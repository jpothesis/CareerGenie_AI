// controllers/interviewController.js

const logActivity = require('../utils/activityLogger');
const InterviewSession = require("../models/InterviewSession");
// ✅ FIX: Import the correct functions from the new generic service
const { generateStream, generateText } = require("../services/geminiService"); 
const { saveInterviewAttemptScore } = require("../services/interviewAttemptService");

// --- PROMPT BUILDERS ---
function buildQuestionPrompt({ role, seniority, jdText, resumeText, askedSoFar, previousAnswers, nextIndex }) {
  return `
You are acting as an interviewer for a ${seniority} ${role} position.

Context:
Job Description: ${jdText || "N/A"}
Candidate Resume: ${resumeText || "N/A"}

Previous Questions: ${askedSoFar.length ? askedSoFar.join("\n") : "None"}
Previous Answers: ${previousAnswers.length ? previousAnswers.join("\n") : "None"}

This is question number ${nextIndex + 1}.
Ask one **clear** technical or behavioral interview question that is different from previous ones.
Do NOT include any extra text — only the question.
`;
}

function buildFeedbackPrompt({ role, seniority, question, answer, jdText, resumeText, durationSec }) {
  return `
You are an interview evaluator.

Candidate Role: ${role} (${seniority})
Job Description: ${jdText || "N/A"}
Resume: ${resumeText || "N/A"}

Question: ${question}
Answer: ${answer}
Time Taken: ${durationSec} seconds

Provide:
1. Strengths of the answer
2. Weaknesses or missing points
3. How it could be improved
4. A score out of 10 (format: "Score: X")
Keep it concise but constructive.
`;
}

function buildSummaryPrompt({ role, seniority, turns }) {
  return `
Summarize the candidate's interview for a ${seniority} ${role} role.

Questions & Answers:
${turns.map(t => `Q: ${t.question}\nA: ${t.answer}\nScore: ${t.score || "N/A"}`).join("\n\n")}

Provide:
- Overall strengths
- Areas for improvement
- Suggested next steps
`;
}

// --- CONTROLLER FUNCTIONS ---

const startInterview = async (req, res, next) => {
  try {
    const { role, seniority = "junior", numQuestions = 8, jdText = "", resumeText = "" } = req.body;
    if (!role) return res.status(400).json({ message: "role is required" });

    const session = await InterviewSession.create({
      user: req.user._id,
      role,
      seniority,
      numQuestions,
      jdText,
      resumeText,
      turns: [],
    });

    // ✅ FIX: Use generateText
    const question = await generateText(
      buildQuestionPrompt({
        role, seniority, jdText, resumeText,
        askedSoFar: [], previousAnswers: [], nextIndex: 0
      })
    );

    session.turns.push({ index: 0, question, startTime: new Date() });
    session.currentIndex = 0;
    await session.save();

    res.status(201).json({ sessionId: session._id, question });
  } catch (err) {
    console.error("Start Interview Error:", err);
    res.status(500).json({ message: "Failed to start interview", error: err.message });
  }
};

const submitAnswer = async (req, res, next) => {
  const { sessionId } = req.params;
  const { answerText } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  try {
    const session = await InterviewSession.findOne({ _id: sessionId, user: req.user._id });
    if (!session) {
      res.write(`data: ${JSON.stringify({ error: "Session not found" })}\n\n`);
      return res.end();
    }

    const turn = session.turns.find(t => t.index === session.currentIndex);
    if (!turn) {
      res.write(`data: ${JSON.stringify({ error: "No active question" })}\n\n`);
      return res.end();
    }

    turn.answer = answerText.trim();
    turn.endTime = new Date();
    turn.durationSec = Math.round((turn.endTime - turn.startTime) / 1000);

    const fbPrompt = buildFeedbackPrompt({
      role: session.role,
      seniority: session.seniority,
      question: turn.question,
      answer: turn.answer,
      jdText: session.jdText,
      resumeText: session.resumeText,
      durationSec: turn.durationSec
    });

    let feedbackFull = "";

    // ✅ FIX: Use generateStream
    for await (const chunk of generateStream(fbPrompt)) {
      feedbackFull += chunk;
      res.write(`data: ${JSON.stringify({ delta: chunk })}\n\n`);
      res.flush?.();
    }

    const scoreMatch = feedbackFull.match(/Score:\s*([0-9]{1,2})/i);
    turn.feedback = feedbackFull.trim();
    turn.score = scoreMatch ? Math.min(10, Math.max(0, parseInt(scoreMatch[1], 10))) : null;
    await session.save();

    const isDone = session.turns.length >= session.numQuestions;

    if (!isDone) {
      const nextIndex = turn.index + 1;
      // ✅ FIX: Use generateText
      const nextQ = await generateText(
        buildQuestionPrompt({
          role: session.role,
          seniority: session.seniority,
          jdText: session.jdText,
          resumeText: session.resumeText,
          askedSoFar: session.turns.map(t => t.question),
          previousAnswers: session.turns.map(t => t.answer),
          nextIndex
        })
      );
      session.turns.push({ index: nextIndex, question: nextQ, startTime: new Date() });
      session.currentIndex = nextIndex;
      await session.save();
      res.write(`data: ${JSON.stringify({ nextQuestion: nextQ })}\n\n`);
    } else {
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    }
  } catch (err) {
    console.error("Submit Answer Error:", err);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
  } finally {
    res.end();
  }
};

const endInterview = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user._id;

        const session = await InterviewSession.findOne({ _id: sessionId, user: userId });
        if (!session) return res.status(404).json({ message: "Session not found" });

        const scoredTurns = session.turns.filter(t => t.score !== null);
        
        let finalScoreOutOfFive = 0;
        if (scoredTurns.length > 0) {
            const totalScore = scoredTurns.reduce((sum, turn) => sum + turn.score, 0);
            const sessionAverageScore = totalScore / scoredTurns.length; 
            finalScoreOutOfFive = (sessionAverageScore / 2).toFixed(1);
        }

        await saveInterviewAttemptScore(userId, finalScoreOutOfFive, session.role, sessionId);
        
        await logActivity(
          userId, 
          'ai_interview', 
          `Completed Mock Interview for ${session.role} (Score: ${finalScoreOutOfFive}/5)`, 
          req
        );

        session.status = 'completed';
        await session.save();

        res.json({ 
            message: "Interview finalized.", 
            finalScore: parseFloat(finalScoreOutOfFive) 
        });

    } catch (err) {
        console.error("Error finalizing interview:", err.message);
        res.status(500).json({ message: "Failed to end interview", error: err.message });
    }
};

const getSummary = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await InterviewSession.findOne({ _id: sessionId, user: req.user._id });
    if (!session) return res.status(404).json({ message: "Session not found" });

    // ✅ FIX: Use generateText
    const summary = await generateText(
      buildSummaryPrompt({
        role: session.role,
        seniority: session.seniority,
        turns: session.turns
      })
    );
    
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ message: "Failed to get summary", error: err.message });
  }
};

module.exports = {
  startInterview,
  submitAnswer,
  getSummary,
  endInterview,
};