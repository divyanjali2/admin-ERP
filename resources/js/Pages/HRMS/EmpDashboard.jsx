import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

import {
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

const drawerWidth = 260;

const navItems = [
  { label: "HRMS Home", href: "/hrms", icon: <HomeOutlinedIcon /> },
  { label: "Dashboard", href: "/hrms/emp-dashboard", icon: <DashboardOutlinedIcon /> },
  { label: "Employees", href: "/hrms/employees", icon: <PeopleAltOutlinedIcon /> },
];

export default function EmpDashboard({ auth }) {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = () => setMobileOpen((p) => !p);

  const drawer = (
    <Box sx={{ width: drawerWidth }}>
      <Toolbar>
        <Typography fontWeight={900} variant="h6">
          HRMS
        </Typography>
      </Toolbar>

      <Divider />

      <List>
        {navItems.map((item) => (
          <ListItemButton key={item.label} onClick={() => router.get(item.href)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Employee Dashboard" />

      <Box sx={{ display: "flex" }}>
        {/* ================= SIDEBAR ================= */}
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={toggleDrawer}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": { width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>

          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": { width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* ================= MAIN CONTENT ================= */}
        <Box
          sx={{
            flexGrow: 1,
          }}
        >
          <Toolbar />

          <Container maxWidth={false}>
            {/* Title + Create button row */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Box>
                <Typography variant="h4" fontWeight={900}>
                  Employee Data Dashboard
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Overview of employee data, departments, and analytics.
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<AddOutlinedIcon />}
                sx={{ backgroundColor: "#0B1C2D", "&:hover": { backgroundColor: "#0F2A44" } }}
                onClick={() => router.get("/hrms/employees/create")}
              >
                Create
              </Button>
            </Stack>
          </Container>
        </Box>
      </Box>
    </AuthenticatedLayout>
  );
}
