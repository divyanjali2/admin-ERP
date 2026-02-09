import React, { useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";


import {
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

const drawerWidth = 260;

const navItems = [
  { label: "HRMS Home", href: "/hrms", icon: <DashboardOutlinedIcon /> },
  { label: "Employees", href: "/hrms/employees", icon: <PeopleAltOutlinedIcon /> },
];

export default function Employees({ auth, employees = [] }) {
  const isMdUp = useMediaQuery("(min-width:900px)");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
const userMenuOpen = Boolean(userMenuAnchor);

const openUserMenu = (e) => setUserMenuAnchor(e.currentTarget);
const closeUserMenu = () => setUserMenuAnchor(null);

  // dialogs
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState("create"); // "create" | "edit"
  const [openView, setOpenView] = useState(false);
  const [viewRow, setViewRow] = useState(null);

  // delete
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Inertia form
  const { data, setData, post, put, processing, reset, errors } = useForm({
    id: null,
    employee_code: "",
    first_name: "",
    last_name: "",
    work_email: "",
    department: "",
    status: "Active",
  });

  const toggleMobile = () => setMobileOpen((v) => !v);

  const openCreate = () => {
    setMode("create");
    reset();
    setData({
      id: null,
      employee_code: "",
      first_name: "",
      last_name: "",
      work_email: "",
      department: "",
      status: "Active",
    });
    setOpenForm(true);
  };

  const openEdit = (row) => {
    setMode("edit");
    setData({
      id: row.id,
      employee_code: row.employee_code ?? "",
      first_name: row.first_name ?? "",
      last_name: row.last_name ?? "",
      work_email: row.work_email ?? "",
      department: row.department ?? "",
      status: row.status ?? "Active",
    });
    setOpenForm(true);
  };

  const openViewDialog = (row) => {
    setViewRow(row);
    setOpenView(true);
  };

  const saveForm = () => {
    if (!data.employee_code || !data.first_name || !data.last_name) return;

    if (mode === "create") {
      post("/hrms/employees", {
        preserveScroll: true,
        onSuccess: () => {
          setOpenForm(false);
          reset();
        },
      });
    } else {
      put(`/hrms/employees/${data.id}`, {
        preserveScroll: true,
        onSuccess: () => {
          setOpenForm(false);
          reset();
        },
      });
    }
  };

  const askDelete = (row) => {
    setDeleteTarget(row);
    setOpenDelete(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    router.delete(`/hrms/employees/${deleteTarget.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setOpenDelete(false);
        setDeleteTarget(null);
      },
    });
  };

  const columns = useMemo(
    () => [
      { field: "employee_code", headerName: "Employee Code", flex: 1, minWidth: 160 },
      { field: "first_name", headerName: "First Name", flex: 1, minWidth: 150 },
      { field: "last_name", headerName: "Last Name", flex: 1, minWidth: 150 },
      { field: "work_email", headerName: "Work Email", flex: 1.4, minWidth: 240 },
      { field: "department", headerName: "Department", flex: 1, minWidth: 160 },
      { field: "status", headerName: "Status", flex: 0.8, minWidth: 130 },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        filterable: false,
        minWidth: 320,
        renderCell: (params) => (
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<VisibilityOutlinedIcon />}
              onClick={() => openViewDialog(params.row)}
              sx={{ borderColor: "#0B1C2D", color: "#0B1C2D" }}
            >
              View
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<EditOutlinedIcon />}
              onClick={() => openEdit(params.row)}
              sx={{ borderColor: "#0B1C2D", color: "#0B1C2D" }}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<DeleteOutlineOutlinedIcon />}
              onClick={() => askDelete(params.row)}
              sx={{ borderColor: "#0B1C2D", color: "#0B1C2D" }}
            >
              Remove
            </Button>
          </Stack>
        ),
      },
    ],
    []
  );

//   function EmployeesGridToolbar() {
//   return (
//     <GridToolbarContainer sx={{ p: 1, gap: 1 }}>
//       <GridToolbarColumnsButton />
//       <GridToolbarFilterButton />
//       <GridToolbarDensitySelector />
//       <GridToolbarExport />
//       <Box sx={{ flex: 1 }} />
//       <GridToolbarQuickFilter debounceMs={300} />
//     </GridToolbarContainer>
//   );
// }


  const Sidebar = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 2, py: 2 }}>
        <Typography fontWeight={900} sx={{ color: "#0B1C2D" }}>
          HRMS
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Modules
        </Typography>
      </Box>

      <Divider />

      <List sx={{ px: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.href}
            component={Link}
            href={item.href}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              border: "1px solid transparent",
              "&:hover": { borderColor: "#0B1C2D" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "#0B1C2D" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ flex: 1 }} />
        <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
        {/* clickable user row */}
        <Button
            onClick={openUserMenu}
            fullWidth
            sx={{
            justifyContent: "space-between",
            textTransform: "none",
            color: "#0B1C2D",
            px: 1,
            py: 1,
            borderRadius: 2,
            "&:hover": { backgroundColor: "rgba(11, 28, 45, 0.06)" },
            }}
            endIcon={<KeyboardArrowDownIcon />}
        >
            <Box sx={{ textAlign: "left" }}>
            <Typography fontWeight={700} sx={{ lineHeight: 1.1 }}>
                {auth?.user?.name ?? "User"}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.1 }}>
                {auth?.user?.email ?? ""}
            </Typography>
            </Box>
        </Button>

        {/* dropdown */}
        <Menu
            anchorEl={userMenuAnchor}
            open={userMenuOpen}
            onClose={closeUserMenu}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
            transformOrigin={{ vertical: "bottom", horizontal: "left" }}
            PaperProps={{ sx: { borderRadius: 2, minWidth: 200 } }}
        >
            <MenuItem
            component={Link}
            href={route("profile.edit")}
            onClick={closeUserMenu}
            >
            <ListItemIcon sx={{ minWidth: 36 }}>
                <PersonOutlineOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Profile
            </MenuItem>

             <MenuItem
                onClick={() => {
                    closeUserMenu();
                    router.post(route("logout"));
                }}
                >
                <ListItemIcon sx={{ minWidth: 36 }}>
                    <LogoutOutlinedIcon fontSize="small" />
                </ListItemIcon>
                Log Out
            </MenuItem>


        </Menu>
        </Box>
    </Box>
  );

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Employees" />

      <Box sx={{ display: "flex" }}>
        {/* Top AppBar (mobile) */}
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            borderBottom: "1px solid",
            borderColor: "divider",
            backgroundColor: "white",
            color: "#0B1C2D",
          }}
        >
          <Toolbar>
            {!isMdUp && (
              <IconButton edge="start" onClick={toggleMobile} sx={{ mr: 1, color: "#0B1C2D" }}>
                {/* <MenuIcon /> */}
              </IconButton>
            )}
            <Typography fontWeight={900}>Employees</Typography>

            <Box sx={{ flex: 1 }} />

            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              onClick={openCreate}
              sx={{ backgroundColor: "#0B1C2D", "&:hover": { backgroundColor: "#0F2A44" } }}
            >
              Create
            </Button>
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
          {!isMdUp && (
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={toggleMobile}
              ModalProps={{ keepMounted: true }}
              sx={{ "& .MuiDrawer-paper": { width: drawerWidth } }}
            >
              {Sidebar}
            </Drawer>
          )}

          {isMdUp && (
            <Drawer
              variant="permanent"
              open
              sx={{ "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" } }}
            >
              {Sidebar}
            </Drawer>
          )}
        </Box>

        {/* Main content (FULL WIDTH) */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            pt: 5,
            pb: 3,
          }}
        >
          <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, md: 3 } }}>
            <Box
              sx={{
                border: "2px solid #0B1C2D",
                // borderRadius: 3,
                overflow: "hidden",
                width: "100%",
              }}
            >
              <Box sx={{ height: "calc(100vh - 170px)", backgroundColor: "white" }}>
                <DataGrid
                rows={employees}
                columns={columns}
                disableRowSelectionOnClick
                checkboxSelection
                pagination
                pageSizeOptions={[10, 25, 50, 100]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 25, page: 0 } },
                }}
                showToolbar
                slotProps={{
                    toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 300 },
                    },
                }}
                />
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Create/Edit Dialog */}
        <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontWeight: 900 }}>
            {mode === "create" ? "Create Employee" : "Edit Employee"}
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Employee Code"
                value={data.employee_code}
                onChange={(e) => setData("employee_code", e.target.value)}
                fullWidth
                error={!!errors.employee_code}
                helperText={errors.employee_code}
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="First Name"
                  value={data.first_name}
                  onChange={(e) => setData("first_name", e.target.value)}
                  fullWidth
                  error={!!errors.first_name}
                  helperText={errors.first_name}
                />
                <TextField
                  label="Last Name"
                  value={data.last_name}
                  onChange={(e) => setData("last_name", e.target.value)}
                  fullWidth
                  error={!!errors.last_name}
                  helperText={errors.last_name}
                />
              </Stack>

              <TextField
                label="Work Email"
                value={data.work_email}
                onChange={(e) => setData("work_email", e.target.value)}
                fullWidth
                error={!!errors.work_email}
                helperText={errors.work_email}
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Department"
                  value={data.department}
                  onChange={(e) => setData("department", e.target.value)}
                  fullWidth
                  error={!!errors.department}
                  helperText={errors.department}
                />
                <TextField
                  label="Status"
                  value={data.status}
                  onChange={(e) => setData("status", e.target.value)}
                  fullWidth
                  placeholder="Active"
                  error={!!errors.status}
                  helperText={errors.status}
                />
              </Stack>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpenForm(false)} disabled={processing}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={saveForm}
              disabled={processing}
              sx={{ backgroundColor: "#0B1C2D", "&:hover": { backgroundColor: "#0F2A44" } }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={openView} onClose={() => setOpenView(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontWeight: 900 }}>Employee Details</DialogTitle>
          <DialogContent>
            <Stack spacing={1.5} sx={{ mt: 1 }}>
              <Typography><b>Employee Code:</b> {viewRow?.employee_code ?? "-"}</Typography>
              <Typography><b>Name:</b> {(viewRow?.first_name ?? "") + " " + (viewRow?.last_name ?? "")}</Typography>
              <Typography><b>Work Email:</b> {viewRow?.work_email ?? "-"}</Typography>
              <Typography><b>Department:</b> {viewRow?.department ?? "-"}</Typography>
              <Typography><b>Status:</b> {viewRow?.status ?? "-"}</Typography>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpenView(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Delete confirm */}
        <Dialog open={openDelete} onClose={() => setOpenDelete(false)} fullWidth maxWidth="xs">
          <DialogTitle sx={{ fontWeight: 900 }}>Remove Employee</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to remove <b>{deleteTarget?.employee_code ?? ""}</b>?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={confirmDelete}
              sx={{ backgroundColor: "#0B1C2D", "&:hover": { backgroundColor: "#0F2A44" } }}
            >
              Remove
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AuthenticatedLayout>
  );
}
