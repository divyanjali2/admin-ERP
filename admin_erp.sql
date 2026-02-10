-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 10, 2026 at 11:25 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `admin_erp`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `department_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`department_id`, `name`) VALUES
(8, 'Administration'),
(7, 'Customer Support'),
(3, 'Finance'),
(1, 'Human Resources'),
(2, 'Information Technology'),
(6, 'Marketing'),
(4, 'Operations'),
(5, 'Sales');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `employee_code` varchar(50) DEFAULT NULL,
  `employment_status` varchar(20) NOT NULL,
  `date_created` datetime NOT NULL,
  `surname` varchar(100) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) NOT NULL,
  `date_of_birth` date NOT NULL,
  `gender` varchar(10) NOT NULL,
  `marital_status` varchar(10) DEFAULT NULL,
  `nationality` varchar(100) DEFAULT NULL,
  `blood_group` varchar(10) DEFAULT NULL,
  `epf_number` varchar(50) DEFAULT NULL,
  `attendance_type` varchar(20) NOT NULL,
  `created_by` char(36) NOT NULL,
  `last_updated_by` char(36) NOT NULL,
  `last_updated_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`employee_id`, `employee_code`, `employment_status`, `date_created`, `surname`, `first_name`, `middle_name`, `last_name`, `date_of_birth`, `gender`, `marital_status`, `nationality`, `blood_group`, `epf_number`, `attendance_type`, `created_by`, `last_updated_by`, `last_updated_date`) VALUES
(3, 'EPF-000003', 'Active', '2026-02-10 06:04:58', 'Divyanjali', 'Navodya', 'Navodya', 'Navodya', '2026-02-10', 'Male', 'Single', 'Sri Lankan', '2', '30', 'Fingerprint', '1', '1', '2026-02-10 06:04:58'),
(12, 'EPF-000012', 'Active', '2026-02-10 10:24:15', 'Divyanjali', 'Navodya', 'Navodya', 'SD', '2026-02-02', 'Male', 'Single', 'Sri Lankan', '23', '23', 'Fingerprint', '1', '1', '2026-02-10 10:24:15');

-- --------------------------------------------------------

--
-- Table structure for table `employee_addresses`
--

