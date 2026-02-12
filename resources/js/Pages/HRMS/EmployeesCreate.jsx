import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const EMPLOYMENT_STATUS = ["Active", "Inactive", "Resigned", "Terminated"];
const GENDERS = ["Male", "Female", "Other"];
const MARITAL_STATUS = ["Single", "Married", "Other"];
const ATTENDANCE_TYPE = ["Fingerprint","Biometric", "Manual"];
const EMPLOYMENT_TYPE = ["Full-Time","Contract"];
const EMPLOYMENT_LEVEL = ["Probation", "Confirmed"];
const ADDRESS_TYPE = ["Residential", "Emergency", "Other"];
const CONTACT_TYPE = ["Personal Email", "Work Email", "Phone", "Alternate Phone"];
const PAY_FREQUENCY = ["Monthly", "Weekly"];
const SALARY_CURRENCY = ["LKR", "USD", "EUR", "GBP", "AUD", "CAD", "SGD", "INR"];
const DOC_TYPES = ["Profile Photo","Resume File","ID Proof","Offer Letter","Employment Contract","Certificates"];
const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-",];
const BANKS = ["Nations Trust Bank","Commercial Bank","Bank of Ceylon","People's Bank","Sampath Bank","Hatton National Bank","DFCC Bank","Pan Asia Bank","Union Bank"];

