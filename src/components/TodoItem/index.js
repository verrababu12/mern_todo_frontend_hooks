import React from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "./index.css";

const TodoItem = ({
  todo,
  editingTodoId,
  editingText,
  onTodoStatusChange,
  startEditingTodo,
  onDeleteTodo,
  onEditInputChange,
  onEditKeyPress,
  saveEditedTodo,
}) => {
  const handleCheckboxChange = () => {
    onTodoStatusChange(todo._id, !todo.isChecked);
  };

  const handleEditClick = () => {
    startEditingTodo(todo);
  };

  const handleDeleteClick = () => {
    onDeleteTodo(todo._id);
  };

  return (
    <li className="todo-item-container">
      <input
        type="checkbox"
        checked={!!todo.isChecked}
        onChange={handleCheckboxChange}
        className="checkbox-input"
        id={todo._id}
      />

      {editingTodoId === todo._id ? (
        <input
          type="text"
          value={editingText}
          onChange={onEditInputChange}
          onKeyDown={onEditKeyPress}
          onBlur={saveEditedTodo}
          className="edit-input"
          autoFocus
        />
      ) : (
        <label
          htmlFor={todo._id}
          className={`checkbox-label ${todo.isChecked ? "checked" : ""}`}
        >
          {todo.text}
        </label>
      )}
      {!todo.isChecked && (
        <div className="edit-icon-container">
          <FaEdit className="edit-icon" onClick={handleEditClick} />
        </div>
      )}
      <div className="delete-icon-container" onClick={handleDeleteClick}>
        <MdDelete className="delete-icon" />
      </div>
    </li>
  );
};

export default TodoItem;
