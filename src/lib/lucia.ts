import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Lucia } from "lucia";
import db from "./db";

const adapter = new PrismaAdapter(db.session, db.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      sameSite: "lax",
      secure: process.env.VERCEL_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
      name: attributes.name,
			username: attributes.username,
		};
	}
});

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      name: string;
      username: string;
    }
  }
  
}


