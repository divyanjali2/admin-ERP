import React, { useMemo, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import Swal from "sweetalert2";
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
const GENDERS = ["Male", "Female"];
const MARITAL_STATUS = ["Single", "Married", "Other"];
const ATTENDANCE_TYPE = ["Fingerprint", "Biometric", "Manual"];
const EMPLOYMENT_TYPE = ["Full-Time", "Contract"];
const EMPLOYMENT_LEVEL = ["Probation", "Confirmed"];
const ADDRESS_TYPE = ["Residential", "Emergency", "Other"];
const CONTACT_TYPE = ["Personal Email", "Work Email", "Whatsapp Number", "Alternate Phone"];
const PAY_FREQUENCY = ["Monthly", "Weekly"];
const SALARY_CURRENCY = ["LKR", "USD"];
const DOC_TYPES = [
  "Profile Photo",
  "Resume File",
  "ID Proof",
  "Offer Letter",
  "Employment Contract",
  "Certificates",
];
const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];
const BANKS = [
  "Nations Trust Bank",
  "Commercial Bank",
  "Bank of Ceylon",
  "People's Bank",
  "Sampath Bank",
  "Hatton National Bank",
  "DFCC Bank",
  "Pan Asia Bank",
  "Union Bank",
];

const ensureArray = (v, fallback) => (Array.isArray(v) && v.length ? v : fallback);
const asDate = (v) => (v ? String(v).slice(0, 10) : "");

// basic emptiness helpers
const hasAny = (obj, keys) => keys.some((k) => String(obj?.[k] ?? "").trim() !== "");
const isNumFilled = (v) => v !== "" && v !== null && v !== undefined;

// ✅ Always define this OUTSIDE the component (so it exists before use)
const toYearlyLeaveRows = (balances) => {
  const rows = (Array.isArray(balances) ? balances : []).map((b) => ({
    leave_policy_id: b?.leave_policy_id != null ? String(b.leave_policy_id) : "",
    leave_entitlement: b?.leave_entitlement != null ? String(b.leave_entitlement) : "",
  }));

  return rows.length ? rows : [{ leave_policy_id: "", leave_entitlement: "" }];
};


