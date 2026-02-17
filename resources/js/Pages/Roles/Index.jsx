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
  FormControlLabel,
  Checkbox,
  IconButton,
  MenuItem,
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

export default function Roles({ auth, roles, permissions: allPermissions = [] }) {
  const list = roles?.data ?? [];

  // modal
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const isEditing = !!editing;

  // filters
  const [q, setQ] = useState("");
  const [permFilter, setPermFilter] = useState(""); // permission name or ""

  // pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    name: "",
    description: "",
    permissions: [],
  });

  const rows = useMemo(() => {
    return list.map((r) => {
      const perms = r.permissions ?? [];
      const permNames = perms.map((p) => p.name).join(", ");

      return {
        id: r.id,
        name: r.name ?? "",
        description: r.description ?? "-",
        permissions: perms,
        permissionCount: perms.length,
        permNames,
      };
    });
  }, [list]);

  // permission dropdown options from allPermissions
  const permissionOptions = useMemo(() => {
    return (allPermissions ?? [])
      .map((p) => p?.name)
      .filter(Boolean)
      .sort();
  }, [allPermissions]);

  const filteredRows = useMemo(() => {
    const query = q.trim().toLowerCase();

    return rows.filter((r) => {
      const matchQ =
        !query ||
        r.name.toLowerCase().includes(query) ||
        String(r.description ?? "").toLowerCase().includes(query) ||
        r.permNames.toLowerCase().includes(query);

      const matchPerm =
        !permFilter || r.permissions.some((p) => p?.name === permFilter);

      return matchQ && matchPerm;
    });
  }, [rows, q, permFilter]);

  const pagedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  useEffect(() => {
    setPage(0);
  }, [q, permFilter, rowsPerPage]);

  const openCreate = () => {
    setEditing(null);
    reset();
    clearErrors();
    setData("permissions", []);
    setOpen(true);
  };

  const openEdit = (row) => {
    // row already contains permissions list
    setEditing(row);
    clearErrors();

    const selected = (row.permissions ?? []).map((p) => p.id);
    setData({
      name: row.name ?? "",
      description: row.description === "-" ? "" : row.description ?? "",
      permissions: selected,
    });

    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditing(null);
    reset();
    clearErrors();
    setData("permissions", []);
  };

  const togglePermission = (permissionId) => {
    const current = Array.isArray(data.permissions) ? data.permissions : [];
    const next = current.includes(permissionId)
      ? current.filter((x) => x !== permissionId)
      : [...current, permissionId];
    setData("permissions", next);
  };

  const submit = (e) => {
    e.preventDefault();

    if (!isEditing) {
      post("/hrms/roles", {
        preserveScroll: true,
        onSuccess: () => {
          closeModal();
          Swal.fire("Success!", "Role created successfully.", "success");
        },
        onError: () => Swal.fire("Error", "Failed to create role.", "error"),
      });
      return;
    }

    put(`/hrms/roles/${editing.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        closeModal();
        Swal.fire("Success!", "Role updated successfully.", "success");
      },
      onError: () => Swal.fire("Error", "Failed to update role.", "error"),
    });
  };

  const confirmDelete = async (row) => {
    const res = await Swal.fire({
      title: "Delete role?",
      text: `Delete "${row.name}"? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d32f2f",
    });

    if (!res.isConfirmed) return;

    router.delete(`/hrms/roles/${row.id}`, {
      preserveScroll: true,
      onSuccess: () => Swal.fire("Deleted!", "Role deleted successfully.", "success"),
      onError: () => Swal.fire("Error", "Failed to delete role.", "error"),
    });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Roles" />

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
              Add Role
            </Button>
          </Stack>

          <Typography variant="h5" fontWeight={900}>
            Roles Management
          </Typography>

          {/* ✅ Filters */}
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Search"
                placeholder="Search role name, description, permissions..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                fullWidth
              />

              <TextField
                select
                label="Permission"
                value={permFilter}
                onChange={(e) => setPermFilter(e.target.value)}
                sx={{ minWidth: 260 }}
              >
                <MenuItem value="">All permissions</MenuItem>
                {permissionOptions.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </Paper>

          {/* ✅ Table */}
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f7fa" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>Permissions</TableCell>
                  <TableCell sx={{ fontWeight: 900 }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {pagedRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3, color: "text.secondary" }}>
                      No matching roles.
                    </TableCell>
                  </TableRow>
                ) : (
                  pagedRows.map((role) => (
                    <TableRow key={role.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{role.id}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{role.name}</TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>{role.description}</TableCell>
                      <TableCell>
                        {role.permissionCount} permission(s)
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={() => openEdit(role)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => confirmDelete(role)}>
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

        {/* ✅ Create/Edit Modal */}
        <Dialog open={open} onClose={closeModal} fullWidth maxWidth="sm">
          <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography fontWeight={900}>
              {isEditing ? "Edit Role" : "Create Role"}
            </Typography>
            <IconButton size="small" onClick={closeModal}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <Divider />

          <Box component="form" onSubmit={submit}>
            <DialogContent sx={{ pt: 2 }}>
              <Stack spacing={2}>
                <TextField
                  label="Role Name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  fullWidth
                  required
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

                <Box>
                  <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>
                    Permissions
                  </Typography>

                  <Paper variant="outlined" sx={{ p: 1, maxHeight: 260, overflow: "auto" }}>
                    <Stack spacing={0.5}>
                      {allPermissions.length ? (
                        allPermissions.map((p) => (
                          <FormControlLabel
                            key={p.id}
                            control={
                              <Checkbox
                                checked={(data.permissions ?? []).includes(p.id)}
                                onChange={() => togglePermission(p.id)}
                              />
                            }
                            label={p.description ? `${p.name} — ${p.description}` : p.name}
                          />
                        ))
                      ) : (
                        <Typography color="text.secondary">No permissions available.</Typography>
                      )}
                    </Stack>
                  </Paper>
                </Box>
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
