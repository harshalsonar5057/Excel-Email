-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 30, 2023 at 09:03 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chatting_calling_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `chatuserconversation`
--

CREATE TABLE `chatuserconversation` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `chatUserId` int(11) NOT NULL,
  `ConversationId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `chatusers`
--

CREATE TABLE `chatusers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `conversations`
--

CREATE TABLE `conversations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `text` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `ConversationId` int(11) DEFAULT NULL,
  `chatUserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullName` varchar(200) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  `otp` int(200) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `isVerify` tinyint(1) DEFAULT 0,
  `token` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullName`, `image`, `email`, `otp`, `mobile`, `isVerify`, `token`, `created_at`, `updated_at`) VALUES
(2, 'Aniket', NULL, 'aniket@gmail.com', 6574, '+917600431201', 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvdHAiOjY1NzQsInVwZGF0ZWRfYXQiOiIyMDIzLTAzLTMwIDEyOjE1OjU4IiwiY3JlYXRlZF9hdCI6IjIwMjMtMDMtMzAgMTI6MTU6MzgiLCJzdGF0dXMiOiIiLCJpYXQiOjE2ODAxNTg3ODZ9.z6-et_YYU2W_alx4xozpUZVuIxM_oDOUj5P1DT4v_CU', '2023-03-30 12:15:38', '2023-03-30 12:17:02'),
(3, NULL, NULL, NULL, 1120, '+917600431250', 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvdHAiOjExMjAsInVwZGF0ZWRfYXQiOiIyMDIzLTAzLTMwIDEyOjE4OjM3IiwiY3JlYXRlZF9hdCI6IjIwMjMtMDMtMzAgMTI6MTg6MzQiLCJzdGF0dXMiOiIiLCJpYXQiOjE2ODAxNTg5MzJ9.trjfwavftnT-XBDNqCiiLEqeK1octIUAygWFgaAA8iE', '2023-03-30 12:18:34', '2023-03-30 12:18:52'),
(4, 'Aniket', NULL, '', 9235, '+917600431200', 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvdHAiOjkyMzUsInVwZGF0ZWRfYXQiOiIyMDIzLTAzLTMwIDEyOjI2OjUwIiwiY3JlYXRlZF9hdCI6IjIwMjMtMDMtMzAgMTI6MjY6NDgiLCJzdGF0dXMiOiIiLCJpYXQiOjE2ODAxNTk0Mjl9.2Iza6VWlWpVju7Wm9GP2iS_F2_nSH5BvfUCkVhXemfk', '2023-03-30 12:26:48', '2023-03-30 12:30:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chatuserconversation`
--
ALTER TABLE `chatuserconversation`
  ADD PRIMARY KEY (`chatUserId`,`ConversationId`),
  ADD KEY `ConversationId` (`ConversationId`);

--
-- Indexes for table `chatusers`
--
ALTER TABLE `chatusers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ConversationId` (`ConversationId`),
  ADD KEY `chatUserId` (`chatUserId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chatusers`
--
ALTER TABLE `chatusers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chatuserconversation`
--
ALTER TABLE `chatuserconversation`
  ADD CONSTRAINT `chatuserconversation_ibfk_1` FOREIGN KEY (`chatUserId`) REFERENCES `chatusers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `chatuserconversation_ibfk_2` FOREIGN KEY (`ConversationId`) REFERENCES `conversations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`ConversationId`) REFERENCES `conversations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`chatUserId`) REFERENCES `chatusers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
