import { connectDB } from "@/lib/db";
import { authorizeUser } from "@/lib/auth";
import Todo from "@/models/Todo";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  const user = await authorizeUser(req);
  if (!user) return;

  const { text } = await req.json();
  if (!text)
    return NextResponse.json({ error: "Text is required!" }, { status: 400 });

  try {
    const newTodo = JSON.stringify(new Todo({ text }));
    user.todos.push(newTodo);
    await user.save();

    return NextResponse.json(
      { message: "Todo added", todo: JSON.parse(newTodo) },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  await connectDB();

  const user = await authorizeUser(req);
  if (!user) return;

  try {
    const todos = await user.todos.map((todo) => JSON.parse(todo));

    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  await connectDB();

  const user = await authorizeUser(req);
  if (!user) return;

  try {
    user.todos = [];
    await user.save();

    return NextResponse.json(
      { message: "All Todos were deleted!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
