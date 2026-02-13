import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";

import {
  Box,
  Stack,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";

const SIDEBAR_WIDTH = 240;

export default function Leave({ auth }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Leave" />

      <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
        
        {/* LEFT SIDEBAR */}
        <Box
          sx={{
            width: SIDEBAR_WIDTH,
            backgroundColor: "#ffffff",
            borderRight: "1px solid #e5e7eb",
            p: 2,
          }}
        >
          <Typography fontWeight={900} sx={{ mb: 2 }}>
            HRMS
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <List disablePadding>

            <ListItemButton
              onClick={() => router.get("/hrms")}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                "&:hover": { backgroundColor: "#f3f4f6" },
              }}
            >
              <HomeOutlinedIcon sx={{ mr: 1.5, color: "#374151" }} />
              <ListItemText
                primary="HRMS Home"
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItemButton>

            <ListItemButton
              selected
              onClick={() => router.get("/hrms/leave-dashboard")}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                "&:hover": { backgroundColor: "#f3f4f6" },
              }}
            >
              <DashboardOutlinedIcon sx={{ mr: 1.5, color: "#374151" }} />
              <ListItemText
                primary="Dashboard"
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

            </ListItemButton>

          </List>

        </Box>

        {/* MAIN CONTENT */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 4 } }}>

          <Typography variant="h4" fontWeight={900} sx={{ color: "#111827", mb: 3 }}>
            Leave Dashboard
          </Typography>

          {/* ===== SUMMARY CARDS ===== */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
              gap: 2,
              mb: 4,
            }}
          >
            {[
              { label: "On Leave Today", value: 5, color: "#2563eb" },
              { label: "Pending Requests", value: 8, color: "#f59e0b" },
              { label: "Approved", value: 24, color: "#16a34a" },
              { label: "Rejected", value: 3, color: "#dc2626" },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 3,
                  p: 3,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
                }}
              >
                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                  {item.label}
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={900}
                  sx={{ color: item.color, mt: 1 }}
                >
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* ===== TWO COLUMN SECTION ===== */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
              gap: 3,
            }}
          >
            {/* === TODAY ON LEAVE === */}
            <Box
              sx={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 3,
                p: 3,
                boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
              }}
            >
              <Typography fontWeight={800} sx={{ mb: 2 }}>
                Employees On Leave Today
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                }}
              >
                {[
                  {
                    name: "John Doe",
                    type: "Annual Leave",
                    department: "Finance",
                    manager: "Mr. Perera",
                  },
                  {
                    name: "Jane Smith",
                    type: "Medical Leave",
                    department: "Operations",
                    manager: "Ms. Fernando",
                  },
                  {
                    name: "Michael Brown",
                    type: "Casual Leave",
                    department: "Sales",
                    manager: "Mr. Silva",
                  },
                  {
                    name: "Anne Blake",
                    type: "Annual Leave",
                    department: "HR",
                    manager: "Mr. Raj",
                  },
                ].map((item) => (
                  <Box
                    key={item.name}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid #e5e7eb",
                      backgroundColor: "#f9fafb",
                      transition: "0.2s ease",
                      "&:hover": {
                        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Typography fontWeight={700} sx={{ color: "#111827" }}>
                      {item.name}
                    </Typography>

                    <Typography variant="caption" sx={{ color: "#6b7280", display: "block", mb: 1 }}>
                      {item.type}
                    </Typography>

                    <Typography variant="caption" sx={{ color: "#374151", display: "block" }}>
                      Department: {item.department}
                    </Typography>

                    <Typography variant="caption" sx={{ color: "#374151" }}>
                      Reporting Manager: {item.manager}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* === PENDING REQUESTS === */}
            <Box
              sx={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 3,
                p: 3,
                boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
              }}
            >
              <Typography fontWeight={800} sx={{ mb: 2 }}>
                Pending Leave Requests
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, // 2 by 2
                  gap: 2,
                }}
              >
                {[
                  {
                    name: "David Lee",
                    days: "2 Days",
                    department: "Finance",
                    manager: "Mr. Perera",
                  },
                  {
                    name: "Sarah Wilson",
                    days: "3 Days",
                    department: "Operations",
                    manager: "Ms. Fernando",
                  },
                  {
                    name: "Chris Evans",
                    days: "1 Day",
                    department: "Sales",
                    manager: "Mr. Silva",
                  },
                  {
                    name: "Anne Blake",
                    days: "4 Days",
                    department: "HR",
                    manager: "Mr. Raj",
                  },
                ].map((item) => (
                  <Box
                    key={item.name}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid #e5e7eb",
                      backgroundColor: "#f9fafb",
                      transition: "0.2s ease",
                      "&:hover": {
                        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Typography fontWeight={700} sx={{ color: "#111827" }}>
                      {item.name}
                    </Typography>

                    <Typography variant="caption" sx={{ color: "#6b7280" }}>
                      {item.days}
                    </Typography>

                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" sx={{ color: "#374151", display: "block" }}>
                        Department: {item.department}
                      </Typography>

                      <Typography variant="caption" sx={{ color: "#374151" }}>
                        Reporting Manager: {item.manager}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>


      </Box>
    </AuthenticatedLayout>
  );
}
