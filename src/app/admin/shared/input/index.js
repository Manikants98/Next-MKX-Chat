import { TextField } from "@mui/material";
import React from "react";

function Input({
  name = "",
  placeholder = "",
  size = "small",
  label = "",
  type = "text",
  className = "",
  formik,
  ...rest
}) {
  return (
    <TextField
      type={type}
      size={size}
      label={label}
      name={name}
      placeholder={placeholder}
      value={formik?.values?.[name]}
      onChange={formik?.handleChange}
      InputLabelProps={{
        shrink: true,
      }}
      className={className}
      {...rest}
    />
  );
}

export default Input;
