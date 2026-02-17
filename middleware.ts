export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/risks/:path*", "/controls/:path*", "/tasks/:path*", "/evidence/:path*", "/settings/:path*"],
};
