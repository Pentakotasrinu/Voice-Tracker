// src/components/ConfirmationModal.js
import React from "react";
import "./ConfirmationModal.css"; // You can style it as per your requirements

const ConfirmationModal = ({ message, onConfirm, onCancel, isVisible }) => {
  if (!isVisible) return null; // If modal isn't visible, return nothing

  return (
    <div className="confirmation-modal">
      <div className="modal-content">
        <h3>{message}</h3>
        <div className="modal-actions">
          <button className="confirm-btn" onClick={onConfirm}>
            Yes
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
