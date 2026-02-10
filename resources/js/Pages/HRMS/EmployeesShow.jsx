import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

export default function EmployeeShow({ auth, employee }) {
  const job = employee?.job;
  const contacts = employee?.contacts ?? [];
  const addresses = employee?.addresses ?? [];
  const emergencyContacts = employee?.emergency_contacts ?? employee?.emergencyContacts ?? [];
  const bankAccounts = employee?.bank_accounts ?? employee?.bankAccounts ?? [];
  const experiences = employee?.experience ?? employee?.experiences ?? [];
  const documents = employee?.employee_documents ?? employee?.documents ?? [];
  const compensations = employee?.compensations ?? [];
  const leaveBalances = employee?.leave_balances ?? employee?.leaveBalances ?? [];

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={`Employee - ${employee?.employee_code ?? ""}`} />

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5" fontWeight={900} sx={{ color: "#0B1C2D" }}>
            Employee Details
          </Typography>

          <Button variant="outlined" onClick={() => router.get("/hrms/employees")}>
            Back
          </Button>
        </Stack>

        <Box sx={{ border: "2px solid #0B1C2D", p: 3, backgroundColor: "white" }}>
          {/* BASIC */}
          <Typography fontWeight={900} sx={{ mb: 1 }}>Basic</Typography>
          <Stack spacing={0.75}>
            <Typography><b>Employee Code:</b> {employee?.employee_code ?? "-"}</Typography>
            <Typography><b>Name:</b> {(employee?.first_name ?? "") + " " + (employee?.last_name ?? "")}</Typography>
            <Typography><b>Employment Status:</b> {employee?.employment_status ?? "-"}</Typography>
            <Typography><b>Attendance Type:</b> {employee?.attendance_type ?? "-"}</Typography>
            <Typography><b>EPF Number:</b> {employee?.epf_number ?? "-"}</Typography>
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* JOB */}
          <Typography fontWeight={900} sx={{ mb: 1 }}>Job</Typography>
          <Stack spacing={0.75}>
            <Typography><b>Department:</b> {job?.department?.name ?? "-"}</Typography>
            <Typography><b>Job Title:</b> {job?.jobTitle?.name ?? "-"}</Typography>
            <Typography><b>Employment Type:</b> {job?.employment_type ?? "-"}</Typography>
            <Typography><b>Employment Level:</b> {job?.employment_level ?? "-"}</Typography>
            <Typography><b>Date of Joining:</b> {job?.date_of_joining ?? "-"}</Typography>
            <Typography><b>Probation End:</b> {job?.probation_end_date ?? "-"}</Typography>
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* CONTACTS */}
          <Typography fontWeight={900} sx={{ mb: 1 }}>Contacts</Typography>
          <Stack spacing={0.75}>
            {contacts.length === 0 ? (
              <Typography color="text.secondary">No contacts</Typography>
            ) : (
              contacts.map((c, i) => (
                <Typography key={i}>
                  <b>{c.contact_type}:</b> {c.contact_value} {c.is_primary ? "(Primary)" : ""}
                </Typography>
              ))
            )}
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* ADDRESSES */}
          <Typography fontWeight={900} sx={{ mb: 1 }}>Addresses</Typography>
          <Stack spacing={1}>
            {addresses.length === 0 ? (
              <Typography color="text.secondary">No addresses</Typography>
            ) : (
              addresses.map((a, i) => (
                <Box key={i} sx={{ p: 1.5, border: "1px solid", borderColor: "divider" }}>
                  <Typography><b>Type:</b> {a.address_type}</Typography>
                  <Typography>
                    <b>Address:</b> {a.address_line_1}{a.address_line_2 ? `, ${a.address_line_2}` : ""},{" "}
                    {a.city}, {a.state}, {a.country} - {a.postal_code}
                  </Typography>
                </Box>
              ))
            )}
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* EMERGENCY */}
          <Typography fontWeight={900} sx={{ mb: 1 }}>Emergency Contacts</Typography>
          <Stack spacing={0.75}>
            {emergencyContacts.length === 0 ? (
              <Typography color="text.secondary">No emergency contacts</Typography>
            ) : (
              emergencyContacts.map((e, i) => (
                <Typography key={i}>
                  <b>{e.name}</b> ({e.relationship}) - {e.phone}
                </Typography>
              ))
            )}
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* BANK */}
          <Typography fontWeight={900} sx={{ mb: 1 }}>Bank Accounts</Typography>
          <Stack spacing={0.75}>
            {bankAccounts.length === 0 ? (
              <Typography color="text.secondary">No bank accounts</Typography>
            ) : (
              bankAccounts.map((b, i) => (
                <Typography key={i}>
                  <b>{b.bank_name}:</b> {b.bank_account_number} {b.bank_branch_name ? `(${b.bank_branch_name})` : ""}
                </Typography>
              ))
            )}
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* EXPERIENCE */}
          <Typography fontWeight={900} sx={{ mb: 1 }}>Experience</Typography>
          <Stack spacing={0.75}>
            {experiences.length === 0 ? (
              <Typography color="text.secondary">No experience</Typography>
            ) : (
              experiences.map((x, i) => (
                <Typography key={i}>
                  <b>{x.previous_employer}</b> - {x.total_years ?? 0} years
                </Typography>
              ))
            )}
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* COMPENSATION */}
          <Typography fontWeight={900} sx={{ mb: 1 }}>Compensation</Typography>
          <Stack spacing={1}>
            {compensations.length === 0 ? (
              <Typography color="text.secondary">No compensation records</Typography>
            ) : (
              compensations.map((c, i) => (
                <Box key={i} sx={{ p: 1.5, border: "1px solid", borderColor: "divider" }}>
                  <Typography><b>Currency:</b> {c.salary_currency} | <b>Frequency:</b> {c.pay_frequency}</Typography>
                  <Typography><b>Effective:</b> {c.effective_from ?? "-"} to {c.effective_to ?? "-"}</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography fontWeight={800}>Components</Typography>
                  {(c.components ?? []).length === 0 ? (
                    <Typography color="text.secondary">No components</Typography>
                  ) : (
                    (c.components ?? []).map((cc, idx) => (
                      <Typography key={idx}>
                        {cc.component_type} - {cc.component_name}: {cc.amount}
                      </Typography>
                    ))
                  )}
                </Box>
              ))
            )}
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* LEAVE */}
          <Typography fontWeight={900} sx={{ mb: 1 }}>Leave Balances</Typography>
          <Stack spacing={0.75}>
            {leaveBalances.length === 0 ? (
              <Typography color="text.secondary">No leave balances</Typography>
            ) : (
              leaveBalances.map((lb, i) => (
                <Typography key={i}>
                  <b>Policy:</b> {lb.leave_policy_id} | <b>Annual:</b> {lb.annual_leave_balance} | <b>Sick:</b>{" "}
                  {lb.sick_leave_balance}
                </Typography>
              ))
            )}
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* DOCUMENTS */}
          <Typography fontWeight={900} sx={{ mb: 1 }}>Documents</Typography>
          <Stack spacing={0.75}>
            {documents.length === 0 ? (
              <Typography color="text.secondary">No documents</Typography>
            ) : (
              documents.map((d, i) => (
                <Typography key={i}>
                  <b>{d.doc_type}:</b> {d.file_path ?? d.file ?? "Uploaded"}
                </Typography>
              ))
            )}
          </Stack>
        </Box>
      </Container>
    </AuthenticatedLayout>
  );
}
