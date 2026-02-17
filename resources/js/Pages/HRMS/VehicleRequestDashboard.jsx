import React, { useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import {
  Box,
  Stack,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Chip,
  Grid,
  Button,
  Paper,
} from "@mui/material";

const SIDEBAR_WIDTH = 280;

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const formatTime = (d) =>
  new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

const EmptyState = ({ icon: Icon, text }) => (
  <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2, bgcolor: "#f8fafc" }}>
    <Icon sx={{ fontSize: 44, color: "#94a3b8", mb: 1.5 }} />
    <Typography sx={{ color: "#64748b" }}>{text}</Typography>
  </Paper>
);

const StatCard = ({ icon: Icon, label, value }) => (
  <Card sx={{ borderRadius: 2, border: "1px solid #e5e7eb" }}>
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            bgcolor: "#f1f5f9",
            color: "#111827",
          }}
        >
          <Icon />
        </Box>
        <Box>
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            {label}
          </Typography>
          <Typography variant="h5" fontWeight={800} sx={{ color: "#111827" }}>
            {value}
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const RequestCard = ({ request, status = "pending" }) => {
  const statusMap = {
    pending: { label: "Pending", bg: "#f1f5f9", color: "#334155" },
    approved: { label: "Approved", bg: "#ecfdf5", color: "#047857" },
    rejected: { label: "Rejected", bg: "#fef2f2", color: "#b91c1c" },
  };
  const s = statusMap[status] || statusMap.pending;

  const start = formatDate(request.start_date);
  const end = request.is_one_day ? start : formatDate(request.end_date);

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: "1px solid #e5e7eb",
        height: "100%",
        "&:hover": { boxShadow: "0 10px 25px rgba(0,0,0,0.06)" },
      }}
    >
      <CardContent>
        <Stack spacing={1.25}>
          <Stack direction="row" justifyContent="space-between" alignItems="start">
            <Box>
              <Typography variant="subtitle1" fontWeight={800} sx={{ color: "#111827" }}>
                {request.vehicle_reg_no}
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                {request.employee?.full_name || "Employee"}
              </Typography>
            </Box>

            <Chip
              label={s.label}
              sx={{ bgcolor: s.bg, color: s.color, fontWeight: 700, borderRadius: 1 }}
              size="small"
            />
          </Stack>

          <Divider />

          <Stack spacing={0.75}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarTodayIcon sx={{ fontSize: 18, color: "#6b7280" }} />
              <Typography variant="body2" sx={{ color: "#374151" }}>
                {start} — {end}
              </Typography>
            </Stack>

            <Typography variant="body2" sx={{ color: "#4b5563" }}>
              <strong>Reason:</strong> {request.reason}
            </Typography>

            {!!request.destinations && (
              <Typography variant="body2" sx={{ color: "#4b5563" }}>
                <strong>Destination:</strong> {request.destinations}
              </Typography>
            )}
          </Stack>

          <Button size="small" sx={{ mt: 1, alignSelf: "flex-start", textTransform: "none" }}>
            View Details
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

