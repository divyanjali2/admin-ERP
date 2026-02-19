import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import LockIcon from "@mui/icons-material/Lock";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const MANAGEMENT_CARDS = [
  {
    title: "Users",
    description: "Create, edit, and manage system users.",
    href: "/hrms/users",
    icon: PersonIcon,
    color: "#0c6eca",
  },
  {
    title: "Roles",
    description: "Define roles and assign permissions to roles.",
    href: "/hrms/roles",
    icon: SecurityIcon,
    color: "#16a34a",
  },
  {
    title: "Permissions",
    description: "Create and manage system permissions.",
    href: "/hrms/permissions",
    icon: LockIcon,
    color: "#bb7804",
  },
];

function ManagementCard({ card }) {
  const Icon = card.icon;
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "2px solid #e5e7eb",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          borderColor: card.color,
        },
      }}
    >
      <CardActionArea component={Link} href={card.href}>
        <CardContent>
          <Stack spacing={2} alignItems="center" textAlign="center">
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                backgroundColor: `${card.color}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon sx={{ width: 30, height: 30, color: card.color }} />
            </Box>

            <Typography variant="h6" fontWeight={900}>
              {card.title}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {card.description}
            </Typography>

            <Typography variant="body2" sx={{ fontWeight: 700, color: card.color }}>
              Manage →
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function UsersManagement({ auth }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Users Management" />

      <Container
        maxWidth="lg"
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.get("/hrms")}
            sx={{ mb: 3 }}
          >
            Back
          </Button>

          <Stack spacing={4} alignItems="center" sx={{ mb: 6 }}>
            <Typography variant="h4" fontWeight={900} sx={{ textAlign: "center" }}>
              Users, Roles & Permissions Management
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: "center", maxWidth: 600 }}
            >
              Manage system users, define roles, and control permissions to ensure proper access control across the
              application.
            </Typography>
          </Stack>

          <Grid container spacing={3} justifyContent="center">
            {MANAGEMENT_CARDS.map((card) => (
              <Grid item xs={12} sm={6} md={4} key={card.title}>
                <ManagementCard card={card} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </AuthenticatedLayout>
  );
}
