import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
