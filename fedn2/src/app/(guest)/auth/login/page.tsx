import Login from "@/components/auth/login";
import Image from "next/image";
import batmanBg from "./batman2.jpg";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <Image
          src={batmanBg}
          alt=""
          fill
          priority
          className="object-cover blur-md brightness-100 scale-105"
        />
      </div>
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/35 to-black/55"
        aria-hidden="true"
      />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-3xl rounded-2xl bg-white/85 p-6 shadow-2xl backdrop-blur">
          <Login />
        </div>
      </div>
    </div>
  );
}
