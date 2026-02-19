import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
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
  TextField,
  MenuItem,
  Autocomplete,
  CircularProgress,
} from "@mui/material";

const SIDEBAR_WIDTH = 240;

export default function Leave({ auth, employeesOnLeave = [], pendingRequests = [], stats = {}, employees = [] }) {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleEmployeeChange = async (event, value) => {
    const empId = value?.id;
    setSelectedEmployee(value);
    setLeaveBalances([]);

    if (!empId) return;

    setLoading(true);
    try {
      const response = await fetch(`/hrms/leave-balances/${empId}`);
      const data = await response.json();
      setLeaveBalances(data.balances || []);
    } catch (error) {
      console.error("Error fetching leave balances:", error);
    } finally {
      setLoading(false);
    }
  };

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

            <Divider sx={{ my: 2 }} />

            {/* EMPLOYEE LEAVE BALANCES SECTION */}
            <Typography fontWeight={900} sx={{ fontSize: "0.9rem", mb: 1 }}>
              LEAVE BALANCES
            </Typography>

            <Autocomplete
              options={employees}
              getOptionLabel={(option) => `${option.name} (${option.code})`}
              value={selectedEmployee}
              onChange={handleEmployeeChange}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              size="small"
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Employee"
                  placeholder="Type name or code..."
                />
              )}
              sx={{ mb: 2 }}
            />

            {loading && (
              <Stack alignItems="center" sx={{ py: 2 }}>
                <CircularProgress size={24} />
              </Stack>
            )}

            {!loading && leaveBalances.length > 0 && (
              <Stack spacing={1}>
                {leaveBalances.map((balance) => (
                  <Box
                    key={balance.leave_balance_id}
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      backgroundColor: "#f0f4f8",
                      border: "1px solid #e0e7ff",
                    }}
                  >
                    <Typography fontWeight={600} sx={{ fontSize: "0.85rem", color: "#374151" }}>
                      {balance.policy_name}
                    </Typography>
                    <Stack direction="row" sx={{ mt: 0.5 }} spacing={1}>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: "0.7rem", color: "#6b7280" }}>
                          Entitlement
                        </Typography>
                        <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "#0c6eca" }}>
                          {balance.leave_entitlement ?? '-'}
                        </Typography>
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: "0.7rem", color: "#6b7280" }}>
                          Taken
                        </Typography>
                        <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "#dc2626" }}>
                          {balance.total_taken}
                        </Typography>
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: "0.7rem", color: "#6b7280" }}>
                          Remaining
                        </Typography>
                        <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "#16a34a" }}>
                          {balance.remaining}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            )}

            {!loading && selectedEmployee && leaveBalances.length === 0 && (
              <Typography sx={{ fontSize: "0.85rem", color: "#6b7280", p: 1 }}>
                No leave balances found.
              </Typography>
            )}
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
              { label: "On Leave Today", value: stats.onLeaveToday ?? 0, color: "#064c8d" },
              { label: "Pending Requests", value: stats.pendingRequests ?? 0, color: "#7f540a" },
              { label: "Approved", value: stats.approved ?? 0, color: "#16a34a" },
              { label: "Rejected", value: stats.rejected ?? 0, color: "#810909" },
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
                {(employeesOnLeave || []).map((item) => (
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
                      Department : {item.department}
                    </Typography>

                    <Typography variant="caption" sx={{ color: "#374151" }}>
                      Reason : {item.reason}
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
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, 
                  gap: 2,
                }}
              >
                {(pendingRequests || []).map((item) => (
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
                        Reason : {item.reason}
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
