"use client";
import { Delete, Edit } from "@mui/icons-material";
import { Divider, TextField } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { enqueueSnackbar as Snackbar } from "notistack";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { deleteContactsFn, getContactsFn } from "../services/contacts";
import AddContacts from "./AddContacts";

const Contacts = () => {
  const [isContactId, setIsContactId] = useState(null);
  const client = useQueryClient();
  const { data: contacts, isLoading: isLoadingContacts } = useQuery(
    ["getContacts"],
    () => getContactsFn(),
    { refetchOnWindowFocus: false }
  );

  const { mutate: deleteContacts } = useMutation(deleteContactsFn, {
    onSuccess: (res) => {
      Snackbar(res.data.message, { variant: "success" });
      client.refetchQueries("getContacts");
    },
  });
  const rows =
    contacts?.data?.contacts?.map((contact) => {
      return {
        id: contact._id,
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email,
        mobile_number: contact.mobile_number,
        contact_type: contact.contact_type,
      };
    }) || [];

  const columns = [
    { field: "id", headerName: "ID", width: 210 },
    { field: "first_name", headerName: "First Name", flex: 1 },
    { field: "last_name", headerName: "Last Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "mobile_number", headerName: "Mobile Number", flex: 1 },
    { field: "contact_type", headerName: "Contact Type", flex: 1 },
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
            onClick={() => setIsContactId(row.id)}
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={() => deleteContacts({ _id: row.id })}
          />,
        ];
      },
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center h-[10vh] px-3">
        <TextField size="small" placeholder="Search" />
        <AddContacts
          isContactId={isContactId}
          setIsContactId={setIsContactId}
        />
      </div>
      <Divider />
      <div className="flex min-h-[400px] overflow-auto h-[90vh] flex-col gap-3 p-3">
        <DataGrid
          onRowSelectionModelChange={(select) => console.log(select)}
          autoPageSize
          rowSelection={false}
          loading={isLoadingContacts}
          rows={rows}
          className="!border-zinc-200 !shadow dark:!border-zinc-700"
          columns={columns}
        />
      </div>
    </>
  );
};

export default Contacts;
