import React, { useMemo, useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";

import {
  Box,
  Stack,
  Typography,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TextField,
} from "@mui/material";

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "";

const getDateDisplay = (r) => {
  const start = formatDate(r.start_date);
  if (r.is_one_day) return start;
  const end = formatDate(r.end_date);
  return `${start} to ${end}`;
};

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
  cancelled: { label: "Cancelled", bg: "#f3f4f6", color: "#374151" },
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

const DetailsDialog = ({ open, onClose, data, statusLabel }) => {
  if (!data) return null;

  const dateDisplay = getDateDisplay(data);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 900 }}>
        {data.vehicle_no || "Vehicle"} — {statusLabel}
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={1.25}>
          <Row label="Employee" value={data.employee_name || data.chauffer_name || "—"} />
          <Row label="Trip Code" value={data.trip_code || "—"} />
          <Row label="Type" value={(data.type || "—").toUpperCase()} />
          <Row label="Passengers" value={data.passenger_count ?? "—"} />
          <Row label="Destination" value={data.destinations || "—"} />
          <Row label="Date" value={dateDisplay} />
          {data.created_at && <Row label="Requested On" value={formatDate(data.created_at)} />}
          {data.reject_reason && <Row label="Reject Reason" value={data.reject_reason} />}
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

const statusToKey = (s) => (s ? String(s).toLowerCase() : "pending");

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
  const [vehicleSearch, setVehicleSearch] = useState(searchedVehicle || "");

  // modal
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedStatusLabel, setSelectedStatusLabel] = useState("");

  const onView = (item) => {
    const sKey = statusToKey(item.status);
    const label = statusStyles[sKey]?.label || "Pending";
    setSelected(item);
    setSelectedStatusLabel(label);
    setOpen(true);
  };

  // Combine all lists into one (dedupe by vehicle_request_id)
  const allRequests = useMemo(() => {
    const merged = [
      ...vehiclesToBeOutToday,
      ...pendingRequests,
      ...approvedRequests,
      ...rejectedRequests,
      ...currentTrips,
      ...pastTrips,
    ];

    const map = new Map();
    merged.forEach((x) => {
      if (!x) return;
      map.set(x.vehicle_request_id, x);
    });
    return Array.from(map.values());
  }, [vehiclesToBeOutToday, pendingRequests, approvedRequests, rejectedRequests, currentTrips, pastTrips]);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();

    return allRequests
      .filter((r) => {
        if (statusFilter === "ALL") return true;
        return String(r.status || "").toUpperCase() === statusFilter;
      })
      .filter((r) => {
        if (!needle) return true;

        const fields = [
          r.vehicle_no,
          r.trip_code,
          r.type,
          r.employee_name,
          r.chauffer_name,
          r.destinations,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return fields.includes(needle);
      })
      .sort((a, b) => {
        // sort by start_date desc
        const da = a.start_date ? new Date(a.start_date).getTime() : 0;
        const db = b.start_date ? new Date(b.start_date).getTime() : 0;
        return db - da;
      });
  }, [allRequests, statusFilter, q]);

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Vehicle Request Dashboard" />

      <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", p: { xs: 2, sm: 3, lg: 4 } }}>
        {/* HEADER + SEARCH */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h5" fontWeight={900} sx={{ color: "#111827" }}>
              Vehicle Request Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              Dashboard + All Requests
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} sx={{ width: { xs: "100%", md: 420 } }}>
            <Button variant="contained" color="success" onClick={() => router.get("/hrms")} sx={{ textTransform: "none", fontWeight: 800 }} >
              Back
            </Button>
            <TextField
              size="small"
              fullWidth
              value={vehicleSearch}
              onChange={(e) => setVehicleSearch(e.target.value)}
              placeholder="Search vehicle number..."
            />
            <Button
              variant="contained"
              onClick={() => router.get(route("hrms.vehicle-request-dashboard"), { vehicle_no: vehicleSearch })}
              sx={{ textTransform: "none", fontWeight: 800 }}
            >
              Go
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

        {/* STATS */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
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

        {/* ALL REQUESTS TABLE */}
        <Paper sx={{ p: 2, borderRadius: 2, border: "1px solid #e5e7eb" }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "center" }}
            sx={{ mb: 2 }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <DirectionsCarOutlinedIcon sx={{ color: "#6b7280" }} />
              <Typography variant="subtitle1" fontWeight={900} sx={{ color: "#111827" }}>
                All Requests
              </Typography>
              <Chip size="small" label={`${filtered.length}`} sx={{ bgcolor: "#f1f5f9" }} />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="ALL">All</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                </Select>
              </FormControl>

              <TextField
                size="small"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Filter by vehicle / employee / trip code..."
                sx={{ width: { xs: "100%", sm: 360 } }}
              />
            </Stack>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900 }}>Vehicle</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>Employee / Chauffer</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>Trip Code</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>Passengers</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 900 }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {!filtered.length ? (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <Box sx={{ py: 4, textAlign: "center", color: "#64748b" }}>
                        No results found.
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((r) => {
                    const sKey = statusToKey(r.status);
                    const s = statusStyles[sKey] || statusStyles.pending;

                    return (
                      <TableRow key={r.vehicle_request_id} hover>
                        <TableCell sx={{ fontWeight: 800, color: "#111827" }}>
                          {r.vehicle_no || "—"}
                        </TableCell>
                        <TableCell sx={{ color: "#374151" }}>
                          {r.employee_name || r.chauffer_name || "Employee"}
                        </TableCell>
                        <TableCell sx={{ color: "#374151" }}>
                          {(r.type || "—").toUpperCase()}
                        </TableCell>
                        <TableCell sx={{ color: "#374151" }}>
                          {r.trip_code || "—"}
                        </TableCell>
                        <TableCell sx={{ color: "#374151" }}>
                          {getDateDisplay(r)}
                        </TableCell>
                        <TableCell sx={{ color: "#374151" }}>
                          {r.passenger_count ?? "—"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={s.label}
                            sx={{ bgcolor: s.bg, color: s.color, fontWeight: 800, borderRadius: 1 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            onClick={() => onView(r)}
                            sx={{ textTransform: "none", fontWeight: 800 }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

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