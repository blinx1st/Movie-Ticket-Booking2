-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 10, 2025 at 01:33 PM
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
-- Database: `movie_ticket_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `id` int(11) NOT NULL,
  `totalAmount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `bookingDate` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `status` varchar(255) NOT NULL DEFAULT 'Paid',
  `paymentMethod` varchar(255) DEFAULT NULL,
  `paymentRef` varchar(255) DEFAULT NULL,
  `userId` varchar(64) DEFAULT NULL,
  `movieId` int(11) DEFAULT NULL,
  `showtimeId` int(11) DEFAULT NULL,
  `cinemaId` int(11) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`id`, `totalAmount`, `bookingDate`, `status`, `paymentMethod`, `paymentRef`, `userId`, `movieId`, `showtimeId`, `cinemaId`, `source`, `note`) VALUES
(1, 18000.00, '2025-12-09 17:25:08.207985', 'Paid', 'Mock', NULL, '2695d228-d7a3-4346-8e6e-6edaa968a079', 1, 1, 1, 'booking', NULL),
(2, 6000.00, '2025-12-09 18:47:37.826868', 'Paid', 'Mock', NULL, '2695d228-d7a3-4346-8e6e-6edaa968a079', 1, 1, 1, 'booking', NULL),
(3, 18000.00, '2025-12-09 21:12:53.403341', 'Paid', 'Mock', NULL, '983d87d1-6ce0-4748-b211-d767ecbfcfcc', 1, 1, 1, 'manual', NULL),
(4, 12000.00, '2025-12-09 21:16:51.636618', 'Paid', 'Mock', NULL, '983d87d1-6ce0-4748-b211-d767ecbfcfcc', 1, 1, 1, 'booking', NULL),
(5, 22000.00, '2025-12-09 21:17:50.865097', 'Paid', 'Mock', NULL, '983d87d1-6ce0-4748-b211-d767ecbfcfcc', 2, 2, 1, 'booking', NULL),
(6, 18000.00, '2025-12-09 21:19:12.832305', 'Paid', 'Mock', NULL, '983d87d1-6ce0-4748-b211-d767ecbfcfcc', 1, 1, 1, 'booking', NULL),
(7, 160000.00, '2025-12-10 01:45:48.731920', 'Paid', 'Bank transfer/QR', 'BANK-222213123213213213213213-TNUTBH', 'a9118eeb-bea3-4f01-a7d2-f3e1a49e8656', 11, 7, 2, 'booking', NULL),
(8, 160000.00, '2025-12-10 01:46:04.780845', 'Paid', 'Bank transfer/QR', 'BANK-222213123213213213213213-C2P2V4', 'a9118eeb-bea3-4f01-a7d2-f3e1a49e8656', 11, 7, 2, 'booking', NULL),
(9, 160000.00, '2025-12-10 01:56:05.926472', 'Paid', 'Bank transfer/QR', 'BANK-BANK-5KAAOY', 'a9118eeb-bea3-4f01-a7d2-f3e1a49e8656', 11, 7, 2, 'booking', NULL),
(10, 80000.00, '2025-12-10 02:03:20.261187', 'Paid', 'Bank transfer/QR', 'BANK-BANK-6PF3QQ', 'a9118eeb-bea3-4f01-a7d2-f3e1a49e8656', 11, 7, 2, 'booking', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cinema`
--

CREATE TABLE `cinema` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cinema`
--

INSERT INTO `cinema` (`id`, `name`, `address`, `city`, `phone`) VALUES
(2, 'Group: 6 (Trụ sở 1)', '369 Nguyễn Trãi', 'Hà Nội', '033500000'),
(3, 'Group: 6 (Trụ sở 2)', '123 Trần Duy Hưng', 'Hà Nội', '033000000'),
(4, 'Group: 6 (Trụ sở 3)', '120 An Liễng', 'Hà Nội', '0331420000');

-- --------------------------------------------------------

--
-- Table structure for table `cinema_room`
--

CREATE TABLE `cinema_room` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `cinemaId` int(11) DEFAULT NULL,
  `type` varchar(255) NOT NULL DEFAULT '2D',
  `capacity` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cinema_room`
--

INSERT INTO `cinema_room` (`id`, `name`, `cinemaId`, `type`, `capacity`) VALUES
(3, 'Phòng số 1', 2, '2D', 40),
(4, 'Phòng số 2', 2, '2D', 32),
(5, 'Phòng số 3', 2, '2D', 32),
(6, 'Phòng số 1', 3, '2D', 32),
(7, 'Phòng số 2', 3, '2D', 40),
(8, 'Phòng số 3', 3, '2D', 32),
(9, 'Phòng số 1', 4, '3D', 32),
(10, 'Phòng số 2', 4, '3D', 40),
(11, 'Phòng số 3', 4, '2D', 32);

-- --------------------------------------------------------

--
-- Table structure for table `movie`
--

CREATE TABLE `movie` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `genre` varchar(255) NOT NULL,
  `durationMinutes` int(11) NOT NULL,
  `ticketPrice` decimal(10,2) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Now Showing',
  `format` varchar(255) NOT NULL DEFAULT '2D',
  `rating` int(11) NOT NULL DEFAULT 0,
  `language` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `posterUrl` varchar(255) NOT NULL,
  `bannerUrl` varchar(255) DEFAULT NULL,
  `releaseDate` date NOT NULL,
  `endDate` date DEFAULT NULL,
  `trailerUrl` varchar(255) DEFAULT NULL,
  `showtimes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`showtimes`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `movie`
--

INSERT INTO `movie` (`id`, `title`, `slug`, `genre`, `durationMinutes`, `ticketPrice`, `status`, `format`, `rating`, `language`, `description`, `posterUrl`, `bannerUrl`, `releaseDate`, `endDate`, `trailerUrl`, `showtimes`) VALUES
(1, 'HOÀNG TỬ QUỶ', 'hong-t-qu', 'Thriller/Criminal/Horror Vietnam', 10, 10.00, 'Now Showing', '2D', 10, 'English', 'Hoàng Tử Quỷ xoay quanh Thân Đức - một hoàng tử được sinh ra nhờ tà thuật. Trốn thoát khỏi cung cấm, Thân Đức tham vọng giải thoát Quỷ Xương Cuồng khỏi Ải Mắt Người để khôi phục Xương Cuồng Giáo. Nhưng kế hoạch của Thân Đức chỉ thành hiện thực khi hắn có đủ cả hai “nguyên liệu” - Du Hồn Giả và Bạch Hổ Nguyên Âm. Đội lốt một lang y hiền lành, muốn chữa bệnh cứu người, Thân Đức lên đường đến làng Hủi và đụng độ trưởng làng Lỗ Đạt mạnh mẽ, liệu hắn có thể đạt được âm mưu tà ác của mình?', 'http://localhost:8000/uploads/posters/1765290623366-641557278.jpg', NULL, '2025-09-12', NULL, NULL, NULL),
(2, 'IN SEARCH OF AMBERFLOWER', 'in-search-of-amberflower', 'ABV', 200, 10.00, 'Now Showing', '2D', 9, 'Tiếng Việt', 'Báu vật làng biển Long Diên Hương bị đánh cắp, mở ra cuộc hành trình truy tìm đầy kịch tính. Không chỉ có võ thuật mãn nhãn, bộ phim còn mang đến tiếng cười, sự gắn kết và những giá trị nhân văn của con người làng chài.', 'http://localhost:8000/uploads/posters/1765290748559-918542813.jpg', NULL, '2025-12-09', NULL, NULL, NULL),
(3, 'THE WAR MAGIC: SHIBUYA INCIDENT x THE RETURN OF THE DEAD', 'the-war-magic-shibuya-incident-x-the-return-of-the-dead', 'Action', 12, 200.00, 'Coming Soon', '2D', 10, 'English', 'Sau bao ngày chờ đợi, Đại Chiến Shibuya cuối cùng cũng xuất hiện trên màn ảnh rộng, gom trọn những khoảnh khắc nghẹt thở nhất thành một cú nổ đúng nghĩa. Không chỉ tái hiện toàn bộ cơn ác mộng tại Shibuya, bộ phim còn hé lộ những bí mật then chốt và mở màn cho trò chơi sinh tử “Tử Diệt Hồi Du” đầy kịch tính và mãn nhãn.', 'http://localhost:8000/uploads/posters/1765290823516-362612734.jpg', NULL, '2000-03-18', NULL, NULL, NULL),
(4, '96 MINUTES OF LIFE AND DEATH', '96-minutes-of-life-and-death', 'Action/Adventure/SF China', 119, 20.00, 'Now Showing', '2D', 10, 'English', 'Ba năm sau thảm kịch tại trung tâm mua sắm, trên chuyến tàu cao tốc định mệnh, nữ cảnh sát Huỳnh Hân (Tống Vân Hoa) và chồng cô là cựu chuyên gia gỡ bom - Tống Khang Nhân (Lâm Bách Hoành), cùng đội trưởng Lý Kiệt (Lý Lý Nhân) bất ngờ nhận được tin nhắn thông báo một quả bom đã được cài sẵn trên tàu. Vụ việc lần này còn phức tạp hơn khi kẻ khủng bố dường tính toán vô cùng tinh vi. Khi thời gian cạn dần, Tống Khang Nhân buộc phải ngăn thảm kịch xảy ra bằng mọi giá, đồng thời đối mặt với những ám ảnh kinh hoàng từ vụ nổ năm xưa.', 'http://localhost:8000/uploads/posters/1765290878134-68931776.jpg', NULL, '2025-12-09', NULL, NULL, NULL),
(5, 'ZOOTOPIA 2', 'zootopia-2', 'Animation USA', 107, 10.00, 'Now Showing', '2D', 9, 'English', 'Trong bộ phim \"Zootopia 2 - Phi Vụ Động Trời 2\" từ Walt Disney Animation Studios, hai thám tử Judy Hopps (lồng tiếng bởi Ginnifer Goodwin) và Nick Wilde (lồng tiếng bởi Jason Bateman) bước vào hành trình truy tìm một sinh vật bò sát bí ẩn vừa xuất hiện tại Zootopia và khiến cả vương quốc động vật bị đảo lộn. Để phá được vụ án, Judy và Nick buộc phải hoạt động bí mật tại những khu vực mới lạ của thành phố – nơi mối quan hệ đồng nghiệp của họ bị thử thách hơn bao giờ hết.', 'http://localhost:8000/uploads/posters/1765290529655-851408098.jpg', NULL, '2025-12-18', NULL, NULL, NULL),
(6, 'The Haunted Pregnant Room\"', 'the-haunted-pregnant-room', 'Comedy Vietnam', 60, 10.00, 'Coming Soon', '2D', 9, 'Tiếng Việt', 'Hai người bạn thân thuê phải một căn phòng trọ cũ, nơi liên tục xảy ra những hiện tượng kỳ bí. Trong hành trình tìm hiểu, họ đối mặt với hồn ma của một người phụ nữ mang thai – “ma bầu”. Ẩn sau nỗi ám ảnh rùng rợn là bi kịch và tình yêu mẫu tử thiêng liêng, nơi sự hy sinh của người mẹ trở thành sợi dây kết nối những thế hệ.', 'http://localhost:8000/uploads/posters/1765290942754-429854767.jpg', NULL, '2025-12-20', NULL, NULL, NULL),
(7, '5 CENTIMET PER SECOND', '5-centimet-per-second', 'Animation Japan', 76, 15.00, 'Now Showing', '2D', 10, 'English', 'Câu chuyện cảm động về Takaki và Akari, đôi bạn thuở thiếu thời dần bị chia cắt bởi thời gian và khoảng cách. Qua ba giai đoạn khác nhau trong cuộc đời, hành trình khắc họa những ký ức, cuộc hội ngộ và sự xa cách của cặp đôi, với hình ảnh hoa anh đào rơi – 5cm/giây – như ẩn dụ cho tình yêu mong manh và thoáng chốc của tuổi trẻ.', 'http://localhost:8000/uploads/posters/1765291021096-671424011.jpg', NULL, '2025-12-22', NULL, NULL, NULL),
(8, 'Five Nights at Freddy\'s 2', 'five-nights-at-freddys-2', 'Thriller/Criminal/Horror USA ', 104, 10.00, 'Coming Soon', '2D', 8, 'English', 'Một năm sau cơn ác mộng siêu nhiên tại Freddy Fazbear’s Pizza, thị trấn tổ chức lễ hội Fazfest lấy cảm hứng từ truyền thuyết địa phương xoay quanh sự kiện đó. Cựu nhân viên bảo vệ Mike và cảnh sát Vanessa che giấu sự thật với em gái 11 tuổi của Mike, Abby, về số phận của những người bạn animatronic của cô bé. Khi Abby lén đến gặp lại Freddy, Bonnie, Chica và Foxy, một chuỗi sự kiện kinh hoàng bắt đầu, làm lộ ra những bí mật đen tối về nguồn gốc thật sự của Freddy’s, đồng thời giải phóng một nỗi kinh hoàng bị lãng quên suốt nhiều thập kỷ.', 'http://localhost:8000/uploads/posters/1765291109470-140735612.jpg', NULL, '2025-12-15', NULL, NULL, NULL),
(9, 'PENJAGAL IBLIS', 'penjagal-iblis', 'Thriller/Criminal/Horror Australia&Others', 99, 20.00, 'Now Showing', '2D', 9, 'English', 'Một gia đình chết một cách khủng khiếp. Một cô gái bị buộc tội là kẻ giết người. Nhưng một sự thật kinh hoàng hơn đang chờ được tiết lộ. Cuộc chiến trừ tà đẫm máu và gây choáng nhất cuối năm giữa hậu duệ một gia tộc diệt quỷ cùng những thế lực tà ác khủng khiếp nhất xứ vạn đảo.', 'http://localhost:8000/uploads/posters/1765291544148-426962600.jpg', NULL, '2025-12-26', NULL, NULL, NULL),
(10, 'The Cursed', 'the-cursed', 'Thriller/Criminal/Horror Korea', 97, 16.00, 'Now Showing', '2D', 10, 'English', 'Phiên chợ của quỷ - Nơi linh hồn trở thành những món hàng để thỏa mãn tham vọng của con người. Mỗi đêm, cổng chợ âm sẽ mở, quỷ sẽ bắt hồn. Một khi đã dám bán rẻ linh hồn, cái giá phải trả có thể là máu, là thịt, hoặc chính sự tồn tại của những kẻ dám liều mạng. Nỗi ám ảnh không lối thoát với phim tâm linh - kinh hợp tác Việt - Hàn quỷ dị nhất dịp cuối năm!', 'http://localhost:8000/uploads/posters/1765291649167-901230536.jpg', NULL, '2025-12-24', NULL, NULL, NULL),
(11, 'Now You See Me 3', 'now-you-see-me-3', 'Thriller/Criminal/Horror England', 112, 16.00, 'Now Showing', '2D', 10, 'English', 'Tứ Kỵ Sĩ chính thức tái xuất, bắt tay cùng các tân binh ảo thuật gia Gen Z trong một phi vụ đánh cắp kim cương liều lĩnh nhất trong sự nghiệp. Họ phải đối đầu với bà trùm Veronika của đế chế rửa tiền nhà Vandenberg (do Rosamund Pike thủ vai) - một người phụ nữ quyền lực và đầy thủ đoạn. Khi kinh nghiệm lão làng của bộ tứ ảo thuật va chạm với công nghệ 4.0 của một mạng lưới tội phạm xuyên lục địa, liệu ai sẽ làm chủ cuộc chơi? Hãy chuẩn bị tinh thần cho những cú xoắn não mà bạn không thể đoán trước!', 'http://localhost:8000/uploads/posters/1765291759082-542534471.jpg', NULL, '2025-12-23', NULL, NULL, NULL),
(12, 'Ky Nam Inn', 'ky-nam-inn', 'Drama Vietnam', 136, 36.00, 'Coming Soon', '2D', 10, 'Tiếng Việt (Phụ đề: Tiếng Anh)', 'Với sự nâng đỡ của người chú quyền lực, Khang được giao cho công việc dịch cuốn “Hoàng Tử Bé” và dọn vào căn hộ bỏ trống ở khu chung cư cũ. Anh làm quen với cô hàng xóm tên Kỳ Nam, một góa phụ từng nổi danh trong giới nữ công gia chánh và giờ lặng lẽ với nghề nấu cơm tháng. Một tai nạn xảy ra khiến Kỳ Nam không thể tiếp tục công việc của mình. Khang đề nghị giúp đỡ và mối quan hệ của họ dần trở nên sâu sắc, gắn bó. Liệu mối quan hệ của họ có thể tồn tại lâu dài giữa những biến động củа xã hội thời bấy giờ?', 'http://localhost:8000/uploads/posters/1765291883117-617714399.jpg', NULL, '2025-12-30', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `seat`
--

CREATE TABLE `seat` (
  `id` int(11) NOT NULL,
  `row` varchar(255) NOT NULL,
  `number` int(11) NOT NULL,
  `roomId` int(11) DEFAULT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'Standard'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `seat`
--

INSERT INTO `seat` (`id`, `row`, `number`, `roomId`, `type`) VALUES
(1, 'A', 1, 1, 'Standard'),
(2, 'A', 2, 1, 'Standard'),
(3, 'A', 3, 1, 'Standard'),
(4, 'A', 4, 1, 'Standard'),
(5, 'A', 5, 1, 'Standard'),
(6, 'A', 6, 1, 'Standard'),
(7, 'A', 7, 1, 'Standard'),
(8, 'A', 8, 1, 'Standard'),
(9, 'B', 1, 1, 'Standard'),
(10, 'B', 2, 1, 'Standard'),
(11, 'B', 3, 1, 'Standard'),
(12, 'B', 4, 1, 'Standard'),
(13, 'B', 5, 1, 'Standard'),
(14, 'B', 6, 1, 'Standard'),
(15, 'B', 7, 1, 'Standard'),
(16, 'B', 8, 1, 'Standard'),
(17, 'C', 1, 1, 'Standard'),
(18, 'C', 2, 1, 'Standard'),
(19, 'C', 3, 1, 'Standard'),
(20, 'C', 4, 1, 'Standard'),
(21, 'C', 5, 1, 'Standard'),
(22, 'C', 6, 1, 'Standard'),
(23, 'C', 7, 1, 'Standard'),
(24, 'C', 8, 1, 'Standard'),
(25, 'D', 1, 1, 'Standard'),
(26, 'D', 2, 1, 'Standard'),
(27, 'D', 3, 1, 'Standard'),
(28, 'D', 4, 1, 'Standard'),
(29, 'D', 5, 1, 'Standard'),
(30, 'D', 6, 1, 'Standard'),
(31, 'D', 7, 1, 'Standard'),
(32, 'D', 8, 1, 'Standard'),
(33, 'E', 1, 1, 'Standard'),
(34, 'E', 2, 1, 'Standard'),
(35, 'E', 3, 1, 'Standard'),
(36, 'E', 4, 1, 'Standard'),
(37, 'E', 5, 1, 'Standard'),
(38, 'E', 6, 1, 'Standard'),
(39, 'E', 7, 1, 'Standard'),
(40, 'E', 8, 1, 'Standard'),
(41, 'A', 1, 2, 'Standard'),
(42, 'A', 2, 2, 'Standard'),
(43, 'A', 3, 2, 'Standard'),
(44, 'A', 4, 2, 'Standard'),
(45, 'A', 5, 2, 'Standard'),
(46, 'A', 6, 2, 'Standard'),
(47, 'A', 7, 2, 'Standard'),
(48, 'A', 8, 2, 'Standard'),
(49, 'B', 1, 2, 'Standard'),
(50, 'B', 2, 2, 'Standard'),
(51, 'B', 3, 2, 'Standard'),
(52, 'B', 4, 2, 'Standard'),
(53, 'B', 5, 2, 'Standard'),
(54, 'B', 6, 2, 'Standard'),
(55, 'B', 7, 2, 'Standard'),
(56, 'B', 8, 2, 'Standard'),
(57, 'C', 1, 2, 'Standard'),
(58, 'C', 2, 2, 'Standard'),
(59, 'C', 3, 2, 'Standard'),
(60, 'C', 4, 2, 'Standard'),
(61, 'C', 5, 2, 'Standard'),
(62, 'C', 6, 2, 'Standard'),
(63, 'C', 7, 2, 'Standard'),
(64, 'C', 8, 2, 'Standard'),
(65, 'D', 1, 2, 'Standard'),
(66, 'D', 2, 2, 'Standard'),
(67, 'D', 3, 2, 'Standard'),
(68, 'D', 4, 2, 'Standard'),
(69, 'D', 5, 2, 'Standard'),
(70, 'D', 6, 2, 'Standard'),
(71, 'D', 7, 2, 'Standard'),
(72, 'D', 8, 2, 'Standard'),
(138, 'A', 1, 3, 'Standard'),
(139, 'A', 2, 3, 'Standard'),
(140, 'A', 3, 3, 'Standard'),
(141, 'A', 4, 3, 'Standard'),
(142, 'A', 5, 3, 'Standard'),
(143, 'A', 6, 3, 'Standard'),
(144, 'A', 7, 3, 'Standard'),
(145, 'A', 8, 3, 'Standard'),
(146, 'B', 1, 3, 'Standard'),
(147, 'B', 2, 3, 'Standard'),
(148, 'B', 3, 3, 'Standard'),
(149, 'B', 4, 3, 'Standard'),
(150, 'B', 5, 3, 'Standard'),
(151, 'B', 6, 3, 'Standard'),
(152, 'B', 7, 3, 'Standard'),
(153, 'B', 8, 3, 'Standard'),
(154, 'C', 1, 3, 'Standard'),
(155, 'C', 2, 3, 'Standard'),
(156, 'C', 3, 3, 'Standard'),
(157, 'C', 4, 3, 'Standard'),
(158, 'C', 5, 3, 'Standard'),
(159, 'C', 6, 3, 'Standard'),
(160, 'C', 7, 3, 'Standard'),
(161, 'C', 8, 3, 'Standard'),
(162, 'D', 1, 3, 'Standard'),
(163, 'D', 2, 3, 'Standard'),
(164, 'D', 3, 3, 'Standard'),
(165, 'D', 4, 3, 'Standard'),
(166, 'D', 5, 3, 'Standard'),
(167, 'D', 6, 3, 'Standard'),
(168, 'D', 7, 3, 'Standard'),
(169, 'D', 8, 3, 'Standard'),
(170, 'E', 1, 3, 'Standard'),
(171, 'E', 2, 3, 'Standard'),
(172, 'E', 3, 3, 'Standard'),
(173, 'E', 4, 3, 'Standard'),
(174, 'E', 5, 3, 'Standard'),
(175, 'E', 6, 3, 'Standard'),
(176, 'E', 7, 3, 'Standard'),
(177, 'E', 8, 3, 'Standard'),
(178, 'A', 1, 4, 'Standard'),
(179, 'A', 2, 4, 'Standard'),
(180, 'A', 3, 4, 'Standard'),
(181, 'A', 4, 4, 'Standard'),
(182, 'A', 5, 4, 'Standard'),
(183, 'A', 6, 4, 'Standard'),
(184, 'A', 7, 4, 'Standard'),
(185, 'A', 8, 4, 'Standard'),
(186, 'B', 1, 4, 'Standard'),
(187, 'B', 2, 4, 'Standard'),
(188, 'B', 3, 4, 'Standard'),
(189, 'B', 4, 4, 'Standard'),
(190, 'B', 5, 4, 'Standard'),
(191, 'B', 6, 4, 'Standard'),
(192, 'B', 7, 4, 'Standard'),
(193, 'B', 8, 4, 'Standard'),
(194, 'C', 1, 4, 'Standard'),
(195, 'C', 2, 4, 'Standard'),
(196, 'C', 3, 4, 'Standard'),
(197, 'C', 4, 4, 'Standard'),
(198, 'C', 5, 4, 'Standard'),
(199, 'C', 6, 4, 'Standard'),
(200, 'C', 7, 4, 'Standard'),
(201, 'C', 8, 4, 'Standard'),
(202, 'D', 1, 4, 'Standard'),
(203, 'D', 2, 4, 'Standard'),
(204, 'D', 3, 4, 'Standard'),
(205, 'D', 4, 4, 'Standard'),
(206, 'D', 5, 4, 'Standard'),
(207, 'D', 6, 4, 'Standard'),
(208, 'D', 7, 4, 'Standard'),
(209, 'D', 8, 4, 'Standard'),
(210, 'A', 1, 5, 'Standard'),
(211, 'A', 2, 5, 'Standard'),
(212, 'A', 3, 5, 'Standard'),
(213, 'A', 4, 5, 'Standard'),
(214, 'A', 5, 5, 'Standard'),
(215, 'A', 6, 5, 'Standard'),
(216, 'A', 7, 5, 'Standard'),
(217, 'A', 8, 5, 'Standard'),
(218, 'B', 1, 5, 'Standard'),
(219, 'B', 2, 5, 'Standard'),
(220, 'B', 3, 5, 'Standard'),
(221, 'B', 4, 5, 'Standard'),
(222, 'B', 5, 5, 'Standard'),
(223, 'B', 6, 5, 'Standard'),
(224, 'B', 7, 5, 'Standard'),
(225, 'B', 8, 5, 'Standard'),
(226, 'C', 1, 5, 'Standard'),
(227, 'C', 2, 5, 'Standard'),
(228, 'C', 3, 5, 'Standard'),
(229, 'C', 4, 5, 'Standard'),
(230, 'C', 5, 5, 'Standard'),
(231, 'C', 6, 5, 'Standard'),
(232, 'C', 7, 5, 'Standard'),
(233, 'C', 8, 5, 'Standard'),
(234, 'D', 1, 5, 'Standard'),
(235, 'D', 2, 5, 'Standard'),
(236, 'D', 3, 5, 'Standard'),
(237, 'D', 4, 5, 'Standard'),
(238, 'D', 5, 5, 'Standard'),
(239, 'D', 6, 5, 'Standard'),
(240, 'D', 7, 5, 'Standard'),
(241, 'D', 8, 5, 'Standard'),
(242, 'A', 1, 6, 'Standard'),
(243, 'A', 2, 6, 'Standard'),
(244, 'A', 3, 6, 'Standard'),
(245, 'A', 4, 6, 'Standard'),
(246, 'A', 5, 6, 'Standard'),
(247, 'A', 6, 6, 'Standard'),
(248, 'A', 7, 6, 'Standard'),
(249, 'A', 8, 6, 'Standard'),
(250, 'B', 1, 6, 'Standard'),
(251, 'B', 2, 6, 'Standard'),
(252, 'B', 3, 6, 'Standard'),
(253, 'B', 4, 6, 'Standard'),
(254, 'B', 5, 6, 'Standard'),
(255, 'B', 6, 6, 'Standard'),
(256, 'B', 7, 6, 'Standard'),
(257, 'B', 8, 6, 'Standard'),
(258, 'C', 1, 6, 'Standard'),
(259, 'C', 2, 6, 'Standard'),
(260, 'C', 3, 6, 'Standard'),
(261, 'C', 4, 6, 'Standard'),
(262, 'C', 5, 6, 'Standard'),
(263, 'C', 6, 6, 'Standard'),
(264, 'C', 7, 6, 'Standard'),
(265, 'C', 8, 6, 'Standard'),
(266, 'D', 1, 6, 'Standard'),
(267, 'D', 2, 6, 'Standard'),
(268, 'D', 3, 6, 'Standard'),
(269, 'D', 4, 6, 'Standard'),
(270, 'D', 5, 6, 'Standard'),
(271, 'D', 6, 6, 'Standard'),
(272, 'D', 7, 6, 'Standard'),
(273, 'D', 8, 6, 'Standard'),
(274, 'A', 1, 7, 'Standard'),
(275, 'A', 2, 7, 'Standard'),
(276, 'A', 3, 7, 'Standard'),
(277, 'A', 4, 7, 'Standard'),
(278, 'A', 5, 7, 'Standard'),
(279, 'A', 6, 7, 'Standard'),
(280, 'A', 7, 7, 'Standard'),
(281, 'A', 8, 7, 'Standard'),
(282, 'B', 1, 7, 'Standard'),
(283, 'B', 2, 7, 'Standard'),
(284, 'B', 3, 7, 'Standard'),
(285, 'B', 4, 7, 'Standard'),
(286, 'B', 5, 7, 'Standard'),
(287, 'B', 6, 7, 'Standard'),
(288, 'B', 7, 7, 'Standard'),
(289, 'B', 8, 7, 'Standard'),
(290, 'C', 1, 7, 'Standard'),
(291, 'C', 2, 7, 'Standard'),
(292, 'C', 3, 7, 'Standard'),
(293, 'C', 4, 7, 'Standard'),
(294, 'C', 5, 7, 'Standard'),
(295, 'C', 6, 7, 'Standard'),
(296, 'C', 7, 7, 'Standard'),
(297, 'C', 8, 7, 'Standard'),
(298, 'D', 1, 7, 'Standard'),
(299, 'D', 2, 7, 'Standard'),
(300, 'D', 3, 7, 'Standard'),
(301, 'D', 4, 7, 'Standard'),
(302, 'D', 5, 7, 'Standard'),
(303, 'D', 6, 7, 'Standard'),
(304, 'D', 7, 7, 'Standard'),
(305, 'D', 8, 7, 'Standard'),
(306, 'E', 1, 7, 'Standard'),
(307, 'E', 2, 7, 'Standard'),
(308, 'E', 3, 7, 'Standard'),
(309, 'E', 4, 7, 'Standard'),
(310, 'E', 5, 7, 'Standard'),
(311, 'E', 6, 7, 'Standard'),
(312, 'E', 7, 7, 'Standard'),
(313, 'E', 8, 7, 'Standard'),
(378, 'A', 1, 8, 'Standard'),
(379, 'A', 2, 8, 'Standard'),
(380, 'A', 3, 8, 'Standard'),
(381, 'A', 4, 8, 'Standard'),
(382, 'A', 5, 8, 'Standard'),
(383, 'A', 6, 8, 'Standard'),
(384, 'A', 7, 8, 'Standard'),
(385, 'A', 8, 8, 'Standard'),
(386, 'B', 1, 8, 'Standard'),
(387, 'B', 2, 8, 'Standard'),
(388, 'B', 3, 8, 'Standard'),
(389, 'B', 4, 8, 'Standard'),
(390, 'B', 5, 8, 'Standard'),
(391, 'B', 6, 8, 'Standard'),
(392, 'B', 7, 8, 'Standard'),
(393, 'B', 8, 8, 'Standard'),
(394, 'C', 1, 8, 'Standard'),
(395, 'C', 2, 8, 'Standard'),
(396, 'C', 3, 8, 'Standard'),
(397, 'C', 4, 8, 'Standard'),
(398, 'C', 5, 8, 'Standard'),
(399, 'C', 6, 8, 'Standard'),
(400, 'C', 7, 8, 'Standard'),
(401, 'C', 8, 8, 'Standard'),
(402, 'D', 1, 8, 'Standard'),
(403, 'D', 2, 8, 'Standard'),
(404, 'D', 3, 8, 'Standard'),
(405, 'D', 4, 8, 'Standard'),
(406, 'D', 5, 8, 'Standard'),
(407, 'D', 6, 8, 'Standard'),
(408, 'D', 7, 8, 'Standard'),
(409, 'D', 8, 8, 'Standard'),
(410, 'A', 1, 9, 'Standard'),
(411, 'A', 2, 9, 'Standard'),
(412, 'A', 3, 9, 'Standard'),
(413, 'A', 4, 9, 'Standard'),
(414, 'A', 5, 9, 'Standard'),
(415, 'A', 6, 9, 'Standard'),
(416, 'A', 7, 9, 'Standard'),
(417, 'A', 8, 9, 'Standard'),
(418, 'B', 1, 9, 'Standard'),
(419, 'B', 2, 9, 'Standard'),
(420, 'B', 3, 9, 'Standard'),
(421, 'B', 4, 9, 'Standard'),
(422, 'B', 5, 9, 'Standard'),
(423, 'B', 6, 9, 'Standard'),
(424, 'B', 7, 9, 'Standard'),
(425, 'B', 8, 9, 'Standard'),
(426, 'C', 1, 9, 'Standard'),
(427, 'C', 2, 9, 'Standard'),
(428, 'C', 3, 9, 'Standard'),
(429, 'C', 4, 9, 'Standard'),
(430, 'C', 5, 9, 'Standard'),
(431, 'C', 6, 9, 'Standard'),
(432, 'C', 7, 9, 'Standard'),
(433, 'C', 8, 9, 'Standard'),
(434, 'D', 1, 9, 'Standard'),
(435, 'D', 2, 9, 'Standard'),
(436, 'D', 3, 9, 'Standard'),
(437, 'D', 4, 9, 'Standard'),
(438, 'D', 5, 9, 'Standard'),
(439, 'D', 6, 9, 'Standard'),
(440, 'D', 7, 9, 'Standard'),
(441, 'D', 8, 9, 'Standard'),
(442, 'A', 1, 10, 'Standard'),
(443, 'A', 2, 10, 'Standard'),
(444, 'A', 3, 10, 'Standard'),
(445, 'A', 4, 10, 'Standard'),
(446, 'A', 5, 10, 'Standard'),
(447, 'A', 6, 10, 'Standard'),
(448, 'A', 7, 10, 'Standard'),
(449, 'A', 8, 10, 'Standard'),
(450, 'B', 1, 10, 'Standard'),
(451, 'B', 2, 10, 'Standard'),
(452, 'B', 3, 10, 'Standard'),
(453, 'B', 4, 10, 'Standard'),
(454, 'B', 5, 10, 'Standard'),
(455, 'B', 6, 10, 'Standard'),
(456, 'B', 7, 10, 'Standard'),
(457, 'B', 8, 10, 'Standard'),
(458, 'C', 1, 10, 'Standard'),
(459, 'C', 2, 10, 'Standard'),
(460, 'C', 3, 10, 'Standard'),
(461, 'C', 4, 10, 'Standard'),
(462, 'C', 5, 10, 'Standard'),
(463, 'C', 6, 10, 'Standard'),
(464, 'C', 7, 10, 'Standard'),
(465, 'C', 8, 10, 'Standard'),
(466, 'D', 1, 10, 'Standard'),
(467, 'D', 2, 10, 'Standard'),
(468, 'D', 3, 10, 'Standard'),
(469, 'D', 4, 10, 'Standard'),
(470, 'D', 5, 10, 'Standard'),
(471, 'D', 6, 10, 'Standard'),
(472, 'D', 7, 10, 'Standard'),
(473, 'D', 8, 10, 'Standard'),
(474, 'E', 1, 10, 'Standard'),
(475, 'E', 2, 10, 'Standard'),
(476, 'E', 3, 10, 'Standard'),
(477, 'E', 4, 10, 'Standard'),
(478, 'E', 5, 10, 'Standard'),
(479, 'E', 6, 10, 'Standard'),
(480, 'E', 7, 10, 'Standard'),
(481, 'E', 8, 10, 'Standard'),
(482, 'A', 1, 11, 'Standard'),
(483, 'A', 2, 11, 'Standard'),
(484, 'A', 3, 11, 'Standard'),
(485, 'A', 4, 11, 'Standard'),
(486, 'A', 5, 11, 'Standard'),
(487, 'A', 6, 11, 'Standard'),
(488, 'A', 7, 11, 'Standard'),
(489, 'A', 8, 11, 'Standard'),
(490, 'B', 1, 11, 'Standard'),
(491, 'B', 2, 11, 'Standard'),
(492, 'B', 3, 11, 'Standard'),
(493, 'B', 4, 11, 'Standard'),
(494, 'B', 5, 11, 'Standard'),
(495, 'B', 6, 11, 'Standard'),
(496, 'B', 7, 11, 'Standard'),
(497, 'B', 8, 11, 'Standard'),
(498, 'C', 1, 11, 'Standard'),
(499, 'C', 2, 11, 'Standard'),
(500, 'C', 3, 11, 'Standard'),
(501, 'C', 4, 11, 'Standard'),
(502, 'C', 5, 11, 'Standard'),
(503, 'C', 6, 11, 'Standard'),
(504, 'C', 7, 11, 'Standard'),
(505, 'C', 8, 11, 'Standard'),
(506, 'D', 1, 11, 'Standard'),
(507, 'D', 2, 11, 'Standard'),
(508, 'D', 3, 11, 'Standard'),
(509, 'D', 4, 11, 'Standard'),
(510, 'D', 5, 11, 'Standard'),
(511, 'D', 6, 11, 'Standard'),
(512, 'D', 7, 11, 'Standard'),
(513, 'D', 8, 11, 'Standard');

-- --------------------------------------------------------

--
-- Table structure for table `showtime`
--

CREATE TABLE `showtime` (
  `id` int(11) NOT NULL,
  `movieId` int(11) NOT NULL,
  `cinemaId` int(11) NOT NULL,
  `cinema` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `roomId` int(11) NOT NULL,
  `times` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`times`)),
  `startTime` datetime NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `room` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `showtime`
--

INSERT INTO `showtime` (`id`, `movieId`, `cinemaId`, `cinema`, `city`, `roomId`, `times`, `startTime`, `price`, `room`) VALUES
(1, 1, 3, NULL, NULL, 7, '[\"18:30 - 21:30\"]', '2025-12-20 06:00:00', 60000.00, NULL),
(2, 2, 2, NULL, NULL, 3, '[\"18:30 - 21:00\"]', '2025-12-22 07:06:00', 110000.00, NULL),
(4, 12, 2, NULL, NULL, 3, '[\"18:30 - 21:00\"]', '2025-12-19 07:30:00', 120000.00, NULL),
(5, 12, 2, NULL, NULL, 5, '[\"18:30 - 21:00\"]', '2025-12-15 23:07:00', 200000.00, NULL),
(6, 12, 2, NULL, NULL, 5, '[\"18:30 - 21:00\"]', '2025-12-15 12:04:00', 60000.00, NULL),
(7, 11, 2, NULL, NULL, 5, '[\"18:30 - 21:00\"]', '2025-12-09 03:08:00', 80000.00, NULL),
(8, 11, 2, NULL, NULL, 4, '[\"18:30 - 21:00\"]', '2025-12-21 22:10:00', 60000.00, NULL),
(9, 11, 3, NULL, NULL, 8, '[\"18:30 - 21:00\"]', '2025-12-20 00:05:00', 300000.00, NULL),
(10, 9, 2, NULL, NULL, 4, '[\"18:30 - 21:00\"]', '2025-12-20 14:10:00', 300000.00, NULL),
(11, 10, 2, NULL, NULL, 3, '[\"18:30 - 21:00\"]', '2025-12-28 10:00:00', 250000.00, NULL),
(12, 10, 2, NULL, NULL, 4, '[\"200000\"]', '2025-12-21 15:12:00', 200000.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ticket`
--

CREATE TABLE `ticket` (
  `id` int(11) NOT NULL,
  `showtimeId` int(11) NOT NULL,
  `price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `seatId` int(11) DEFAULT NULL,
  `bookingId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ticket`
--

INSERT INTO `ticket` (`id`, `showtimeId`, `price`, `seatId`, `bookingId`) VALUES
(1, 1, 6000.00, 53, 1),
(2, 1, 6000.00, 60, 1),
(3, 1, 6000.00, 69, 1),
(4, 1, 6000.00, 54, 2),
(5, 1, 6000.00, 55, 3),
(6, 1, 6000.00, 63, 3),
(7, 1, 6000.00, 71, 3),
(8, 1, 6000.00, 56, 4),
(9, 1, 6000.00, 64, 4),
(10, 2, 11000.00, 32, 5),
(11, 2, 11000.00, 40, 5),
(12, 1, 6000.00, 61, 6),
(13, 1, 6000.00, 62, 6),
(14, 1, 6000.00, 70, 6),
(15, 7, 80000.00, 214, 7),
(16, 7, 80000.00, 222, 7),
(17, 7, 80000.00, 230, 8),
(18, 7, 80000.00, 238, 8),
(19, 7, 80000.00, 215, 9),
(20, 7, 80000.00, 223, 9),
(21, 7, 80000.00, 216, 10);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_f9bb5ef37ba5803611f1121e0b3` (`movieId`);

--
-- Indexes for table `cinema`
--
ALTER TABLE `cinema`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cinema_room`
--
ALTER TABLE `cinema_room`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `movie`
--
ALTER TABLE `movie`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_454288774942b99d5127fb4173` (`slug`);

--
-- Indexes for table `seat`
--
ALTER TABLE `seat`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `showtime`
--
ALTER TABLE `showtime`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_2c35aa6c90c4dd7450dad753ae5` (`showtimeId`),
  ADD KEY `FK_ab9b02f72bbc7d05bd15a5cb6b4` (`seatId`),
  ADD KEY `FK_1c37434449c76d1725b3d4d6c80` (`bookingId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `cinema`
--
ALTER TABLE `cinema`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `cinema_room`
--
ALTER TABLE `cinema_room`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `movie`
--
ALTER TABLE `movie`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `seat`
--
ALTER TABLE `seat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=514;

--
-- AUTO_INCREMENT for table `showtime`
--
ALTER TABLE `showtime`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `ticket`
--
ALTER TABLE `ticket`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `FK_f9bb5ef37ba5803611f1121e0b3` FOREIGN KEY (`movieId`) REFERENCES `movie` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `ticket`
--
ALTER TABLE `ticket`
  ADD CONSTRAINT `FK_1c37434449c76d1725b3d4d6c80` FOREIGN KEY (`bookingId`) REFERENCES `booking` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_2c35aa6c90c4dd7450dad753ae5` FOREIGN KEY (`showtimeId`) REFERENCES `showtime` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_ab9b02f72bbc7d05bd15a5cb6b4` FOREIGN KEY (`seatId`) REFERENCES `seat` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
