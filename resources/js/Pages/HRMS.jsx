import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
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

const modules = [
  {
    title: "Employee Data",
    description: "Profiles, departments, documents, and employee records.",
    href: "/hrms/emp-dashboard",
    image: "/images/hrms-employee.webp",
  },
  {
    title: "Leave Management",
    description: "View, Approve and monitor employee leave records and balances.",
    href: "/hrms/payroll",
    image: "/images/hrms-payroll.webp",
  },
  {
    title: "Vehicle Request Management",
    description: "Review, approve, and manage vehicle booking requests.",
    href: "/hrms/recruitment",
    image: "/images/hrms-recruitment.webp",
  },
  {
    title: "Training",
    description: "Training programs, sessions, and completion tracking.",
    href: "/hrms/training",
    image: "/images/hrms-training.webp",
  },
  {
    title: "Employee Data",
    description: "Profiles, departments, documents, and employee records.",
    href: "/hrms/emp-dashboard",
    image: "/images/hrms-employee.webp",
  },
  {
    title: "Payroll",
    description: "Salary components, payslips, and deductions.",
    href: "/hrms/payroll",
    image: "/images/hrms-payroll.webp",
  },
  {
    title: "Recruitment",
    description: "Applicants, vacancies, and hiring pipeline.",
    href: "/hrms/recruitment",
    image: "/images/hrms-recruitment.webp",
  }
];

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
            {/* Image */}
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

            {/* Title */}
            <Typography variant="h6" fontWeight={900}>
              {item.title}
            </Typography>

            {/* Description */}
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {item.description}
            </Typography>

            {/* Action */}
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
            HRMS PORTAL
          </Typography>

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
        </Box>
      </Container>
    </AuthenticatedLayout>
  );
}