CREATE TABLE `employee_addresses` (
  `employee_address_id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `address_type` varchar(20) NOT NULL,
  `address_line_1` varchar(255) NOT NULL,
  `address_line_2` varchar(255) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `country` varchar(100) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `is_current` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee_addresses`
--

INSERT INTO `employee_addresses` (`employee_address_id`, `employee_id`, `address_type`, `address_line_1`, `address_line_2`, `city`, `state`, `country`, `postal_code`, `is_current`) VALUES
(1, 3, 'Residential', '109/1 Andhimulla Katana', NULL, 'Katana', 'ER', 'Sri Lanka', '11500', 1),
(2, NULL, 'Residential', '109/1 Andhimulla Katana', NULL, 'Katana', 'DFDF', 'Sri Lanka', '11500', 1),
(3, 12, 'Residential', '109/1 Andhimulla Katana', NULL, 'Katana', 'WE', 'Sri Lanka', '11500', 1);

-- --------------------------------------------------------

--
-- Table structure for table `employee_bank_accounts`
--

CREATE TABLE `employee_bank_accounts` (
  `bank_account_id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `bank_name` varchar(150) NOT NULL,
  `bank_branch_name` varchar(150) NOT NULL,
  `bank_account_number` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee_bank_accounts`
--

INSERT INTO `employee_bank_accounts` (`bank_account_id`, `employee_id`, `bank_name`, `bank_branch_name`, `bank_account_number`) VALUES
(6, NULL, 'SDASD', '23QW', 'ADADS'),
(8, 12, 'WE', 'WE', 'WE');

-- --------------------------------------------------------

--
-- Table structure for table `employee_compensation`
--

CREATE TABLE `employee_compensation` (
  `comp_id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `salary_currency` char(3) NOT NULL,
  `pay_frequency` varchar(10) NOT NULL,
  `effective_from` date NOT NULL,
  `effective_to` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee_compensation`
--

INSERT INTO `employee_compensation` (`comp_id`, `employee_id`, `salary_currency`, `pay_frequency`, `effective_from`, `effective_to`) VALUES
(5, NULL, 'LKR', 'Monthly', '2026-02-10', '2026-02-14'),
(7, 12, 'LKR', 'Monthly', '2026-02-03', '2026-02-06');

-- --------------------------------------------------------

--
-- Table structure for table `employee_compensation_components`
--

CREATE TABLE `employee_compensation_components` (
  `component_id` bigint(20) UNSIGNED NOT NULL,
  `comp_id` bigint(20) UNSIGNED NOT NULL,
  `component_type` varchar(10) NOT NULL,
  `component_name` varchar(120) NOT NULL,
  `amount` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee_compensation_components`
--

INSERT INTO `employee_compensation_components` (`component_id`, `comp_id`, `component_type`, `component_name`, `amount`) VALUES
(3, 5, 'Basic', 'Basic Salary', 2323.00),
(5, 7, 'Basic', 'Basic Salary', 2000.00);

-- --------------------------------------------------------

--
-- Table structure for table `employee_contacts`
--

CREATE TABLE `employee_contacts` (
  `contact_id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `contact_type` varchar(30) NOT NULL,
  `contact_value` varchar(255) NOT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee_contacts`
--

INSERT INTO `employee_contacts` (`contact_id`, `employee_id`, `contact_type`, `contact_value`, `is_primary`) VALUES
(1, 3, 'Work_Email', '0761258552', 1),
(2, 3, 'Phone', '0761258552', 1),
(3, NULL, 'Work_Email', 'ASDDS', 1),
(4, NULL, 'Phone', 'ADSASD', 1),
(5, 12, 'Work_Email', 'WE', 1),
(6, 12, 'Phone', 'WE', 1);

-- --------------------------------------------------------

--
-- Table structure for table `employee_documents`
--

CREATE TABLE `employee_documents` (
  `employee_document_id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `doc_type` varchar(30) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `file_size_bytes` bigint(20) UNSIGNED DEFAULT NULL,
  `uploaded_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee_documents`
--

INSERT INTO `employee_documents` (`employee_document_id`, `employee_id`, `doc_type`, `file_name`, `file_path`, `mime_type`, `file_size_bytes`, `uploaded_at`) VALUES
(1, NULL, 'ID_Proof', 'Name', 'employees/10/documents/wMB4ulQPojVrykOwbQr9aPWLR9Eh9Wx3if0xTGk1.jpg', 'image/jpeg', 80832, '2026-02-10 09:27:57'),
(2, 12, 'ID_Proof', 'ID_Proof', 'employees/12/documents/4yrHSZPUsumJBnee8RS4qgAyBe9ZrMcxTmAjZFpa.jpg', 'image/jpeg', 107682, '2026-02-10 10:24:15');

-- --------------------------------------------------------

--
-- Table structure for table `employee_emergency_contacts`
--

CREATE TABLE `employee_emergency_contacts` (
  `emergency_contact_id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `relationship` varchar(100) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee_emergency_contacts`
--

INSERT INTO `employee_emergency_contacts` (`emergency_contact_id`, `employee_id`, `name`, `relationship`, `phone`, `address`) VALUES
(6, NULL, 'Navodya Divyanjali', 'ASD', '334234', NULL),
(8, 12, 'Navodya Divyanjali', 'WE', 'WE', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employee_experience`
--

CREATE TABLE `employee_experience` (
  `experience_id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `previous_employer` varchar(150) NOT NULL,
  `total_years` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee_experience`
--

INSERT INTO `employee_experience` (`experience_id`, `employee_id`, `previous_employer`, `total_years`) VALUES
(6, NULL, 'ERERER', 3.00),
(8, 12, 'WE', 5.00);

-- --------------------------------------------------------

--
-- Table structure for table `employee_job`
--

CREATE TABLE `employee_job` (
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `department_id` bigint(20) UNSIGNED NOT NULL,
  `job_title_id` bigint(20) UNSIGNED NOT NULL,
  `employment_type` varchar(20) NOT NULL,
  `employment_level` varchar(20) NOT NULL,
  `date_of_joining` date NOT NULL,
  `probation_end_date` date DEFAULT NULL,
  `reporting_manager_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee_job`
--

INSERT INTO `employee_job` (`employee_id`, `department_id`, `job_title_id`, `employment_type`, `employment_level`, `date_of_joining`, `probation_end_date`, `reporting_manager_id`) VALUES
(3, 1, 13, 'Full-Time', 'Probation', '2026-02-10', '2026-02-14', NULL),
(12, 3, 13, 'Full-Time', 'Probation', '2026-02-02', '2026-02-07', 3);

-- --------------------------------------------------------

--
-- Table structure for table `employee_leave_balances`
--

CREATE TABLE `employee_leave_balances` (
  `leave_balance_id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `leave_policy_id` bigint(20) UNSIGNED NOT NULL,
  `total_taken` decimal(5,2) NOT NULL DEFAULT 0.00,
  `remaining` decimal(5,2) NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_yearly_leave_balance`
--

CREATE TABLE `employee_yearly_leave_balance` (
  `id` int(11) NOT NULL,
  `employee_id` varchar(50) NOT NULL,
  `leave_policy_id` int(11) NOT NULL,
  `leave_entitlement` decimal(10,2) NOT NULL DEFAULT 0.00,
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_yearly_leave_balance`
--

INSERT INTO `employee_yearly_leave_balance` (`id`, `employee_id`, `leave_policy_id`, `leave_entitlement`, `updated_at`) VALUES
(2, '12', 7, 27.00, '2026-02-10 15:54:15');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_titles`
--

CREATE TABLE `job_titles` (
  `job_title_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `job_titles`
--

INSERT INTO `job_titles` (`job_title_id`, `name`) VALUES
(9, 'Accountant'),
(10, 'Finance Manager'),
(2, 'HR Executive'),
(1, 'HR Manager'),
(13, 'Marketing Executive'),
(11, 'Operations Manager'),
(6, 'Project Manager'),
(7, 'QA Engineer'),
(12, 'Sales Executive'),
(4, 'Senior Software Engineer'),
(3, 'Software Engineer'),
(8, 'System Administrator'),
(5, 'Team Lead');

-- --------------------------------------------------------

--
-- Table structure for table `leave_policies`
--

CREATE TABLE `leave_policies` (
  `leave_policy_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `leave_policies`
--

INSERT INTO `leave_policies` (`leave_policy_id`, `name`) VALUES
(1, 'Annual Leave'),
(3, 'Casual Leave'),
(7, 'Compassionate Leave'),
(4, 'Maternity Leave'),
(6, 'No Pay Leave'),
(5, 'Paternity Leave'),
(2, 'Sick Leave'),
(8, 'Study Leave');

-- --------------------------------------------------------

--
-- Table structure for table `leave_requests`
--

CREATE TABLE `leave_requests` (
  `leave_request_id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `leave_policy_id` bigint(20) UNSIGNED NOT NULL,
  `leave_start_date` date NOT NULL,
  `leave_end_date` date NOT NULL,
  `number_of_days` decimal(5,2) NOT NULL,
  `reason` varchar(500) NOT NULL,
  `oversee_member_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_special_request` tinyint(1) NOT NULL DEFAULT 0,
  `address` varchar(255) DEFAULT NULL,
  `status` varchar(30) NOT NULL,
  `requested_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leave_request_documents`
--

CREATE TABLE `leave_request_documents` (
  `leave_request_document_id` bigint(20) UNSIGNED NOT NULL,
  `leave_request_id` bigint(20) UNSIGNED NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `file_size_bytes` bigint(20) UNSIGNED DEFAULT NULL,
  `uploaded_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(20, '0001_01_01_000001_create_cache_table', 1),
(21, '0001_01_01_000002_create_jobs_table', 1),
(22, '2026_02_09_094756_create_departments_table', 1),
(23, '2026_02_09_094831_create_job_titles_table', 1),
(24, '2026_02_09_094846_create_leave_policies_table', 1),
(25, '2026_02_09_094903_create_employees_table', 1),
(26, '2026_02_09_094918_create_employee_jobs_table', 1),
(27, '2026_02_09_094935_create_employee_contacts_table', 1),
(28, '2026_02_09_094949_create_employee_addresses_table', 1),
(29, '2026_02_09_095006_create_employee_emergency_contacts_table', 1),
(30, '2026_02_09_095023_create_employee_compensation_table', 1),
(31, '2026_02_09_095044_create_employee_compensation_components_table', 1),
(32, '2026_02_09_095135_create_employee_bank_accounts_table', 1),
(33, '2026_02_09_095152_create_employee_yearly_leave_balances_table', 1),
(34, '2026_02_09_095204_create_employee_documents_table', 1),
(35, '2026_02_09_095232_create_employee_experiences_table', 1),
(36, '2026_02_09_095300_create_leave_requests_table', 1),
(37, '2026_02_09_095312_create_leave_request_documents_table', 1),
(38, '2026_02_09_095322_create_employee_leave_balances_table', 1),
(39, '2026_03_09_094903_create_users_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('pvlfLvm2lFPaUuhE340nLBldf1UNpOWRlVQII3bM', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiN2NJNnJXVzdhRVZIUENEN1ZQYUhEZ2dIY1g2MW8yN2FJUnBaOU0yRSI7czozOiJ1cmwiO2E6MDp7fXM6OToiX3ByZXZpb3VzIjthOjI6e3M6MzoidXJsIjtzOjM2OiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvaHJtcy9lbXBsb3llZXMiO3M6NToicm91dGUiO3M6MjA6ImhybXMuZW1wbG95ZWVzLmluZGV4Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTt9', 1770719090);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `employee_id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Admin User', 'admin@example.com', '2026-02-10 00:25:54', '$2y$12$b.9fCfURgXqc8X7AcnM6uOle1Ox5IbzYtgYlxNatLRXVhxdDUtQNC', '1yCxAuZ5fh', '2026-02-10 00:25:55', '2026-02-10 00:25:55'),
(4, NULL, 'Navodya Navodya', 'navodyadivyanjali2@gmail.com', NULL, '$2y$12$T521ObnBBi35.a2Vzp4/B.E6Mr0zFZFvLeH0wdIGdgsJG76Mecrvm', NULL, '2026-02-10 00:34:58', '2026-02-10 00:34:58'),
(11, NULL, 'Navodya Navodya', 'navodyadivyanSDSDjali2@gmail.com', NULL, '$2y$12$QDuHV8VPQCgAzy.2Yl7Hy.KEKCA7TFOmfClnc3KYktloxFj9nyy8m', NULL, '2026-02-10 03:57:57', '2026-02-10 03:57:57'),
(13, NULL, 'Navodya SD', 'navodyaWEWEdivyanjali2@gmail.com', NULL, '$2y$12$Agus2eM4hVpfjWhYGDWHmOkKOMdkxyF4v1/VzNFCyYxrGfjS7BUgS', NULL, '2026-02-10 04:54:15', '2026-02-10 04:54:15');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`department_id`),
  ADD UNIQUE KEY `departments_name_unique` (`name`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`employee_id`),
  ADD UNIQUE KEY `uq_epf_number` (`epf_number`),
  ADD UNIQUE KEY `employees_employee_code_unique` (`employee_code`),
  ADD KEY `idx_emp_name` (`last_name`,`first_name`),
  ADD KEY `idx_emp_status` (`employment_status`);

--
-- Indexes for table `employee_addresses`
--
ALTER TABLE `employee_addresses`
  ADD PRIMARY KEY (`employee_address_id`),
  ADD KEY `idx_addr_emp` (`employee_id`);

--
-- Indexes for table `employee_bank_accounts`
--
ALTER TABLE `employee_bank_accounts`
  ADD PRIMARY KEY (`bank_account_id`),
  ADD KEY `idx_bank_emp` (`employee_id`);

--
-- Indexes for table `employee_compensation`
--
ALTER TABLE `employee_compensation`
  ADD PRIMARY KEY (`comp_id`),
  ADD KEY `idx_comp_emp` (`employee_id`),
  ADD KEY `idx_comp_effective` (`employee_id`,`effective_from`);

--
-- Indexes for table `employee_compensation_components`
--
ALTER TABLE `employee_compensation_components`
  ADD PRIMARY KEY (`component_id`),
  ADD KEY `idx_comp_comp` (`comp_id`);

--
-- Indexes for table `employee_contacts`
--
ALTER TABLE `employee_contacts`
  ADD PRIMARY KEY (`contact_id`),
  ADD UNIQUE KEY `uq_work_email_global` (`contact_type`,`contact_value`),
  ADD UNIQUE KEY `uq_emp_contact` (`employee_id`,`contact_type`,`contact_value`),
  ADD KEY `idx_contact_emp` (`employee_id`);

--
-- Indexes for table `employee_documents`
--
ALTER TABLE `employee_documents`
  ADD PRIMARY KEY (`employee_document_id`),
  ADD KEY `idx_doc_emp` (`employee_id`),
  ADD KEY `idx_doc_type` (`employee_id`,`doc_type`);

--
-- Indexes for table `employee_emergency_contacts`
--
ALTER TABLE `employee_emergency_contacts`
  ADD PRIMARY KEY (`emergency_contact_id`),
  ADD KEY `idx_emg_emp` (`employee_id`);

--
-- Indexes for table `employee_experience`
--
ALTER TABLE `employee_experience`
  ADD PRIMARY KEY (`experience_id`),
  ADD KEY `idx_exp_emp` (`employee_id`);

--
-- Indexes for table `employee_job`
--
ALTER TABLE `employee_job`
  ADD PRIMARY KEY (`employee_id`),
  ADD KEY `employee_job_department_id_index` (`department_id`),
  ADD KEY `employee_job_job_title_id_index` (`job_title_id`),
  ADD KEY `employee_job_reporting_manager_id_index` (`reporting_manager_id`);

--
-- Indexes for table `employee_leave_balances`
--
ALTER TABLE `employee_leave_balances`
  ADD PRIMARY KEY (`leave_balance_id`),
  ADD UNIQUE KEY `uq_lb_emp_policy` (`employee_id`,`leave_policy_id`),
  ADD KEY `idx_lb_employee` (`employee_id`),
  ADD KEY `idx_lb_policy` (`leave_policy_id`);

--
-- Indexes for table `employee_yearly_leave_balance`
--
ALTER TABLE `employee_yearly_leave_balance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_emp_policy` (`employee_id`,`leave_policy_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `job_titles`
--
ALTER TABLE `job_titles`
  ADD PRIMARY KEY (`job_title_id`),
  ADD UNIQUE KEY `job_titles_name_unique` (`name`);

--
-- Indexes for table `leave_policies`
--
ALTER TABLE `leave_policies`
  ADD PRIMARY KEY (`leave_policy_id`),
  ADD UNIQUE KEY `leave_policies_name_unique` (`name`);

--
-- Indexes for table `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD PRIMARY KEY (`leave_request_id`),
  ADD KEY `idx_leave_emp_start` (`employee_id`,`leave_start_date`),
  ADD KEY `idx_leave_policy` (`leave_policy_id`),
  ADD KEY `idx_leave_status` (`status`),
  ADD KEY `idx_leave_oversee` (`oversee_member_id`);

--
-- Indexes for table `leave_request_documents`
--
ALTER TABLE `leave_request_documents`
  ADD PRIMARY KEY (`leave_request_document_id`),
  ADD KEY `idx_leave_req_docs` (`leave_request_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_employee_id_unique` (`employee_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `department_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `employee_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `employee_addresses`
--
ALTER TABLE `employee_addresses`
  MODIFY `employee_address_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `employee_bank_accounts`
--
ALTER TABLE `employee_bank_accounts`
  MODIFY `bank_account_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `employee_compensation`
--
ALTER TABLE `employee_compensation`
  MODIFY `comp_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `employee_compensation_components`
--
ALTER TABLE `employee_compensation_components`
  MODIFY `component_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `employee_contacts`
--
ALTER TABLE `employee_contacts`
  MODIFY `contact_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `employee_documents`
--
ALTER TABLE `employee_documents`
  MODIFY `employee_document_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `employee_emergency_contacts`
--
ALTER TABLE `employee_emergency_contacts`
  MODIFY `emergency_contact_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `employee_experience`
--
ALTER TABLE `employee_experience`
  MODIFY `experience_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `employee_leave_balances`
--
ALTER TABLE `employee_leave_balances`
  MODIFY `leave_balance_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employee_yearly_leave_balance`
--
ALTER TABLE `employee_yearly_leave_balance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_titles`
--
ALTER TABLE `job_titles`
  MODIFY `job_title_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `leave_policies`
--
ALTER TABLE `leave_policies`
  MODIFY `leave_policy_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `leave_requests`
--
ALTER TABLE `leave_requests`
  MODIFY `leave_request_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leave_request_documents`
--
ALTER TABLE `leave_request_documents`
  MODIFY `leave_request_document_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `employee_addresses`
--
ALTER TABLE `employee_addresses`
  ADD CONSTRAINT `employee_addresses_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL;

--
-- Constraints for table `employee_bank_accounts`
--
ALTER TABLE `employee_bank_accounts`
  ADD CONSTRAINT `employee_bank_accounts_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL;

--
-- Constraints for table `employee_compensation`
--
ALTER TABLE `employee_compensation`
  ADD CONSTRAINT `employee_compensation_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL;

--
-- Constraints for table `employee_compensation_components`
--
ALTER TABLE `employee_compensation_components`
  ADD CONSTRAINT `employee_compensation_components_comp_id_foreign` FOREIGN KEY (`comp_id`) REFERENCES `employee_compensation` (`comp_id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_contacts`
--
ALTER TABLE `employee_contacts`
  ADD CONSTRAINT `employee_contacts_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL;

--
-- Constraints for table `employee_documents`
--
ALTER TABLE `employee_documents`
  ADD CONSTRAINT `employee_documents_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL;

--
-- Constraints for table `employee_emergency_contacts`
--
ALTER TABLE `employee_emergency_contacts`
  ADD CONSTRAINT `employee_emergency_contacts_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL;

--
-- Constraints for table `employee_experience`
--
ALTER TABLE `employee_experience`
  ADD CONSTRAINT `employee_experience_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL;

--
-- Constraints for table `employee_job`
--
ALTER TABLE `employee_job`
  ADD CONSTRAINT `employee_job_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`),
  ADD CONSTRAINT `employee_job_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `employee_job_job_title_id_foreign` FOREIGN KEY (`job_title_id`) REFERENCES `job_titles` (`job_title_id`),
  ADD CONSTRAINT `employee_job_reporting_manager_id_foreign` FOREIGN KEY (`reporting_manager_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL;

--
-- Constraints for table `employee_leave_balances`
--
ALTER TABLE `employee_leave_balances`
  ADD CONSTRAINT `employee_leave_balances_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `employee_leave_balances_leave_policy_id_foreign` FOREIGN KEY (`leave_policy_id`) REFERENCES `leave_policies` (`leave_policy_id`);

--
-- Constraints for table `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD CONSTRAINT `leave_requests_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `leave_requests_leave_policy_id_foreign` FOREIGN KEY (`leave_policy_id`) REFERENCES `leave_policies` (`leave_policy_id`),
  ADD CONSTRAINT `leave_requests_oversee_member_id_foreign` FOREIGN KEY (`oversee_member_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL;

--
-- Constraints for table `leave_request_documents`
--
ALTER TABLE `leave_request_documents`
  ADD CONSTRAINT `leave_request_documents_leave_request_id_foreign` FOREIGN KEY (`leave_request_id`) REFERENCES `leave_requests` (`leave_request_id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