export default function EmployeesEdit({
  auth,
  employee,
  departments = [],
  jobTitles = [],
  leavePolicies = [],
  employees = [],
}) {
  const job = employee?.job ?? employee?.employee_job ?? {};

  const contacts = employee?.contacts ?? employee?.employee_contacts ?? [];
  const addresses = employee?.addresses ?? employee?.employee_addresses ?? [];
  const emergencyContacts =
    employee?.emergencyContacts ??
    employee?.emergency_contacts ??
    employee?.employee_emergency_contacts ??
    [];
  const bankAccounts =
    employee?.bankAccounts ??
    employee?.bank_accounts ??
    employee?.employee_bank_accounts ??
    [];
  const experiences =
    employee?.experiences ??
    employee?.experience ??
    employee?.employee_experiences ??
    [];
  const compensations =
    employee?.compensations ??
    employee?.employee_compensations ??
    employee?.employeeCompensations ??
    [];
  const yearlyLeaveBalances =
    employee?.yearly_leave_balances ??        
    employee?.yearlyLeaveBalances ??         
    employee?.employee_yearly_leave_balance ??
    employee?.leaveBalances ??
    employee?.leave_balances ??
    employee?.yearly_leave ??
    [];


  const initialComp =
    compensations?.[0] ??
    employee?.compensation ??
    employee?.employee_compensation ??
    null;

    const existingDocs =
      employee?.documents ??
      employee?.employee_documents ??
      [];


  const initialYearlyLeaveRows = toYearlyLeaveRows(yearlyLeaveBalances);

  const { data, setData, processing, errors } = useForm({
    employment_status: employee?.employment_status ?? "Active",
    surname: employee?.surname ?? "",
    first_name: employee?.first_name ?? "",
    middle_name: employee?.middle_name ?? "",
    last_name: employee?.last_name ?? "",
    date_of_birth: asDate(employee?.date_of_birth),
    gender: employee?.gender ?? "Male",
    marital_status: employee?.marital_status ?? "Single",
    nationality: employee?.nationality ?? "Sri Lankan",
    blood_group: employee?.blood_group ?? "",
    epf_number: employee?.epf_number ?? "",
    attendance_type: employee?.attendance_type ?? "Fingerprint",

    user_email: employee?.user?.email ?? employee?.user_email ?? "",
    user_password: "",

    department_id: job?.department_id ?? "",
    job_title_id: job?.job_title_id ?? "",
    employment_type: job?.employment_type ?? "Full-Time",
    employment_level: job?.employment_level ?? "Probation",
    date_of_joining: asDate(job?.date_of_joining),
    probation_end_date: asDate(job?.probation_end_date),
    reporting_manager_id: job?.reporting_manager_id ?? "",

    contacts: ensureArray(contacts, [
      { contact_type: "Work Email", contact_value: "", is_primary: true },
    ]),
    addresses: ensureArray(addresses, [
      {
        address_type: "Residential",
        address_line_1: "",
        city: "",
        country: "Sri Lanka",
        postal_code: "",
        is_current: true,
      },
    ]),
    emergency_contacts: ensureArray(emergencyContacts, [
      { name: "", relationship: "", phone: "", address: "" },
    ]),
    bank_accounts: ensureArray(bankAccounts, [
      { bank_name: "", bank_account_number: "", bank_branch_name: "" },
    ]),
    experience: ensureArray(experiences, [{ previous_employer: "", total_years: "" }]),

    compensation: {
      salary_currency: initialComp?.salary_currency ?? "LKR",
      pay_frequency: initialComp?.pay_frequency ?? "Monthly",
      effective_from: asDate(initialComp?.effective_from),
      effective_to: asDate(initialComp?.effective_to),
      components: ensureArray(initialComp?.components, [
        { component_type: "Basic", component_name: "Basic Salary", amount: "" },
      ]),
    },

    // ✅ MUST be an array because UI uses map()
    yearly_leave: initialYearlyLeaveRows,

    employee_documents: [{ doc_type: "Other", file: null }],
  });

  const cleanedPayload = useMemo(() => {
    const cleaned = { ...data };

    cleaned.emergency_contacts = (data.emergency_contacts || []).filter((x) =>
      hasAny(x, ["name", "relationship", "phone", "address"])
    );

    cleaned.bank_accounts = (data.bank_accounts || []).filter((x) =>
      hasAny(x, ["bank_name", "bank_account_number", "bank_branch_name"])
    );

    cleaned.experience = (data.experience || []).filter(
      (x) => hasAny(x, ["previous_employer"]) || isNumFilled(x?.total_years)
    );

    cleaned.employee_documents = (data.employee_documents || []).filter((d) => !!d?.file);

    cleaned.compensation = data.compensation
      ? {
          ...data.compensation,
          components: (data.compensation.components || []).filter(
            (c) => String(c?.component_name ?? "").trim() !== "" && isNumFilled(c?.amount)
          ),
        }
      : null;

    // reporting_manager nullable
    if (cleaned.reporting_manager_id === "") cleaned.reporting_manager_id = null;

    // ✅ yearly_leave as array, convert "" -> null
    cleaned.yearly_leave = (data.yearly_leave || [])
      .filter(
        (x) =>
          String(x?.leave_policy_id ?? "").trim() !== "" ||
          isNumFilled(x?.leave_entitlement)
      )
      .map((x) => ({
        leave_policy_id: x.leave_policy_id === "" ? null : x.leave_policy_id,
        leave_entitlement: x.leave_entitlement === "" ? null : x.leave_entitlement,
      }));

    return cleaned;
  }, [data]);

  const submit = (e) => {
    e.preventDefault();

    router.post(
      `/hrms/employees/${employee.employee_id}`,
      {
        _method: "put",
        ...cleanedPayload,
      },
      {
        preserveScroll: true,
        forceFormData: true,
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Employee updated successfully.",
            confirmButtonColor: "#078318",
          }).then(() => {
            router.get(`/hrms/employees/`);
          });
        },
        onError: (errors) => {
          const errorMessages = Object.entries(errors)
            .map(([key, message]) => `<strong>${key}:</strong> ${message}`)
            .join("<br>");

          Swal.fire({
            icon: "error",
            title: "Validation Error",
            html: errorMessages || "Please check your input and try again.",
            confirmButtonColor: "#880d0d",
          });
        },
      }
    );
  };

  // ===== small field helpers =====
  const updateArrayRow = (field, idx, patch) => {
    const next = [...(data[field] || [])];
    next[idx] = { ...next[idx], ...patch };
    setData(field, next);
  };

  const addRow = (field, row) => setData(field, [...(data[field] || []), row]);
  const removeRow = (field, idx) =>
    setData(field, (data[field] || []).filter((_, i) => i !== idx));

  const setComp = (patch) => setData("compensation", { ...data.compensation, ...patch });

  const handleCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Any unsaved changes will be lost.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#045511",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, leave",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        router.get(`/hrms/employees/`);
      }
    });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={`Edit Employee - ${employee?.employee_code ?? ""}`} />

      <Container maxWidth="false" sx={{ py: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={900} sx={{ color: "#0B1C2D" }}>
            Edit Employee
          </Typography>
          <Button variant="outlined" onClick={handleCancel}>
            Back
          </Button>
        </Stack>

        <Box component="form" onSubmit={submit} sx={{ border: "2px solid #0B1C2D", p: 3 }}>
          <Stack spacing={3}>
            <Typography fontWeight={900}>Basic Details</Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label="Surname" value={data.surname} onChange={(e) => setData("surname", e.target.value)} error={!!errors.surname} helperText={errors.surname} fullWidth />
              <TextField label="First Name" value={data.first_name} onChange={(e) => setData("first_name", e.target.value)} error={!!errors.first_name} helperText={errors.first_name} fullWidth />
              <TextField label="Middle Name" value={data.middle_name} onChange={(e) => setData("middle_name", e.target.value)} fullWidth />
              <TextField label="Last Name" value={data.last_name} onChange={(e) => setData("last_name", e.target.value)} error={!!errors.last_name} helperText={errors.last_name} fullWidth />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
              <TextField label="Date of Birth" type="date" InputLabelProps={{ shrink: true }} value={data.date_of_birth} onChange={(e) => setData("date_of_birth", e.target.value)} error={!!errors.date_of_birth} helperText={errors.date_of_birth} fullWidth />
              <TextField select label="Gender" value={data.gender} onChange={(e) => setData("gender", e.target.value)} fullWidth>
                {GENDERS.map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
              </TextField>
              <TextField select label="Marital Status" value={data.marital_status} onChange={(e) => setData("marital_status", e.target.value)} fullWidth>
                {MARITAL_STATUS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </TextField>
              <TextField select label="Employment Status" value={data.employment_status} onChange={(e) => setData("employment_status", e.target.value)} fullWidth>
                {EMPLOYMENT_STATUS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
              <TextField label="Nationality" value={data.nationality} onChange={(e) => setData("nationality", e.target.value)} fullWidth />
              <TextField select label="Attendance Type" value={data.attendance_type} onChange={(e) => setData("attendance_type", e.target.value)} fullWidth>
                {ATTENDANCE_TYPE.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
              </TextField>
              <TextField label="EPF Number" value={data.epf_number} onChange={(e) => setData("epf_number", e.target.value)} fullWidth />
              <TextField select label="Blood Group" value={data.blood_group} onChange={(e) => setData("blood_group", e.target.value)} fullWidth>
                {BLOOD_GROUPS.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
              </TextField>
            </Stack>

            <Divider />

            <Typography fontWeight={900}>Job Details</Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
              <TextField select label="Department" value={data.department_id} onChange={(e) => setData("department_id", e.target.value)} error={!!errors.department_id} helperText={errors.department_id} fullWidth>
                {departments.map((d) => <MenuItem key={d.department_id} value={d.department_id}>{d.name}</MenuItem>)}
              </TextField>

              <TextField select label="Job Title" value={data.job_title_id} onChange={(e) => setData("job_title_id", e.target.value)} error={!!errors.job_title_id} helperText={errors.job_title_id} fullWidth>
                {jobTitles.map((j) => <MenuItem key={j.job_title_id} value={j.job_title_id}>{j.name}</MenuItem>)}
              </TextField>

              <TextField select label="Employment Type" value={data.employment_type} onChange={(e) => setData("employment_type", e.target.value)} fullWidth>
                {EMPLOYMENT_TYPE.map((x) => <MenuItem key={x} value={x}>{x}</MenuItem>)}
              </TextField>

              <TextField select label="Employment Level" value={data.employment_level} onChange={(e) => setData("employment_level", e.target.value)} fullWidth>
                {EMPLOYMENT_LEVEL.map((x) => <MenuItem key={x} value={x}>{x}</MenuItem>)}
              </TextField>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
              <TextField label="Date of Joining" type="date" InputLabelProps={{ shrink: true }} value={data.date_of_joining} onChange={(e) => setData("date_of_joining", e.target.value)} fullWidth />
              <TextField label="Probation End Date" type="date" InputLabelProps={{ shrink: true }} value={data.probation_end_date} onChange={(e) => setData("probation_end_date", e.target.value)} fullWidth />
              <TextField select label="Reporting Manager" value={data.reporting_manager_id ?? ""} onChange={(e) => setData("reporting_manager_id", e.target.value)} fullWidth>
                <MenuItem value="">None</MenuItem>
                {employees.map((e) => (
                  <MenuItem key={e.employee_id ?? e.id} value={e.employee_id ?? e.id}>
                    {(e.first_name ?? "") + " " + (e.last_name ?? "")} ({e.employee_code ?? ""})
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Divider />

            {/* EXPERIENCE */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={900}>Experience</Typography>
              <Button startIcon={<AddOutlinedIcon />} onClick={() => addRow("experience", { previous_employer: "", total_years: "" })}>
                Add Experience
              </Button>
            </Stack>

            <Stack spacing={2}>
              {data.experience.map((x, idx) => (
                <Stack key={idx} direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                  <TextField label="Previous Employer" value={x.previous_employer} onChange={(e) => updateArrayRow("experience", idx, { previous_employer: e.target.value })} fullWidth />
                  <TextField label="Total Years" type="number" inputProps={{ step: "0.25" }} value={x.total_years} onChange={(e) => updateArrayRow("experience", idx, { total_years: e.target.value })} fullWidth />
                  <IconButton onClick={() => removeRow("experience", idx)}><DeleteOutlineOutlinedIcon /></IconButton>
                </Stack>
              ))}
            </Stack>

            <Divider />

            {/* CONTACTS */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={900}>Contacts</Typography>
              <Button startIcon={<AddOutlinedIcon />} onClick={() => addRow("contacts", { contact_type: "Personal Email", contact_value: "", is_primary: false })}>
                Add Contact
              </Button>
            </Stack>

            <Stack spacing={2}>
              {data.contacts.map((c, idx) => (
                <Stack key={idx} direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                  <TextField select label="Contact Type" value={c.contact_type} onChange={(e) => updateArrayRow("contacts", idx, { contact_type: e.target.value })} fullWidth>
                    {CONTACT_TYPE.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </TextField>
                  <TextField label="Contact Value" value={c.contact_value} onChange={(e) => updateArrayRow("contacts", idx, { contact_value: e.target.value })} fullWidth />
                  <TextField label="Primary" select value={c.is_primary ? "1" : "0"} onChange={(e) => updateArrayRow("contacts", idx, { is_primary: e.target.value === "1" })} sx={{ minWidth: 120 }}>
                    <MenuItem value="1">Yes</MenuItem>
                    <MenuItem value="0">No</MenuItem>
                  </TextField>
                  <IconButton onClick={() => removeRow("contacts", idx)}><DeleteOutlineOutlinedIcon /></IconButton>
                </Stack>
              ))}
            </Stack>

            <Divider />

            <Typography fontWeight={900}>Login (User)</Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label="User Email" value={data.user_email} onChange={(e) => setData("user_email", e.target.value)} error={!!errors.user_email} helperText={errors.user_email} fullWidth />
              <TextField label="User Password (leave empty to keep)" type="password" value={data.user_password} onChange={(e) => setData("user_password", e.target.value)} error={!!errors.user_password} helperText={errors.user_password} fullWidth />
            </Stack>

            <Divider />

            {/* ADDRESSES */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={900}>Addresses</Typography>
              <Button
                startIcon={<AddOutlinedIcon />}
                onClick={() =>
                  addRow("addresses", {
                    address_type: "Other",
                    address_line_1: "",
                    city: "",
                    country: "Sri Lanka",
                    postal_code: "",
                    is_current: false,
                  })
                }
              >
                Add Address
              </Button>
            </Stack>

            <Stack spacing={2}>
              {data.addresses.map((a, idx) => (
                <Box key={idx} sx={{ p: 2, border: "1px solid", borderColor: "divider" }}>
                  <Stack spacing={4}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                      <TextField select label="Address Type" value={a.address_type} onChange={(e) => updateArrayRow("addresses", idx, { address_type: e.target.value })} fullWidth>
                        {ADDRESS_TYPE.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                      </TextField>

                      <IconButton onClick={() => removeRow("addresses", idx)}><DeleteOutlineOutlinedIcon /></IconButton>

                      <TextField label="Address Line 1" value={a.address_line_1} onChange={(e) => updateArrayRow("addresses", idx, { address_line_1: e.target.value })} fullWidth />

                      {/* ✅ FIX: update addresses, not "city" */}
                      <TextField label="City" value={a.city} onChange={(e) => updateArrayRow("addresses", idx, { city: e.target.value })} fullWidth />
                    </Stack>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
                      <TextField label="Country" value={a.country} onChange={(e) => updateArrayRow("addresses", idx, { country: e.target.value })} fullWidth />
                      <TextField label="Postal Code" value={a.postal_code} onChange={(e) => updateArrayRow("addresses", idx, { postal_code: e.target.value })} fullWidth />
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Stack>

            <Divider />

            {/* EMERGENCY */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={900}>Emergency Contacts</Typography>
              <Button startIcon={<AddOutlinedIcon />} onClick={() => addRow("emergency_contacts", { name: "", relationship: "", phone: "", address: "" })}>
                Add Emergency Contact
              </Button>
            </Stack>

            <Stack spacing={2}>
              {data.emergency_contacts.map((ec, idx) => (
                <Stack key={idx} direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                  <TextField label="Name" value={ec.name} onChange={(e) => updateArrayRow("emergency_contacts", idx, { name: e.target.value })} fullWidth />
                  <TextField label="Relationship" value={ec.relationship} onChange={(e) => updateArrayRow("emergency_contacts", idx, { relationship: e.target.value })} fullWidth />
                  <TextField label="Phone" value={ec.phone} onChange={(e) => updateArrayRow("emergency_contacts", idx, { phone: e.target.value })} fullWidth />
                  <IconButton onClick={() => removeRow("emergency_contacts", idx)}><DeleteOutlineOutlinedIcon /></IconButton>
                </Stack>
              ))}
            </Stack>

            <Divider />

            {/* BANK */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={900}>Bank Accounts</Typography>
              <Button startIcon={<AddOutlinedIcon />} onClick={() => addRow("bank_accounts", { bank_name: "", bank_account_number: "", bank_branch_name: "" })}>
                Add Bank Account
              </Button>
            </Stack>

            <Stack spacing={2}>
              {data.bank_accounts.map((b, idx) => (
                <Stack key={idx} direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                  <TextField select label="Bank Name" value={b.bank_name || ""} onChange={(e) => updateArrayRow("bank_accounts", idx, { bank_name: e.target.value })} fullWidth>
                    <MenuItem value="">Select Bank</MenuItem>
                    {BANKS.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                  </TextField>

                  <TextField label="Bank Account Number" value={b.bank_account_number || ""} onChange={(e) => updateArrayRow("bank_accounts", idx, { bank_account_number: e.target.value })} fullWidth />
                  <TextField label="Bank Branch Name" value={b.bank_branch_name || ""} onChange={(e) => updateArrayRow("bank_accounts", idx, { bank_branch_name: e.target.value })} fullWidth />

                  <IconButton onClick={() => removeRow("bank_accounts", idx)}><DeleteOutlineOutlinedIcon /></IconButton>
                </Stack>
              ))}
            </Stack>

            <Divider />

            {/* COMP */}
            <Typography fontWeight={900}>Compensation</Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
              <TextField select label="Salary Currency" value={data.compensation.salary_currency} onChange={(e) => setComp({ salary_currency: e.target.value })} fullWidth>
                {SALARY_CURRENCY.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
              <TextField select label="Pay Frequency" value={data.compensation.pay_frequency} onChange={(e) => setComp({ pay_frequency: e.target.value })} fullWidth>
                {PAY_FREQUENCY.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </TextField>
              <TextField label="Effective From" type="date" InputLabelProps={{ shrink: true }} value={data.compensation.effective_from} onChange={(e) => setComp({ effective_from: e.target.value })} fullWidth />
              <TextField label="Effective To" type="date" InputLabelProps={{ shrink: true }} value={data.compensation.effective_to} onChange={(e) => setComp({ effective_to: e.target.value })} fullWidth />
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={800}>Compensation Components</Typography>
              <Button startIcon={<AddOutlinedIcon />} onClick={() => setComp({ components: [...(data.compensation.components || []), { component_type: "Allowance", component_name: "", amount: "" }] })}>
                Add Component
              </Button>
            </Stack>

            <Stack spacing={2}>
              {data.compensation.components.map((cc, idx) => (
                <Stack key={idx} direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                  <TextField select label="Type" value={cc.component_type} onChange={(e) => {
                    const next = [...data.compensation.components];
                    next[idx] = { ...next[idx], component_type: e.target.value };
                    setComp({ components: next });
                  }} fullWidth>
                    {["Basic", "Allowance", "Deduction"].map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </TextField>

                  <TextField label="Name" value={cc.component_name} onChange={(e) => {
                    const next = [...data.compensation.components];
                    next[idx] = { ...next[idx], component_name: e.target.value };
                    setComp({ components: next });
                  }} fullWidth />

                  <TextField label="Amount" type="number" value={cc.amount} onChange={(e) => {
                    const next = [...data.compensation.components];
                    next[idx] = { ...next[idx], amount: e.target.value };
                    setComp({ components: next });
                  }} fullWidth />

                  <IconButton onClick={() => {
                    const next = data.compensation.components.filter((_, i) => i !== idx);
                    setComp({ components: next });
                  }}>
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                </Stack>
              ))}
            </Stack>

            <Divider />

            {/* YEARLY LEAVE */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={900}>Yearly Leave Balance</Typography>
              <Button
                startIcon={<AddOutlinedIcon />}
                onClick={() => addRow("yearly_leave", { leave_policy_id: "", leave_entitlement: "" })}
              >
                Add Leave Policy
              </Button>
            </Stack>

            <Stack spacing={2}>
              {(data.yearly_leave || []).map((yl, idx) => (
                <Stack
                  key={idx}
                  direction={{ xs: "column", sm: "row" }}
                  spacing={4}
                  alignItems="center"
                >
                  <TextField
                    select
                    label="Leave Policy"
                    value={yl.leave_policy_id != null ? String(yl.leave_policy_id) : ""}
                    onChange={(e) => {
                      const next = [...(data.yearly_leave || [])];
                      next[idx] = { ...next[idx], leave_policy_id: e.target.value };
                      setData("yearly_leave", next);
                    }}
                    fullWidth
                  >
                    <MenuItem value="">Select policy</MenuItem>
                    {leavePolicies.map((lp) => (
                      <MenuItem key={lp.leave_policy_id} value={String(lp.leave_policy_id)}>
                        {lp.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    label="Leave Entitlement"
                    type="number"
                    value={yl.leave_entitlement ?? ""}
                    onChange={(e) => {
                      const next = [...(data.yearly_leave || [])];
                      next[idx] = { ...next[idx], leave_entitlement: e.target.value };
                      setData("yearly_leave", next);
                    }}
                    fullWidth
                  />

                  <IconButton onClick={() => removeRow("yearly_leave", idx)}>
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                </Stack>
              ))}
            </Stack>

            <Divider />

            {/* DOCUMENTS */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={900}>Upload New Documents</Typography>
              <Button startIcon={<AddOutlinedIcon />} onClick={() => addRow("employee_documents", { doc_type: "Other", file: null })}>
                Add Document
              </Button>
            </Stack>

            <Typography fontWeight={900}>Existing Documents</Typography>

              {existingDocs.length === 0 ? (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  No documents uploaded yet.
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {existingDocs.map((doc) => (
                    <Box
                      key={doc.employee_document_id ?? `${doc.doc_type}-${doc.file_path}`}
                      sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 1 }}
                    >
                      <Typography fontWeight={700}>{doc.doc_type}</Typography>
                      <Typography variant="body2">{doc.file_name}</Typography>

                      {doc.url && (
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ mt: 1 }}
                          component="a"
                          href={doc.url}
                          target="_blank"
                        >
                          View / Download
                        </Button>
                      )}
                    </Box>
                  ))}
                </Stack>
              )}

            <Stack spacing={2}>
              {data.employee_documents.map((d, idx) => (
                <Stack key={idx} direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                  <TextField select label="Document Type" value={d.doc_type} onChange={(e) => updateArrayRow("employee_documents", idx, { doc_type: e.target.value })} fullWidth>
                    {DOC_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </TextField>

                  <Button variant="outlined" component="label" fullWidth sx={{ justifyContent: "flex-start" }}>
                    {d.file ? d.file.name : "Choose File"}
                    <input type="file" hidden onChange={(e) => updateArrayRow("employee_documents", idx, { file: e.target.files?.[0] ?? null })} />
                  </Button>

                  <IconButton onClick={() => removeRow("employee_documents", idx)}><DeleteOutlineOutlinedIcon /></IconButton>
                </Stack>
              ))}
            </Stack>

            <Divider />

            <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ pt: 1 }}>
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={processing} sx={{ backgroundColor: "#0B1C2D", "&:hover": { backgroundColor: "#0F2A44" } }}>
                Update Employee
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </AuthenticatedLayout>
  );
}
