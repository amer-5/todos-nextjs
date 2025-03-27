import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  if (!email || !password)
    return NextResponse.json(
      { error: "Please provide all details!" },
      { status: 400 }
    );

  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json(
      { error: "Email is not in use!" },
      { status: 400 }
    );

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return NextResponse.json({ error: "Wrong Password!" }, { status: 400 });

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return NextResponse.json({ token }, { status: 200 });
}
