import React, { useState, useEffect } from "react";
import { TbRefresh } from "react-icons/tb";
import { Rings } from "react-loader-spinner";
import TodoItem from "../TodoItem";
import "./index.css";

const apiStatusConstants = {
  initial: "INITIAL",
  loading: "LOADING",
  success: "SUCCESS",
  failure: "FAILURE",
};

const TodoList = () => {
  const [todoList, setTodoList] = useState([]);
  const [todosCount, setTodosCount] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  useEffect(() => {
    fetchTodoList();
  }, []);

  const fetchTodoList = async () => {
    setApiStatus(apiStatusConstants.loading);
    try {
      const response = await fetch(
        "https://mern-todo-mongo-backend-hooks.onrender.com/api/todos"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data = await response.json();
      setTodoList(data);
      setTodosCount(data.length);
      setApiStatus(apiStatusConstants.success);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const onAddTodo = async () => {
    if (!userInput) {
      alert("Enter valid text");
      return;
    }

    const newTodo = {
      text: userInput,
      uniqueNo: todosCount + 1,
      isChecked: false,
    };

    try {
      const response = await fetch(
        "https://mern-todo-mongo-backend-hooks.onrender.com/api/todos",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTodo),
        }
      );
      const addedTodo = await response.json();
      setTodoList((prevTodos) => [...prevTodos, addedTodo]);
      setTodosCount((prevCount) => prevCount + 1);
      setUserInput("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const onTodoStatusChange = async (todoId, isChecked) => {
    try {
      await fetch(
        `https://mern-todo-mongo-backend-hooks.onrender.com/api/todos/${todoId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isChecked }),
        }
      );
      setTodoList((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === todoId ? { ...todo, isChecked } : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const onDeleteTodo = async (todoId) => {
    try {
      await fetch(
        `https://mern-todo-mongo-backend-hooks.onrender.com/api/todos/${todoId}`,
        {
          method: "DELETE",
        }
      );
      fetchTodoList();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const startEditingTodo = (todo) => {
    setEditingTodoId(todo._id);
    setEditingText(todo.text);
  };

  const handleEditInputChange = (event) => {
    setEditingText(event.target.value);
  };

  const saveEditedTodo = async () => {
    try {
      await fetch(
        `https://mern-todo-mongo-backend-hooks.onrender.com/api/todos/${editingTodoId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: editingText }),
        }
      );
      setEditingTodoId(null);
      setEditingText("");
      fetchTodoList();
    } catch (error) {
      console.error("Error saving edited todo:", error);
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleEditKeyPress = (event) => {
    if (event.key === "Enter") {
      saveEditedTodo();
    }
  };

  const renderLoadingView = () => (
    <div className="loading-container">
      <Rings
        visible={true}
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="rings-loading"
      />
    </div>
  );

  const renderFailureView = () => (
    <div>
      <h1>Something went wrong!</h1>
    </div>
  );

  const onClickRefreshBtn = () => {
    fetchTodoList();
  };

  const renderTodos = () => (
    <ul className="todo-items-container">
      {todoList.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          editingTodoId={editingTodoId}
          editingText={editingText}
          onTodoStatusChange={onTodoStatusChange}
          onDeleteTodo={onDeleteTodo}
          startEditingTodo={startEditingTodo}
          onEditInputChange={handleEditInputChange}
          onEditKeyPress={handleEditKeyPress}
          saveEditedTodo={saveEditedTodo}
        />
      ))}
    </ul>
  );

  const listView = () => {
    switch (apiStatus) {
      case apiStatusConstants.loading:
        return renderLoadingView();
      case apiStatusConstants.success:
        return renderTodos();
      case apiStatusConstants.failure:
        return renderFailureView();
      default:
        return null;
    }
  };

  return (
    <div className="background-container">
      <div className="todo-app-container">
        <h1>Todo List</h1>

        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          className="todo-input"
          placeholder="What needs to be done?"
        />
        <button onClick={onAddTodo} className="add-todo-button">
          Add Todo
        </button>

        <div className="save-head-container">
          <p>Create Tasks</p>
          <button
            type="button"
            onClick={onClickRefreshBtn}
            className="refresh-button"
            disabled={apiStatus === apiStatusConstants.loading}
          >
            <TbRefresh size={18} />
          </button>
        </div>

        {listView()}
      </div>
    </div>
  );
};

export default TodoList;
