import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

const ConfirmationDialog = ({ open, title, message, onConfirm, onCancel, onCancelButton, confirmButtonLabel }) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {onCancelButton !== false && (
          <Button onClick={onCancel} color="secondary">
            Cancel
          </Button>
        )}
        <Button onClick={onConfirm} color="primary" autoFocus>
          {confirmButtonLabel ? "Ok" :  "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;