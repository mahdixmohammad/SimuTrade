import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session"; // Assuming decrypt function exists

export async function GET() {
	const cookie = cookies().get("session")?.value;
	const session = await decrypt(cookie);

	if (session?.userId) {
		return NextResponse.json({ isAuth: true });
	} else {
		return NextResponse.json({ isAuth: false });
	}
}
