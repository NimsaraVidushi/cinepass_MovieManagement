import { useState, useEffect } from "react";

export default function ReviewSection({ movieId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchReviews();
  }, [movieId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/movie/${movieId}`);
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movie: movieId, rating, comment }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
      }
      setReviews([data, ...reviews]);
      setComment("");
      setRating(5);
    } catch (err) {
      setError(err.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "3rem", padding: "2rem 0", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
      <h3 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Reviews & Feedback</h3>

      {token ? (
        <form onSubmit={submitReview} style={{ marginBottom: "3rem", background: "rgba(255,255,255,0.05)", padding: "2rem", borderRadius: "12px" }}>
          <h4 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>Leave a Review</h4>
          {error && <div style={{ color: "#e50914", marginBottom: "1rem" }}>{error}</div>}
          
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Rating</label>
            <select 
              value={rating} 
              onChange={(e) => setRating(Number(e.target.value))}
              style={{ padding: "0.8rem", width: "100px", borderRadius: "4px", background: "rgba(0,0,0,0.5)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              {[5, 4, 3, 2, 1].map((num) => (
                <option key={num} value={num}>{num} Stars</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Comment</label>
            <textarea
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              style={{ width: "100%", padding: "1rem", borderRadius: "8px", background: "rgba(0,0,0,0.5)", color: "white", border: "1px solid rgba(255,255,255,0.2)", resize: "vertical" }}
              placeholder="What did you think of the movie?"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="active"
            style={{ padding: "0.8rem 2rem", borderRadius: "4px", border: "none", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <div style={{ marginBottom: "3rem", padding: "1.5rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px", textAlign: "center" }}>
          Please log in to leave a review.
        </div>
      )}

      <div>
        {reviews.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.6)" }}>No reviews yet. Be the first to review!</p>
        ) : (
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {reviews.map((review) => (
              <div key={review._id} style={{ background: "rgba(255,255,255,0.03)", padding: "1.5rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div style={{ fontWeight: "bold" }}>{review.user?.name || "Unknown User"}</div>
                  <div style={{ color: "#46d369" }}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                </div>
                <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: "1.6" }}>{review.comment}</p>
                <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
