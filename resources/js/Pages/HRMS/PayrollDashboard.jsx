import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Box, Button, Stack, Typography } from "@mui/material";

const NAVY = "#0B1C2D";
const NAVY_2 = "#0F2A44";

export default function Leave({ auth }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Leave" />

      <Box
        sx={{
          minHeight: "100vh",
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 3 },
          backgroundColor: "#f5f7fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 720,
            borderRadius: 4,
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            p: { xs: 3, md: 5 },
            textAlign: "center",
          }}
        >
          <Typography variant="h4" fontWeight={900} sx={{ color: "#111827" }}>
            Payroll Managment
          </Typography>

          <Typography sx={{ color: "#6b7280", mt: 1.25 }}>
            Coming soon. We’re working on this page and it will be available shortly.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.25}
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            <Button
              variant="contained"
              onClick={() => window.history.back()}
              sx={{
                backgroundColor: NAVY,
                "&:hover": { backgroundColor: NAVY_2 },
                borderRadius: 3,
                fontWeight: 900,
                textTransform: "none",
                px: 3,
              }}
            >
              Go Back
            </Button>

            <Button
              variant="outlined"
              href="/suite-services"
              sx={{
                color: NAVY,
                borderColor: "#cbd5e1",
                borderRadius: 3,
                fontWeight: 900,
                textTransform: "none",
                px: 3,
                "&:hover": { borderColor: "#94a3b8", backgroundColor: "#f8fafc" },
              }}
            >
              HRMS Home
            </Button>
          </Stack>

          <Typography variant="caption" sx={{ color: "#9ca3af", mt: 3, display: "block" }}>
            Developed &amp; Maintained by IT Department of Explore Vacations © {new Date().getFullYear()}
          </Typography>
        </Box>
      </Box>
    </AuthenticatedLayout>
  );
}
