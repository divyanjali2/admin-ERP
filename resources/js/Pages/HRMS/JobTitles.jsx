// import { Head, Link, router, useForm } from "@inertiajs/react";
// import { useEffect, useMemo, useState } from "react";
// import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

// import {
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import {
//   DataGrid,
//   GridToolbarContainer,
//   GridToolbarQuickFilter,
// } from "@mui/x-data-grid";

// import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
// import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

// export default function JobTitles({ jobTitles = [] }) {
//   const [open, setOpen] = useState(false);
//   const [mode, setMode] = useState("create"); // "create" | "edit"
//   const [editing, setEditing] = useState(null);

//   const { data, setData, put, post, processing, errors, reset, clearErrors } = useForm({
//     name: "",
//   });

//   const openCreate = () => {
//     setMode("create");
//     setEditing(null);
//     reset();
//     clearErrors();
//     setOpen(true);
//   };

//   const openEdit = (row) => {
//     setMode("edit");
//     setEditing(row);
//     setData("name", row?.name ?? "");
//     clearErrors();
//     setOpen(true);
//   };

//   const closeModal = () => {
//     setOpen(false);
//     setEditing(null);
//     reset();
//     clearErrors();
//   };

//   const submit = (e) => {
//     e.preventDefault();

//     if (mode === "create") {
//       post(route("hrms.job-titles.store"), {
//         preserveScroll: true,
//         onSuccess: () => closeModal(),
//       });
//       return;
//     }

//     // edit
//     put(route("hrms.job-titles.update", editing?.job_title_id), {
//       preserveScroll: true,
//       data: { _method: "put", ...data },
//       onSuccess: () => closeModal(),
//     });
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this job title?")) {
//       router.delete(route("hrms.job-titles.destroy", id), {
//         preserveScroll: true,
//       });
//     }
//   };

//   const rows = useMemo(
//     () =>
//       (jobTitles || []).map((jt) => ({
//         id: jt.job_title_id, // DataGrid needs `id`
//         ...jt,
//       })),
//     [jobTitles]
//   );

//   const columns = useMemo(
//     () => [
//       {
//         field: "name",
//         headerName: "Job Title",
//         flex: 1,
//         minWidth: 250,
//       },
//       {
//         field: "actions",
//         headerName: "Actions",
//         width: 160,
//         sortable: false,
//         filterable: false,
//         align: "center",
//         headerAlign: "center",
//         renderCell: (params) => (
//           <Stack direction="row" spacing={1}>
//             <IconButton
//               size="small"
//               onClick={() => openEdit(params.row)}
//               aria-label="edit"
//             >
//               <EditOutlinedIcon fontSize="small" />
//             </IconButton>
//             <IconButton
//               size="small"
//               color="error"
//               onClick={() => handleDelete(params.row.job_title_id)}
//               aria-label="delete"
//             >
//               <DeleteOutlineOutlinedIcon fontSize="small" />
//             </IconButton>
//           </Stack>
//         ),
//       },
//     ],
//     []
//   );

//   function Toolbar() {
//     return (
//       <GridToolbarContainer sx={{ p: 1, justifyContent: "space-between" }}>
//         <GridToolbarQuickFilter placeholder="Search job titles..." />
//         <Button
//           variant="contained"
//           startIcon={<AddOutlinedIcon />}
//           onClick={openCreate}
//         >
//           Add Job Title
//         </Button>
//       </GridToolbarContainer>
//     );
//   }

//   return (
//     <AuthenticatedLayout>
//       <Head title="Job Titles" />

//       <div className="py-12">
//         <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//           <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
//             <div className="p-6 text-gray-900">
//               <Stack
//                 direction="row"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 sx={{ mb: 2 }}
//                 >
//                 <Typography variant="h5" fontWeight={800}>
//                     Job Titles
//                 </Typography>

//                 <Stack direction="row" spacing={2}>
//                     <Button
//                     variant="contained"
//                     startIcon={<AddOutlinedIcon />}
//                     onClick={openCreate}
//                     >
//                     Add Job Title
//                     </Button>

//                     <Button
//                     variant="outlined"
//                     startIcon={<ArrowBackOutlinedIcon />}
//                     onClick={() => router.get(route("hrms.employees.index"))}
//                     >
//                     Back
//                     </Button>
//                 </Stack>
//                 </Stack>

//               {/* ✅ Table */}
//               <Box sx={{ height: 520, width: "100%" }}>
//                 <DataGrid
//                   rows={rows}
//                   columns={columns}
//                   disableRowSelectionOnClick
//                   pageSizeOptions={[10, 25, 50]}
//                   initialState={{
//                     pagination: { paginationModel: { pageSize: 10, page: 0 } },
//                   }}
//                   slots={{ toolbar: Toolbar }}
//                 />
//               </Box>

//               {/* ✅ Modal for Create/Edit */}
//               <Dialog open={open} onClose={closeModal} fullWidth maxWidth="sm">
//                 <DialogTitle sx={{ fontWeight: 800 }}>
//                   {mode === "create" ? "Create Job Title" : "Edit Job Title"}
//                 </DialogTitle>

//                 <Box component="form" onSubmit={submit}>
//                   <DialogContent dividers>
//                     <TextField
//                       label="Job Title"
//                       value={data.name}
//                       onChange={(e) => setData("name", e.target.value)}
//                       fullWidth
//                       autoFocus
//                       error={!!errors.name}
//                       helperText={errors.name}
//                     />
//                   </DialogContent>

//                   <DialogActions sx={{ p: 2 }}>
//                     <Button variant="outlined" onClick={closeModal}>
//                       Cancel
//                     </Button>
//                     <Button type="submit" variant="contained" disabled={processing}>
//                       {mode === "create" ? "Save" : "Update"}
//                     </Button>
//                   </DialogActions>
//                 </Box>
//               </Dialog>
//             </div>
//           </div>
//         </div>
//       </div>
//     </AuthenticatedLayout>
//   );
// }



import React, { useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

import {
  AppBar,
  Avatar,
  Box,
  Chip,
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
  Tooltip,
  Button,
  Container,
} from "@mui/material";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

const NAVY = "#0B1C2D";
const NAVY_2 = "#0F2A44";
const drawerWidth = 260;

const navItems = [
  { label: "HRMS Home", href: "/suite-services", icon: <HomeOutlinedIcon /> },
  { label: "Dashboard", href: "/hrms/emp-dashboard", icon: <DashboardOutlinedIcon /> },
  { label: "Employees", href: "/hrms/employees", icon: <PeopleAltOutlinedIcon /> },
];

function GlassCard({ title, icon, right, children, sx }) {
  return (
    <Box
      sx={{
        borderRadius: 4,
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
        overflow: "hidden",
        color: "#111827",
        ...sx,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 2,
          py: 1.5,
          background: "#f8fafc",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ color: NAVY }}>{icon}</Box>
          <Typography fontWeight={900} sx={{ color: "#111827" }}>
            {title}
          </Typography>
        </Stack>
        {right}
      </Stack>

      <Box sx={{ p: 2 }}>{children}</Box>
    </Box>
  );
}

function EventRow({ avatarSrc, title, subtitle, rightChip, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: onClick ? "pointer" : "default",
        px: 1.5,
        py: 1.25,
        borderRadius: 3,
        border: "1px solid #e5e7eb",
        background: "#ffffff",
        transition: "transform .15s ease, background .15s ease, box-shadow .15s ease",
        "&:hover": {
          transform: onClick ? "translateY(-2px)" : "none",
          background: "#f8fafc",
          boxShadow: onClick ? "0 8px 18px rgba(0,0,0,0.06)" : "none",
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.25}>
        <Avatar src={avatarSrc} sx={{ width: 34, height: 34 }} />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography fontWeight={800} sx={{ color: "#111827", lineHeight: 1.15 }} noWrap>
            {title}
          </Typography>
          <Typography variant="caption" sx={{ color: "#6b7280" }} noWrap>
            {subtitle}
          </Typography>
        </Box>
        {rightChip}
      </Stack>
    </Box>
  );
}

function MiniCalendar({ accent = "#22c55e" }) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const today = new Date();
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthName = cursor.toLocaleString(undefined, { month: "long" });

  const startDay = new Date(year, month, 1).getDay(); // 0 Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  const totalCells = 42;
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - startDay + 1;
    const inMonth = dayNum >= 1 && dayNum <= daysInMonth;

    const isToday =
      inMonth &&
      year === today.getFullYear() &&
      month === today.getMonth() &&
      dayNum === today.getDate();

    cells.push({ dayNum, inMonth, isToday });
  }

  const prev = () => setCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const next = () => setCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography fontWeight={900} sx={{ color: "#111827" }}>
          {monthName} {year}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="contained"
            onClick={prev}
            sx={{
              minWidth: 36,
              px: 1,
              backgroundColor: "#eef2f7",
              color: "#111827",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#e5e7eb", boxShadow: "none" },
            }}
          >
            ‹
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={next}
            sx={{
              minWidth: 36,
              px: 1,
              backgroundColor: "#eef2f7",
              color: "#111827",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#e5e7eb", boxShadow: "none" },
            }}
          >
            ›
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.75, mb: 1 }}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, idx) => (
          <Typography key={`${d}-${idx}`} variant="caption" sx={{ color: "#6b7280", textAlign: "center" }}>
            {d}
          </Typography>
        ))}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.75 }}>
        {cells.map((c, idx) => (
          <Box
            key={idx}
            sx={{
              height: 30,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              background: c.isToday ? accent : "#f8fafc",
              border: "1px solid #e5e7eb",
              fontWeight: c.isToday ? 900 : 700,
              color: c.isToday ? "#ffffff" : c.inMonth ? "#111827" : "#cbd5e1",
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: "inherit", color: "inherit" }}>
              {c.inMonth ? c.dayNum : ""}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default function EmpDashboard({
  auth,
  stats = {},
  todayBirthdays = [],
  upcomingBirthdays = [],
  departmentBreakdown = [],
  probationEnding = [],
  recentHires = [],
}) {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = () => setMobileOpen((p) => !p);

  const drawer = (
    <Box sx={{ width: drawerWidth }}>
      <Toolbar>
        <Typography fontWeight={900} variant="h6" sx={{ color: "#111827" }}>
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
            sx={{
              borderRadius: 2,
              mx: 1,
              my: 1,
              "&:hover": { backgroundColor: "#f3f4f6" },
            }}
          >
            <ListItemIcon sx={{ color: NAVY }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  const totalEmployees = stats?.employeesCount ?? 0;

  const userName =
    auth?.user?.name ||
    auth?.user?.full_name ||
    auth?.user?.username ||
    auth?.user?.email ||
    "User";

  const todaysEvents = useMemo(() => {
    const bdays = (todayBirthdays ?? []).slice(0, 6).map((b) => ({
      type: "birthday",
      employee_id: b.employee_id,
      name: b.name ?? "Unknown",
      employee_code: b.employee_code ?? "",
      label: "Birthday",
      chip: { text: "Today", kind: "today" },
    }));

    const prob = [...(probationEnding ?? [])]
      .map((p) => ({
        type: "probation",
        employee_id: p.employee_id,
        name: p.name ?? "Unknown",
        employee_code: p.employee_code ?? "",
        label: "Probation ends",
        days_left: Number(p.days_left ?? 0),
      }))
      .filter((x) => Number.isFinite(x.days_left))
      .sort((a, b) => a.days_left - b.days_left)
      .slice(0, 4)
      .map((x) => ({
        ...x,
        chip: { text: `${x.days_left}d`, kind: "warn" },
      }));

    return [...bdays, ...prob];
  }, [todayBirthdays, probationEnding]);

  const bookmarked = useMemo(() => {
    const list = [...(upcomingBirthdays ?? [])]
      .map((b) => ({
        employee_id: b.employee_id,
        name: b.name ?? "Unknown",
        employee_code: b.employee_code ?? "",
        days_left: Number(b.days_left ?? 0),
      }))
      .filter((x) => Number.isFinite(x.days_left))
      .sort((a, b) => a.days_left - b.days_left)
      .slice(0, 6);

    return list;
  }, [upcomingBirthdays]);

  return (
    <AuthenticatedLayout >
      <Head title="Employee Dashboard" />

      <Box sx={{ display: "flex" }}>
        {/* MOBILE TOP BAR */}
        {isMobile && (
          <AppBar position="fixed" sx={{ backgroundColor: NAVY }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <IconButton color="inherit" edge="start" onClick={toggleDrawer}>
                <MenuIcon />
              </IconButton>
              <Typography fontWeight={900}>Dashboard</Typography>
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
                "& .MuiDrawer-paper": {
                  width: drawerWidth,
                  top: "64px",                     
                  height: "calc(100% - 64px)",     
                  backgroundColor: "#ffffff",
                  color: "#111827",
                  borderRight: "1px solid #e5e7eb",
                },
              }}
              open
            >

            {drawer}
          </Drawer>
        </Box>

        {/* MAIN */}
        <Box sx={{ flexGrow: 1 }}>
          {/* PAGE */}
          <Box
            sx={{
              minHeight: "100vh",
              px: { xs: 2, md: 3 },
              py: { xs: 2, md: 3 },
              backgroundColor: "#f5f7fa",
            }}
          >
            <Container maxWidth={false} sx={{ px: 0 }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", md: "center" }}
                justifyContent="space-between"
                sx={{ mb: 2.5 }}
              >
                <Box>
                  <Typography variant="h4" fontWeight={900} sx={{ color: "#111827" }}>
                    Welcome Back, {userName}..
                  </Typography>
                  <Typography sx={{ color: "#6b7280", mt: 0.5 }}>
                    Here’s what’s happening in HR today.
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap">
                    <Chip
                      icon={<PeopleAltOutlinedIcon />}
                      label={`Active Employees: ${totalEmployees}`}
                      sx={{
                        color: "#111827",
                        backgroundColor: "#ffffff",
                        border: "1px solid #e5e7eb",
                        fontWeight: 800,
                      }}
                    />
                    <Chip
                      icon={<CakeOutlinedIcon />}
                      label={`${todayBirthdays.length} birthdays today`}
                      sx={{
                        color: "#111827",
                        backgroundColor: "#ffffff",
                        border: "1px solid #e5e7eb",
                        fontWeight: 800,
                      }}
                    />
                    <Chip
                      icon={<NotificationsOutlinedIcon />}
                      label={`${probationEnding.length} probation alerts`}
                      sx={{
                        color: "#111827",
                        backgroundColor: "#ffffff",
                        border: "1px solid #e5e7eb",
                        fontWeight: 800,
                      }}
                    />
                  </Stack>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Tooltip title="Refresh">
                    <IconButton
                      onClick={() =>
                        router.reload({
                          only: [
                            "stats",
                            "todayBirthdays",
                            "upcomingBirthdays",
                            "probationEnding",
                            "recentHires",
                            "departmentBreakdown",
                          ],
                        })
                      }
                      sx={{
                        color: NAVY,
                        backgroundColor: "#ffffff",
                        border: "1px solid #e5e7eb",
                        "&:hover": { backgroundColor: "#f8fafc" },
                      }}
                    >
                      <RefreshOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>

              {/* MAIN GRID */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", lg: "1.35fr 0.65fr" },
                  gap: 2,
                  alignItems: "start",
                }}
              >
                {/* LEFT COLUMN: TODAY + QUICK LINKS UNDER IT */}
                <Stack spacing={2}>
                  <GlassCard
                    title="Today's Events"
                    icon={<NotificationsOutlinedIcon />}
                    right={
                      <Button
                        size="small"
                        onClick={() => router.get("/hrms/employees")}
                        sx={{
                          color: NAVY,
                          fontWeight: 900,
                          textTransform: "none",
                          backgroundColor: "#ffffff",
                          border: "1px solid #e5e7eb",
                          borderRadius: 2,
                          "&:hover": { backgroundColor: "#f8fafc" },
                        }}
                      >
                        View all
                      </Button>
                    }
                  >
                    <Stack spacing={1.25}>
                      {todaysEvents.length === 0 ? (
                        <Typography sx={{ color: "#6b7280" }}>No events found for today.</Typography>
                      ) : (
                        todaysEvents.map((e) => (
                          <EventRow
                            key={`${e.type}-${e.employee_id}`}
                            title={`${e.name}`}
                            subtitle={`${e.label}${e.employee_code ? ` • ${e.employee_code}` : ""}`}
                            rightChip={
                              <Chip
                                size="small"
                                label={e.chip?.text}
                                sx={{
                                  fontWeight: 900,
                                  color: e.chip?.kind === "today" ? "#065f46" : "#92400e",
                                  backgroundColor: e.chip?.kind === "today" ? "#d1fae5" : "#ffedd5",
                                  border: "1px solid #e5e7eb",
                                }}
                              />
                            }
                            onClick={() => router.get(`/hrms/employees/${e.employee_id}`)}
                          />
                        ))
                      )}
                    </Stack>
                  </GlassCard>

                  {/* QUICK LINKS (moved here, under Today's Events) */}
                  <GlassCard title="Quick Links" icon={<DashboardOutlinedIcon />}>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
                      <Button
                        onClick={() => router.get("/hrms/employees")}
                        variant="contained"
                        sx={{
                          backgroundColor: NAVY,
                          "&:hover": { backgroundColor: NAVY_2 },
                          borderRadius: 3,
                          fontWeight: 900,
                          textTransform: "none",
                        }}
                      >
                        Employees
                      </Button>

                      <Button
                        onClick={() => router.get("/hrms/employees/create")}
                        variant="outlined"
                        sx={{
                          color: NAVY,
                          borderColor: "#cbd5e1",
                          borderRadius: 3,
                          fontWeight: 900,
                          textTransform: "none",
                          "&:hover": { borderColor: "#94a3b8", backgroundColor: "#f8fafc" },
                        }}
                      >
                        Add Employee
                      </Button>
                    </Stack>
                  </GlassCard>
                </Stack>

                {/* RIGHT COLUMN: BOOKMARKED + CALENDAR */}
                <Stack spacing={2}>
                  <GlassCard
                    title="Bookmarked"
                    icon={<BookmarkBorderOutlinedIcon />}
                    right={
                      <Chip
                        size="small"
                        label={`${bookmarked.length}`}
                        sx={{
                          color: "#111827",
                          fontWeight: 900,
                          backgroundColor: "#ffffff",
                          border: "1px solid #e5e7eb",
                        }}
                      />
                    }
                  >
                    <Stack spacing={1.25}>
                      {bookmarked.length === 0 ? (
                        <Typography sx={{ color: "#6b7280" }}>No upcoming birthdays.</Typography>
                      ) : (
                        bookmarked.map((b) => (
                          <EventRow
                            key={b.employee_id}
                            title={b.name}
                            subtitle={`Birthday • ${b.employee_code || "-"}`}
                            rightChip={
                              <Chip
                                size="small"
                                label={`${b.days_left} day`}
                                sx={{
                                  fontWeight: 900,
                                  color: "#065f46",
                                  backgroundColor: "#d1fae5",
                                  border: "1px solid #a7f3d0",
                                }}
                              />
                            }
                            onClick={() => router.get(`/hrms/employees/${b.employee_id}`)}
                          />
                        ))
                      )}
                    </Stack>
                  </GlassCard>

                  <GlassCard title="Calendar" icon={<CalendarMonthOutlinedIcon />}>
                    <MiniCalendar accent="#22c55e" />
                  </GlassCard>
                </Stack>
              </Box>
            </Container>
          </Box>
        </Box>
      </Box>
    </AuthenticatedLayout>
  );
}

