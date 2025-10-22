import { useState, useEffect, useRef } from "react";
import axios from "axios";
import InputField from "../../components/InputField";
import TextAreaField from "../../components/TextAreaField";
import bgImage from "../../assets/background.png";

const AIInterviews = () => {
  const [form, setForm] = useState({
    role: "",
    seniority: "junior",
    numQuestions: 5,
    jdText: "",
    resumeText: "",
  });

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [interviewDone, setInterviewDone] = useState(false);
  const feedbackRef = useRef<HTMLDivElement | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "numQuestions" ? Number(value) : value,
    });
  };

  const startInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");
    setSessionId(null);
    setInterviewDone(false);

    try {
      const res = await axios.post("/api/interview/start", form);
      setSessionId(res.data.sessionId);
      setCurrentQuestion(res.data.question);
    } catch (err) {
      console.error(err);
      setFeedback("❌ Failed to start interview.");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = () => {
    if (!sessionId || !answer.trim()) return;

    setFeedback("");
    const eventSource = new EventSource(`/api/interview/${sessionId}/answer`, {
      withCredentials: true,
    } as any);

    eventSource.onopen = () => {
      axios.post(`/api/interview/${sessionId}/answer`, {
        answerText: answer,
      });
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.delta) {
        setFeedback((prev) => prev + data.delta);
      }
      if (data.nextQuestion) {
        setCurrentQuestion(data.nextQuestion);
        setAnswer("");
      }
      if (data.done) {
        setInterviewDone(true);
        setCurrentQuestion("");
      }
      if (data.error) {
        setFeedback(`❌ ${data.error}`);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };
  };

  useEffect(() => {
    if (feedbackRef.current) {
      feedbackRef.current.scrollTop = feedbackRef.current.scrollHeight;
    }
  }, [feedback]);

  return (
    <div
      className="min-h-screen bg-cover bg-no-repeat bg-center px-6 py-10"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundColor: "rgba(0,0,0,0.6)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="max-w-4xl mx-auto backdrop-blur-md p-6 rounded-2xl border border-orange-500/20 bg-[#1a1a1a]/70">
        <h1 className="text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-transparent bg-clip-text">
          🎤 AI Interview Practice
        </h1>

        {!sessionId ? (
          <form onSubmit={startInterview} className="space-y-4">
            <InputField
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="Role (e.g., Software Engineer)"
              label="Role"
              required
            />

            <InputField
              name="seniority"
              value={form.seniority}
              onChange={handleChange}
              placeholder="Seniority (junior, mid, senior)"
              label="Seniority"
            />

            <InputField
              name="numQuestions"
              value={form.numQuestions.toString()} // ✅ convert number → string
              onChange={handleChange}
              placeholder="Number of Questions"
              label="Questions Count"
              type="number"
            />

            <TextAreaField
              name="jdText"
              value={form.jdText}
              onChange={handleChange}
              placeholder="Paste job description (optional)"
              label="Job Description"
              rows={3}
            />

            <TextAreaField
              name="resumeText"
              value={form.resumeText}
              onChange={handleChange}
              placeholder="Paste resume text (optional)"
              label="Resume"
              rows={3}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 text-lg bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-black font-bold rounded-lg hover:opacity-90 transition"
            >
              {loading ? "🔄 Starting..." : "🚀 Start Interview"}
            </button>
          </form>
        ) : (
          <div>
            {currentQuestion && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-yellow-400 mb-2">
                  Question:
                </h2>
                <p className="text-white">{currentQuestion}</p>

                <TextAreaField
                  name="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  label="Your Answer"
                  rows={4}
                  required
                />

                <button
                  onClick={submitAnswer}
                  className="w-full mt-4 py-3 text-lg bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-black font-bold rounded-lg hover:opacity-90 transition"
                >
                  📤 Submit Answer
                </button>
              </div>
            )}

            {feedback && (
              <div
                ref={feedbackRef}
                className="mt-8 p-6 bg-[#111827] border border-green-500/20 rounded-lg animate-fade-in max-h-64 overflow-y-auto"
              >
                <h2 className="text-lg font-bold text-green-400 mb-2">
                  Feedback:
                </h2>
                <p className="whitespace-pre-wrap text-sm text-white">
                  {feedback}
                </p>
              </div>
            )}

            {interviewDone && (
              <p className="mt-6 text-center text-pink-400 font-bold">
                ✅ Interview Completed! You can now view your summary.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInterviews;
