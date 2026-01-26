import { NextRequest, NextResponse } from "next/server";
import { auth } from "@workspace/auth";
import type { Route } from "next";

const AUTH_ROUTE_PREFIXES: Route[] = ["/login", "/reset-password"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isAuthRoute = AUTH_ROUTE_PREFIXES.some((route) =>
        pathname.startsWith(route)
    );

    const session = await auth.api.getSession({
        headers: request.headers,
    });

    if (session && isAuthRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
    }
    if (!session && !isAuthRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    const headers = new Headers(request.headers);
    headers.set("x-path", pathname);

    return NextResponse.next({
        request: { headers },
    });
}

export const config = {
    matcher: [
        "/((?!_next/|api/|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map|txt|xml|json|woff2?|ttf|eot|mp4|webm)).*)",
    ],
};
