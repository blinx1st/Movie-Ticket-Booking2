-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3307
-- Thời gian đã tạo: Th12 07, 2025 lúc 11:34 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `movie_ticket_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `booking`
--

CREATE TABLE `booking` (
  `id` int(11) NOT NULL,
  `totalAmount` decimal(10,2) NOT NULL,
  `bookingDate` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `userId` int(11) DEFAULT NULL,
  `movieId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `booking`
--

INSERT INTO `booking` (`id`, `totalAmount`, `bookingDate`, `status`, `userId`, `movieId`) VALUES
(5, 300000.00, '2025-12-07 16:33:50.685000', 'Paid', 1, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cinema_room`
--

CREATE TABLE `cinema_room` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'Standard'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `cinema_room`
--

INSERT INTO `cinema_room` (`id`, `name`, `type`) VALUES
(1, 'Cinema 01', 'Standard'),
(2, 'Cinema 02', 'Standard'),
(3, 'Cinema 03', 'Standard'),
(4, 'Cinema 04', 'Standard'),
(5, 'Cinema 05', 'Standard'),
(6, 'Cinema 06', 'Standard'),
(7, 'Cinema 07 (3D)', '3D'),
(8, 'Cinema 08 (3D)', '3D'),
(9, 'IMAX Hall 01', 'IMAX'),
(10, 'IMAX Hall 02', 'IMAX');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `movie`
--

CREATE TABLE `movie` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `genre` varchar(255) NOT NULL,
  `durationMinutes` int(11) NOT NULL,
  `ticketPrice` decimal(10,0) NOT NULL,
  `imageUrl` varchar(255) NOT NULL,
  `startDate` datetime NOT NULL,
  `releaseDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `movie`
--

INSERT INTO `movie` (`id`, `title`, `description`, `genre`, `durationMinutes`, `ticketPrice`, `imageUrl`, `startDate`, `releaseDate`) VALUES
(1, 'Test Movie', 'Test Description', 'Action', 120, 100000, '', '0000-00-00 00:00:00', NULL),
(2, 'Inception', 'Một kẻ cắp chuyên nghiệp chuyên đánh cắp bí mật bằng cách xâm nhập vào tiềm thức của mục tiêu.', 'Sci-Fi', 148, 120000, '', '0000-00-00 00:00:00', NULL),
(3, 'Avatar: The Way of Water', 'Phim 3D siêu đẹp', 'Sci-Fi', 190, 100000, '', '0000-00-00 00:00:00', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `seat`
--

CREATE TABLE `seat` (
  `id` int(11) NOT NULL,
  `row` varchar(255) NOT NULL,
  `number` int(11) NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'Standard'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `seat`
--

INSERT INTO `seat` (`id`, `row`, `number`, `type`) VALUES
(1, 'A', 1, 'Standard'),
(2, 'A', 2, 'Standard'),
(3, 'A', 3, 'Standard'),
(4, 'A', 4, 'Standard'),
(5, 'A', 5, 'Standard'),
(6, 'A', 6, 'Standard'),
(7, 'A', 7, 'Standard'),
(8, 'A', 8, 'Standard'),
(9, 'A', 9, 'Standard'),
(10, 'A', 10, 'Standard'),
(11, 'B', 1, 'Standard'),
(12, 'B', 2, 'Standard'),
(13, 'B', 3, 'Standard'),
(14, 'B', 4, 'Standard'),
(15, 'B', 5, 'Standard'),
(16, 'B', 6, 'Standard'),
(17, 'B', 7, 'Standard'),
(18, 'B', 8, 'Standard'),
(19, 'B', 9, 'Standard'),
(20, 'B', 10, 'Standard'),
(21, 'C', 1, 'Standard'),
(22, 'C', 2, 'Standard'),
(23, 'C', 3, 'Standard'),
(24, 'C', 4, 'Standard'),
(25, 'C', 5, 'Standard'),
(26, 'C', 6, 'Standard'),
(27, 'C', 7, 'Standard'),
(28, 'C', 8, 'Standard'),
(29, 'C', 9, 'Standard'),
(30, 'C', 10, 'Standard'),
(31, 'D', 1, 'Standard'),
(32, 'D', 2, 'Standard'),
(33, 'D', 3, 'Standard'),
(34, 'D', 4, 'Standard'),
(35, 'D', 5, 'Standard'),
(36, 'D', 6, 'Standard'),
(37, 'D', 7, 'Standard'),
(38, 'D', 8, 'Standard'),
(39, 'D', 9, 'Standard'),
(40, 'D', 10, 'Standard'),
(41, 'E', 1, 'VIP'),
(42, 'E', 2, 'VIP'),
(43, 'E', 3, 'VIP'),
(44, 'E', 4, 'VIP'),
(45, 'E', 5, 'VIP'),
(46, 'E', 6, 'VIP'),
(47, 'E', 7, 'VIP'),
(48, 'E', 8, 'VIP'),
(49, 'E', 9, 'VIP'),
(50, 'E', 10, 'VIP'),
(51, 'F', 1, 'VIP'),
(52, 'F', 2, 'VIP'),
(53, 'F', 3, 'VIP'),
(54, 'F', 4, 'VIP'),
(55, 'F', 5, 'VIP'),
(56, 'F', 6, 'VIP'),
(57, 'F', 7, 'VIP'),
(58, 'F', 8, 'VIP'),
(59, 'F', 9, 'VIP'),
(60, 'F', 10, 'VIP'),
(61, 'G', 1, 'VIP'),
(62, 'G', 2, 'VIP'),
(63, 'G', 3, 'VIP'),
(64, 'G', 4, 'VIP'),
(65, 'G', 5, 'VIP'),
(66, 'G', 6, 'VIP'),
(67, 'G', 7, 'VIP'),
(68, 'G', 8, 'VIP'),
(69, 'G', 9, 'VIP'),
(70, 'G', 10, 'VIP'),
(71, 'H', 1, 'VIP'),
(72, 'H', 2, 'VIP'),
(73, 'H', 3, 'VIP'),
(74, 'H', 4, 'VIP'),
(75, 'H', 5, 'VIP'),
(76, 'H', 6, 'VIP'),
(77, 'H', 7, 'VIP'),
(78, 'H', 8, 'VIP'),
(79, 'H', 9, 'VIP'),
(80, 'H', 10, 'VIP'),
(81, 'I', 1, 'VIP'),
(82, 'I', 2, 'VIP'),
(83, 'I', 3, 'VIP'),
(84, 'I', 4, 'VIP'),
(85, 'I', 5, 'VIP'),
(86, 'I', 6, 'VIP'),
(87, 'I', 7, 'VIP'),
(88, 'I', 8, 'VIP'),
(89, 'I', 9, 'VIP'),
(90, 'I', 10, 'VIP'),
(91, 'J', 1, 'VIP'),
(92, 'J', 2, 'VIP'),
(93, 'J', 3, 'VIP'),
(94, 'J', 4, 'VIP'),
(95, 'J', 5, 'VIP'),
(96, 'J', 6, 'VIP'),
(97, 'J', 7, 'VIP'),
(98, 'J', 8, 'VIP'),
(99, 'J', 9, 'VIP'),
(100, 'J', 10, 'VIP');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `showtime`
--

CREATE TABLE `showtime` (
  `id` int(11) NOT NULL,
  `startTime` datetime NOT NULL,
  `roomId` int(11) DEFAULT NULL,
  `movieId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `showtime`
--

INSERT INTO `showtime` (`id`, `startTime`, `roomId`, `movieId`) VALUES
(500, '2025-12-24 20:00:00', 9, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ticket`
--

CREATE TABLE `ticket` (
  `id` int(11) NOT NULL,
  `showtimeId` int(11) NOT NULL,
  `seatId` int(11) DEFAULT NULL,
  `bookingId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `ticket`
--

INSERT INTO `ticket` (`id`, `showtimeId`, `seatId`, `bookingId`) VALUES
(1, 500, 2, 5),
(2, 500, 99, 5);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `fullName`, `email`, `password`, `role`) VALUES
(1, 'Test User', 'test@gmail.com', 'password123', 'Customer'),
(2, 'Nguyen Van A', 'khachhang@gmail.com', '123', 'Customer');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_336b3f4a235460dc93645fbf222` (`userId`),
  ADD KEY `FK_f9bb5ef37ba5803611f1121e0b3` (`movieId`);

--
-- Chỉ mục cho bảng `cinema_room`
--
ALTER TABLE `cinema_room`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `movie`
--
ALTER TABLE `movie`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `seat`
--
ALTER TABLE `seat`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `showtime`
--
ALTER TABLE `showtime`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_5dbe760796ab36699aee894d255` (`roomId`),
  ADD KEY `FK_1af27f8171269552599f8e18ff1` (`movieId`);

--
-- Chỉ mục cho bảng `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_2c35aa6c90c4dd7450dad753ae5` (`showtimeId`),
  ADD KEY `FK_ab9b02f72bbc7d05bd15a5cb6b4` (`seatId`),
  ADD KEY `FK_1c37434449c76d1725b3d4d6c80` (`bookingId`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `booking`
--
ALTER TABLE `booking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `cinema_room`
--
ALTER TABLE `cinema_room`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `movie`
--
ALTER TABLE `movie`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `seat`
--
ALTER TABLE `seat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT cho bảng `showtime`
--
ALTER TABLE `showtime`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=501;

--
-- AUTO_INCREMENT cho bảng `ticket`
--
ALTER TABLE `ticket`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `FK_336b3f4a235460dc93645fbf222` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_f9bb5ef37ba5803611f1121e0b3` FOREIGN KEY (`movieId`) REFERENCES `movie` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `showtime`
--
ALTER TABLE `showtime`
  ADD CONSTRAINT `FK_1af27f8171269552599f8e18ff1` FOREIGN KEY (`movieId`) REFERENCES `movie` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_5dbe760796ab36699aee894d255` FOREIGN KEY (`roomId`) REFERENCES `cinema_room` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `ticket`
--
ALTER TABLE `ticket`
  ADD CONSTRAINT `FK_1c37434449c76d1725b3d4d6c80` FOREIGN KEY (`bookingId`) REFERENCES `booking` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_2c35aa6c90c4dd7450dad753ae5` FOREIGN KEY (`showtimeId`) REFERENCES `showtime` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_ab9b02f72bbc7d05bd15a5cb6b4` FOREIGN KEY (`seatId`) REFERENCES `seat` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
