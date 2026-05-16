import { useState, useEffect } from "react";

export default function AdminReviewManager() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/reviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error("Failed to fetch reviews");
      setReviews(data);
    } catch (err) {
      setError("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete review");
      setReviews(reviews.filter((review) => review._id !== id));
    } catch (err) {
      setError("Failed to delete review");
    }
  };

  if (loading) return <div style={{ color: "white" }}>Loading reviews...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="admin-section fade-in">
      <h2 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Review Management</h2>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", color: "white" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.1)", textAlign: "left" }}>
              <th style={{ padding: "1rem" }}>Movie</th>
              <th style={{ padding: "1rem" }}>User</th>
              <th style={{ padding: "1rem" }}>Rating</th>
              <th style={{ padding: "1rem" }}>Comment</th>
              <th style={{ padding: "1rem" }}>Date</th>
              <th style={{ padding: "1rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <td style={{ padding: "1rem" }}>{review.movie?.title || "Unknown Movie"}</td>
                <td style={{ padding: "1rem" }}>{review.user?.name || "Unknown User"}</td>
                <td style={{ padding: "1rem", color: "#46d369" }}>{review.rating} ★</td>
                <td style={{ padding: "1rem", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {review.comment}
                </td>
                <td style={{ padding: "1rem" }}>{new Date(review.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: "1rem" }}>
                  <button 
                    onClick={() => deleteReview(review._id)}
                    style={{ background: "#e50914", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reviews.length === 0 && (
          <div style={{ padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
            No reviews found.
          </div>
        )}
      </div>
    </div>
  );
}
