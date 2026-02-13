import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack,
} from "@mui/material";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";

const SIDEBAR_WIDTH = 250;

export default function AdminDashboard({ auth }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Admin Panel" />

      <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
        
        {/* ================= SIDEBAR ================= */}
        <Box
          sx={{
            width: SIDEBAR_WIDTH,
            backgroundColor: "#ffffff",
            borderRight: "1px solid #e5e7eb",
            p: 2,
          }}
        >
          <Typography fontWeight={900} variant="h6" sx={{ mb: 2 }}>
            Admin Panel
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <List disablePadding>

            <ListItemButton
              onClick={() => router.get("/services")}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                "&:hover": { backgroundColor: "#f3f4f6" },
              }}
            >
              <ListItemIcon>
                <HomeOutlinedIcon sx={{ color: "#374151" }} />
              </ListItemIcon>
              <ListItemText
                primary="Home"
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItemButton>

            <ListItemButton
              onClick={() => router.get("/hrms/employees")}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                "&:hover": { backgroundColor: "#f3f4f6" },
              }}
            >
              <ListItemIcon>
                <PeopleAltOutlinedIcon sx={{ color: "#374151" }} />
              </ListItemIcon>
              <ListItemText
                primary="Employees"
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItemButton>

            <ListItemButton
              onClick={() => router.get("/hrms/leave-dashboard")}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                "&:hover": { backgroundColor: "#f3f4f6" },
              }}
            >
              <ListItemIcon>
                <EventAvailableOutlinedIcon sx={{ color: "#374151" }} />
              </ListItemIcon>
              <ListItemText
                primary="Leaves"
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItemButton>

            <ListItemButton
              onClick={() => router.get("/admin/users")}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                "&:hover": { backgroundColor: "#f3f4f6" },
              }}
            >
              <ListItemIcon>
                <GroupOutlinedIcon sx={{ color: "#374151" }} />
              </ListItemIcon>
              <ListItemText
                primary="Users"
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItemButton>

          </List>
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
