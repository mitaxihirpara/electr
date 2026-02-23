
import { useEffect, useState } from "react";
import "./feedback.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const Feedback = ({ productId }) => {
  const [comment, setComment] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  const loadFeedbacks = () => {
    fetch(`http://localhost:5000/api/feedback/${productId}`)
      .then(res => res.json())
      .then(data => setFeedbacks(data));
  };

  useEffect(() => {
    loadFeedbacks();
  }, [productId]);

  const submitFeedback = async () => {
    console.log("🔥 submitFeedback CALLED");
    const userId = localStorage.getItem("customer_id");
    const userName = localStorage.getItem("customer_name");

    if (!userId) {
      alert("Please login to give feedback");
      return;
    }

    if (!comment.trim()) {
      alert("Please write feedback");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          customer_id: userId,
          customer_name: userName,
          comment: comment
        })
      });

      const data = await res.json();
      console.log(data);

      setComment("");
      loadFeedbacks();

    } catch (err) {
      console.error(err);
      alert("Feedback failed");
    }
  };

  return (
    <div className="feedback-container">
      <h3>Review this product</h3>
      <div className="feedback-input">
  <textarea
    placeholder="Write a product Review..."
    value={comment}
    onChange={(e) => setComment(e.target.value)}
  />

  <button type="button" onClick={submitFeedback}>
    <FontAwesomeIcon icon={faPaperPlane} />
  </button>
</div>
     

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
