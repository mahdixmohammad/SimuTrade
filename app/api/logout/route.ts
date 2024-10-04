// app/api/logout/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
	// Clear the session cookie
	const cookie = cookies();
	cookie.set("session", "", { maxAge: -1 }); // Remove session cookie
	return NextResponse.json({ message: "Logout successful" });
}
