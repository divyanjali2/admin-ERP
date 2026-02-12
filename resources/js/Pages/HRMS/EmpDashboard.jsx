// resources/js/Pages/HRMS/EmpDashboard.jsx
import React, { useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  Paper,
  Tabs,
  Tab,
  Chip,
  TextField,
  MenuItem,
  LinearProgress,
  Tooltip,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 260;

const navItems = [
  { label: "HRMS Home", href: "/hrms", icon: <HomeOutlinedIcon /> },
  { label: "Dashboard", href: "/hrms/emp-dashboard", icon: <DashboardOutlinedIcon /> },
  { label: "Employees", href: "/hrms/employees", icon: <PeopleAltOutlinedIcon /> },
];

const onlyDate = (v) => {
  if (!v) return "-";
  const s = String(v);
  return s.split("T")[0].split(" ")[0] || "-";
};

const StatPill = ({ icon, label, value, helper }) => (
  <Stack
    direction="row"
    spacing={1.25}
    alignItems="center"
    sx={{
      px: 1.5,
      py: 1.25,
      borderRight: "1px solid",
      borderColor: "divider",
      minWidth: 220,
      flexShrink: 0,
    }}
  >
    <Box sx={{ display: "grid", placeItems: "center" }}>{icon}</Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
        {label}
      </Typography>
      <Typography fontWeight={900} sx={{ lineHeight: 1.1 }}>
        {value}
      </Typography>
      {helper ? (
        <Typography variant="caption" color="text.secondary">
          {helper}
        </Typography>
      ) : null}
    </Box>
  </Stack>
);

export default function EmpDashboard({
  auth,
  stats = {},
  todayBirthdays = [],
  upcomingBirthdays = [],
  departmentBreakdown = [], // [{ name, count }]
  probationEnding = [], // [{ employee_id, employee_code, name, probation_end_date, days_left }]
  recentHires = [], // [{ employee_id, employee_code, name, date_of_joining }]
}) {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [tab, setTab] = useState(0); // 0 today, 1 next 7 days
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("days_left"); // days_left | name | next_birthday

  const toggleDrawer = () => setMobileOpen((p) => !p);

  const activeList = tab === 0 ? todayBirthdays : upcomingBirthdays;

  const birthdayRows = useMemo(() => {
    const query = q.trim().toLowerCase();

    let out = (activeList ?? []).filter((b) => {
      if (!query) return true;
      const name = (b.name ?? "").toLowerCase();
      const code = (b.employee_code ?? "").toLowerCase();
      return name.includes(query) || code.includes(query);
    });

    out = [...out].sort((a, b) => {
      if (sortBy === "name") return String(a.name ?? "").localeCompare(String(b.name ?? ""));
      if (sortBy === "next_birthday") return String(a.next_birthday ?? "").localeCompare(String(b.next_birthday ?? ""));
      return Number(a.days_left ?? 0) - Number(b.days_left ?? 0);
    });

    return out.map((x) => ({
      id: x.employee_id,
      ...x,
      next_birthday: onlyDate(x.next_birthday),
      date_of_birth: onlyDate(x.date_of_birth),
    }));
  }, [activeList, q, sortBy]);

  const birthdayCols = [
    {
      field: "name",
      headerName: "Employee",
      flex: 1,
      minWidth: 220,
      renderCell: (p) => (
        <Stack spacing={0.25}>
          <Typography fontWeight={800} sx={{ lineHeight: 1.1 }}>
            {p.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {p.row.employee_code ?? "-"}
          </Typography>
        </Stack>
      ),
    },
    { field: "next_birthday", headerName: "Next Birthday", width: 140 },
    {
      field: "days_left",
      headerName: "In",
      width: 120,
      renderCell: (p) =>
        tab === 0 ? <Chip size="small" label="Today" /> : <Chip size="small" label={`${p.value} days`} />,
    },
  ];

  const probationRows = useMemo(
    () =>
      (probationEnding ?? []).map((x) => ({
        id: x.employee_id,
        ...x,
        probation_end_date: onlyDate(x.probation_end_date),
      })),
    [probationEnding]
  );

  const probationCols = [
    {
      field: "name",
      headerName: "Employee",
      flex: 1,
      minWidth: 220,
      renderCell: (p) => (
        <Stack spacing={0.25}>
          <Typography fontWeight={800} sx={{ lineHeight: 1.1 }}>
            {p.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {p.row.employee_code ?? "-"}
          </Typography>
        </Stack>
      ),
    },
    { field: "probation_end_date", headerName: "Ends", width: 140 },
    {
      field: "days_left",
      headerName: "In",
      width: 120,
      renderCell: (p) => <Chip size="small" label={`${p.value}d`} />,
    },
  ];

  const hireRows = useMemo(
    () =>
      (recentHires ?? []).map((x) => ({
        id: x.employee_id,
        ...x,
        date_of_joining: onlyDate(x.date_of_joining),
      })),
    [recentHires]
  );

  const hireCols = [
    {
      field: "name",
      headerName: "Employee",
      flex: 1,
      minWidth: 220,
      renderCell: (p) => (
        <Stack spacing={0.25}>
          <Typography fontWeight={800} sx={{ lineHeight: 1.1 }}>
            {p.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {p.row.employee_code ?? "-"}
          </Typography>
        </Stack>
      ),
    },
    { field: "date_of_joining", headerName: "Joined", width: 140 },
  ];

  const deptTotal = (departmentBreakdown ?? []).reduce((sum, d) => sum + Number(d.count ?? 0), 0) || 1;

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
          <ListItemButton
            key={item.label}
            onClick={() => {
              router.get(item.href);
              if (isMobile) setMobileOpen(false);
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  const totalEmployees = stats?.employeesCount ?? 0;
  const departmentsCount = stats?.departmentsCount ?? (departmentBreakdown?.length || 0);
  const newHires30 = stats?.newHiresLast30Days ?? (recentHires?.length || 0);

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Employee Dashboard" />

      <Box sx={{ display: "flex" }}>
        {/* MOBILE TOP BAR */}
        {isMobile && (
          <AppBar position="fixed" sx={{ backgroundColor: "#0B1C2D" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <IconButton color="inherit" edge="start" onClick={toggleDrawer}>
                <MenuIcon />
              </IconButton>
              <Typography fontWeight={900}>Employee Dashboard</Typography>
              <Box sx={{ width: 48 }} />
            </Toolbar>
          </AppBar>
        )}

        {/* SIDEBAR */}
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

        {/* MAIN */}
        <Box sx={{ flexGrow: 1 }}>
          <Toolbar sx={{ minHeight: isMobile ? 64 : undefined }} />

          <Container maxWidth={false} sx={{ py: 2 }}>
            {/* Header row */}
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={1.25}
              sx={{ mb: 1.5 }}
            >
              <Box>
                <Typography variant="h4" fontWeight={900}>
                  Employee Dashboard
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  Active employees • Birthdays • Probation alerts • Recent hires
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip title="Refresh">
                  <IconButton onClick={() => router.reload({ only: ["stats", "todayBirthdays", "upcomingBirthdays", "probationEnding", "recentHires", "departmentBreakdown"] })}>
                    <RefreshOutlinedIcon />
                  </IconButton>
                </Tooltip>

                <Button
                  variant="contained"
                  startIcon={<AddOutlinedIcon />}
                  sx={{ backgroundColor: "#0B1C2D", "&:hover": { backgroundColor: "#0F2A44" } }}
                  onClick={() => router.get("/hrms/employees/create")}
                >
                  Create
                </Button>
              </Stack>
            </Stack>

            {/* KPI STRIP (responsive, not card-y) */}
            <Paper variant="outlined" sx={{ overflow: "hidden" }}>
              <Stack
                direction="row"
                sx={{
                  overflowX: "auto",
                  flexWrap: { xs: "wrap", md: "nowrap" },
                }}
              >
                <StatPill
                  icon={<GroupOutlinedIcon />}
                  label="Active Employees"
                  value={totalEmployees}
                  helper=""
                />
                <StatPill
                  icon={<CakeOutlinedIcon />}
                  label="Birthdays"
                  value={`${todayBirthdays.length} today`}
                  helper={`${upcomingBirthdays.length} in next 7 days`}
                />
                <StatPill
                  icon={<ApartmentOutlinedIcon />}
                  label="Departments"
                  value={departmentsCount}
                  helper={departmentBreakdown?.length ? "Top departments shown" : "No data"}
                />
                <StatPill
                  icon={<PersonAddAltOutlinedIcon />}
                  label="New hires (30 days)"
                  value={newHires30}
                />
              </Stack>
            </Paper>

            {/* MAIN PANELS */}
            <Stack direction={{ xs: "column", lg: "row" }} spacing={2} sx={{ mt: 2 }}>
              {/* LEFT: Birthdays */}
              <Paper variant="outlined" sx={{ flex: 1, p: 1.5 }}>
                <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1.5}>
                  <Tabs value={tab} onChange={(_, v) => setTab(v)} variant={isMobile ? "scrollable" : "standard"}>
                    <Tab label={`Today (${todayBirthdays.length})`} />
                    <Tab label={`Next 7 Days (${upcomingBirthdays.length})`} />
                  </Tabs>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ minWidth: { md: 520 } }}>
                    <TextField
                      size="small"
                      placeholder="Search by name or code…"
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      fullWidth
                    />
                    <TextField
                      size="small"
                      select
                      label="Sort"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      sx={{ minWidth: 170 }}
                    >
                      <MenuItem value="days_left">Days left</MenuItem>
                      <MenuItem value="name">Name</MenuItem>
                      <MenuItem value="next_birthday">Date</MenuItem>
                    </TextField>
                  </Stack>
                </Stack>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ height: 360 }}>
                  <DataGrid
                    rows={birthdayRows}
                    columns={birthdayCols}
                    disableRowSelectionOnClick
                    hideFooter
                    onRowClick={(p) => router.get(`/hrms/employees/${p.row.employee_id}`)}
                    sx={{
                      border: 0,
                      "& .MuiDataGrid-columnHeaders": { fontWeight: 900 },
                      "& .MuiDataGrid-row": { cursor: "pointer" },
                    }}
                  />
                </Box>
              </Paper>

              {/* RIGHT: Alerts + Department Mix + Recent Hires */}
              <Stack spacing={2} sx={{ width: { xs: "100%", lg: 520 } }}>
                {/* Probation Alerts */}
                <Paper variant="outlined" sx={{ p: 1.5 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <NotificationsOutlinedIcon />
                    <Typography fontWeight={900}>Probation ending soon (next 14 days)</Typography>
                    <Chip size="small" label={`${probationRows.length}`} sx={{ ml: "auto" }} />
                  </Stack>

                  <Divider sx={{ my: 1.25 }} />

                  <Box sx={{ height: 260 }}>
                    <DataGrid
                      rows={probationRows}
                      columns={probationCols}
                      disableRowSelectionOnClick
                      hideFooter
                      onRowClick={(p) => router.get(`/hrms/employees/${p.row.employee_id}`)}
                      sx={{
                        border: 0,
                        "& .MuiDataGrid-columnHeaders": { fontWeight: 900 },
                        "& .MuiDataGrid-row": { cursor: "pointer" },
                      }}
                    />
                  </Box>
                </Paper>

                {/* Department Mix */}
                <Paper variant="outlined" sx={{ p: 1.5 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ApartmentOutlinedIcon />
                    <Typography fontWeight={900}>Department mix (top)</Typography>
                    <Chip size="small" label={`${departmentBreakdown.length}`} sx={{ ml: "auto" }} />
                  </Stack>

                  <Divider sx={{ my: 1.25 }} />

                  {departmentBreakdown.length === 0 ? (
                    <Typography color="text.secondary">No department data.</Typography>
                  ) : (
                    <Stack spacing={1}>
                      {departmentBreakdown.slice(0, 8).map((d) => {
                        const pct = Math.round((Number(d.count ?? 0) / deptTotal) * 100);
                        return (
                          <Box
                            key={d.name}
                            sx={{
                              p: 1,
                              border: "1px solid",
                              borderColor: "divider",
                              borderRadius: 1,
                            }}
                          >
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography fontWeight={800} noWrap sx={{ maxWidth: "70%" }}>
                                {d.name}
                              </Typography>
                              <Typography fontWeight={900}>{d.count ?? 0}</Typography>
                            </Stack>
                            <LinearProgress variant="determinate" value={pct} sx={{ mt: 1 }} />
                            <Typography variant="caption" color="text.secondary">
                              {pct}%
                            </Typography>
                          </Box>
                        );
                      })}
                    </Stack>
                  )}
                </Paper>

                {/* Recent Hires */}
                <Paper variant="outlined" sx={{ p: 1.5 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonAddAltOutlinedIcon />
                    <Typography fontWeight={900}>Recent hires (last 30 days)</Typography>
                    <Chip size="small" label={`${hireRows.length}`} sx={{ ml: "auto" }} />
                  </Stack>

                  <Divider sx={{ my: 1.25 }} />

                  <Box sx={{ height: 260 }}>
                    <DataGrid
                      rows={hireRows}
                      columns={hireCols}
                      disableRowSelectionOnClick
                      hideFooter
                      onRowClick={(p) => router.get(`/hrms/employees/${p.row.employee_id}`)}
                      sx={{
                        border: 0,
                        "& .MuiDataGrid-columnHeaders": { fontWeight: 900 },
                        "& .MuiDataGrid-row": { cursor: "pointer" },
                      }}
                    />
                  </Box>
                </Paper>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Box>
    </AuthenticatedLayout>
  );
}
