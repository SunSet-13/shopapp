-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 11, 2025 at 11:22 AM
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
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` text DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `banner_details`
--

CREATE TABLE `banner_details` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `banner_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `image`, `created_at`, `updated_at`) VALUES
(1, 'SamSung', NULL, '2025-06-06 11:45:19', '2025-06-06 11:45:19'),
(3, 'Xiaomi', NULL, '2025-06-06 11:46:33', '2025-06-06 11:46:33'),
(4, 'Apple', NULL, '2025-06-06 11:46:51', '2025-06-06 11:46:51'),
(5, 'LG', NULL, '2025-06-06 11:47:09', '2025-06-06 11:47:09'),
(7, 'LGB', NULL, '2025-06-11 04:59:57', '2025-06-11 04:59:57'),
(9, 'Sony', NULL, '2025-06-11 07:33:53', '2025-06-11 07:33:53'),
(10, 'Nokia', NULL, '2025-06-11 07:34:03', '2025-06-11 07:34:03'),
(11, 'Google', NULL, '2025-06-11 07:35:19', '2025-06-11 07:35:19'),
(12, 'OnePlus', NULL, '2025-06-11 07:35:37', '2025-06-11 07:35:37'),
(13, 'Huawei', NULL, '2025-06-11 07:36:35', '2025-06-11 07:36:35');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `image`, `created_at`, `updated_at`) VALUES
(1, 'Đồ công nghệ', NULL, '2025-06-06 14:32:32', '2025-06-06 14:32:32'),
(2, 'Đồ gia dụng', NULL, '2025-06-06 14:32:45', '2025-06-06 14:32:45'),
(3, 'Thời trang', NULL, '2025-06-06 14:33:25', '2025-06-06 14:33:25'),
(4, 'Điện thoại thông minh', NULL, '2025-06-06 14:33:39', '2025-06-06 14:33:39'),
(5, 'Máy tính bảng', NULL, '2025-06-06 14:34:03', '2025-06-06 14:34:03');

-- --------------------------------------------------------

--
-- Table structure for table `feedbacks`
--

