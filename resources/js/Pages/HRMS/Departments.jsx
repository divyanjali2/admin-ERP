import React, { useMemo, useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

export default function Departments({ departments = [] }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create"); // "create" | "edit"
  const [editing, setEditing] = useState(null);

  const { data, setData, post, put, processing, errors, reset, clearErrors } =
    useForm({
      name: "",
    });

  const openCreate = () => {
    setMode("create");
    setEditing(null);
    reset();
    clearErrors();
    setOpen(true);
  };

  const openEdit = (row) => {
    setMode("edit");
    setEditing(row);
    setData("name", row?.name ?? "");
    clearErrors();
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditing(null);
    reset();
    clearErrors();
  };

  const submit = (e) => {
    e.preventDefault();

    if (mode === "create") {
      post(route("hrms.departments.store"), {
        preserveScroll: true,
        onSuccess: () => closeModal(),
      });
      return;
    }

    // edit
    put(route("hrms.departments.update", editing?.department_id), {
      preserveScroll: true,
      data: { _method: "put", ...data },
      onSuccess: () => closeModal(),
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      router.delete(route("hrms.departments.destroy", id), {
        preserveScroll: true,
      });
    }
  };

  const rows = useMemo(
    () =>
      (departments || []).map((d) => ({
        id: d.department_id, // DataGrid needs `id`
        ...d,
      })),
    [departments]
  );

  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Department Name",
        flex: 1,
        minWidth: 260,
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 160,
        sortable: false,
        filterable: false,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Stack direction="row" spacing={1}>
            <IconButton
              size="small"
              onClick={() => openEdit(params.row)}
              aria-label="edit"
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row.department_id)}
              aria-label="delete"
            >
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </Stack>
        ),
      },
    ],
    []
  );

  function Toolbar() {
    return (
      <GridToolbarContainer sx={{ p: 1, justifyContent: "space-between" }}>
        <GridToolbarQuickFilter placeholder="Search departments..." />
        <Button
          variant="contained"
          startIcon={<AddOutlinedIcon />}
          onClick={openCreate}
        >
          Add Department
        </Button>
      </GridToolbarContainer>
    );
  }

  return (
    <AuthenticatedLayout>
      <Head title="Departments" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight={800}>Departments</Typography>

                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={openCreate}>
                        Add Department
                        </Button>

                        <Button variant="outlined" startIcon={<ArrowBackOutlinedIcon />} onClick={() => router.get("/hrms/employees")}>
                        Back
                        </Button>
                    </Stack>
                </Stack>

              <Box sx={{ height: 520, width: "100%" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  disableRowSelectionOnClick
                  pageSizeOptions={[10, 25, 50]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 10, page: 0 } },
                  }}
                  slots={{ toolbar: Toolbar }}
                />
              </Box>

              {/* Modal for Create/Edit */}
              <Dialog open={open} onClose={closeModal} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 800 }}>
                  {mode === "create" ? "Create Department" : "Edit Department"}
                </DialogTitle>

                <Box component="form" onSubmit={submit}>
                  <DialogContent dividers>
                    <TextField
                      label="Department Name"
                      value={data.name}
                      onChange={(e) => setData("name", e.target.value)}
                      fullWidth
                      autoFocus
                      error={!!errors.name}
                      helperText={errors.name}
                    />
                  </DialogContent>

                  <DialogActions sx={{ p: 2 }}>
                    <Button variant="outlined" onClick={closeModal}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={processing}
                    >
                      {mode === "create" ? "Save" : "Update"}
                    </Button>
                  </DialogActions>
                </Box>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
