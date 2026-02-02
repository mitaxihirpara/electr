import { useEffect, useState } from "react";
import "./feedback.css";

const Feedback = ({ productId }) => {
  const [comment, setComment] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  // fetch feedbacks
  const loadFeedbacks = () => {
    fetch(`http://localhost:5000/api/feedback/${productId}`)
      .then(res => res.json())
      .then(data => setFeedbacks(data));
  };

  useEffect(() => {
    loadFeedbacks();
  }, [productId]);

  const submitFeedback = (e) => {
    e.preventDefault(); // <--- add this
    if (!comment.trim()) {
        alert("Please write feedback");
        return;
    }

    fetch("http://localhost:5000/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: productId,
        customer_name: "Guest",
        comment: comment
      })
    })
    .then((res) => res.json())
    .then((data) => {
      console.log("Response:", data);
      setComment("");
      loadFeedbacks();
    })
    .catch((err) => {
      console.error("Error:", err);
      alert("Feedback submit failed");
    });
};


  return (
    <div className="feedback-container">
      <h3>Customer Feedback</h3>
      <form onSubmit={submitFeedback}>
      <textarea
        placeholder="Write your feedback..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        />
         <button type="submit">Submit</button>
</form>
      

      {/* <button onClick={submitFeedback}>Submit</button> */}

      <div className="feedback-list">
        {feedbacks.map((f) => (
          <div key={f.feedback_id} className="feedback-card">
            <strong>{f.customer_name}</strong>
            <p>{f.comment}</p>
            <span>{new Date(f.created_at).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedback;