const VehicleInUseCard = ({ vehicle }) => {
  const trip = vehicle.trip_details?.[0];
  const start = trip?.trip_start_datetime ? formatTime(trip.trip_start_datetime) : "N/A";

  const durationHours = useMemo(() => {
    if (!trip?.trip_start_datetime) return null;
    const end = trip.trip_end_datetime ? new Date(trip.trip_end_datetime) : new Date();
    const diff = end - new Date(trip.trip_start_datetime);
    return Math.max(0, Math.round(diff / (1000 * 60 * 60)));
  }, [trip]);

  return (
    <Card sx={{ borderRadius: 2, border: "1px solid #e5e7eb", bgcolor: "#fff" }}>
      <CardContent>
        <Stack spacing={1.25}>
          <Stack direction="row" justifyContent="space-between" alignItems="start">
            <Box>
              <Typography variant="subtitle1" fontWeight={800} sx={{ color: "#111827" }}>
                {vehicle.vehicle_reg_no}
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                {vehicle.employee?.full_name || "Driver"}
              </Typography>
            </Box>

            <Chip
              icon={<AccessTimeIcon />}
              label="In Use"
              size="small"
              sx={{ bgcolor: "#fef2f2", color: "#b91c1c", fontWeight: 700, borderRadius: 1 }}
            />
          </Stack>

          <Divider />

          <Stack spacing={0.75}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Started:
              </Typography>
              <Typography variant="body2" fontWeight={700} sx={{ color: "#111827" }}>
                {start}
              </Typography>
            </Stack>

            {trip?.trip_end_datetime && durationHours !== null && (
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                  Duration:
                </Typography>
                <Typography variant="body2" fontWeight={700} sx={{ color: "#111827" }}>
                  {durationHours} hrs
                </Typography>
              </Stack>
            )}

            <Typography variant="body2" sx={{ color: "#4b5563" }}>
              <strong>Destination:</strong> {vehicle.destinations || "Not specified"}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default function VehicleRequestDashboard({
  auth,
  vehiclesOutNow = [],
  vehiclesToBeOutToday = [],
  pendingRequests = [],
  approvedRequests = [],
}) {
  const [activeSection, setActiveSection] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: DashboardOutlinedIcon },
    { id: "out-now", label: "Out Now", icon: DirectionsCarOutlinedIcon },
    { id: "out-today", label: "Out Today", icon: LocalShippingOutlinedIcon },
    { id: "pending", label: "Pending Requests", icon: HourglassEmptyOutlinedIcon },
    { id: "approved", label: "Approved Requests", icon: CheckCircleOutlinedIcon },
  ];

  const Section = ({ title, items, renderItem, emptyIcon, emptyText }) => (
    <Box>
      <Typography variant="h5" fontWeight={850} sx={{ mb: 3, color: "#111827" }}>
        {title}
      </Typography>

      {items.length ? (
        <Grid container spacing={2.5}>
          {items.map(renderItem)}
        </Grid>
      ) : (
        <EmptyState icon={emptyIcon} text={emptyText} />
      )}
    </Box>
  );

  const content = (() => {
    switch (activeSection) {
      case "out-now":
        return (
          <Section
            title="Vehicles Out Now"
            items={vehiclesOutNow}
            emptyIcon={DirectionsCarOutlinedIcon}
            emptyText="No vehicles out currently"
            renderItem={(v) => (
              <Grid item xs={12} sm={6} lg={4} key={v.vehicle_request_id}>
                <VehicleInUseCard vehicle={v} />
              </Grid>
            )}
          />
        );

      case "out-today":
        return (
          <Section
            title="Vehicles To Be Out Today"
            items={vehiclesToBeOutToday}
            emptyIcon={CalendarTodayIcon}
            emptyText="No vehicles scheduled for today"
            renderItem={(r) => (
              <Grid item xs={12} sm={6} lg={4} key={r.vehicle_request_id}>
                <RequestCard request={r} status="approved" />
              </Grid>
            )}
          />
        );

      case "pending":
        return (
          <Section
            title="Pending Vehicle Requests"
            items={pendingRequests}
            emptyIcon={HourglassEmptyOutlinedIcon}
            emptyText="No pending requests"
            renderItem={(r) => (
              <Grid item xs={12} sm={6} lg={4} key={r.vehicle_request_id}>
                <RequestCard request={r} status="pending" />
              </Grid>
            )}
          />
        );

      case "approved":
        return (
          <Section
            title="Approved Vehicle Requests"
            items={approvedRequests}
            emptyIcon={CheckCircleOutlinedIcon}
            emptyText="No approved requests"
            renderItem={(r) => (
              <Grid item xs={12} sm={6} lg={4} key={r.vehicle_request_id}>
                <RequestCard request={r} status="approved" />
              </Grid>
            )}
          />
        );

      default:
        return (
          <Box>
            <Typography variant="h5" fontWeight={850} sx={{ mb: 3, color: "#111827" }}>
              Dashboard Overview
            </Typography>

            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6} lg={3}>
                <StatCard icon={DirectionsCarOutlinedIcon} label="Out Now" value={vehiclesOutNow.length} />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <StatCard icon={CalendarTodayIcon} label="Out Today" value={vehiclesToBeOutToday.length} />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <StatCard icon={HourglassEmptyOutlinedIcon} label="Pending" value={pendingRequests.length} />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <StatCard icon={CheckCircleOutlinedIcon} label="Approved" value={approvedRequests.length} />
              </Grid>
            </Grid>

            <Typography variant="subtitle1" fontWeight={800} sx={{ mt: 4, mb: 2, color: "#111827" }}>
              Recent Activity
            </Typography>

            <Grid container spacing={2.5}>
              {vehiclesOutNow.slice(0, 3).map((v) => (
                <Grid item xs={12} sm={6} lg={4} key={v.vehicle_request_id}>
                  <VehicleInUseCard vehicle={v} />
                </Grid>
              ))}
              {!vehiclesOutNow.length && !pendingRequests.length && (
                <Grid item xs={12}>
                  <EmptyState icon={DashboardOutlinedIcon} text="No recent activity" />
                </Grid>
              )}
              {pendingRequests.slice(0, 3).map((r) => (
                <Grid item xs={12} sm={6} lg={4} key={r.vehicle_request_id}>
                  <RequestCard request={r} status="pending" />
                </Grid>
              ))}
            </Grid>
          </Box>
        );
    }
  })();

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Vehicle Request Dashboard" />

      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
        {/* SIDEBAR (WHITE) */}
        <Box
          sx={{
            width: SIDEBAR_WIDTH,
            bgcolor: "#ffffff",
            borderRight: "1px solid #e5e7eb",
            p: 2.5,
            position: "sticky",
            top: 0,
            height: "100vh",
          }}
        >
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="subtitle1" fontWeight={900} sx={{ color: "#111827" }}>
                Vehicle Managment
              </Typography>
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                Dashboard
              </Typography>
            </Box>

            <Divider />

            <List sx={{ p: 0 }}>
              {menuItems.map(({ id, label, icon: Icon }) => {
                const active = activeSection === id;
                return (
                  <ListItemButton
                    key={id}
                    onClick={() => setActiveSection(id)}
                    sx={{
                      mb: 0.75,
                      borderRadius: 1.5,
                      color: active ? "#111827" : "#374151",
                      bgcolor: active ? "#f1f5f9" : "transparent",
                      border: active ? "1px solid #e5e7eb" : "1px solid transparent",
                      "&:hover": { bgcolor: "#f8fafc" },
                    }}
                  >
                    <Icon sx={{ mr: 1.5, fontSize: 20, color: active ? "#111827" : "#6b7280" }} />
                    <ListItemText primary={label} primaryTypographyProps={{ variant: "body2", fontWeight: 700 }} />
                  </ListItemButton>
                );
              })}
            </List>

            <Divider />

            <Button
              variant="outlined"
              fullWidth
              onClick={() => router.get("/hrms")}
              sx={{
                textTransform: "none",
                borderRadius: 1.5,
                fontWeight: 800,
                borderColor: "#e5e7eb",
                color: "#111827",
                "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" },
              }}
            >
              ← Back to HRMS
            </Button>
          </Stack>
        </Box>

        {/* MAIN */}
        <Box sx={{ flex: 1, p: { xs: 2, sm: 3, lg: 4 } }}>{content}</Box>
      </Box>
    </AuthenticatedLayout>
  );
}
