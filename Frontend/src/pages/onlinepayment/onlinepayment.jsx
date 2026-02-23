import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./onlinepayment.css";

const Payment = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [method, setMethod] = useState("CARD");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [error, setError] = useState("");

  const validateCard = () => {
    if (cardNumber.length !== 16) {
      setError("Card number must be 16 digits");
      return false;
    }

    if (cvv.length !== 3) {
      setError("CVV must be 3 digits");
      return false;
    }

    if (!expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      setError("Expiry must be in MM/YY format");
      return false;
    }

    setError("");
    return true;
  };

  const handlePayment = async () => {
    let transactionId = "TXN" + Date.now();

    if (method === "CARD") {
      if (!validateCard()) return;
    }

    if (method === "UPI") {
      if (!isUpiValid) {
         setError("Enter a valid UPI ID (example@upi)");
        return;
      }
    }

    try {
      await axios.post("http://localhost:5000/api/place-order", {
        ...state,
        payment_method: method,
        transaction_id: transactionId
      });

      alert("Payment Successful 🎉");
      navigate("/orders");
    } catch (err) {
      alert("Payment failed");
    }
  };

  const isCardValid =
  cardNumber.replace(/\s/g, "").length === 16 &&
  expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/) &&
  cvv.length === 3;

const upiRegex = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{3,}$/;

const isUpiValid = upiRegex.test(upiId);

return (
  <div className="payment-page">
    <div className="payment-card">

      <h2 className="payment-title">Select Payment Method</h2>

      <div className="payment-methods">
        <label className={`method ${method === "CARD" ? "active" : ""}`}>
          <input
            type="radio"
            checked={method === "CARD"}
            onChange={() => setMethod("CARD")}
          />
          Credit / Debit Card
        </label>

        <label className={`method ${method === "UPI" ? "active" : ""}`}>
          <input
            type="radio"
            checked={method === "UPI"}
            onChange={() => setMethod("UPI")}
          />
          UPI
        </label>
      </div>

      {method === "CARD" && (
        <div className="payment-inputs">
         <input
  type="text"
  placeholder="0000 0000 0000 0000"
  maxLength="19"
  value={cardNumber}
  onChange={(e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.substring(0, 16);
    value = value.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(value);
  }}
/>

          <div className="row">
            <input
  type="text"
  placeholder="MM/YY"
  maxLength="5"
  value={expiry}
  onChange={(e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 3) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    setExpiry(value);
  }}
/>

           <input
  type="password"
  placeholder="123"
  maxLength="3"
  value={cvv}
  onChange={(e) =>
    setCvv(e.target.value.replace(/\D/g, "").substring(0, 3))
  }
/>
          </div>

          {error && <p className="error">{error}</p>}
        </div>
      )}

     
      
      {method === "UPI" && (
  <div className="payment-inputs">

    <div className="upi-title">Pay using UPI</div>

    <div className="upi-apps">
      <button
        type="button"
        className="upi-app"
        onClick={() => setUpiId("example@oksbi")}
      >
        Google Pay
      </button>

      <button
        type="button"
        className="upi-app"
        onClick={() => setUpiId("example@ybl")}
      >
        PhonePe
      </button>

      <button
        type="button"
        className="upi-app"
        onClick={() => setUpiId("example@paytm")}
      >
        Paytm
      </button>
    </div>

    <div className="upi-or">OR</div>

    <input
      type="text"
      placeholder="Enter UPI ID (example@upi)"
      value={upiId}
      onChange={(e) => {
        setUpiId(e.target.value.toLowerCase());
        setError("");
      }}
    />

    {upiId && !isUpiValid && (
      <p className="error">Invalid UPI format</p>
    )}

  </div>
)}

      <button
  className="pay-btn"
  onClick={handlePayment}
  disabled={
    (method === "CARD" && !isCardValid) ||
    (method === "UPI" && !isUpiValid)
  }
>
  Pay ₹{state?.total_amount}
</button>

    </div>
  </div>
);
}
export default Payment;