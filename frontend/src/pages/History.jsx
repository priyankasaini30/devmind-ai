import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

function History() {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch(`/reviews?page=${page}&limit=10`);
        setReviews(data.reviews);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [page]);
  const openReview = async (id) => {
    setDetailLoading(true);
    setSelectedReview(null);
    try {
      const data = await apiFetch(`/reviews/${id}`);
      setSelectedReview(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const severityColor = (severity) => {
    if (severity === "High") return "text-red-400 border-red-400";
    if (severity === "Medium") return "text-yellow-400 border-yellow-400";
    return "text-green-400 border-green-400";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <h1 className="text-2xl font-semibold mb-6">Review History</h1>

      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-200 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {/* Detail view */}
      {(detailLoading || selectedReview) && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Review Detail</h2>
            <button 
              onClick={() => setSelectedReview(null)}
              className="text-sm text-slate-400 hover:text-slate-200"
            >
              Close
            </button>
          </div>

          {detailLoading ? (
            <p className="text-slate-400">Loading...</p>
          ) : (
            selectedReview && (
              <div className="space-y-4">
                <p className="text-sm text-slate-400">
                  {selectedReview.language} ·{" "}
                  {new Date(selectedReview.createdAt).toLocaleString()}
                </p>

                <p>{selectedReview.summary}</p>

                <div>
                  <h3 className="font-medium mb-1">
                    Code Quality: {selectedReview.codeQuality?.score}/10
                  </h3>
                  <p className="text-sm text-slate-400">
                    {selectedReview.codeQuality?.comment}
                  </p>
                </div>

                {selectedReview.bugs?.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-1">Bugs</h3>
                    {selectedReview.bugs.map((bug, i) => (
                      <div
                        key={i}
                        className={`border-l-2 pl-3 mb-2 ${severityColor(bug.severity)}`}
                      >
                        <p className="font-medium">{bug.title}</p>
                        <p className="text-sm text-slate-400">{bug.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {selectedReview.security?.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-1">Security</h3>
                    {selectedReview.security.map((issue, i) => (
                      <div
                        key={i}
                        className={`border-l-2 pl-3 mb-2 ${severityColor(issue.severity)}`}
                      >
                        <p className="font-medium">{issue.title}</p>
                        <p className="text-sm text-slate-400">{issue.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <h3 className="font-medium mb-1">Complexity</h3>
                  <p className="text-sm text-slate-400">
                    Time: {selectedReview.complexity?.time} · Space:{" "}
                    {selectedReview.complexity?.space}
                  </p>
                  <p className="text-sm text-slate-400">
                    {selectedReview.complexity?.explanation}
                  </p>
                </div>

                {selectedReview.suggestions?.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-1">Suggestions</h3>
                    <ul className="list-disc list-inside text-sm text-slate-400">
                      {selectedReview.suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      )}

      {/* List view */}
      {loading ? (
        <p className="text-slate-400">Loading history...</p>
      ) : reviews.length === 0 ? (
        <p className="text-slate-400">No reviews yet. Submit code to get started.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <button
              key={review._id}
              onClick={() => openReview(review._id)}
              className="w-full text-left bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-lg p-4 transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-sm uppercase text-slate-500">
                    {review.language}
                  </span>
                  <p className="text-slate-200">{review.summary}</p>
                </div>
                <span className="text-sm text-slate-400 whitespace-nowrap ml-4">
                  Score: {review.codeQuality?.score}/10
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {new Date(review.createdAt).toLocaleString()}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && reviews.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-slate-800 rounded disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-slate-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-slate-800 rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default History;