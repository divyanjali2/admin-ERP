import React, { useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

const MODULE_SETS = {
  ADMIN: [
    {
      title: "Users, Roles & Permissions",
      description: "Manage system users, roles, and permission controls.",
      href: "/hrms/users-management",
      image: "/images/users-roles-permissions.webp",
    },
  ],
  HR: [
    {
      title: "Employee Data",
      description: "Profiles, departments, documents, and employee records.",
      href: "/hrms/emp-dashboard",
      image: "/images/employee-data.webp",
    },
    {
      title: "Leave Management",
      description: "View, Approve and monitor employee leave records and balances.",
      href: "/hrms/leave-dashboard",
      image: "/images/leave-managment.webp",
    },
    {
      title: "Vehicle Request Management",
      description: "Review, approve, and manage vehicle booking requests.",
      href: "/hrms/vehicle-request-dashboard",
      image: "/images/vehicle-request-management.webp",
    },
    {
      title: "Recruitment",
      description: "Applicants, vacancies, and hiring pipeline.",
      href: "/hrms/recruitment-dashboard",
      image: "/images/hrms-recruitment.webp",
    },
    {
      title: "Training",
      description: "Training programs, sessions, and completion tracking.",
      href: "/hrms/training-dashboard",
      image: "/images/hrms-training.webp",
    },
  ],

  FINANCE: [
    {
      title: "Payroll",
      description: "Salary components, payslips, and deductions.",
      href: "/hrms/payroll-dashboard",
      image: "/images/payroll.webp",
    },
  ],
  // TRANSPORT: [
  //   {
  //     title: "Fleet & Booking Operations",
  //     description: "Manage transfer schedules and shuttle schedules.",
  //     href: "/schedules/transport-dashboard",
  //     image: "/images/transport-operations.webp",
  //   },
  // ],
};

function ModuleCard({ item }) {
  return (
    <Card
      elevation={0}
      sx={{
        width: 320,
        maxWidth: "100%",
        borderRadius: 3,
        border: "3px solid #000035",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(11, 28, 45, 0.25)",
          borderColor: "#0F2A44",
        },
      }}
    >
      <CardActionArea component={Link} href={item.href}>
        <CardContent>
          <Stack spacing={1.75} alignItems="center" textAlign="center">
            <Box
              component="img"
              src={item.image}
              alt={item.title}
              sx={{
                width: "100%",
                height: 130,
                objectFit: "contain",
                borderRadius: 2,
              }}
            />

            <Typography variant="h6" fontWeight={900}>
              {item.title}
            </Typography>

            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {item.description}
            </Typography>

            <Typography variant="body2" sx={{ fontWeight: 800, color: "#0B1C2D" }}>
              Open →
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function HRMS({ auth }) {
  const page = usePage();

  const roleRaw =
    page.props?.auth?.user?.role ??
    auth?.user?.role ??
    "";

  const role = String(roleRaw).trim().toLowerCase(); 

  const deptRaw =
    page.props?.auth?.department ??
    page.props?.auth?.user?.department ??
    auth?.department ??
    auth?.user?.department ??
    "";

  const dept = String(deptRaw).trim().toLowerCase();

  const allModules = useMemo(() => {
    const all = [...(MODULE_SETS.HR || []), ...(MODULE_SETS.FINANCE || [])];
    return all.filter((m, i, arr) => arr.findIndex((x) => x.href === m.href) === i);
  }, []);

  const modules = useMemo(() => {
    if (role === "admin") {
      const adminModules = [
        ...allModules,
        ...(MODULE_SETS.ADMIN || []),
        ...(MODULE_SETS.TRANSPORT || []),
      ];
      return adminModules.filter(
        (m, i, arr) => arr.findIndex((x) => x.href === m.href) === i
      );
    }

    if (dept === "hr" || dept.includes("human"))
      return MODULE_SETS.HR || [];

    if (dept === "finance" || dept.includes("finan"))
      return MODULE_SETS.FINANCE || [];

    if (
      dept.includes("transfer") ||
      dept.includes("rent a car") ||
      dept.includes("rental")
    )
      return MODULE_SETS.TRANSPORT || [];

    return [];
  }, [role, dept, allModules]);


  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="HRMS" />

      <Container
        maxWidth="false"
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 3,
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Typography variant="h5" fontWeight={900} sx={{ mb: 5, textAlign: "center" }}>
            ERP WORKSPACE
          </Typography>

          {modules.length === 0 ? (
            <Typography align="center" color="text.secondary">
              No modules assigned for your account.
            </Typography>
          ) : (
            <Grid container spacing={3} justifyContent="center">
              {modules.map((m) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  key={m.title}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <ModuleCard item={m} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </AuthenticatedLayout>
  );
}
