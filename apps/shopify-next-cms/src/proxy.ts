import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/cms") && !pathname.startsWith("/cms/login")) {
    const token = request.cookies.get("cms-token")?.value;

    if (token !== process.env.CMS_SECRET) {
      return NextResponse.redirect(new URL("/cms/login", request.url));
    }
  }

  return NextResponse.next();
}

export const proxyConfig = {
  matcher: ["/cms/:path*"],
};
