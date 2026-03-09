import { Head, Link, router, useForm } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
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

export default function JobTitles({ jobTitles = [] }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create"); // "create" | "edit"
  const [editing, setEditing] = useState(null);

  const { data, setData, put, post, processing, errors, reset, clearErrors } = useForm({
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
      post(route("hrms.job-titles.store"), {
        preserveScroll: true,
        onSuccess: () => closeModal(),
      });
      return;
    }

    // edit
    put(route("hrms.job-titles.update", editing?.job_title_id), {
      preserveScroll: true,
      data: { _method: "put", ...data },
      onSuccess: () => closeModal(),
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this job title?")) {
      router.delete(route("hrms.job-titles.destroy", id), {
        preserveScroll: true,
      });
    }
  };

  const rows = useMemo(
    () =>
      (jobTitles || []).map((jt) => ({
        id: jt.job_title_id, // DataGrid needs `id`
        ...jt,
      })),
    [jobTitles]
  );

  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Job Title",
        flex: 1,
        minWidth: 250,
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
              onClick={() => handleDelete(params.row.job_title_id)}
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
        <GridToolbarQuickFilter placeholder="Search job titles..." />
        <Button
          variant="contained"
          startIcon={<AddOutlinedIcon />}
          onClick={openCreate}
        >
          Add Job Title
        </Button>
      </GridToolbarContainer>
    );
  }

  return (
    <AuthenticatedLayout>
      <Head title="Job Titles" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
                >
                <Typography variant="h5" fontWeight={800}>
                    Job Titles
                </Typography>

                <Stack direction="row" spacing={2}>
                    <Button
                    variant="contained"
                    startIcon={<AddOutlinedIcon />}
                    onClick={openCreate}
                    >
                    Add Job Title
                    </Button>

                    <Button
                    variant="outlined"
                    startIcon={<ArrowBackOutlinedIcon />}
                    onClick={() => router.get(route("hrms.employees.index"))}
                    >
                    Back
                    </Button>
                </Stack>
                </Stack>

              {/* ✅ Table */}
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

              {/* ✅ Modal for Create/Edit */}
              <Dialog open={open} onClose={closeModal} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 800 }}>
                  {mode === "create" ? "Create Job Title" : "Edit Job Title"}
                </DialogTitle>

                <Box component="form" onSubmit={submit}>
                  <DialogContent dividers>
                    <TextField
                      label="Job Title"
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
                    <Button type="submit" variant="contained" disabled={processing}>
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
