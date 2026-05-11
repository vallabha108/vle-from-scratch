import { auth } from "@/auth";

export const middleware = auth;

export const config = {
  // Protect everything under /dashboard. Auth.js handles the redirect.
  matcher: ["/dashboard/:path*"],
};
