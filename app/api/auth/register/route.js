import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  const { email, name, password } = await req.json();

  if (!email || !name || !password)
    return NextResponse.json(
      { error: "Please provide all details!" },
      { status: 400 }
    );

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return NextResponse.json(
      { error: "Email already in use!" },
      { status: 400 }
    );

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ email, name, password: hashedPassword });

  const token = jwt.sign(
    { id: newUser._id, email: newUser.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return NextResponse.json({ token }, { status: 201 });
}
