import { useState, useEffect, useRef } from "react";
import axios from "axios";
// Assuming you have a standard InputField and TextAreaField component
import InputField from "../../components/InputField";
import TextAreaField from "../../components/TextAreaField";
// Removed bgImage import to use a cleaner CSS background
import { Wand2, MessageSquare, CheckCircle, Send, XCircle } from "lucide-react"; // Imported new icons

// --- CONSTANTS & TYPES (New fields) ---

const INTERVIEW_TYPES = [
  { id: "mixed", name: "Mixed (Default)" },
  { id: "technical", name: "Technical" },
  { id: "behavioral", name: "Behavioral" },
  { id: "system_design", name: "System Design" },
];

const SENIORITY_LEVELS = ["Junior", "Mid", "Senior", "Lead", "Executive"];

// --- AIInterviews Component ---

const AIInterviews = () => {
  const [form, setForm] = useState({
    role: "",
    seniority: "Junior", // Changed default to capital for consistency
    numQuestions: 5,
    jdText: "",
    resumeText: "",
    interviewType: "mixed", // New field
    focusAreas: "", // New field
    language: "English", // New field
  });

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false); // New state for answer submission
  const [interviewDone, setInterviewDone] = useState(false);
  const feedbackRef = useRef<HTMLDivElement | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "numQuestions" ? Math.max(1, Number(value)) : value, // Ensure min 1 question
    });
  };

  const startInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");
    setSessionId(null);
    setInterviewDone(false);

    try {
      // Basic validation
      if (!form.role.trim()) {
         setFeedback("❌ Please enter a Role to start the interview.");
         return;
      }
      
      const res = await axios.post("/api/interview/start", form);
      
      // Check if the response contains necessary data
      if (res.data.sessionId && res.data.question) {
        setSessionId(res.data.sessionId);
        setCurrentQuestion(res.data.question);
      } else {
        setFeedback("❌ Interview engine failed to return a session ID or first question.");
      }

    } catch (err) {
      console.error(err);
      setFeedback("❌ Failed to start interview. Please check server logs.");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = () => {
    if (!sessionId || !answer.trim() || submitting) return;

    setSubmitting(true);
    setFeedback("");
    
    // 1. Initialize EventSource
    // Note: EventSource should listen to the feedback/stream endpoint, 
    // and the POST request should be sent separately.
    const eventSource = new EventSource(`/api/interview/${sessionId}/stream`, { 
      withCredentials: true,
    } as any);

    let receivedFeedback = false;
    let errorOccurred = false;

    eventSource.onopen = () => {
        // 2. Send the answer via POST request right after EventSource is open
        axios.post(`/api/interview/${sessionId}/answer`, { answerText: answer })
        .catch(err => {
            console.error("Answer POST error:", err);
            setFeedback("❌ Error submitting answer to the server.");
            eventSource.close();
            setSubmitting(false);
            errorOccurred = true;
        });
    };

    eventSource.onmessage = (event) => {
      if(errorOccurred) return;
      
      try {
        const data = JSON.parse(event.data);

        if (data.delta) {
          setFeedback((prev) => prev + data.delta);
          receivedFeedback = true;
        }
        
        if (data.nextQuestion) {
          setCurrentQuestion(data.nextQuestion);
          setAnswer("");
          setSubmitting(false);
          eventSource.close();
        }
        
        if (data.done) {
          setInterviewDone(true);
          setCurrentQuestion("");
          setSubmitting(false);
          eventSource.close();
        }
        
        if (data.error) {
          setFeedback(`❌ ${data.error}`);
          setSubmitting(false);
          eventSource.close();
        }
      } catch (e) {
        console.error("Error parsing stream message:", e);
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      // Only show a generic error if we haven't already received feedback/next steps
      if (!receivedFeedback && !errorOccurred) {
        setFeedback("❌ Connection lost. Please try again.");
        setSubmitting(false);
      }
      eventSource.close();
    };
  };

  // Auto-scroll feedback box
  useEffect(() => {
    if (feedbackRef.current) {
      feedbackRef.current.scrollTop = feedbackRef.current.scrollHeight;
    }
  }, [feedback]);
  
  // Custom Select Field for better styling
  const SelectField: React.FC<{ label: string; name: string; value: string; options: string[]; onChange: typeof handleChange }> = 
    ({ label, name, value, options, onChange }) => (
      // ⭐ MODIFIED: Used "space-y-1" and "relative" for container consistency ⭐
      <div className="space-y-1 relative"> 
        <label className="text-xs font-medium text-gray-400">{label}</label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-3 bg-black/30 border border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none"
          style={{ backgroundImage: 'none' }} // Override Tailwind/browser default arrow
        >
          {options.map(option => (
            <option key={option} value={option.toLowerCase().replace(/ /g, '_')} className="bg-black text-white">
              {option}
            </option>
          ))}
        </select>
        {/* Adjusted vertical position (translate-y-1.5 -> top-1/2 translate-y-0) 
            to align the arrow inside the input box height */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"> 
            <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
  );


  // --- Render ---

  return (
    <div className="min-h-screen relative text-white bg-black">
      {/* Background Effect Overlay (Adapted from ResumeBuilder) */}
      <div className="absolute inset-0 z-0 bg-black/80 backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-br before:from-orange-500/10 before:to-yellow-400/10 before:animate-pulse" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8 p-4 rounded-xl bg-black/40 border border-white/10 shadow-xl shadow-orange-400/20 text-center">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-transparent bg-clip-text mb-2">
              <MessageSquare className="inline h-8 w-8 mr-2" /> AI Interview Coach
            </h1>
            <p className="text-gray-400">Simulate real job interviews tailored to your role, resume, and JD.</p>
        </div>

        {/* --- Interview Setup Form (If not started) --- */}
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

                <div className="relative">
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
              </div>

              {/* Advanced Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <SelectField
                    label="Interview Type"
                    name="interviewType"
                    value={form.interviewType}
                    onChange={handleChange}
                    options={INTERVIEW_TYPES.map(t => t.name)}
                  />
                </div>

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
          /* --- Active Interview Session --- */
          <div className="animate-fade-in space-y-6">
            <div className="p-6 rounded-xl bg-black/40 border border-white/10 shadow-xl shadow-orange-400/20">
              
              {/* Question Area */}
              {currentQuestion && (
                <div className="pb-4 mb-4 border-b border-white/10">
                  <h2 className="text-xl font-bold text-orange-400 mb-3 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" /> AI Interviewer
                  </h2>
                  <p className="text-lg text-white font-medium whitespace-pre-wrap animate-fade-in">{currentQuestion}</p>
                </div>
              )}

              {/* Answer Input */}
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

            {/* Feedback / Summary Area */}
            {feedback && (
              <div
                ref={feedbackRef}
                className={`mt-4 p-6 bg-black/50 border border-green-500/20 rounded-xl shadow-lg shadow-green-500/20 max-h-96 overflow-y-auto transition-all ${interviewDone ? 'border-pink-500/20' : 'border-green-500/20'}`}
              >
                <h2 className={`text-xl font-bold mb-3 flex items-center gap-2 ${interviewDone ? 'text-pink-400' : 'text-green-400'}`}>
                    {interviewDone ? <CheckCircle className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />} 
                    {interviewDone ? "Final Summary" : "Live Feedback"}
                </h2>
                <p className="whitespace-pre-wrap text-sm text-gray-200">
                  {feedback}
                </p>
              </div>
            )}

            {/* Interview Done Message */}
            {interviewDone && (
              <div className="mt-6 p-4 rounded-xl text-center bg-black/40 border border-pink-400/50 shadow-lg shadow-pink-400/20 animate-bounce-once">
                <p className="text-pink-400 font-bold text-xl flex items-center justify-center gap-3">
                  <CheckCircle className="h-6 w-6" /> Interview Completed!
                </p>
                <p className="text-gray-300 mt-1">Review the final summary above or click the button below to start a new session.</p>
                <button
                    onClick={() => setSessionId(null)}
                    className="mt-4 py-2 px-6 text-base bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold rounded-lg hover:opacity-90 transition"
                  >
                    Start New Interview
                  </button>
              </div>
            )}
            
             {/* Error Message for missing question/session */}
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