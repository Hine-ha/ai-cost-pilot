import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth().protect();
  }
});

export const config = {
  matcher: [
    // /api/track 公开（API Key）；/api/dashboard 需经过 clerkMiddleware 以便 auth() 可用
    "/((?!api/track|_next|favicon|.*\\.svg).*)",
    "/__clerk/:path*",
  ],
};
