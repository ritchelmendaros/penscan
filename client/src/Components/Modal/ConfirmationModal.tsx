import React from "react";
import { SyncLoader } from "react-spinners";

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  loading: boolean; 
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  message,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        {loading ? ( 
          <div className="loader">
            <SyncLoader color="#fff" loading={loading} size={10} /> 
          </div>
        ) : (
          <div className="modal-buttons">
            <button onClick={onConfirm}>Yes</button>
            <button onClick={onCancel}>No</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmationModal;
