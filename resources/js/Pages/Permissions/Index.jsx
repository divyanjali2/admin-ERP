import React, { useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import Swal from "sweetalert2";

import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Permissions({ auth, permissions }) {
  const list = permissions?.data ?? [];

  // modal
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const isEditing = !!editing;

  // filters + pagination
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    name: "",
    description: "",
  });

  const rows = useMemo(
    () =>
      list.map((p) => ({
        id: p.id,
        name: p.name ?? "",
        description: p.description ?? "-",
      })),
    [list]
  );

  const filteredRows = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        String(r.description ?? "").toLowerCase().includes(query)
    );
  }, [rows, q]);

  const pagedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  useEffect(() => setPage(0), [q, rowsPerPage]);

  const openCreate = () => {
    setEditing(null);
    reset();
    clearErrors();
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    clearErrors();
    setData({
      name: row.name ?? "",
      description: row.description === "-" ? "" : row.description ?? "",
    });
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

    if (!isEditing) {
      post("/hrms/permissions", {
        preserveScroll: true,
        onSuccess: () => {
          closeModal();
          Swal.fire("Success!", "Permission created successfully.", "success");
        },
        onError: () => Swal.fire("Error", "Failed to create permission.", "error"),
      });
      return;
    }

    put(`/hrms/permissions/${editing.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        closeModal();
        Swal.fire("Success!", "Permission updated successfully.", "success");
      },
      onError: () => Swal.fire("Error", "Failed to update permission.", "error"),
    });
  };

  const confirmDelete = async (row) => {
    const res = await Swal.fire({
      title: "Delete permission?",
      text: `Delete "${row.name}"? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d32f2f",
    });

    if (!res.isConfirmed) return;

    router.delete(`/hrms/permissions/${row.id}`, {
      preserveScroll: true,
      onSuccess: () => Swal.fire("Deleted!", "Permission deleted successfully.", "success"),
      onError: () => Swal.fire("Error", "Failed to delete permission.", "error"),
    });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Permissions" />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Button startIcon={<ArrowBackIcon />} onClick={() => router.get("/hrms/users-management")}>
              Back
            </Button>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreate}
              sx={{ backgroundColor: "#0c6eca", "&:hover": { backgroundColor: "#064c8d" } }}
            >
              Add Permission
            </Button>
          </Stack>

          <Typography variant="h5" fontWeight={900}>
            Permissions Management
          </Typography>

          {/* Filters */}
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <TextField
              label="Search"
              placeholder="Search permission name or description..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              fullWidth
            />
          </Paper>

          {/* Table */}
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f7fa" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 900 }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {pagedRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3, color: "text.secondary" }}>
                      No matching permissions.
                    </TableCell>
                  </TableRow>
                ) : (
                  pagedRows.map((perm) => (
                    <TableRow key={perm.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{perm.id}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{perm.name}</TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>{perm.description}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={() => openEdit(perm)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => confirmDelete(perm)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <TablePagination
              component="div"
              count={filteredRows.length}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </TableContainer>
        </Stack>

        {/* Create/Edit Modal */}
        <Dialog open={open} onClose={closeModal} fullWidth maxWidth="sm">
          <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography fontWeight={900}>{isEditing ? "Edit Permission" : "Create Permission"}</Typography>
            <IconButton size="small" onClick={closeModal}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <Divider />

          <Box component="form" onSubmit={submit}>
            <DialogContent sx={{ pt: 2 }}>
              <Stack spacing={2}>
                <TextField
                  label="Permission Name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  fullWidth
                  required
                  placeholder="e.g., users.create, roles.edit"
                />

                <TextField
                  label="Description"
                  value={data.description}
                  onChange={(e) => setData("description", e.target.value)}
                  error={!!errors.description}
                  helperText={errors.description}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Stack>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ p: 2 }}>
              <Button onClick={closeModal} variant="outlined">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={processing}
                sx={{ backgroundColor: "#0c6eca", "&:hover": { backgroundColor: "#064c8d" } }}
              >
                {isEditing ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Container>
    </AuthenticatedLayout>
  );
}
