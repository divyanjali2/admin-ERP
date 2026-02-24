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

const suites = [
  {
    title: "HR SUITE",
    description: "Employee, leave, payroll, onboarding & HR workflows",
    href: "/suite-services",
    external: false,
    image: "/images/hr-suite.webp",
  },
  {
    title: "IT SUITE",
    description: "Tickets, assets, access, compliance & IT operations",
    href: "/suite-services",
    external: false,
    image: "/images/it-suite.webp",
  },
];

function SuiteCard({ item }) {
  const actionProps = item.external
    ? { component: "a", href: item.href, target: "_blank", rel: "noreferrer" }
    : { component: Link, href: item.href };

  return (
    <Card
      elevation={0}
      sx={{
        width: 320,
        maxWidth: "100%",
        borderRadius: 5,
        border: "3px solid #000035",
        backgroundColor: "#ffffff",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(11, 28, 45, 0.25)",
          borderColor: "#0F2A44",
        },
      }}
    >
      <CardActionArea {...actionProps} sx={{ height: "100%" }}>
        <CardContent>
          <Stack spacing={2} alignItems="center" textAlign="center">
            <Box
              component="img"
              src={item.image}
              alt={item.title}
              sx={{
                width: "100%",
                maxHeight: 160,
                height: "auto",
                borderRadius: 2,
                objectFit: "contain",
              }}
            />

            <Typography variant="h6" fontWeight={800}>
              {item.title}
            </Typography>

            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {item.description}
            </Typography>

            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              Open →
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function Suites({ auth }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Suites" />

      <Container
        maxWidth={false}
        sx={{
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "#a7c4e50f",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Typography
            variant="h4"
            fontWeight={900}
            sx={{ mb: 4, textAlign: "center" }}
          >
            Choose a Suite
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {suites.map((suite) => (
              <Grid
                item
                key={suite.title}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <SuiteCard item={suite} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </AuthenticatedLayout>
  );
}