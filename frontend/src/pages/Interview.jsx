import { useState } from "react";
import { apiFetch } from "../utils/api";

const TOPICS = [
  "JavaScript",
  "Data Structures",
  "Algorithms",
  "OOP Concepts",
  "DBMS",
  "Operating Systems",
];

function Interview() {
  const [interview, setInterview] = useState(null);
  const [topic, setTopic] = useState(TOPICS[0]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFeedback, setLastFeedback] = useState(null); // feedback for the just-answered question

  const startInterview = async () => {
    setLoading(true);
    setError(null);
    setLastFeedback(null);
    try {
      const data = await apiFetch("/interview/start", {
        method: "POST",
        body: JSON.stringify({ topic }),
      });
      setInterview(data);
      setAnswer("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      setError("Please write an answer before submitting.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/interview/${interview._id}/answer`, {
        method: "POST",
        body: JSON.stringify({ answer }),
      });

      // The question just answered is the second-to-last if a new one was appended,
      // or the last one if the interview just completed.
      const answeredQuestion =
        data.status === "completed"
          ? data.questions[data.questions.length - 1]
          : data.questions[data.questions.length - 2];

      setLastFeedback(answeredQuestion);
      setInterview(data);
      setAnswer("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startNew = () => {
    setInterview(null);
    setLastFeedback(null);
    setAnswer("");
    setError(null);
  };

  const scoreColor = (score) => {
    if (score >= 8) return "text-green-400";
    if (score >= 5) return "text-yellow-400";
    return "text-red-400";
  };

  const currentQuestion =
    interview && interview.status === "in_progress"
      ? interview.questions[interview.questions.length - 1]
      : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl">

        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-300">
            🎙️ AI Powered
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            AI Interviewer
          </h1>
          <p className="mt-2 text-slate-400">
            Practice technical interview questions with real-time AI feedback.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Landing: pick a topic and start */}
        {!interview && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Choose a topic
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mb-5 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              {TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <button
              onClick={startInterview}
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Starting..." : "Start Interview"}
            </button>
          </div>
        )}

        {/* Feedback on the just-answered question */}
        {lastFeedback && (
          <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="mb-2 text-sm text-slate-500">Previous question</p>
            <p className="mb-4 text-slate-200">{lastFeedback.question}</p>

            <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">Feedback</span>
                <span className={`text-lg font-bold ${scoreColor(lastFeedback.score)}`}>
                  {lastFeedback.score}/10
                </span>
              </div>
              <p className="text-sm leading-6 text-slate-300">{lastFeedback.feedback}</p>
            </div>
          </div>
        )}

        {/* Current question + answer input */}
          {currentQuestion ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-indigo-400">
                Question {interview.questions.length} of {interview.maxQuestions}
              </span>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                {interview.topic}
              </span>
            </div>

            <p className="mb-5 text-lg text-slate-100">{currentQuestion.question}</p>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={6}
              className="mb-4 w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />

            <button
              onClick={submitAnswer}
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Evaluating..." : "Submit Answer"}
            </button>
          </div>
        ) : (
          <div className="rounded-2xl mt-6 border border-slate-800 bg-slate-900 p-6">
            <p className="mb-4 text-lg text-slate-100">No questions remaining. Please start a new interview.</p>
          </div>
        )}

        {/* Completion screen */}
        {interview && interview.status === "completed" && (
          <div className="mt-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-6 text-center">
            <div className="mb-3 text-4xl">🎉</div>
            <h2 className="mb-2 text-xl font-semibold">Interview Complete</h2>

            <p className={`mb-4 text-4xl font-bold ${scoreColor(interview.overallScore)}`}>
              {interview.overallScore}/10
            </p>

            <p className="mx-auto mb-6 max-w-md text-sm leading-6 text-slate-300">
              {interview.overallFeedback}
            </p>

            <button
              onClick={startNew}
              className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Start New Interview
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Interview;