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

const services = [
  {
    title: "FMS",
    description: "Fleet Management System",
    href: "https://exploredrive.lk/",
    external: true,
    image: "/images/fms.webp",
  },
  {
    title: "HRMS",
    description: "Human Resource Management System",
    href: "/hrms",
    external: false,
    image: "/images/hrms.webp",
  },
];

function ServiceCard({ item }) {
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
            {/* Image */}
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

            {/* Text */}
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

export default function Services({ auth }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Services" />

      <Container
        maxWidth="md"
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Typography
            variant="h4"
            fontWeight={900}
            sx={{ mb: 4, textAlign: "center" }}
          >
            Choose a Service
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {services.map((service) => (
                <Grid item key={service.title}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                <ServiceCard item={service} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </AuthenticatedLayout>
  );
}
