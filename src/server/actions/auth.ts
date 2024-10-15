"use server";

import db from "@/lib/db";
import { loginDTO, registerDTO, TLoginDTO, TRegisterDTO } from "@/lib/dto/auth";
import { generateHashPassword, verifyHashPassword } from "@/lib/hash";
import { lucia } from "@/lib/lucia";
import { Session, User } from "lucia";
import { ApiError } from "next/dist/server/api-utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

export const login = async (dto: TLoginDTO) => {
  try {
    const body = loginDTO.parse(dto);
    const user = await db.user.findUnique({
      where: { username: body.username },
    });
    if (!user) throw new ApiError(401, "Invalid username or password");
    const verified = await verifyHashPassword({
      password: body.password,
      hash: user.password,
    });
    if (!verified) throw new ApiError(401, "Invalid username or password");
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return redirect("/");
  } catch (err) {
    if (err instanceof Error) {
      throw new ApiError(401, "Invalid username or password");
    }
    throw new ApiError(500, "Internal server error");
  }
};

export const register = async (dto: TRegisterDTO) => {
  try {
    const { name, username, password } = registerDTO.parse(dto);
    const passwordHash = await generateHashPassword({ password });
    await db.user.create({
      data: { password: passwordHash, username, name },
    });
    return redirect("/login");
  } catch (err) {
    if (err instanceof Error) {
      throw new ApiError(405, "Bad request");
    }
    throw new ApiError(500, "Internal server error");
  }
};


export const validateRequest = cache(
	async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
		const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
		if (!sessionId) {
			return {
				user: null,
				session: null
			};
		}

		const result = await lucia.validateSession(sessionId);
		// next.js throws when you attempt to set cookie when rendering page
		try {
			if (result.session && result.session.fresh) {
				const sessionCookie = lucia.createSessionCookie(result.session.id);
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie();
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
		} catch {}
		return result;
	}
);


export const logout = async () => {
  try {
    const { session } = await validateRequest();
	if (!session) {
		return {
			error: "Unauthorized"
		};
	}

	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	return redirect("/login");
  } catch (err) {
    if (err instanceof Error) {
      throw new ApiError(401, "Invalid username or password");
    }
    throw new ApiError(500, "Internal server error");
  }
}
