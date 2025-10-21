import React, { useReducer, useEffect, useState } from "react";
import "./App.css";
import data from "./data.json";

function reducer(state, action) {
  switch (action.type) {
    case "LOAD_DATA":
      return action.payload;

    case "ADD_WIDGET":
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.categoryId
            ? {
                ...cat,
                widgets: [
                  ...cat.widgets,
                  {
                    id: Date.now(),
                    title: action.payload.title,
                    content: action.payload.content,
                  },
                ],
              }
            : cat
        ),
      };

    case "REMOVE_WIDGET":
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.categoryId
            ? {
                ...cat,
                widgets: cat.widgets.filter(
                  (widget) => widget.id !== action.widgetId
                ),
              }
            : cat
        ),
      };

    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, { categories: [] });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [newWidget, setNewWidget] = useState({ title: "", content: "" });

  useEffect(() => {
    dispatch({ type: "LOAD_DATA", payload: data });
  }, []);

  const filteredCategories = state.categories.map((cat) => ({
    ...cat,
    widgets: cat.widgets.filter((w) =>
      w.title.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  const handleAddWidget = () => {
    if (!selectedCategory || !newWidget.title.trim()) return;
    dispatch({
      type: "ADD_WIDGET",
      categoryId: Number(selectedCategory),
      payload: newWidget,
    });
    setNewWidget({ title: "", content: "" });
  };

  return (
    <div className="app-container">
      <h1>📊 Executive Dashboard</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search widgets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Add Widget Form */}
      <div className="add-widget">
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          defaultValue=""
        >
          <option value="">Select Category</option>
          {state.categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Widget Title"
          value={newWidget.title}
          onChange={(e) =>
            setNewWidget({ ...newWidget, title: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Widget Content"
          value={newWidget.content}
          onChange={(e) =>
            setNewWidget({ ...newWidget, content: e.target.value })
          }
        />
        <button onClick={handleAddWidget}>+ Add Widget</button>
      </div>

      {/* Categories & Widgets */}
      {filteredCategories.map((cat) => (
        <div key={cat.id} className="category">
          <h2>{cat.name}</h2>
          <div className="widget-grid">
            {cat.widgets.length > 0 ? (
              cat.widgets.map((widget) => (
                <div key={widget.id} className="widget-circle">
                  <button
                    className="remove-btn"
                    onClick={() =>
                      dispatch({
                        type: "REMOVE_WIDGET",
                        categoryId: cat.id,
                        widgetId: widget.id,
                      })
                    }
                  >
                    ✖
                  </button>
                  <div className="widget-content">
                    <h3>{widget.title}</h3>
                    <p>{widget.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-widget">No widgets found.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}



