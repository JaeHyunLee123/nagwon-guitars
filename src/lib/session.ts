import { cookies } from "next/headers";
import { getIronSession, SessionOptions } from "iron-session";
import type { Role } from "@prisma/client";

export interface SessionData {
  email?: string;
  userId?: string;
  role?: Role;
  isApproved?: boolean;
  username?: string;
  isLoggedIn: boolean;
}

const defaultSesion: SessionData = {
  isLoggedIn: false,
};

const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD!,
  cookieName: "user-session-data",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
};

const getIronSessionData = async () => {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSesion.isLoggedIn;
  }

  return session;
};

export default getIronSessionData;
