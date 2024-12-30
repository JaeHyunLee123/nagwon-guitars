import getIronSessionData from "@/lib/session"; // Adjust the path to your session code

export async function POST() {
  try {
    const session = await getIronSessionData();
    session.destroy();

    return Response.json({ status: 200 });
  } catch (e) {
    console.log(e);
    return Response.json(
      { message: "unexpected server error" },
      { status: 500 }
    );
  }
}
