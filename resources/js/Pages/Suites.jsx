import React, { useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

const SUITE_SETS = {
  HR: [
    {
      key: "hr",
      title: "HR SUITE",
      description: "Employee, leave, payroll, onboarding & HR workflows",
      href: "/suite-services?type=hr",
      image: "/images/hr-suite.webp",
    },
  ],
  IT: [
    {
      key: "it",
      title: "IT SUITE",
      description: "Tickets, assets, access, compliance & IT operations",
      href: "/suite-services?type=it",
      image: "/images/it-suite.webp",
    },
  ],
};

function SuiteCard({ item, disabled, onUnauthorized }) {
  const actionProps = disabled
    ? {
        component: "button",
        type: "button",
        onClick: onUnauthorized,
      }
    : {
        component: Link,
        href: item.href,
      };

  return (
    <Card
      elevation={0}
      sx={{
        width: 320,
        maxWidth: "100%",
        borderRadius: 3,
        border: "3px solid #000035",
        transition: "all 0.2s ease",
        opacity: disabled ? 0.55 : 1,
        filter: disabled ? "grayscale(0.2)" : "none",
        "&:hover": disabled
          ? {}
          : {
              transform: "translateY(-4px)",
              boxShadow: "0 8px 24px rgba(11, 28, 45, 0.25)",
              borderColor: "#0F2A44",
            },
      }}
    >
      <CardActionArea
        {...actionProps}
        sx={{
          cursor: disabled ? "not-allowed" : "pointer",
          height: "100%",
          // make button look like normal card click area
          ...(disabled
            ? {
                "&.MuiCardActionArea-root": { display: "block" },
                border: 0,
                background: "transparent",
                textAlign: "inherit",
                width: "100%",
              }
            : {}),
        }}
      >
        <CardContent>
          <Stack spacing={1.75} alignItems="center" textAlign="center">
            <Box
              component="img"
              src={item.image}
              alt={item.title}
              sx={{
                width: "100%",
                height: 130,
                objectFit: "contain",
                borderRadius: 2,
              }}
            />

            <Typography variant="h6" fontWeight={900}>
              {item.title}
            </Typography>

            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {item.description}
            </Typography>

            <Typography
              variant="body2"
              sx={{ fontWeight: 800, color: "#0B1C2D" }}
            >
              {disabled ? "Not authorized" : "Open →"}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function Suites({ auth }) {
  const page = usePage();

  const roleRaw = page.props?.auth?.user?.role ?? auth?.user?.role ?? "";
  const role = String(roleRaw).trim().toLowerCase();

  const deptRaw =
    page.props?.auth?.department ??
    page.props?.auth?.user?.department ??
    auth?.department ??
    auth?.user?.department ??
    "";

  const dept = String(deptRaw).trim().toLowerCase();

  const [toast, setToast] = React.useState({
    open: false,
    message: "",
  });

  const allSuites = useMemo(() => {
    const all = [...(SUITE_SETS.HR || []), ...(SUITE_SETS.IT || [])];
    return all.filter(
      (m, i, arr) => arr.findIndex((x) => x.href === m.href) === i
    );
  }, []);

  // figure out what the user is authorized for
  const authorizedKeys = useMemo(() => {
    if (role === "admin") return new Set(["hr", "it"]);

    const keys = new Set();
    if (dept === "hr" || dept.includes("human")) keys.add("hr");
    if (dept === "it" || dept.includes("information") || dept.includes("tech"))
      keys.add("it");

    return keys;
  }, [role, dept]);

  // show ALL suites, but disable unauthorized ones
  const suites = useMemo(() => allSuites, [allSuites]);

  const handleUnauthorized = () => {
    setToast({ open: true, message: "Not authorized to access this suite." });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Suites" />

      <Container
        maxWidth="false"
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 3,
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Typography
            variant="h5"
            fontWeight={900}
            sx={{ mb: 5, textAlign: "center" }}
          >
            SUITE WORKSPACE
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {suites.map((m) => {
              const disabled = !authorizedKeys.has(m.key);

              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  key={m.title}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <SuiteCard
                    item={m}
                    disabled={disabled}
                    onUnauthorized={handleUnauthorized}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Container>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast({ open: false, message: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="error"
          onClose={() => setToast({ open: false, message: "" })}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </AuthenticatedLayout>
  );
}