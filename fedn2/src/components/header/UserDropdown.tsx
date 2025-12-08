import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  // Hàm xử lý đăng xuất (Xóa cookie/localStorage và về trang login)
  const handleLogout = () => {
    // 1. Xóa các dữ liệu phiên làm việc
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    // localStorage.clear(); // Có thể bật nếu muốn xóa sạch dữ liệu admin đã nhập

    // 2. Chuyển hướng
    router.push("/auth/signin");
  };

  return (
    <div className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            System Administrator
          </span>
          <span className="block text-xs">Admin</span>
        </span>

        <span className="h-12 w-12 rounded-full overflow-hidden border border-gray-300">
            {/* Avatar mặc định cho Admin */}
            <img
                src="https://ui-avatars.com/api/?name=System+Admin&background=0D8ABC&color=fff"
                alt="User"
                className="h-full w-full object-cover"
            />
        </span>
        
        <ChevronDown className={`hidden fill-current sm:block w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
      </Link>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark z-99999">
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
            <li>
              <Link
                href="/admin/users" // Link đến trang quản lý User bạn vừa làm
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                onClick={() => setDropdownOpen(false)}
              >
                <User className="w-5 h-5" />
                My Profile
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings className="w-5 h-5" />
                Account Settings
              </Link>
            </li>
          </ul>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownUser;