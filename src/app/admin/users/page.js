"use client";
import { Delete, Edit } from "@mui/icons-material";
import { Divider, TextField } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import moment from "moment";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { deleteUsersFn, getUsersFn } from "../services/users";
import AddUsers from "./AddUsers";
import { enqueueSnackbar as Snackbar } from "notistack";

const Users = () => {
  const [selected, setSelected] = useState(null);
  const client = useQueryClient();
  const { data: users, isLoading: isloadingUsers } = useQuery(
    ["getUsers"],
    () => getUsersFn(),
    { refetchOnWindowFocus: false }
  );

  const { mutate: deleteUsers } = useMutation(deleteUsersFn, {
    onSuccess: (res) => {
      Snackbar(res.data.message, { variant: "success" });
      client.refetchQueries("getUsers");
    },
  });
  const rows =
    users?.data?.users?.map((user) => {
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile_number: user.mobile_number,
        gender: user.gender,
        dob: moment(user.dob).format("LL"),
      };
    }) || [];

  const columns = [
    { field: "id", headerName: "ID", width: 210 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "mobile_number", headerName: "Mobile Number", flex: 1 },
    { field: "gender", headerName: "Gender", flex: 1 },
    { field: "dob", headerName: "Date Of Birth", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      type: "actions",
      getActions: ({ row }) => {
        return [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            onClick={() => setSelected(row)}
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={() => deleteUsers({ _id: row.id })}
          />,
        ];
      },
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center h-[10vh] px-3">
        <TextField size="small" placeholder="Search" />
        <AddUsers selected={selected} setSelected={setSelected} />
      </div>
      <Divider />
      <div className="flex min-h-[400px] overflow-auto h-[90vh] flex-col gap-3 p-3">
        <DataGrid
          onRowSelectionModelChange={(select) => console.log(select)}
          autoPageSize
          rowSelection={false}
          loading={isloadingUsers}
          rows={rows}
          className="!border-zinc-200 !shadow dark:!border-zinc-700"
          columns={columns}
        />
      </div>
    </>
  );
};

export default Users;
