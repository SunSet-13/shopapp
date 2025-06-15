-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 15, 2025 at 07:44 PM
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
-- Database: `shopapp_online`
--

-- --------------------------------------------------------

--
-- Table structure for table `news_details`
--

CREATE TABLE `news_details` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `news_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `news_details`
--

INSERT INTO `news_details` (`id`, `product_id`, `news_id`, `created_at`, `updated_at`) VALUES
(1, 18, 1, '2025-06-13 09:50:34', '2025-06-13 09:50:34'),
(2, 23, 1, '2025-06-13 09:50:34', '2025-06-13 09:50:34'),
(3, 28, 1, '2025-06-13 09:50:34', '2025-06-13 09:50:34'),
(5, 33, 1, '2025-06-13 09:50:34', '2025-06-15 17:43:39'),
(6, 18, 2, '2025-06-15 16:28:42', '2025-06-15 16:28:42'),
(7, 23, 2, '2025-06-15 16:28:42', '2025-06-15 16:28:42'),
(8, 28, 2, '2025-06-15 16:28:42', '2025-06-15 16:28:42'),
(9, 33, 2, '2025-06-15 16:28:42', '2025-06-15 16:28:42'),
(10, 38, 2, '2025-06-15 16:28:42', '2025-06-15 16:28:42'),
(11, 15, 1, '2025-06-15 17:33:49', '2025-06-15 17:33:49');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `news_details`
--
ALTER TABLE `news_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `news_id` (`news_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `news_details`
--
ALTER TABLE `news_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `news_details`
--
ALTER TABLE `news_details`
  ADD CONSTRAINT `news_details_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `news_details_ibfk_2` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
