import React from "react";
import { BsCheckCircleFill } from "react-icons/bs";

const OrderSuccessMessageModal = ({ setIsOrderSuccessModal }) => {
  const closeModal = () => {
    setIsOrderSuccessModal(false);
    document.getElementById("background-overlay").style.display = "none";
  };
  return (
    <div className="order-success-message-modal">
      <BsCheckCircleFill className="success-icon" />
      <p>Order Successful</p>
      <button className="close-modal-btn" onClick={closeModal}>
        okay
      </button>
    </div>
  );
};

export default OrderSuccessMessageModal;
