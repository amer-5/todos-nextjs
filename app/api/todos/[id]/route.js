import { connectDB } from "@/lib/db";
import { authorizeUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  await connectDB();

  const user = await authorizeUser(req);
  if (!user) return;

  try {
    const { id } = await params;
    const { text } = await req.json();

    const todos = user.todos.map((todo) => JSON.parse(todo));

    const todoIndex = todos.findIndex((todo) => todo._id === id);

    if (todoIndex === -1)
      return NextResponse.json(
        { message: "Todo not found!", id },
        { status: 404 }
      );
    const todo = todos[todoIndex];

    todo.text = text;

    user.todos[todoIndex] = JSON.stringify(todos[todoIndex]);

    await user.save();

    return NextResponse.json({ todo }, { status: 200 });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectDB();

  const user = await authorizeUser(req);
  if (!user) return;

  try {
    const { id } = await params;

    const todoIndex = user.todos.findIndex(
      (todo) => JSON.parse(todo)._id === id
    );
    if (todoIndex === -1)
      return NextResponse.json({ message: "Todo not found!", id });

    user.todos.splice(todoIndex, 1);

    await user.save();

    return NextResponse.json({ todos: user.todos }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
