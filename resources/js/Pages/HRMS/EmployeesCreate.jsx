import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";

export default function EmployeesCreate({ auth }) {
  const { data, setData, post, processing, errors } = useForm({
    // employees
    employee_code: "",
    employment_status: "Active",
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    marital_status: "",
    nationality: "",
    blood_group: "",
    epf_number: "",
    attendance_type: "Biometric",

    // user (auth table) - optional if you create user here
    user_email: "",
    user_password: "",

    // job
    department_id: "",
    job_title_id: "",
    employment_type: "Full-Time",
    employment_level: "Probation",
    date_of_joining: "",
    probation_end_date: "",
    reporting_manager_id: "",
    work_location_id: "",

    // contacts (simple)
    work_email: "",
    personal_email: "",
    phone: "",

    // address
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
  });

  const submit = (e) => {
    e.preventDefault();
    post("/hrms/employees", { preserveScroll: true });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Create Employee" />

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={900} sx={{ color: "#0B1C2D" }}>
            Create Employee
          </Typography>
          <Button variant="outlined" onClick={() => router.get("/hrms/employees")}>
            Back
          </Button>
        </Stack>

        <Box component="form" onSubmit={submit} sx={{ border: "2px solid #0B1C2D", p: 3 }}>
          <Stack spacing={3}>
            {/* Core */}
            <Typography fontWeight={800}>Basic Details</Typography>
            <TextField
              label="Employee Code"
              value={data.employee_code}
              onChange={(e) => setData("employee_code", e.target.value)}
              error={!!errors.employee_code}
              helperText={errors.employee_code}
              fullWidth
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="First Name"
                value={data.first_name}
                onChange={(e) => setData("first_name", e.target.value)}
                error={!!errors.first_name}
                helperText={errors.first_name}
                fullWidth
              />
              <TextField
                label="Middle Name"
                value={data.middle_name}
                onChange={(e) => setData("middle_name", e.target.value)}
                fullWidth
              />
              <TextField
                label="Last Name"
                value={data.last_name}
                onChange={(e) => setData("last_name", e.target.value)}
                error={!!errors.last_name}
                helperText={errors.last_name}
                fullWidth
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Date of Birth"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={data.date_of_birth}
                onChange={(e) => setData("date_of_birth", e.target.value)}
                error={!!errors.date_of_birth}
                helperText={errors.date_of_birth}
                fullWidth
              />
              <TextField
                label="Gender"
                value={data.gender}
                onChange={(e) => setData("gender", e.target.value)}
                error={!!errors.gender}
                helperText={errors.gender}
                fullWidth
              />
            </Stack>

            {/* Contacts */}
            <Typography fontWeight={800}>Contacts</Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Work Email"
                value={data.work_email}
                onChange={(e) => setData("work_email", e.target.value)}
                fullWidth
              />
              <TextField
                label="Phone"
                value={data.phone}
                onChange={(e) => setData("phone", e.target.value)}
                fullWidth
              />
            </Stack>

            {/* Job */}
            <Typography fontWeight={800}>Job Details</Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Department ID"
                value={data.department_id}
                onChange={(e) => setData("department_id", e.target.value)}
                fullWidth
              />
              <TextField
                label="Job Title ID"
                value={data.job_title_id}
                onChange={(e) => setData("job_title_id", e.target.value)}
                fullWidth
              />
            </Stack>

            <TextField
              label="Date of Joining"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={data.date_of_joining}
              onChange={(e) => setData("date_of_joining", e.target.value)}
              fullWidth
            />

            {/* Address */}
            <Typography fontWeight={800}>Address</Typography>
            <TextField
              label="Address Line 1"
              value={data.address_line_1}
              onChange={(e) => setData("address_line_1", e.target.value)}
              fullWidth
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="City"
                value={data.city}
                onChange={(e) => setData("city", e.target.value)}
                fullWidth
              />
              <TextField
                label="State"
                value={data.state}
                onChange={(e) => setData("state", e.target.value)}
                fullWidth
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Country"
                value={data.country}
                onChange={(e) => setData("country", e.target.value)}
                fullWidth
              />
              <TextField
                label="Postal Code"
                value={data.postal_code}
                onChange={(e) => setData("postal_code", e.target.value)}
                fullWidth
              />
            </Stack>

            <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ pt: 1 }}>
              <Button variant="outlined" onClick={() => router.get("/hrms/employees")}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={processing}
                sx={{ backgroundColor: "#0B1C2D", "&:hover": { backgroundColor: "#0F2A44" } }}
              >
                Save Employee
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </AuthenticatedLayout>
  );
}
