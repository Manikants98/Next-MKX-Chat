"use client";
import { Add, AddAPhoto, Close } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { enqueueSnackbar as Snackbar } from "notistack";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { addContactsFn, updateContactsFn } from "../../services/contacts";
import ImageUploader from "../../shared/ImageUploader";

const AddContacts = ({ selected, setSelected }) => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");
  const client = useQueryClient();
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelected(null);
    formik.resetForm();
    client.refetchQueries("getContacts");
  };

  const { mutate: addContacts } = useMutation(addContactsFn, {
    onSuccess: (res) => {
      Snackbar(res.data.message, { variant: "success" });
      client.refetchQueries("getContacts");
      formik.resetForm();
      handleClose();
    },
  });
  const { mutate: updateContacts } = useMutation(updateContactsFn, {
    onSuccess: (res) => {
      Snackbar(res.data.message, { variant: "success" });
      client.refetchQueries("getContacts");
      formik.resetForm();
      handleClose();
    },
  });
  const initialValues = {
    profile_picture: selected?.profile_picture || "",
    first_name: selected?.first_name || "",
    last_name: selected?.last_name || "",
    email: selected?.email || "",
    mobile_number: selected?.mobile_number || "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: () => {
      const form = document.getElementById("conatct-form");
      const reqbody = new FormData(form);
      reqbody.append("avatar", image || "");
      Boolean(selected) && reqbody.append("_id", selected?.id);
      Boolean(selected) ? updateContacts(reqbody) : addContacts(reqbody);
    },
  });
  useEffect(() => {
    console.log(selected);
    setImage(selected?.avatar);
  }, [selected]);
  console.log(image, "mkx");
  return (
    <>
      <Button
        startIcon={<Add />}
        variant="contained"
        disableElevation
        onClick={handleOpen}
        className="!px-10 !bg-blue-500 dark:!text-white"
      >
        Contacts
      </Button>
      <Dialog
        id="conatct-form"
        enctype="multipart/form-data"
        component="form"
        onSubmit={formik.handleSubmit}
        onClose={handleClose}
        open={Boolean(selected) || open}
        PaperProps={{ className: "!w-[350px]" }}
      >
        <span className="flex items-center">
          <DialogTitle>
            {Boolean(selected) ? "Update" : "Add"} Contacts
          </DialogTitle>
          <IconButton onClick={handleClose} className="!absolute !right-2">
            <Close />
          </IconButton>
        </span>

        <DialogContent dividers className="!flex !flex-col gap-5 !py-8">
          <ImageUploader image={image} setImage={setImage} />

          <div className="!grid !gap-5">
            <TextField
              size="small"
              label="First Name*"
              name="first_name"
              placeholder="Enter First Name"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              size="small"
              label="Last Name"
              name="last_name"
              placeholder="Enter Last Name"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              size="small"
              label="Email*"
              name="email"
              placeholder="Enter Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              size="small"
              label="Mobile Number"
              name="mobile_number"
              placeholder="Enter 10 Digit Mobile Number"
              value={formik.values.mobile_number}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button type="submit" autoFocus>
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddContacts;
