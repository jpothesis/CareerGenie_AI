import { useState, useEffect, useRef } from "react";
import axios from "axios";
import InputField from "../../components/InputField";
import TextAreaField from "../../components/TextAreaField";
import { Wand2, MessageSquare, CheckCircle, Send, XCircle } from "lucide-react";

const INTERVIEW_TYPES = [
  { id: "mixed", name: "Mixed (Default)" },
  { id: "technical", name: "Technical" },
  { id: "behavioral", name: "Behavioral" },
  { id: "system_design", name: "System Design" },
];

const SENIORITY_LEVELS = ["Junior", "Mid", "Senior", "Lead", "Executive"];

const LIVE_BACKEND_URL = "https://careergenie-ai.onrender.com"; 

const getApiUrl = (endpoint: string) => {
  // If running locally, use the relative path (Vite proxy handles it)
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return endpoint;
  }
  // If running in production (Vercel), use the full backend URL
  // We remove trailing slashes to avoid double //
  const baseUrl = LIVE_BACKEND_URL.replace(/\/$/, "");
  return `${baseUrl}${endpoint}`;
};

const AIInterviews = () => {
  const [form, setForm] = useState({
    role: "",
    seniority: "Junior",
    numQuestions: 5,
    jdText: "",
    resumeText: "",
    interviewType: "mixed",
    focusAreas: "",
    language: "English",
  });

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [interviewDone, setInterviewDone] = useState(false);
  const feedbackRef = useRef<HTMLDivElement | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "numQuestions" ? Math.max(1, Number(value)) : value,
    });
  };

  const startInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");
    setSessionId(null);
    setInterviewDone(false);
    setCurrentQuestion("");

    const token = localStorage.getItem("jwttoken"); 

    if (!token) {
      setFeedback("❌ No authentication token found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      if (!form.role.trim()) {
        setFeedback("❌ Please enter a **Role** to start the interview.");
        return;
      }

      const url = getApiUrl("/api/interview/start");
      
      const res = await axios.post(url, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.sessionId && res.data.question) {
        setSessionId(res.data.sessionId);
        setCurrentQuestion(res.data.question);
      } else {
        setFeedback("❌ Interview engine failed to return a session ID or first question.");
      }
    } catch (err) {
      console.error(err);
      const errorMsg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "❌ Failed to start interview. Please check server logs.";
      setFeedback(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!sessionId || !answer.trim() || submitting) return;

    // 1. GET TOKEN
    const token = localStorage.getItem("jwttoken");
    if (!token) {
      setFeedback("\n\n❌ Session expired. Please log in again.");
      return;
    }

    setSubmitting(true);
    const answerText = answer.trim();

    setFeedback((prev) => prev + "\n\n--- [ AI is evaluating... ] ---\n\n");
    setAnswer("");

    try {
      // 2. ATTACH HEADER HERE (Fetch API)
      const url = getApiUrl(`/api/interview/answer/${sessionId}`);

      const response = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ answerText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Server responded with status ${response.status}`);
      }

      if (!response.body) throw new Error("No response stream available.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      setFeedback((prev) => prev.replace("\n\n--- [ AI is evaluating... ] ---\n\n", ""));

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        if (value) {
          buffer += decoder.decode(value, { stream: true });
          let lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data:")) {
              try {
                const data = JSON.parse(line.substring(5).trim());
                if (data.delta) setFeedback((prev) => prev + data.delta);
                if (data.nextQuestion) {
                  setCurrentQuestion(data.nextQuestion);
                  setSubmitting(false);
                }
                if (data.done) {
                  await finalizeInterview(sessionId);
                  setInterviewDone(true);
                  setCurrentQuestion("");
                  setSubmitting(false);
                  return;
                }
                if (data.error) {
                  setFeedback((prev) => prev + `\n\n❌ Server Error: ${data.error}`);
                  setSubmitting(false);
                  return;
                }
              } catch (e) {
                console.error("Error parsing stream message:", e, line);
              }
            }
          }
        }
      }
      setSubmitting(false);
    } catch (err: any) {
      console.error("Submit Answer Error:", err);
      setFeedback((prev) => prev + `\n\n❌ Failed to submit answer: ${err.message || "Connection lost"}`);
      setSubmitting(false);
    }
  };

  const finalizeInterview = async (sessionId: string) => {
    const token = localStorage.getItem("jwttoken");
    
    // 2. Prepare the config object
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    try {
      const endRes = await axios.post(
        `/api/interview/${sessionId}/end`, 
        {},     
        config  
      );
      setFeedback((prev) => prev + `\n\n✅ Final Score Saved! (Average: ${endRes.data.finalScore} / 5)\n\n`);

      const summaryRes = await axios.get(
        `/api/interview/summary/${sessionId}`, 
        config
      );
      setFeedback((prev) => prev.replace("(Fetching detailed summary...)\n", "") + summaryRes.data.summary);
        
    } catch (err) {
      console.error("Error finalizing or getting summary:", err);
      setFeedback((prev) => prev + "\n\n❌ **CRITICAL ERROR:** Failed to finalize interview or fetch final summary.");
    }
  };

  useEffect(() => {
    if (feedbackRef.current) {
      feedbackRef.current.scrollTop = feedbackRef.current.scrollHeight;
    }
  }, [feedback]);

  const SelectField: React.FC<{
    label: string;
    name: string;
    value: string;
    options: string[];
    onChange: typeof handleChange;
  }> = ({ label, name, value, options, onChange }) => (
    <div className="space-y-1 relative">
      <label className="text-xs font-medium text-gray-400">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 bg-black/30 border border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none"
        style={{ backgroundImage: "none" }}
      >
        {options.map((option) => (
          <option key={option} value={option.toLowerCase().replace(/ /g, "_")} className="bg-black text-white">
            {option}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 translate-y-1.5 pointer-events-none">
        <svg
          className="w-4 h-4 text-orange-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative text-white bg-black">
      <div className="absolute inset-0 z-0 bg-black/80 backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-br before:from-orange-500/10 before:to-yellow-400/10 before:animate-pulse" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8 p-4 rounded-xl bg-black/40 border border-white/10 shadow-xl shadow-orange-400/20 text-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-transparent bg-clip-text mb-2">
            <MessageSquare className="inline h-8 w-8 mr-2" /> AI Interview Coach
          </h1>
          <p className="text-gray-400">Simulate real job interviews tailored to your role, resume, and JD.</p>
        </div>

        {!sessionId ? (
          <div className="animate-fade-in">
            <form onSubmit={startInterview} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  placeholder="e.g., Software Engineer"
                  label="Target Role"
                  required
                />
                <SelectField
                  label="Seniority"
                  name="seniority"
                  value={form.seniority}
                  onChange={handleChange}
                  options={SENIORITY_LEVELS}
                />
                <InputField
                  name="numQuestions"
                  value={form.numQuestions.toString()}
                  onChange={handleChange}
                  placeholder="5"
                  label="Questions Count (Max 10)"
                  type="number"
                  min="1"
                  max="10"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Interview Type"
                  name="interviewType"
                  value={form.interviewType}
                  onChange={handleChange}
                  options={INTERVIEW_TYPES.map((t) => t.name)}
                />
                <InputField
                  name="focusAreas"
                  value={form.focusAreas}
                  onChange={handleChange}
                  placeholder="e.g., React, TypeScript, Cloud"
                  label="Key Focus Areas (Keywords)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextAreaField
                  name="jdText"
                  value={form.jdText}
                  onChange={handleChange}
                  placeholder="Paste job description (optional, recommended)"
                  label="Job Description (JD)"
                  rows={4}
                />
                <TextAreaField
                  name="resumeText"
                  value={form.resumeText}
                  onChange={handleChange}
                  placeholder="Paste your resume text (optional, recommended)"
                  label="Resume Text"
                  rows={4}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3 text-lg bg-gradient-to-r from-orange-500 via-yellow-400 to-pink-500 text-black font-bold rounded-xl hover:opacity-90 transition transform hover:scale-[1.01] shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Wand2 className="h-5 w-5 animate-spin" /> Starting Simulation...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5" /> Start Interview
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="animate-fade-in space-y-6">
            <div className="p-6 rounded-xl bg-black/40 border border-white/10 shadow-xl shadow-orange-400/20">
              {currentQuestion && (
                <div className="pb-4 mb-4 border-b border-white/10">
                  <h2 className="text-xl font-bold text-orange-400 mb-3 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" /> AI Interviewer
                  </h2>
                  <p className="text-lg text-white font-medium whitespace-pre-wrap animate-fade-in">
                    {currentQuestion}
                  </p>
                </div>
              )}
              {currentQuestion && !interviewDone && (
                <div>
                  <TextAreaField
                    name="answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    label="Your Answer"
                    rows={4}
                    required
                    disabled={submitting}
                  />
                  <button
                    onClick={submitAnswer}
                    disabled={submitting || !answer.trim()}
                    className="w-full mt-4 py-3 text-lg bg-gradient-to-r from-orange-500 to-pink-500 text-black font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Wand2 className="h-5 w-5 animate-pulse" /> Generating Feedback...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" /> Submit Answer
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {feedback && (
              <div
                ref={feedbackRef}
                className={`mt-4 p-6 bg-black/50 border rounded-xl shadow-lg max-h-96 overflow-y-auto transition-all 
                  ${interviewDone ? "border-pink-500/20 shadow-pink-500/20" : "border-green-500/20 shadow-green-500/20"}`}
              >
                <h2
                  className={`text-xl font-bold mb-3 flex items-center gap-2 ${
                    interviewDone ? "text-pink-400" : "text-green-400"
                  }`}
                >
                  {interviewDone ? <CheckCircle className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}{" "}
                  {interviewDone ? "Final Summary" : "Live Feedback"}
                </h2>
                <p className="whitespace-pre-wrap text-sm text-gray-200">{feedback}</p>
              </div>
            )}

            {interviewDone && (
              <div className="mt-6 p-4 rounded-xl text-center bg-black/40 border border-pink-400/50 shadow-lg shadow-pink-400/20 animate-bounce-once">
                <p className="text-pink-400 font-bold text-xl flex items-center justify-center gap-3">
                  <CheckCircle className="h-6 w-6" /> Interview Completed!
                </p>
                <p className="text-gray-300 mt-1">
                  Review the final summary above or click the button below to start a new session.
                </p>
                <button
                  onClick={() => setSessionId(null)}
                  className="mt-4 py-2 px-6 text-base bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold rounded-lg hover:opacity-90 transition"
                >
                  Start New Interview
                </button>
              </div>
            )}

            {!currentQuestion && !interviewDone && !loading && (
              <div className="mt-6 p-4 rounded-xl text-center bg-black/40 border border-red-400/50 shadow-lg shadow-red-400/20 animate-fade-in">
                <p className="text-red-400 font-bold text-xl flex items-center justify-center gap-3">
                  <XCircle className="h-6 w-6" /> Interview Halted
                </p>
                <p className="text-gray-300 mt-1">
                  The interview session may have expired or encountered an error. Please try starting a new one.
                </p>
                <button
                  onClick={() => setSessionId(null)}
                  className="mt-4 py-2 px-6 text-base bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold rounded-lg hover:opacity-90 transition"
                >
                  Go to Setup
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInterviews;
