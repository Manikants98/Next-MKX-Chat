"use client";
import { Add, Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
} from "@mui/material";
import { useFormik } from "formik";
import { enqueueSnackbar as Snackbar } from "notistack";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  addContactsFn,
  getContactsFn,
  updateContactsFn,
} from "../../services/contacts";
import ImageUploader from "../../shared/ImageUploader";
import Input from "../../shared/input";
import Select from "../../shared/select";

const AddContacts = ({ isContactId, setIsContactId }) => {
  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState("");
  const client = useQueryClient();
  const { data: contactData } = useQuery(
    ["getContact", isContactId],
    () => getContactsFn({ _id: isContactId }),
    { refetchOnWindowFocus: false }
  );
  const contact = contactData?.data;
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setIsContactId(null);
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
    avatar: contact?.avatar || "",
    first_name: contact?.first_name || "",
    last_name: contact?.last_name || "",
    email: contact?.email || "",
    mobile_number: contact?.mobile_number || "",
    instagram: contact?.instagram || "",
    linkedin: contact?.linkedin || "",
    contact_type: contact?.contact_type || "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      isContactId
        ? updateContacts({ _id: isContactId, avatar, ...values })
        : addContacts({ avatar, ...values });
    },
  });

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
        component="form"
        onSubmit={formik.handleSubmit}
        onClose={handleClose}
        open={isContactId || open}
        PaperProps={{ className: "!max-w-[50%] !w-[350px]" }}
      >
        <span className="flex items-center">
          <DialogTitle>{isContactId ? "Update" : "Add"} Contacts</DialogTitle>
          <IconButton onClick={handleClose} className="!absolute !right-2">
            <Close />
          </IconButton>
        </span>

        <DialogContent dividers className="!flex !flex-col gap-5 !py-8">
          <ImageUploader name="avatar" formik={formik} />

          <div className="grid gap-5">
            <Input
              name="first_name"
              label="First Name*"
              placeholder="Enter First Name"
              formik={formik}
            />
            <Input
              name="last_name"
              label="Last Name*"
              placeholder="Enter Last Name"
              formik={formik}
            />
            <Input
              name="email"
              label="Email*"
              placeholder="Enter Email"
              formik={formik}
            />
            <Input
              name="mobile_number"
              label="Mobile Number*"
              placeholder="Enter Mobile Number"
              formik={formik}
            />
            <Input
              name="instagram"
              label="Instagram Link"
              placeholder="Enter Instagram Link"
              formik={formik}
            />
            <Input
              name="linkedin"
              label="LinkedIn Link"
              placeholder="Enter LinkedIn Link"
              formik={formik}
            />
            <Select name="contact_type" label="Contact Type" formik={formik}>
              <MenuItem value="General">General</MenuItem>
              <MenuItem value="Office">Office</MenuItem>
              <MenuItem value="College">College</MenuItem>
              <MenuItem value="Business">Business</MenuItem>
            </Select>
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
