"use client";
import { Delete, Edit } from "@mui/icons-material";
import { Divider, TextField } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import moment from "moment";
import AddUsers from "../users/AddUsers";
import { getUsersFn } from "../services/users";
import { useQuery } from "react-query";

const Chats = () => {
  const { data: users, isLoading: isloadingUsers } = useQuery(
    ["getUsers"],
    () => getUsersFn(),
    { refetchOnWindowFocus: false }
  );

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
    { field: "id", headerName: "ID", width: 200 },
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
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem icon={<Edit />} label="Edit" />,
          <GridActionsCellItem icon={<Delete />} label="Delete" />,
        ];
      },
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center h-[10vh] px-3">
        <TextField size="small" placeholder="Search" />
        <AddUsers />
      </div>
      <Divider />
      <div className="flex min-h-[400px] overflow-auto  h-[90vh] flex-col gap-3 p-3">
        <DataGrid
          onRowSelectionModelChange={(select) => console.log(select)}
          autoPageSize
          rowSelection={false}
          loading={isloadingUsers}
          rows={rows}
          columns={columns}
        />
      </div>
    </>
  );
};

export default Chats;
