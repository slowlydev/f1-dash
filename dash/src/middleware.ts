import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	const visitedThisWeek = request.cookies.has("visited-this-week");

	if (visitedThisWeek) return NextResponse.next();

	const response = NextResponse.redirect(new URL("/home", request.url));

	const oneWeek = 86400 * 7;
	const currentDate = Date.now() + oneWeek * 1000;

	response.cookies.set("visited-this-week", "ofc he did", {
		expires: new Date(currentDate),
		sameSite: true,
	});

	return response;
}
