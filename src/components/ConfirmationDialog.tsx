import React from 'react';

// Minimal placeholder to fix import error. Replace with full implementation as needed.
type ConfirmationDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText: string;
};
const ConfirmationDialog = (_: ConfirmationDialogProps) => null;
export default ConfirmationDialog;
