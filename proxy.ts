import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    return NextResponse.redirect(new URL('/blog', request.url))
}

export const config = {
    matcher: '/',
}