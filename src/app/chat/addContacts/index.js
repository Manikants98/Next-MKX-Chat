"use client";
import {
  addContactsFn,
  getContactsFn,
  updateContactsFn,
} from "@/app/admin/services/contacts";
import ImageUploader from "@/app/admin/shared/ImageUploader";
import Input from "@/app/admin/shared/input";
import Select from "@/app/admin/shared/select";
import { Add, Close, PersonAdd } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemButton,
  ListItemIcon,
  MenuItem,
} from "@mui/material";
import { useFormik } from "formik";
import { enqueueSnackbar as Snackbar } from "notistack";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

const AddContacts = ({ isContactId, setIsContactId, fetchContacts }) => {
  const [open, setOpen] = useState(false);
  const client = useQueryClient();
  const { data: contactData } = useQuery(
    ["getContact", isContactId],
    () => getContactsFn({ _id: isContactId }),
    { refetchOnWindowFocus: false, enabled: isContactId }
  );
  const contact = contactData?.data;
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
    setIsContactId(false);
  };

  const { mutate: addContacts } = useMutation(addContactsFn, {
    onSuccess: (res) => {
      Snackbar(res.data.message, { variant: "success" });
      fetchContacts();
      handleClose();
    },
  });
  const { mutate: updateContacts } = useMutation(updateContactsFn, {
    onSuccess: (res) => {
      Snackbar(res.data.message, { variant: "success" });
      fetchContacts();
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
        ? updateContacts({ _id: isContactId, ...values })
        : addContacts(values);
    },
  });

  return (
    <>
      <ListItemButton
        className="flex items-center w-full gap-3 px-4 py-3 font-semibold"
        onClick={handleOpen}
      >
        <Avatar className="!bg-[#00A884]">
          <PersonAdd className="text-white" />
        </Avatar>{" "}
        New Contact
      </ListItemButton>
      <Dialog
        component="form"
        onSubmit={formik.handleSubmit}
        onClose={handleClose}
        open={isContactId || open}
        PaperProps={{ className: "!max-w-[50%] dark:!bg-[#222E35] !w-[350px]" }}
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
              <MenuItem value="Friends">Friends</MenuItem>
              <MenuItem value="Family">Family</MenuItem>
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
