import { authMiddleware } from "@clerk/nextjs";
//The authMiddleware from @clerk/nextjs is a middleware function that helps
//protect routes in your Next.js application by enforcing authentication
//requirements. It integrates with the Clerk authentication service to ensure
// that only authenticated users can access certain pages or endpoints.

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: ["/"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
