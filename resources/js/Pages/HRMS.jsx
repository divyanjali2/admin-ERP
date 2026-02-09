import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Container, Typography } from "@mui/material";

export default function HRMS({ auth }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="HRMS" />
      <Container maxWidth="md" sx={{ py: 2 }}>
        <Typography variant="h5" fontWeight={800}>
          HRMS
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Coming soon.
        </Typography>
      </Container>
    </AuthenticatedLayout>
  );
}
