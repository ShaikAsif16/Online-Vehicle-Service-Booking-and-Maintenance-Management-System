import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be reversed.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center space-y-4 py-2">
        <div
          className={`p-3.5 rounded-2xl ${
            isDanger ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
          }`}
        >
          <AlertTriangle className="w-8 h-8" />
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">{message}</p>

        <div className="flex items-center gap-3 w-full pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-300 font-medium text-sm border border-dark-700 transition"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-2.5 px-4 rounded-xl text-white font-medium text-sm transition flex items-center justify-center gap-2 ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-900/30'
                : 'bg-automotive-orange hover:bg-automotive-darkOrange shadow-lg shadow-orange-950/40'
            }`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
