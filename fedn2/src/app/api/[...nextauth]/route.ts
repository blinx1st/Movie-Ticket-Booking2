// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth"; // đường dẫn tới file bạn gửi ở trên

export const { GET, POST } = handlers;
