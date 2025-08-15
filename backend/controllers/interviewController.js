const InterviewSession = require("../models/InterviewSession");
const { generateTextStream, generateFullText } = require("../services/geminiService");

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

// Start Interview
exports.startInterview = async (req, res, next) => {
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

    const question = await generateFullText(
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
    next(err);
  }
};

// Submit Answer (stream feedback + auto next question)
exports.submitAnswer = async (req, res, next) => {
  const { sessionId } = req.params;
  const { answerText } = req.body;

  // SSE setup
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.(); // send headers immediately if compression is disabled

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

    for await (const chunk of generateTextStream(fbPrompt)) {
      feedbackFull += chunk;
      res.write(`data: ${JSON.stringify({ delta: chunk })}\n\n`);
      res.flush?.(); // push chunk to client immediately
    }

    // Extract score
    const scoreMatch = feedbackFull.match(/Score:\s*([0-9]{1,2})/i);
    turn.feedback = feedbackFull.trim();
    turn.score = scoreMatch ? Math.min(10, Math.max(0, parseInt(scoreMatch[1], 10))) : null;
    await session.save();

    // Auto next question
    if (session.turns.length < session.numQuestions) {
      const nextIndex = turn.index + 1;
      const nextQ = await generateFullText(
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
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
  } finally {
    res.end();
  }
};

// Get Summary
exports.getSummary = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await InterviewSession.findOne({ _id: sessionId, user: req.user._id });
    if (!session) return res.status(404).json({ message: "Session not found" });

    const summary = await generateFullText(
      buildSummaryPrompt({
        role: session.role,
        seniority: session.seniority,
        turns: session.turns
      })
    );

    res.json({ summary });
  } catch (err) {
    next(err);
  }
};
