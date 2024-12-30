import { NextResponse } from "next/server";
import getIronSessionData from "@/lib/session"; // Adjust the path to your session code

export async function GET() {
  try {
    const session = await getIronSessionData();
    return NextResponse.json(session);
  } catch (e) {
    console.log(e);
    return Response.json(
      { message: "unexpected server error" },
      { status: 500 }
    );
  }
}
