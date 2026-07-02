import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth().protect();
  }
});

export const config = {
  matcher: [
    // /api/track 不强制登录，但仍经过 clerkMiddleware 以便 auth() 可读 session
    "/((?!_next|favicon|.*\\.svg).*)",
    "/__clerk/:path*",
  ],
};
