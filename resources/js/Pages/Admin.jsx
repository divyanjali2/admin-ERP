import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, Link } from "@inertiajs/react";

import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";

const SIDEBAR_WIDTH = 250;

export default function AdminDashboard({ auth }) {
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const userMenuOpen = Boolean(userMenuAnchor);

  const openUserMenu = (e) => setUserMenuAnchor(e.currentTarget);
  const closeUserMenu = () => setUserMenuAnchor(null);

  return (
    <AuthenticatedLayout user={auth?.user}>
      <Head title="Admin Panel" />

      <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
        {/* ================= SIDEBAR ================= */}
        <Box
          sx={{
            width: SIDEBAR_WIDTH,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#ffffff",
            borderRight: "1px solid #e5e7eb",
            p: 2,
          }}
        >
          <Typography fontWeight={900} variant="h6" sx={{ mb: 2, color: "#111827" }}>
            Admin Panel
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <List disablePadding>
            <ListItemButton
              onClick={() => router.get("/services")}
              sx={{ borderRadius: 2, mb: 0.5, "&:hover": { backgroundColor: "#f3f4f6" } }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <HomeOutlinedIcon sx={{ color: "#374151" }} />
              </ListItemIcon>
              <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>

            <ListItemButton
              onClick={() => router.get("/hrms/employees")}
              sx={{ borderRadius: 2, mb: 0.5, "&:hover": { backgroundColor: "#f3f4f6" } }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <PeopleAltOutlinedIcon sx={{ color: "#374151" }} />
              </ListItemIcon>
              <ListItemText primary="Employees" primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>

            <ListItemButton
              onClick={() => router.get("/hrms/leave-dashboard")}
              sx={{ borderRadius: 2, mb: 0.5, "&:hover": { backgroundColor: "#f3f4f6" } }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <EventAvailableOutlinedIcon sx={{ color: "#374151" }} />
              </ListItemIcon>
              <ListItemText primary="Leaves" primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>

            <ListItemButton
              onClick={() => router.get("/admin/users")}
              sx={{ borderRadius: 2, mb: 0.5, "&:hover": { backgroundColor: "#f3f4f6" } }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <GroupOutlinedIcon sx={{ color: "#374151" }} />
              </ListItemIcon>
              <ListItemText primary="Users" primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
          </List>

          {/* pushes footer to bottom */}
          <Box sx={{ flex: 1 }} />

          {/* ================= FOOTER USER MENU ================= */}
          <Box sx={{ pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
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
                <Typography fontWeight={700} sx={{ lineHeight: 1.1, color: "#111827" }}>
                  {auth?.user?.name ?? "User"}
                </Typography>
                <Typography variant="caption" sx={{ lineHeight: 1.1, color: "#6b7280" }}>
                  {auth?.user?.email ?? ""}
                </Typography>
              </Box>
            </Button>

            <Menu
              anchorEl={userMenuAnchor}
              open={userMenuOpen}
              onClose={closeUserMenu}
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
              transformOrigin={{ vertical: "bottom", horizontal: "left" }}
              PaperProps={{ sx: { borderRadius: 2, minWidth: 220 } }}
            >
              <MenuItem component={Link} href="/profile" onClick={closeUserMenu}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <PersonOutlineOutlinedIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>

              <MenuItem
                onClick={() => {
                  closeUserMenu();
                  router.post("/logout");
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

        {/* ================= MAIN CONTENT ================= */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 4 } }}>
          <Typography variant="h4" fontWeight={900} sx={{ color: "#111827" }}>
            Admin Dashboard
          </Typography>

          <Typography sx={{ color: "#6b7280", mt: 1 }}>
            Manage system users, employees, leave configurations and overall administration.
          </Typography>

          {/* Quick Summary Cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
              gap: 3,
              mt: 4,
            }}
          >
            <SummaryCard title="Total Employees" value="124" />
            <SummaryCard title="Active Users" value="32" />
            <SummaryCard title="Pending Leaves" value="7" />
          </Box>
        </Box>
      </Box>
    </AuthenticatedLayout>
  );
}

/* ================= SUMMARY CARD ================= */

function SummaryCard({ title, value }) {
  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 3,
        p: 3,
        boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
      }}
    >
      <Typography variant="caption" sx={{ color: "#6b7280" }}>
        {title}
      </Typography>

      <Typography variant="h4" fontWeight={900} sx={{ mt: 1, color: "#111827" }}>
        {value}
      </Typography>
    </Box>
  );
}