CREATE TABLE `feedbacks` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `star` int(11) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `content` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` int(11) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `total` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `price` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` int(11) NOT NULL DEFAULT 0,
  `oldprice` int(11) DEFAULT 0,
  `image` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `specification` text DEFAULT NULL,
  `buyturn` int(11) DEFAULT 0,
  `quantity` int(11) DEFAULT 0,
  `brand_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `oldprice`, `image`, `description`, `specification`, `buyturn`, `quantity`, `brand_id`, `category_id`, `created_at`, `updated_at`) VALUES
(9, 'Galaxy S22 Ultra', 24990000, 27990000, '', 'Galaxy S22 Ultra với bút S Pen tích hợp, hiệu năng đột phá và khả năng chụp ảnh chuyên nghiệp, là sự kết hợp hoàn hảo giữa điện thoại và máy tính bảng trong một thiết kế sang trọng.', 'Màn hình Dynamic AMOLED 2X 6.8 inch, độ phân giải 3200x1440; Chipset Exynos 2200; RAM 12GB; Bộ nhớ trong 256GB; Camera sau: chính 108MP, ultra-wide 12MP, telephoto 10MP và periscope 10MP; Camera trước: 40MP; Pin 5000 mAh với sạc siêu nhanh.', 320, 85, 1, 3, '2025-06-09 08:27:23', '2025-06-09 08:27:23'),
(15, 'Galaxy S22 Ultra1', 24990000, 27990000, '', 'Galaxy S22 Ultra với bút S Pen tích hợp, hiệu năng đột phá và khả năng chụp ảnh chuyên nghiệp, là sự kết hợp hoàn hảo giữa điện thoại và máy tính bảng trong một thiết kế sang trọng.', 'Màn hình Dynamic AMOLED 2X 6.8 inch, độ phân giải 3200x1440; Chipset Exynos 2200; RAM 12GB; Bộ nhớ trong 256GB; Camera sau: chính 108MP, ultra-wide 12MP, telephoto 10MP và periscope 10MP; Camera trước: 40MP; Pin 5000 mAh với sạc siêu nhanh.', 320, 85, 1, 3, '2025-06-09 08:58:03', '2025-06-09 08:58:03'),
(18, 'Galaxy S22 Ultra2', 24990000, 27990000, '', 'Galaxy S22 Ultra với bút S Pen tích hợp, hiệu năng đột phá và khả năng chụp ảnh chuyên nghiệp, là sự kết hợp hoàn hảo giữa điện thoại và máy tính bảng trong một thiết kế sang trọng.', 'Màn hình Dynamic AMOLED 2X 6.8 inch, độ phân giải 3200x1440; Chipset Exynos 2200; RAM 12GB; Bộ nhớ trong 256GB; Camera sau: chính 108MP, ultra-wide 12MP, telephoto 10MP và periscope 10MP; Camera trước: 40MP; Pin 5000 mAh với sạc siêu nhanh.', 320, 85, 1, 3, '2025-06-09 09:16:46', '2025-06-09 09:16:46'),
(20, 'Galaxy S22 Ultra3', 24990000, 27990000, '', 'Galaxy S22 Ultra với bút S Pen tích hợp, hiệu năng đột phá và khả năng chụp ảnh chuyên nghiệp, là sự kết hợp hoàn hảo giữa điện thoại và máy tính bảng trong một thiết kế sang trọng.', 'Màn hình Dynamic AMOLED 2X 6.8 inch, độ phân giải 3200x1440; Chipset Exynos 2200; RAM 12GB; Bộ nhớ trong 256GB; Camera sau: chính 108MP, ultra-wide 12MP, telephoto 10MP và periscope 10MP; Camera trước: 40MP; Pin 5000 mAh với sạc siêu nhanh.', 320, 85, 1, 3, '2025-06-09 09:17:57', '2025-06-09 09:17:57'),
(23, 'Xiaomi 13 Pro', 18990000, 20990000, '', 'Xiaomi 13 Pro với thiết kế cao cấp và camera Leica mang lại trải nghiệm hình ảnh đỉnh cao.', 'Màn hình AMOLED 6.73 inch 3200x1440; Snapdragon 8 Gen 2; RAM 12GB; ROM 256GB; Camera sau 50MP + 50MP + 50MP; Trước 32MP; Pin 4820mAh, sạc nhanh 120W.', 215, 50, 3, 3, '2025-06-11 08:10:42', '2025-06-11 08:10:42'),
(24, 'iPhone 14 Pro Max', 30990000, 33990000, '', 'iPhone 14 Pro Max mang đến Dynamic Island, chip A16 Bionic và camera chuyên nghiệp.', 'Màn hình Super Retina XDR 6.7 inch; A16 Bionic; RAM 6GB; ROM 256GB; Camera sau 48MP + 12MP + 12MP; Trước 12MP; Pin 4323mAh.', 430, 40, 4, 3, '2025-06-11 08:10:56', '2025-06-11 08:10:56'),
(25, 'LG Velvet 5G', 10990000, 12990000, '', 'LG Velvet 5G có thiết kế mỏng nhẹ, sang trọng và hiệu năng tốt.', 'P-OLED 6.8 inch 2460x1080; Snapdragon 765G; RAM 6GB; ROM 128GB; Camera sau 48MP + 8MP + 5MP; Trước 16MP; Pin 4300mAh.', 102, 25, 5, 3, '2025-06-11 08:11:08', '2025-06-11 08:11:08'),
(26, 'LGB Aura 11', 8990000, 9990000, '', 'LGB Aura 11 đem lại hiệu suất ổn định và thiết kế hiện đại.', 'IPS LCD 6.5 inch; MediaTek Helio G95; RAM 8GB; ROM 128GB; Camera sau 64MP + 8MP + 2MP; Trước 16MP; Pin 5000mAh.', 88, 30, 7, 3, '2025-06-11 08:11:20', '2025-06-11 08:11:20'),
(27, 'Galaxy Z Fold4', 44990000, 47990000, '', 'Galaxy Z Fold4 mở ra kỷ nguyên điện thoại gập thông minh với hiệu suất cao và đa nhiệm tốt.', 'Màn hình chính 7.6 inch QXGA+; Snapdragon 8+ Gen 1; RAM 12GB; ROM 512GB; Camera 50MP + 12MP + 10MP; Trước 10MP + 4MP; Pin 4400mAh.', 160, 20, 1, 3, '2025-06-11 08:11:32', '2025-06-11 08:11:32'),
(28, 'Xiaomi Redmi Note 12', 5290000, 5990000, '', 'Redmi Note 12 với màn hình AMOLED 120Hz và pin khủng.', 'AMOLED 6.67 inch FHD+; Snapdragon 685; RAM 8GB; ROM 128GB; Camera sau 50MP + 8MP + 2MP; Trước 13MP; Pin 5000mAh.', 198, 100, 3, 3, '2025-06-11 08:11:42', '2025-06-11 08:11:42'),
(29, 'iPhone SE 2022', 11990000, 12990000, '', 'iPhone SE 2022 nhỏ gọn, mạnh mẽ với chip A15 Bionic.', 'Retina HD 4.7 inch; A15 Bionic; RAM 4GB; ROM 128GB; Camera sau 12MP; Trước 7MP; Pin 2018mAh.', 122, 60, 4, 3, '2025-06-11 08:11:52', '2025-06-11 08:11:52'),
(30, 'LG Wing 5G', 15990000, 17990000, '', 'LG Wing với thiết kế xoay độc đáo, trải nghiệm đa nhiệm sáng tạo.', 'P-OLED 6.8 inch + G-OLED 3.9 inch; Snapdragon 765G; RAM 8GB; ROM 128GB; Camera 64MP + 13MP + 12MP; Trước 32MP; Pin 4000mAh.', 75, 15, 5, 3, '2025-06-11 08:12:02', '2025-06-11 08:12:02'),
(31, 'LGB Star X', 7590000, 8990000, '', 'LGB Star X với chip tiết kiệm điện năng và thời lượng pin ấn tượng.', 'IPS LCD 6.6 inch; Unisoc T616; RAM 6GB; ROM 128GB; Camera sau 50MP; Trước 8MP; Pin 6000mAh.', 51, 40, 7, 3, '2025-06-11 08:12:13', '2025-06-11 08:12:13'),
(32, 'Galaxy A54', 9490000, 10490000, '', 'Galaxy A54 mang đến màn hình Super AMOLED cùng khả năng chụp ảnh tốt.', 'Super AMOLED 6.4 inch; Exynos 1380; RAM 8GB; ROM 128GB; Camera 50MP + 12MP + 5MP; Trước 32MP; Pin 5000mAh.', 170, 90, 1, 3, '2025-06-11 08:12:23', '2025-06-11 08:12:23'),
(33, 'Xiaomi POCO F5', 8990000, 9990000, '', 'POCO F5 mang lại hiệu năng mạnh mẽ trong tầm giá nhờ chip Snapdragon 7+ Gen 2.', 'AMOLED 6.67 inch; Snapdragon 7+ Gen 2; RAM 8GB; ROM 256GB; Camera sau 64MP + 8MP + 2MP; Trước 16MP; Pin 5000mAh.', 136, 85, 3, 3, '2025-06-11 08:12:33', '2025-06-11 08:12:33'),
(34, 'iPhone 13', 21990000, 23990000, '', 'iPhone 13 với thiết kế cân đối, chip A15 và camera cải tiến.', 'Super Retina XDR 6.1 inch; A15 Bionic; RAM 4GB; ROM 128GB; Camera 12MP + 12MP; Trước 12MP; Pin 3240mAh.', 310, 70, 4, 3, '2025-06-11 08:12:43', '2025-06-11 08:12:43'),
(35, 'LG Q92', 7490000, 8490000, '', 'LG Q92 5G hỗ trợ kết nối nhanh, thiết kế bền bỉ.', 'IPS LCD 6.67 inch; Snapdragon 765G; RAM 6GB; ROM 128GB; Camera 48MP + 8MP + 5MP + 2MP; Trước 32MP; Pin 4000mAh.', 84, 20, 5, 3, '2025-06-11 08:12:52', '2025-06-11 08:12:52'),
(36, 'LGB Note Z', 6790000, 7890000, '', 'LGB Note Z nổi bật với màn hình lớn, pin trâu, hỗ trợ học tập và giải trí tốt.', 'LCD 6.9 inch; Helio G85; RAM 6GB; ROM 128GB; Camera 50MP + 2MP; Trước 8MP; Pin 6000mAh.', 65, 25, 7, 3, '2025-06-11 08:13:03', '2025-06-11 08:13:03'),
(37, 'Galaxy S21 FE', 12990000, 14990000, '', 'Galaxy S21 FE cân bằng giữa hiệu năng và giá thành, dành cho người trẻ.', 'Dynamic AMOLED 2X 6.4 inch; Exynos 2100; RAM 8GB; ROM 128GB; Camera 12MP + 12MP + 8MP; Trước 32MP; Pin 4500mAh.', 248, 35, 1, 3, '2025-06-11 08:13:14', '2025-06-11 08:13:14'),
(38, 'Xiaomi 12T Pro', 13990000, 15990000, '', 'Xiaomi 12T Pro sở hữu camera 200MP cùng hiệu năng khủng từ Snapdragon 8+ Gen 1.', 'AMOLED 6.67 inch; Snapdragon 8+ Gen 1; RAM 8GB; ROM 256GB; Camera 200MP + 8MP + 2MP; Trước 20MP; Pin 5000mAh.', 199, 55, 3, 3, '2025-06-11 08:13:25', '2025-06-11 08:13:25'),
(39, 'iPhone 15', 25990000, 28990000, '', 'iPhone 15 với cổng USB-C, chip A16 Bionic và camera nâng cấp.', 'Super Retina XDR 6.1 inch; A16 Bionic; RAM 6GB; ROM 128GB; Camera 48MP + 12MP; Trước 12MP; Pin 3349mAh.', 325, 65, 4, 3, '2025-06-11 08:13:40', '2025-06-11 08:13:40');

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20250603051825-create-user.js'),
('20250603074818-create-category.js'),
('20250603075844-create-brand.js'),
('20250603080143-create-news.js'),
('20250603080250-create-banner.js'),
('20250603095224-create-order.js'),
('20250603164224-create-product.js'),
('20250603165831-create-order-detail.js'),
('20250603170721-create-banner-detail.js'),
('20250603180926-create-feedback.js'),
('20250603181813-create-news-detail.js');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `role` int(11) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `phone` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `banner_details`
--
ALTER TABLE `banner_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `banner_id` (`banner_id`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `news_details`
--
ALTER TABLE `news_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `news_id` (`news_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_name` (`name`),
  ADD KEY `brand_id` (`brand_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

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
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `banner_details`
--
ALTER TABLE `banner_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `news_details`
--
ALTER TABLE `news_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `banner_details`
--
ALTER TABLE `banner_details`
  ADD CONSTRAINT `banner_details_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `banner_details_ibfk_2` FOREIGN KEY (`banner_id`) REFERENCES `banners` (`id`);

--
-- Constraints for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `feedbacks_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `news_details`
--
ALTER TABLE `news_details`
  ADD CONSTRAINT `news_details_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `news_details_ibfk_2` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
