import React, { useMemo, useState } from "react";
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Users({ auth, users, roles: availableRoles }) {
  const list = users?.data ?? [];

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const isEditing = !!editing;

  // ✅ filter state
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState(""); // role name or ""

  // ✅ pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, setData, post, put, processing, errors, reset, clearErrors } =
    useForm({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      role_id: "",
    });

  const rows = useMemo(() => {
    return list.map((u) => ({
      id: u.id,
      name: u.name ?? "",
      email: u.email ?? "",
      roles: u.roles ?? [],
      roleNames: (u.roles ?? []).map((r) => r.name).join(", "),
    }));
  }, [list]);

  // ✅ build role options from the table data
  const roleOptions = useMemo(() => {
    const s = new Set();
    rows.forEach((r) => r.roles.forEach((x) => x?.name && s.add(x.name)));
    return Array.from(s).sort();
  }, [rows]);

  // ✅ apply filters
  const filteredRows = useMemo(() => {
    const query = q.trim().toLowerCase();

    return rows.filter((r) => {
      const matchQ =
        !query ||
        r.name.toLowerCase().includes(query) ||
        r.email.toLowerCase().includes(query) ||
        r.roleNames.toLowerCase().includes(query);

      const matchRole = !roleFilter || r.roles.some((x) => x?.name === roleFilter);

      return matchQ && matchRole;
    });
  }, [rows, q, roleFilter]);

  // ✅ paginate filtered results
  const pagedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  // reset to page 0 whenever filters change
  React.useEffect(() => {
    setPage(0);
  }, [q, roleFilter, rowsPerPage]);

  const openCreate = () => {
    setEditing(null);
    reset();
    clearErrors();
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    clearErrors();
    const roleId = row.roles && row.roles.length > 0 ? row.roles[0].id : "";
    setData({
      name: row.name ?? "",
      email: row.email ?? "",
      password: "",
      password_confirmation: "",
      role_id: roleId,
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
      post("/hrms/users", {
        preserveScroll: true,
        onSuccess: () => {
          closeModal();
          Swal.fire("Success!", "User created successfully.", "success");
        },
        onError: () => Swal.fire("Error", "Failed to create user.", "error"),
      });
      return;
    }

    put(`/hrms/users/${editing.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        closeModal();
        Swal.fire("Success!", "User updated successfully.", "success");
      },
      onError: () => Swal.fire("Error", "Failed to update user.", "error"),
    });
  };

  const confirmDelete = async (row) => {
    const res = await Swal.fire({
      title: "Delete user?",
      text: `Delete "${row.name}"? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d32f2f",
    });

    if (!res.isConfirmed) return;

    router.delete(`/hrms/users/${row.id}`, {
      preserveScroll: true,
      onSuccess: () => Swal.fire("Deleted!", "User deleted successfully.", "success"),
      onError: () => Swal.fire("Error", "Failed to delete user.", "error"),
    });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Users" />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.get("/hrms/users-management")}
            >
              Back
            </Button>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreate}
              sx={{ backgroundColor: "#0c6eca", "&:hover": { backgroundColor: "#064c8d" } }}
            >
              Add User
            </Button>
          </Stack>

          <Typography variant="h5" fontWeight={900}>
            Users Management
          </Typography>

          {/* ✅ Filters */}
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Search"
                placeholder="Search name, email, roles..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                fullWidth
              />

              <TextField
                select
                label="Role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                sx={{ minWidth: 220 }}
              >
                <MenuItem value="">All roles</MenuItem>
                {roleOptions.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </Paper>

          {/* ✅ Table */}
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: 800, width: 80 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Roles</TableCell>
                  <TableCell sx={{ fontWeight: 800, width: 140 }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {pagedRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                      No matching users.
                    </TableCell>
                  </TableRow>
                ) : (
                  pagedRows.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.roleNames || "No roles"}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={() => openEdit(row)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => confirmDelete(row)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* ✅ Pagination */}
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
              {isEditing ? "Edit User" : "Create User"}
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
                  label="Full Name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  fullWidth
                  required
                />

                <TextField
                  label="Email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                  required
                />

                <TextField
                  label={isEditing ? "Password (optional)" : "Password"}
                  type="password"
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                  fullWidth
                  required={!isEditing}
                />

                <TextField
                  label="Confirm Password"
                  type="password"
                  value={data.password_confirmation}
                  onChange={(e) => setData("password_confirmation", e.target.value)}
                  error={!!errors.password_confirmation}
                  helperText={errors.password_confirmation}
                  fullWidth
                  required={!isEditing}
                />

                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    label="Role"
                    value={data.role_id}
                    onChange={(e) => setData("role_id", e.target.value)}
                    error={!!errors.role_id}
                  >
                    <MenuItem value="">
                      <em>Select a role</em>
                    </MenuItem>
                    {availableRoles && availableRoles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
