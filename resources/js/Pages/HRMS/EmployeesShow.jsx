import React, { useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const fmt = (v) => (v === null || v === undefined || v === "" ? "-" : String(v));
const asArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

export default function EmployeeShow({ auth, employee }) {
  const job = employee?.job ?? employee?.employee_job ?? null;
  const contacts = employee?.contacts ?? employee?.employee_contacts ?? [];
  const addresses = employee?.addresses ?? employee?.employee_addresses ?? [];
  const emergencyContacts =
    employee?.emergencyContacts ?? employee?.emergency_contacts ?? employee?.employee_emergency_contacts ?? [];
  const bankAccounts = employee?.bankAccounts ?? employee?.bank_accounts ?? employee?.employee_bank_accounts ?? [];
  const experiences = employee?.experiences ?? employee?.experience ?? employee?.employee_experiences ?? [];
  const documents = employee?.documents ?? employee?.employee_documents ?? employee?.employeeDocuments ?? [];
  const compensations = employee?.compensations ?? employee?.employee_compensations ?? employee?.employeeCompensations ?? [];
  const yearlyLeaveBalances =
    employee?.yearlyLeaveBalances ??
    employee?.employee_yearly_leave_balance ??
    employee?.leaveBalances ??
    employee?.leave_balances ??
    [];

  const fullName = useMemo(() => {
    return `${employee?.first_name ?? ""} ${employee?.last_name ?? ""}`.trim() || "-";
  }, [employee]);

  const onlyDate = (v) => {
  if (!v) return "-";
  // handles "2026-02-10 12:30:00" or ISO strings
  const s = String(v);
  const datePart = s.split("T")[0].split(" ")[0];
  return datePart || "-";
};

const managerName = (job) => {
  const m = job?.reportingManager ?? job?.reporting_manager ?? null;
  if (!m) return fmt(job?.reporting_manager_id);
  const name = `${m.first_name ?? ""} ${m.last_name ?? ""}`.trim();
  return name || fmt(job?.reporting_manager_id);
};

const jobTitleName =
  job?.jobTitle?.name ??
  job?.job_title?.name ??
  job?.job_title_name ??
  "-";

  const Section = ({ title, children, defaultExpanded = false }) => (
    <Accordion
      defaultExpanded={defaultExpanded}
      disableGutters
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight={900} sx={{ color: "#0B1C2D" }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );

  // ✅ 4-by-4 grid on desktop: xs=12, sm=6 (2 cols), md=3 (4 cols)
  const KVGrid = ({ items }) => (
    <Grid container spacing={2}>
      {items.map(({ k, v }, idx) => (
        <Grid key={idx} item xs={12} sm={6} md={3}>
          <Box sx={{ border: "1px solid", borderColor: "divider", p: 1.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
              {k}
            </Typography>
            <Typography fontWeight={800}>{fmt(v)}</Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  const SimpleTable = ({ columns, rows, emptyText = "No records" }) => {
    const safeRows = asArray(rows);
    return safeRows.length === 0 ? (
      <Typography color="text.secondary">{emptyText}</Typography>
    ) : (
      <Table size="small" sx={{ border: "1px solid", borderColor: "divider" }}>
        <TableHead>
          <TableRow>
            {columns.map((c) => (
              <TableCell key={c.key} sx={{ fontWeight: 900, color: "#0B1C2D" }}>
                {c.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {safeRows.map((r, i) => (
            <TableRow key={i}>
              {columns.map((c) => (
                <TableCell key={c.key}>
                  {fmt(typeof c.get === "function" ? c.get(r) : r?.[c.key])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={`Employee - ${employee?.employee_code ?? ""}`} />

      {/* ✅ Fluid container */}
      <Container maxWidth={false} disableGutters sx={{ py: 4, px: { xs: 2, md: 3 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight={900} sx={{ color: "#0B1C2D" }}>
              Employee Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {fmt(employee?.employee_code)} • {fullName}
            </Typography>
          </Box>

          <Button variant="outlined" onClick={() => router.get("/hrms/employees")}>
            Back
          </Button>
        </Box>

        <Box sx={{ border: "2px solid #0B1C2D", p: 2.5, backgroundColor: "white" }}>
          <Box sx={{ display: "grid", gap: 1.5 }}>
            {/* BASIC */}
            <Section title="Basic" defaultExpanded>
              <KVGrid
                items={[
                  { k: "Employee Code", v: employee?.employee_code },
                  { k: "Name", v: fullName },
                  { k: "Surname", v: employee?.surname },
                  { k: "DOB", v: employee?.date_of_birth },
                  { k: "Gender", v: employee?.gender },
                  { k: "Marital Status", v: employee?.marital_status },
                  { k: "Nationality", v: employee?.nationality },
                  { k: "Blood Group", v: employee?.blood_group },
                  { k: "EPF Number", v: employee?.epf_number },
                  { k: "Employment Status", v: employee?.employment_status },
                  { k: "Attendance Type", v: employee?.attendance_type },
                ]}
              />
            </Section>

            {/* JOB */}
            <Section title="Job">
              <KVGrid
                items={[
                  { k: "Department", v: job?.department?.name ?? job?.department_name },
                  { k: "Job Title", v: jobTitleName },
                  { k: "Employment Type", v: job?.employment_type },
                  { k: "Employment Level", v: job?.employment_level },
                  { k: "Date of Joining", v: onlyDate(job?.date_of_joining) },
                  { k: "Probation End", v: onlyDate(job?.probation_end_date) },
                  { k: "Reporting Manager", v: managerName(job) },
                ]}
              />
            </Section>


            {/* CONTACTS */}
            <Section title={`Contacts (${contacts.length})`}>
              <SimpleTable
                columns={[
                  { key: "contact_type", label: "Type" },
                  { key: "contact_value", label: "Value" },
                ]}
                rows={contacts}
                emptyText="No contacts"
              />
            </Section>

            {/* ADDRESSES */}
            <Section title={`Addresses (${addresses.length})`}>
              <SimpleTable
                columns={[
                  { key: "address_type", label: "Type" },
                  { key: "address_line_1", label: "Line 1" },
                  { key: "address_line_2", label: "Line 2" },
                  { key: "city", label: "City" },
                  { key: "state", label: "State" },
                  { key: "country", label: "Country" },
                  { key: "postal_code", label: "Postal Code" },
                ]}
                rows={addresses}
                emptyText="No addresses"
              />
            </Section>

            {/* EMERGENCY */}
            <Section title={`Emergency Contacts (${emergencyContacts.length})`}>
              <SimpleTable
                columns={[
                  { key: "name", label: "Name" },
                  { key: "relationship", label: "Relationship" },
                  { key: "phone", label: "Phone" },
                  { key: "address", label: "Address" },
                ]}
                rows={emergencyContacts}
                emptyText="No emergency contacts"
              />
            </Section>

            {/* BANK */}
            <Section title={`Bank Accounts (${bankAccounts.length})`}>
              <SimpleTable
                columns={[
                  { key: "bank_name", label: "Bank" },
                  { key: "bank_account_number", label: "Account No." },
                  { key: "bank_branch_name", label: "Branch" },
                ]}
                rows={bankAccounts}
                emptyText="No bank accounts"
              />
            </Section>

            {/* EXPERIENCE */}
            <Section title={`Experience (${experiences.length})`}>
              <SimpleTable
                columns={[
                  { key: "previous_employer", label: "Previous Employer" },
                  { key: "total_years", label: "Total Years" },
                ]}
                rows={experiences}
                emptyText="No experience"
              />
            </Section>

            {/* COMPENSATION */}
            <Section title={`Compensation (${compensations.length})`}>
              {asArray(compensations).length === 0 ? (
                <Typography color="text.secondary">No compensation records</Typography>
              ) : (
                asArray(compensations).map((c, idx) => (
                  <Box key={idx} sx={{ mb: 2 }}>
                    <KVGrid
                      items={[
                        { k: "Currency", v: c?.salary_currency },
                        { k: "Pay Frequency", v: c?.pay_frequency },
                        { k: "Effective From", v: onlyDate(c?.effective_from) },
                        { k: "Effective To", v: onlyDate(c?.effective_to) },
                      ]}
                    />
                    <Divider sx={{ my: 1.5 }} />
                    <Typography fontWeight={900} sx={{ mb: 1, color: "#0B1C2D" }}>
                      Components
                    </Typography>
                    <SimpleTable
                      columns={[
                        { key: "component_type", label: "Type" },
                        { key: "component_name", label: "Name" },
                        { key: "amount", label: "Amount" },
                      ]}
                      rows={c?.components ?? c?.compensation_components ?? []}
                      emptyText="No components"
                    />
                  </Box>
                ))
              )}
            </Section>

            {/* LEAVE */}
            <Section title={`Leave Balances (${yearlyLeaveBalances.length})`}>
              <SimpleTable
                columns={[
                  { key: "policy", label: "Policy", get: (r) => r?.policy?.name ?? r?.leave_policy_id },
                  { key: "leave_entitlement", label: "Entitlement" },
                ]}
                rows={yearlyLeaveBalances}
                emptyText="No leave balances"
              />
            </Section>

            {/* DOCUMENTS */}
            <Section title={`Documents (${documents.length})`}>
              <SimpleTable
                columns={[
                  { key: "doc_type", label: "Type" },
                  { key: "file_path", label: "Path" },
                ]}
                rows={documents}
                emptyText="No documents"
              />
            </Section>
          </Box>
        </Box>
      </Container>
    </AuthenticatedLayout>
  );
}
