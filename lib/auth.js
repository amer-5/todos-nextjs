import { getUserFromToken } from "./getUserFromToken";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const authorizeUser = async (req) => {
  const auth = req.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer "))
    return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });

  const token = auth.split(" ")[1];
  const userData = getUserFromToken(token);
  if (!userData)
    return NextResponse.json({ error: "Invalid token!" }, { status: 401 });

  try {
    const user = await User.findById(userData.id);
    if (!user)
      return NextResponse.json({ error: "User not found!" }, { status: 404 });

    return user;
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
};
