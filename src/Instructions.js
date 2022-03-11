import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
} from "@mui/material";

export default function Instructions({ open, setClose }) {
  return (
    <Dialog
      open={open}
      onBackdropClick={setClose}
      PaperProps={{ sx: { backgroundColor: "#333", color: "white" } }}
    >
      <DialogTitle>How to play</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: "white" }}>
          Use your arrow keys to move the tiles. Tiles with the same number
          merge into one when they touch. Add them up to reach 2048!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={setClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
