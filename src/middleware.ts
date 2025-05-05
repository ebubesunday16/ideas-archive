// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Get the pathname from the request
    const pathname = req.nextUrl.pathname;
    
    // Check if the route is an admin route
    if (pathname.includes("/admin")) {
      // Get the token and check if the email is the admin email
      const token = req.nextauth.token;
      if (token?.email !== "ebubesunday16@gmail.com") {
        // If not the admin email, redirect to homepage or unauthorized page
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      // Return true if the user is authenticated
      authorized: ({ token }) => !!token,
    },
  }
);

// Specify which paths this middleware should run on
export const config = {
    matcher: [
      // "/ideas/admin",
      "/ideas/:path*/james"
    ],
  };

  
  