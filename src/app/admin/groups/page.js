"use client";
import axiosInstance from "@/app/utils/axiosInstance";
import { Divider, TextField } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import moment from "moment";
import { useEffect, useState } from "react";
import AddUsers from "../users/AddUsers";
import { Delete, Edit } from "@mui/icons-material";

const Groups = () => {
  const [isloadingUsers, setIsLoadingUsers] = useState(false);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await axiosInstance.get("api/users");
      if (response) {
        setUsers(response.data.users);
        setIsLoadingUsers(false);
      }
    } catch (error) {
      setIsLoadingUsers(false);
      throw error;
    }
  };
  const rows = users?.map((user) => {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile_number: user.mobile_number,
      gender: user.gender,
      dob: moment(user.dob).format("LL"),
    };
  });

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
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center h-[10vh] px-3">
        <TextField size="small" placeholder="Search" />
        <AddUsers refetchFn={fetchUsers} />
      </div>
      <Divider />
      <div className="flex min-h-[400px] overflow-auto flex-col h-[90vh] gap-3 p-3">
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

export default Groups;
