import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
// import { SessionPayload } from '@/app/lib/definitions'

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
	return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("1d").sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
	try {
		const { payload } = await jwtVerify(session, encodedKey, {
			algorithms: ["HS256"],
		});
		return payload;
	} catch (error) {
		console.log("Failed to verify session");
	}
}

export async function createSession(userId: string) {
	const expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
	const session = await encrypt({ userId, expiresAt });

	cookies().set("session", session, {
		httpOnly: true,
		secure: true,
		expires: expiresAt,
		sameSite: "lax",
		path: "/",
	});
}

export async function verifySession() {
	const cookie = cookies().get("session")?.value;
	const session: any = await decrypt(cookie);

	if (!session?.userId) {
		return { isAuth: false, userId: "" };
	}

	return { isAuth: true, userId: session!.userId };
}
