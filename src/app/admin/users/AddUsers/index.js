"use client";
import { Add, Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import moment from "moment";
import { enqueueSnackbar as Snackbar } from "notistack";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { addUsersFn, updateUsersFn } from "../../services/users";

const AddUsers = ({ selected, setSelected }) => {
  const [open, setOpen] = useState(false);
  const client = useQueryClient();
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelected(null);
    formik.resetForm();
    client.refetchQueries("getUsers");
  };

  const { mutate: addUsers } = useMutation(addUsersFn, {
    onSuccess: (res) => {
      Snackbar(res.data.message, { variant: "success" });
      client.refetchQueries("getUsers");
      formik.resetForm();
      handleClose();
    },
  });
  const { mutate: updateUsers } = useMutation(updateUsersFn, {
    onSuccess: (res) => {
      Snackbar(res.data.message, { variant: "success" });
      client.refetchQueries("getUsers");
      formik.resetForm();
      handleClose();
    },
  });
  const initialValues = {
    name: selected?.name || "",
    email: selected?.email || "",
    mobile_number: selected?.mobile_number || "",
    gender: selected?.gender || "",
    dob: selected?.dob
      ? moment(selected?.dob).format("YYYY-MM-DD")
      : "2000-01-01",
    password: selected?.password || "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      Boolean(selected)
        ? updateUsers({ _id: selected?.id, ...values })
        : addUsers(values);
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
        User
      </Button>
      <Dialog
        component="form"
        onSubmit={formik.handleSubmit}
        onClose={handleClose}
        open={Boolean(selected) || open}
        PaperProps={{ className: "!max-w-1/2 !w-1/2" }}
      >
        <span className="flex items-center">
          <DialogTitle>{Boolean(selected) ? "Update" : "Add"} User</DialogTitle>
          <IconButton onClick={handleClose} className="!absolute !right-2">
            <Close />
          </IconButton>
        </span>

        <DialogContent dividers className="!grid !grid-cols-2 !gap-5 !py-8">
          <TextField
            size="small"
            label="Name*"
            name="name"
            placeholder="Enter Name"
            value={formik.values.name}
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

          <FormControl>
            <InputLabel
              className="!bg-white dark:!bg-[#383838]"
              shrink={true}
              size="small"
              id="gender-label"
            >
              Gender
            </InputLabel>
            <Select
              size="small"
              labelId="gender-label"
              name="gender"
              placeholder="Ex. Male"
              label="Gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              displayEmpty
            >
              <MenuItem value="">Select Gender</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            type="date"
            label="Birthday"
            name="dob"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{ style: { textTransform: "uppercase" } }}
            value={formik.values.dob}
            onChange={formik.handleChange}
          />
          {!Boolean(selected) && (
            <TextField
              size="small"
              type="password"
              label="Password*"
              name="password"
              placeholder="Enter Password"
              InputLabelProps={{
                shrink: true,
              }}
              value={formik.values.password}
              onChange={formik.handleChange}
            />
          )}
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

export default AddUsers;
