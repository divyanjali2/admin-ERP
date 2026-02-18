import React, { useMemo, useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const SIDEBAR_WIDTH = 280;

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "";

const formatTime = (d) =>
  d
    ? new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    : "";

const getDateDisplay = (r) => {
  const start = formatDate(r.start_date);
  if (r.is_one_day) return start;
  const end = formatDate(r.end_date);
  return `${start}  ${end}`;
};

const EmptyState = ({ icon: Icon, text }) => (
  <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2, bgcolor: "#f8fafc" }}>
    <Icon sx={{ fontSize: 44, color: "#94a3b8", mb: 1.5 }} />
    <Typography sx={{ color: "#64748b" }}>{text}</Typography>
  </Paper>
);

const StatCard = ({ icon: Icon, label, value }) => (
  <Card sx={{ borderRadius: 2, border: "1px solid #e5e7eb", width: "100%" }}>
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

const statusStyles = {
  pending: { label: "Pending", bg: "#f1f5f9", color: "#334155" },
  approved: { label: "Approved", bg: "#ecfdf5", color: "#047857" },
  rejected: { label: "Rejected", bg: "#fef2f2", color: "#b91c1c" },
};

const DetailsDialog = ({ open, onClose, data, statusLabel }) => {
  if (!data) return null;

  const dateDisplay = getDateDisplay(data);

  const trip = data.trip_details;

  const isOutNow = !!trip && !trip.trip_end_datetime;

  const tripStartDate = trip?.trip_start_datetime ? formatDate(trip.trip_start_datetime) : "—";
  const tripStartTime = trip?.trip_start_datetime ? formatTime(trip.trip_start_datetime) : "—";

  const tripEndDate = trip?.trip_end_datetime ? formatDate(trip.trip_end_datetime) : "—";
  const tripEndTime = trip?.trip_end_datetime ? formatTime(trip.trip_end_datetime) : "—";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 900 }}>
        {data.vehicle_reg_no || "Vehicle"} — {statusLabel}
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={1.25}>
          <Row label="Employee" value={data.employee_name || "—"} />
          <Row label="Trip Code" value={data.trip_code || "—"} />
          <Row label="Reason" value={data.reason || "—"} />
          <Row label="Destination" value={data.destinations || "—"} />

          <Row label="Date" value={dateDisplay} />

          {data.created_at && <Row label="Requested On" value={formatDate(data.created_at)} />}
          {data.reject_reason && <Row label="Reject Reason" value={data.reject_reason} />}

          {trip && (
            <Card sx={{ mt: 1.5, borderRadius: 2, border: "1px solid #e5e7eb" }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.25 }}>
                  <Typography fontWeight={900} sx={{ color: "#111827" }}>
                    {isOutNow ? "Out Now" : "Trip Details"}
                  </Typography>

                  <Chip
                    size="small"
                    label={isOutNow ? "OUT NOW" : "COMPLETED"}
                    sx={{
                      bgcolor: isOutNow ? "#fff7ed" : "#ecfdf5",
                      color: isOutNow ? "#9a3412" : "#047857",
                      fontWeight: 800,
                      borderRadius: 1,
                    }}
                  />
                </Stack>

                <Stack spacing={1}>
                  <Row label="Start Date" value={tripStartDate} />
                  <Row label="Start Time" value={tripStartTime} />

                  <Row label="End Date" value={tripEndDate} />
                  <Row label="End Time" value={tripEndTime} />

                  <Row label="Start Odometer" value={trip.trip_start_odometer ?? "—"} />
                  <Row label="End Odometer" value={trip.trip_end_odometer ?? "—"} />

                  {trip.trip_start_odometer_photo && (
                    <Row label="Start Odo Photo" value={trip.trip_start_odometer_photo} />
                  )}
                  {trip.trip_end_odometer_photo && (
                    <Row label="End Odo Photo" value={trip.trip_end_odometer_photo} />
                  )}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Row = ({ label, value }) => (
  <Stack direction="row" justifyContent="space-between" spacing={2}>
    <Typography variant="body2" sx={{ color: "#6b7280" }}>
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={700} sx={{ color: "#111827", textAlign: "right" }}>
      {value}
    </Typography>
  </Stack>
);

const RequestCard = ({ request, status = "pending", onView, hideOutNowDetails = false }) => {
  const s = statusStyles[status] || statusStyles.pending;
  const dateDisplay = getDateDisplay(request);

  return (
    <Card sx={{ borderRadius: 2, border: "1px solid #e5e7eb", height: "100%" }}>
      <CardContent>
        <Stack spacing={1.25}>
          <Stack direction="row" justifyContent="space-between" alignItems="start">
            <Box>
              <Typography variant="subtitle1" fontWeight={800} sx={{ color: "#111827" }}>
                {request.vehicle_reg_no}
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                {request.employee_name || "Employee"}
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
                {dateDisplay}
              </Typography>
            </Stack>

            <Typography variant="body2" sx={{ color: "#4b5563" }}>
              <strong>Trip Code:</strong> {request.trip_code || "—"}
            </Typography>

            <Typography variant="body2" sx={{ color: "#4b5563" }}>
              <strong>Reason:</strong> {request.reason || "—"}
            </Typography>

            {/* Out-now cards: keep these blank (no extra data on card) */}
            {!hideOutNowDetails && (
              <Typography variant="body2" sx={{ color: "#4b5563" }}>
                <strong>Destination:</strong> {request.destinations || "—"}
              </Typography>
            )}
          </Stack>

          <Button
            size="small"
            onClick={() => onView?.(request, s.label)}
            sx={{ mt: 1, alignSelf: "flex-start", textTransform: "none" }}
          >
            View Details
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default function VehicleRequestDashboard({
  auth,
  vehiclesToBeOutToday = [],
  pendingRequests = [],
  approvedRequests = [],
  rejectedRequests = [],

  searchedVehicle = "",
  currentTrips = [],
  pastTrips = [],
}) {

  const [activeSection, setActiveSection] = useState("dashboard");
  const [vehicleSearch, setVehicleSearch] = useState(searchedVehicle || "");

  // Auto-switch to search section when a vehicle is searched
  useEffect(() => {
    if (searchedVehicle) {
      setActiveSection("search");
    }
  }, [searchedVehicle]);

  // modal state
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedStatusLabel, setSelectedStatusLabel] = useState("");

  const onView = (item, statusLabel) => {
    setSelected(item);
    setSelectedStatusLabel(statusLabel);
    setOpen(true);
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: DashboardOutlinedIcon },
    { id: "out-today", label: "Out Today", icon: LocalShippingOutlinedIcon },
    { id: "pending", label: "Pending Requests", icon: HourglassEmptyOutlinedIcon },
    { id: "approved", label: "Approved Requests", icon: CheckCircleOutlinedIcon },
    { id: "rejected", label: "Rejected Requests", icon: CancelOutlinedIcon },
    { id: "search", label: "Search Trips", icon: DirectionsCarOutlinedIcon },
  ];

  const Section = ({ title, items, renderItem, emptyIcon, emptyText }) => (
    <Box>
      <Typography variant="h5" fontWeight={850} sx={{ mb: 3, color: "#111827" }}>
        {title}
      </Typography>

      {items.length ? <Grid container spacing={2.5}>{items.map(renderItem)}</Grid> : <EmptyState icon={emptyIcon} text={emptyText} />}
    </Box>
  );

  const content = (() => {
    switch (activeSection) {
      case "out-today":
        return (
          <Section
            title="Vehicles To Be Out Today"
            items={vehiclesToBeOutToday}
            emptyIcon={CalendarTodayIcon}
            emptyText="No vehicles scheduled for today"
            renderItem={(r) => (
              <Grid item xs={12} sm={6} lg={4} key={r.vehicle_request_id}>
                <RequestCard request={r} status="approved" onView={onView} />
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
                <RequestCard request={r} status="pending" onView={onView} />
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
                <RequestCard request={r} status="approved" onView={onView} />
              </Grid>
            )}
          />
        );

      case "rejected":
        return (
          <Section
            title="Rejected Vehicle Requests"
            items={rejectedRequests}
            emptyIcon={CancelOutlinedIcon}
            emptyText="No rejected requests"
            renderItem={(r) => (
              <Grid item xs={12} sm={6} lg={4} key={r.vehicle_request_id}>
                <RequestCard request={r} status="rejected" onView={onView} />
              </Grid>
            )}
          />
        );

        case "search":
  return (
    <Box>
      <Typography variant="h5" fontWeight={850} sx={{ mb: 3, color: "#111827" }}>
        Search Results
      </Typography>

      {!searchedVehicle && (
        <EmptyState icon={DirectionsCarOutlinedIcon} text="Search a vehicle number to view trips" />
      )}

      {!!searchedVehicle && !currentTrips.length && !pastTrips.length && (
        <EmptyState icon={DirectionsCarOutlinedIcon} text="No trips found for this vehicle" />
      )}

      {currentTrips.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight={900} sx={{ mb: 2, color: "#111827" }}>
            Current & Future Trips
          </Typography>
          <Grid container spacing={2.5}>
            {currentTrips.map((r) => (
              <Grid item xs={12} sm={6} lg={4} key={r.vehicle_request_id}>
                <RequestCard request={r} status={(r.status || "PENDING").toLowerCase()} onView={onView} />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {pastTrips.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight={900} sx={{ mt: 4, mb: 2, color: "#111827" }}>
            Past Trips
          </Typography>
          <Grid container spacing={2.5}>
            {pastTrips.map((r) => (
              <Grid item xs={12} sm={6} lg={4} key={r.vehicle_request_id}>
                <RequestCard request={r} status={(r.status || "PENDING").toLowerCase()} onView={onView} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );


      default:
        return (
          <Box>
            <Typography variant="h5" fontWeight={850} sx={{ mb: 3, color: "#111827" }}>
              Dashboard Overview
            </Typography>

            {/* STAT CARDS (side by side) */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} lg={3}>
                <StatCard icon={CalendarTodayIcon} label="Out Today" value={vehiclesToBeOutToday.length} />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <StatCard icon={HourglassEmptyOutlinedIcon} label="Pending" value={pendingRequests.length} />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <StatCard icon={CheckCircleOutlinedIcon} label="Approved" value={approvedRequests.length} />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <StatCard icon={CancelOutlinedIcon} label="Rejected" value={rejectedRequests.length} />
              </Grid>
            </Grid>

            <Typography variant="subtitle1" fontWeight={800} sx={{ mt: 4, mb: 2, color: "#111827" }}>
              Upcoming Trips
            </Typography>

            <Grid container spacing={2.5}>
              {approvedRequests
                .filter((r) => r.trip_details && new Date(r.start_date) >= new Date())
                .slice(0, 3)
                .map((r) => (
                  <Grid item xs={12} sm={6} lg={4} key={r.vehicle_request_id}>
                    <RequestCard request={r} status="approved" onView={onView} />
                  </Grid>
                ))}
              {!approvedRequests.filter((r) => r.trip_details && new Date(r.start_date) >= new Date()).length && (
                <Grid item xs={12}>
                  <EmptyState icon={LocalShippingOutlinedIcon} text="No upcoming approved trips" />
                </Grid>
              )}
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
                Vehicle Management
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
        <Box sx={{ flex: 1, p: { xs: 2, sm: 3, lg: 4 } }}>
          {activeSection === "search" && (
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2, border: "1px solid #e5e7eb" }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight={800} sx={{ mb: 0.75, color: "#111827" }}>
                    Search by Vehicle Number
                  </Typography>

                  <Box
                    component="input"
                    value={vehicleSearch}
                    onChange={(e) => setVehicleSearch(e.target.value)}
                    placeholder="Ex: ABC-1234"
                    sx={{
                      width: "100%",
                      px: 1.5,
                      py: 1.25,
                      borderRadius: 1.5,
                      border: "1px solid #e5e7eb",
                      outline: "none",
                      fontSize: 14,
                      "&:focus": { borderColor: "#94a3b8" },
                    }}
                  />
                </Box>

                <Stack direction="row" spacing={1} alignItems="end">
                  <Button
                    variant="contained"
                    onClick={() => router.get(route("hrms.vehicle-request-dashboard"), { vehicle_no: vehicleSearch })}
                    sx={{ textTransform: "none", fontWeight: 800 }}
                  >
                    Search
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => {
                      setVehicleSearch("");
                      router.get(route("hrms.vehicle-request-dashboard"));
                    }}
                    sx={{ textTransform: "none", fontWeight: 800 }}
                  >
                    Clear
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          )}

          {content}
        </Box>

        {/* MODAL */}
        <DetailsDialog
          open={open}
          onClose={() => setOpen(false)}
          data={selected}
          statusLabel={selectedStatusLabel}
        />
      </Box>
    </AuthenticatedLayout>
  );
}