export default function EmployeesCreate({
  auth,
  departments = [],
  jobTitles = [],
  leavePolicies = [],
  employees = [], 
}) {
  const { data, setData, post, processing, errors } = useForm({
    // employees
    employee_code: "",
    employment_status: "Active",
    surname: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "Male",
    marital_status: "Single",
    nationality: "Sri Lankan",
    blood_group: "",
    epf_number: "",
    attendance_type: "Fingerprint",

    // user
    user_email: "",
    user_password: "",

    // employee_job
    department_id: "",
    job_title_id: "",
    employment_type: "Full-Time",
    employment_level: "Probation",
    date_of_joining: "",
    probation_end_date: "",
    reporting_manager_id: "",
    work_location_id: "",

    // contacts (multiple)
    contacts: [
      { contact_type: "Work Email", contact_value: "", is_primary: true },
      { contact_type: "Phone", contact_value: "", is_primary: true },
    ],

    // addresses (multiple)
    addresses: [
      {
        address_type: "Residential",
        address_line_1: "",
        address_line_2: "",
        city: "",
        country: "Sri Lanka",
        postal_code: "",
        is_current: true,
      },
    ],

    // emergency contacts
    emergency_contacts: [
      { name: "", relationship: "", phone: "", address: "" },
    ],

    employee_documents: [
      {
        doc_type: "ID Proof",
        files: [], 
      },
    ],

    experience: [
      { previous_employer: "", total_years: "" },
    ],

    // bank accounts
    bank_accounts: [
      { bank_name: "", bank_account_number: "", bank_branch_name: "" },
    ],

    // compensation
    compensation: {
      salary_currency: "LKR",
      pay_frequency: "Monthly",
      effective_from: "",
      effective_to: "",
      components: [
        { component_type: "Basic", component_name: "Basic Salary", amount: "" },
      ],
    },

    yearly_leave: [
      {
        leave_policy_id: "",
        leave_entitlement: 0,
      },
    ],
  });

  const submit = (e) => {
    e.preventDefault();

    post("/hrms/employees", {
      preserveScroll: true,
      forceFormData: true,
      onSuccess: () => setAlert({ type: "success", message: "Employee saved successfully.", open: true }),
      onError: () => setAlert({ type: "error", message: "Please fix the errors and try again.", open: true }),
    });
  };

  const setContact = (idx, key, value) => {
    const next = [...data.contacts];
    next[idx] = { ...next[idx], [key]: value };
    setData("contacts", next);
  };

  const addContact = () => {
    setData("contacts", [
      ...data.contacts,
      { contact_type: "Personal_Email", contact_value: "", is_primary: false },
    ]);
  };

  const removeContact = (idx) => {
    const next = data.contacts.filter((_, i) => i !== idx);
    setData("contacts", next);
  };

  const setAddress = (idx, key, value) => {
    const next = [...data.addresses];
    next[idx] = { ...next[idx], [key]: value };
    setData("addresses", next);
  };

  const addAddress = () => {
    setData("addresses", [
      ...data.addresses,
      {
        address_type: "Other",
        address_line_1: "",
        city: "",
        country: "Sri Lanka",
        postal_code: "",
        is_current: false,
      },
    ]);
  };

  const removeAddress = (idx) => {
    const next = data.addresses.filter((_, i) => i !== idx);
    setData("addresses", next);
  };

  const setEmergency = (idx, key, value) => {
    const next = [...data.emergency_contacts];
    next[idx] = { ...next[idx], [key]: value };
    setData("emergency_contacts", next);
  };

  const addEmergency = () => {
    setData("emergency_contacts", [
      ...data.emergency_contacts,
      { name: "", relationship: "", phone: "", address: "" },
    ]);
  };

  const removeEmergency = (idx) => {
    const next = data.emergency_contacts.filter((_, i) => i !== idx);
    setData("emergency_contacts", next);
  };

  const setBank = (idx, key, value) => {
    const next = [...data.bank_accounts];
    next[idx] = { ...next[idx], [key]: value };
    setData("bank_accounts", next);
  };

  const addBank = () => {
    setData("bank_accounts", [
      ...data.bank_accounts,
      { bank_name: "", bank_account_number: "" },
    ]);
  };

  const removeBank = (idx) => {
    const next = data.bank_accounts.filter((_, i) => i !== idx);
    setData("bank_accounts", next);
  };

  const setComp = (key, value) => {
    setData("compensation", { ...data.compensation, [key]: value });
  };

  const setCompComponent = (idx, key, value) => {
    const next = [...data.compensation.components];
    next[idx] = { ...next[idx], [key]: value };
    setComp("components", next);
  };

  const addCompComponent = () => {
    setComp("components", [
      ...data.compensation.components,
      { component_type: "Allowance", component_name: "", amount: "" },
    ]);
  };

  const removeCompComponent = (idx) => {
    const next = data.compensation.components.filter((_, i) => i !== idx);
    setComp("components", next);
  };

    // ===== DOCUMENTS =====
  const setDocument = (idx, key, value) => {
    const next = [...data.employee_documents];
    next[idx] = { ...next[idx], [key]: value };
    setData("employee_documents", next);
  };

  const addDocument = () => {
    setData("employee_documents", [
      ...data.employee_documents,
      { doc_type: "Other", files: null },
    ]);
  };

  const removeDocument = (idx) => {
    setData("employee_documents", data.employee_documents.filter((_, i) => i !== idx));
  };

  // ===== EXPERIENCE =====
  const setExperience = (idx, key, value) => {
    const next = [...data.experience];
    next[idx] = { ...next[idx], [key]: value };
    setData("experience", next);
  };

  const addExperience = () => {
    setData("experience", [...data.experience, { previous_employer: "", total_years: "" }]);
  };

  const removeExperience = (idx) => {
    setData("experience", data.experience.filter((_, i) => i !== idx));
  };

  const setYearlyLeave = (idx, key, value) => {
    const next = [...data.yearly_leave];
    next[idx] = { ...next[idx], [key]: value };
    setData("yearly_leave", next);
  };

  const addYearlyLeave = () => {
    setData("yearly_leave", [
      ...data.yearly_leave,
      { leave_policy_id: "", leave_entitlement: 0 },
    ]);
  };

  const removeYearlyLeave = (idx) => {
    setData(
      "yearly_leave",
      data.yearly_leave.filter((_, i) => i !== idx)
    );
  };

const { flash } = usePage().props;
const [alert, setAlert] = useState({ type: "", message: "", open: false });

useEffect(() => {
  if (flash?.success) setAlert({ type: "success", message: flash.success, open: true });
  else if (flash?.error) setAlert({ type: "error", message: flash.error, open: true });
}, [flash]);

useEffect(() => {
  if (Object.keys(errors || {}).length) {
    setAlert({ type: "error", message: "Please fix the highlighted fields.", open: true });
  }
}, [errors]);


  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Create Employee" />
      <Collapse in={alert.open} sx={{ mb: 2 }}>
        <Alert
          severity={alert.type || "info"}
          onClose={() => setAlert((p) => ({ ...p, open: false }))}
        >
          {alert.message}
        </Alert>
      </Collapse>

      <Container maxWidth="false" sx={{ py: 4 }}>
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
            {/* ================= BASIC ================= */}
            <Typography fontWeight={900}>Basic Details</Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Surname"
                value={data.surname}
                onChange={(e) => setData("surname", e.target.value)}
                error={!!errors.surname}
                helperText={errors.surname}
                fullWidth
              />
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

            <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Birth"
                  value={data.date_of_birth ? dayjs(data.date_of_birth) : null}
                  onChange={(newValue) =>
                    setData("date_of_birth", newValue ? newValue.format("YYYY-MM-DD") : "")
                  }
                  disableFuture
                  maxDate={dayjs().subtract(6, "year")}
                  views={["year", "month", "day"]}
                  openTo="year"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.date_of_birth,
                      helperText: errors.date_of_birth,
                    },
                  }}
                />
              </LocalizationProvider>

              <TextField
                select
                label="Gender"
                value={data.gender}
                onChange={(e) => setData("gender", e.target.value)}
                fullWidth
              >
                {GENDERS.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </TextField>

                   <TextField
                select
                label="Marital Status"
                value={data.marital_status}
                onChange={(e) => setData("marital_status", e.target.value)}
                fullWidth
              >
                {MARITAL_STATUS.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Employment Status"
                value={data.employment_status}
                onChange={(e) => setData("employment_status", e.target.value)}
                fullWidth
              >
                {EMPLOYMENT_STATUS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
              <TextField
                label="Nationality"
                value={data.nationality}
                onChange={(e) => setData("nationality", e.target.value)}
                fullWidth
              />
              <TextField
                select
                label="Attendance Type"
                value={data.attendance_type}
                onChange={(e) => setData("attendance_type", e.target.value)}
                fullWidth
              >
                {ATTENDANCE_TYPE.map((a) => (
                  <MenuItem key={a} value={a}>
                    {a}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="EPF Number"
                value={data.epf_number}
                onChange={(e) => setData("epf_number", e.target.value)}
                fullWidth
              />
              <TextField
                select
                label="Blood Group"
                value={data.blood_group}
                onChange={(e) => setData("blood_group", e.target.value)}
                fullWidth
              >
                <MenuItem value="">Select Blood Group</MenuItem>
                {BLOOD_GROUPS.map((bg) => (
                  <MenuItem key={bg} value={bg}>
                    {bg}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Divider />

            {/* ================= USER ================= */}
            <Typography fontWeight={900}>Login (User)</Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="User Email"
                value={data.user_email}
                onChange={(e) => setData("user_email", e.target.value)}
                error={!!errors.user_email}
                helperText={errors.user_email}
                fullWidth
              />
              <TextField
                label="User Password"
                type="password"
                value={data.user_password}
                onChange={(e) => setData("user_password", e.target.value)}
                error={!!errors.user_password}
                helperText={errors.user_password}
                fullWidth
              />
            </Stack>

            <Divider />

            {/* ================= JOB ================= */}
            <Typography fontWeight={900}>Job Details</Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
              <TextField
                select
                label="Department"
                value={data.department_id}
                onChange={(e) => setData("department_id", e.target.value)}
                error={!!errors.department_id}
                helperText={errors.department_id}
                fullWidth
              >
                {departments.map((d) => (
                  <MenuItem key={d.department_id} value={d.department_id}>
                    {d.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Job Title"
                value={data.job_title_id}
                onChange={(e) => setData("job_title_id", e.target.value)}
                error={!!errors.job_title_id}
                helperText={errors.job_title_id}
                fullWidth
              >
                {jobTitles.map((j) => (
                  <MenuItem key={j.job_title_id} value={j.job_title_id}>
                    {j.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Employment Type"
                value={data.employment_type}
                onChange={(e) => setData("employment_type", e.target.value)}
                fullWidth
              >
                {EMPLOYMENT_TYPE.map((x) => (
                  <MenuItem key={x} value={x}>
                    {x}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Employment Level"
                value={data.employment_level}
                onChange={(e) => setData("employment_level", e.target.value)}
                fullWidth
              >
                {EMPLOYMENT_LEVEL.map((x) => (
                  <MenuItem key={x} value={x}>
                    {x}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                <TextField
                  label="Date of Joining"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={data.date_of_joining}
                  onChange={(e) => setData("date_of_joining", e.target.value)}
                  inputProps={{
                    max: new Date().toISOString().split("T")[0], 
                  }}
                  fullWidth
                />

                <TextField
                  label="Probation End Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={data.probation_end_date}
                  onChange={(e) => setData("probation_end_date", e.target.value)}
                  inputProps={{
                    min: new Date().toISOString().split("T")[0], 
                  }}
                  fullWidth
                />

              <TextField
                select
                label="Reporting Manager"
                value={data.reporting_manager_id}
                onChange={(e) => setData("reporting_manager_id", e.target.value)}
                fullWidth
              >
                <MenuItem value="">None</MenuItem>
                {employees.map((e) => (
                  <MenuItem key={e.employee_id ?? e.id} value={e.employee_id ?? e.id}>
                    {(e.first_name ?? "") + " " + (e.last_name ?? "")} ({e.employee_code ?? ""})
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Divider />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={900}>Experience</Typography>
              <Button startIcon={<AddOutlinedIcon />} onClick={addExperience}>
                Add Experience
              </Button>
            </Stack>

            <Stack spacing={2}>
              {data.experience.map((x, idx) => (
                <Stack
                  key={idx}
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems="center"
                >
                  <TextField
                    label="Previous Employer"
                    value={x.previous_employer}
                    onChange={(e) => setExperience(idx, "previous_employer", e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Total Years"
                    type="number"
                    inputProps={{ step: "0.25" }}
                    value={x.total_years}
                    onChange={(e) => setExperience(idx, "total_years", e.target.value)}
                    fullWidth
                  />
                  <IconButton onClick={() => removeExperience(idx)} aria-label="remove-experience">
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                </Stack>
              ))}
            </Stack>

            <Divider />

            {/* ================= CONTACTS ================= */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={900}>Contacts</Typography>
              <Button startIcon={<AddOutlinedIcon />} onClick={addContact}>
                Add Contact
              </Button>
            </Stack>

            <Stack spacing={2}>
              {data.contacts.map((c, idx) => (
                <Stack key={idx} direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                  <TextField
                    select
                    label="Contact Type"
                    value={c.contact_type}
                    onChange={(e) => setContact(idx, "contact_type", e.target.value)}
                    fullWidth
                  >
                    {CONTACT_TYPE.map((t) => (
                      <MenuItem key={t} value={t}>
                        {t}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    label="Contact Value"
                    value={c.contact_value}
                    onChange={(e) => setContact(idx, "contact_value", e.target.value)}
                    fullWidth
                  />

                  <IconButton onClick={() => removeContact(idx)} aria-label="remove-contact">
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                </Stack>
              ))}
            </Stack>

            <Divider />

            {/* ================= ADDRESSES ================= */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={900}>Addresses</Typography>
              <Button startIcon={<AddOutlinedIcon />} onClick={addAddress}>
                Add Address
              </Button>
            </Stack>

            <Stack spacing={2}>
              {data.addresses.map((a, idx) => (
                <Box key={idx} sx={{ p: 2, border: "1px solid", borderColor: "divider" }}>
                  <Stack spacing={4}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={4} alignItems="center">
                      <TextField
                        select
                        label="Address Type"
                        value={a.address_type}
                        onChange={(e) => setAddress(idx, "address_type", e.target.value)}
                        fullWidth
                      >
                        {ADDRESS_TYPE.map((t) => (
                          <MenuItem key={t} value={t}>
                            {t}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        label="Address Line 1"
                        value={a.address_line_1}
                        onChange={(e) => setAddress(idx, "address_line_1", e.target.value)}
                        fullWidth
                      />

                        <TextField
                          label="City"
                          value={a.city}
                          onChange={(e) => setAddress(idx, "city", e.target.value)}
                          fullWidth
                        />

                      <IconButton onClick={() => removeAddress(idx)} aria-label="remove-address">
                        <DeleteOutlineOutlinedIcon />
                      </IconButton>
                    </Stack>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
                
                       <TextField
                        label="Country"
                        value={a.country}
                        onChange={(e) => setAddress(idx, "country", e.target.value)}
                        fullWidth
                      />
                      <TextField
                        label="Postal Code"
                        value={a.postal_code}
                        onChange={(e) => setAddress(idx, "postal_code", e.target.value)}
                        fullWidth
                      />
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Stack>

            <Divider />

            {/* ================= EMERGENCY CONTACTS ================= */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={900}>Emergency Contacts</Typography>
              <Button startIcon={<AddOutlinedIcon />} onClick={addEmergency}>
                Add Emergency Contact
              </Button>
            </Stack>

            <Stack spacing={2}>
              {data.emergency_contacts.map((ec, idx) => (
                <Stack key={idx} direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                  <TextField
                    label="Name"
                    value={ec.name}
                    onChange={(e) => setEmergency(idx, "name", e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Relationship"
                    value={ec.relationship}
                    onChange={(e) => setEmergency(idx, "relationship", e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Phone"
                    value={ec.phone}
                    onChange={(e) => setEmergency(idx, "phone", e.target.value)}
                    fullWidth
                  />
                  <IconButton onClick={() => removeEmergency(idx)} aria-label="remove-emergency">
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                </Stack>
              ))}
            </Stack>

            <Divider />

            {/* ================= BANK ================= */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={900}>Bank Accounts</Typography>
              <Button startIcon={<AddOutlinedIcon />} onClick={addBank}>
                Add Bank Account
              </Button>
            </Stack>

            <Stack spacing={2}>
              {data.bank_accounts.map((b, idx) => (
                <Stack key={idx} direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                  <TextField
                    select
                    label="Bank Name"
                    value={b.bank_name}
                    onChange={(e) => setBank(idx, "bank_name", e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="">Select Bank</MenuItem>
                    {BANKS.map((bank) => (
                      <MenuItem key={bank} value={bank}>
                        {bank}
                      </MenuItem>
                    ))}
                    
                  </TextField>

                  <TextField
                    label="Bank Account Number"
                    value={b.bank_account_number}
                    onChange={(e) => setBank(idx, "bank_account_number", e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Bank Branch Name"
                    value={b.bank_branch_name}
                    onChange={(e) => setBank(idx, "bank_branch_name", e.target.value)}
                    fullWidth
                  />
                  <IconButton onClick={() => removeBank(idx)} aria-label="remove-bank">
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                </Stack>
              ))}
            </Stack>

            <Divider />

            {/* ================= COMPENSATION ================= */}
            <Typography fontWeight={900}>Compensation</Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
              <TextField
                select
                label="Salary Currency"
                value={data.compensation.salary_currency}
                onChange={(e) => setComp("salary_currency", e.target.value)}
                fullWidth
              >
                {SALARY_CURRENCY.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Pay Frequency"
                value={data.compensation.pay_frequency}
                onChange={(e) => setComp("pay_frequency", e.target.value)}
                fullWidth
              >
                {PAY_FREQUENCY.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Effective From"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={data.compensation.effective_from}
                onChange={(e) => setComp("effective_from", e.target.value)}
                fullWidth
              />
              <TextField
                label="Effective To"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={data.compensation.effective_to}
                onChange={(e) => setComp("effective_to", e.target.value)}
                fullWidth
              />
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={800}>Compensation Components</Typography>
              <Button startIcon={<AddOutlinedIcon />} onClick={addCompComponent}>
                Add Component
              </Button>
            </Stack>

            <Stack spacing={2}>
              {data.compensation.components.map((cc, idx) => (
                <Stack key={idx} direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                  <TextField
                    select
                    label="Type"
                    value={cc.component_type}
                    onChange={(e) => setCompComponent(idx, "component_type", e.target.value)}
                    fullWidth
                  >
                    {["Basic", "Allowance", "Deduction"].map((t) => (
                      <MenuItem key={t} value={t}>
                        {t}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Name"
                    value={cc.component_name}
                    onChange={(e) => setCompComponent(idx, "component_name", e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Amount"
                    type="number"
                    value={cc.amount}
                    onChange={(e) => setCompComponent(idx, "amount", e.target.value)}
                    fullWidth
                  />
                  <IconButton onClick={() => removeCompComponent(idx)} aria-label="remove-comp-component">
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                </Stack>
              ))}
            </Stack>

            <Divider />

            {/* ================= LEAVE POLICY / YEARLY ================= */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={800}>Yearly Balance</Typography>
              <Button startIcon={<AddOutlinedIcon />} onClick={addYearlyLeave}>
                Add Leave Policy
              </Button>
            </Stack>

            <Stack spacing={2}>
              {data.yearly_leave.map((yl, idx) => (
                <Stack
                  key={idx}
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems="center"
                >
                  <TextField
                    select
                    label="Leave Policy"
                    value={yl.leave_policy_id}
                    onChange={(e) =>
                      setYearlyLeave(idx, "leave_policy_id", e.target.value)
                    }
                    fullWidth
                  >
                    <MenuItem value="">Select policy</MenuItem>
                    {leavePolicies.map((lp) => (
                      <MenuItem
                        key={lp.leave_policy_id}
                        value={lp.leave_policy_id}
                      >
                        {lp.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    label="Annual Leave Balance"
                    type="number"
                    value={yl.leave_entitlement}
                    onChange={(e) =>
                      setYearlyLeave(idx, "leave_entitlement", e.target.value)
                    }
                    fullWidth
                  />

                  <IconButton onClick={() => removeYearlyLeave(idx)}>
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                </Stack>
              ))}
            </Stack>


            <Divider />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={900}>Documents</Typography>
              <Button startIcon={<AddOutlinedIcon />} onClick={addDocument}>
                Add Document
              </Button>
            </Stack>

            <Stack spacing={2}>
              {data.employee_documents.map((d, idx) => (
                <Stack
                  key={idx}
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems="center"
                >
                  <TextField
                    select
                    label="Document Type"
                    value={d.doc_type}
                    onChange={(e) => setDocument(idx, "doc_type", e.target.value)}
                    fullWidth
                  >
                    {DOC_TYPES.map((t) => (
                      <MenuItem key={t} value={t}>
                        {t}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      sx={{ justifyContent: "flex-start" }}
                    >
                      {d.files?.length
                        ? `${d.files.length} file(s) selected`
                        : "Choose Files"}

                      <input
                        type="file"
                        hidden
                        multiple
                        onChange={(e) =>
                          setDocument(
                            idx,
                            "files",
                            Array.from(e.target.files || [])
                          )
                        }
                      />
                    </Button>


                  <IconButton onClick={() => removeDocument(idx)} aria-label="remove-document">
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                </Stack>
              ))}
            </Stack>

            <Divider />

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