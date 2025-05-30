import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const CommonDeleteDialog = ({
  title = "Delete",
  message = "Are you sure?",
  handleDelete = () => {},
  dialogOpen,
  setDialogOpen,
  deleteBtntext = "Delete",
}) => {
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Cancel</Button>
        <Button
          type="button"
          variant="contained"
          color="secondary"
          onClick={handleDelete}
        >
          {deleteBtntext}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommonDeleteDialog;
