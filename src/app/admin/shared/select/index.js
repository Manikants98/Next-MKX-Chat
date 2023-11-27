import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
} from "@mui/material";
import React from "react";

function Select({
  name = "",
  size = "small",
  fullWidth = false,
  className = "",
  formik,
  label = "",
  children,
  ...rest
}) {
  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel id={`${name}_label`} size={size}>
        {label}
      </InputLabel>
      <MuiSelect
        id={name}
        labelId={`${name}_label`}
        name={name}
        label={label}
        size={size}
        value={formik?.values?.[name]}
        onChange={formik?.handleChange}
        {...rest}
      >
        {children ? children : <MenuItem>No Data Found</MenuItem>}
      </MuiSelect>
    </FormControl>
  );
}

export default Select;
