"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";

const Page = () => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [token, setToken] = useState("");
  const name = 

  useEffect(() => {
    const fetchTodos = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) redirect("/auth/login");
      else {
        setToken(storedToken);
        await getTodos(storedToken);
      }
    };

    fetchTodos();
  }, []);

  const getTodos = async (token) => {
    const response = await fetch("http://localhost:3000/api/todos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setTodos(data);
  };

  const handleNewTodo = async () => {
    if (!text.trim()) return;

    const response = await fetch("http://localhost:3000/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    setText("");
    setTodos((prev) => [...prev, data.todo]);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/api/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    setTodos((prev) => prev.filter((todo) => todo._id !== id));
  };

  const handleStatus = async (id) => {
    await fetch(`http://localhost:3000/api/todos/status/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    setTodos((prev) =>
      prev.map((todo) =>
        todo._id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  const handleEdit = async (id) => {
    if (!text.trim())
      return alert("U input field ukucajte novi text pa pritisnite button");

    await fetch(`http://localhost:3000/api/todos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: text,
    });

    setTodos((prev) =>
      prev.map((todo) => (todo._id === id ? { ...todo, text } : todo))
    );
    setText("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token")
    redirect("/auth/login");
  }

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleNewTodo}>Add Todo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className="flex gap-3">
            <p>{todo.text}</p>
            <button onClick={() => handleStatus(todo._id)}>
              {!todo.isCompleted ? " Mark as done " : " Mark as undone "}
            </button>
            <button onClick={() => handleDelete(todo._id)}>Delete</button>
            <button onClick={() => handleEdit(todo._id)}>Edit</button>
          </li>
        ))}
      </ul>
      <button onClick={() => handleLogout()}>Logout - {name}</button>
    </div>
  );
};

export default Page;
