import React, { useState, useEffect } from "react";
import "./Todo.css";
import ok from "../assets/ok.png";
import notok from "../assets/notok.png";
import garbage from "../assets/garbage.png";
import edit from "../assets/pencil.png";

const Todo = () => {
  const [todo, setTodo] = useState([]);
  const [input, setInput] = useState("");
  const [currPage, setCurrPage] = useState(1);
  const [totalItem, setTotalItem] = useState(0);
  const totalPages = Math.round(totalItem / 2);
  const [showEdit, setShowEdit] = useState({
    status: false,
    id: 0,
  });
  const [editInp, setEditInp] = useState("");
  // const [status, setStatus] = useState(false);

  const getData = async () => {
    let res = await fetch(
      `http://localhost:5000/data?_page=${currPage}&_limit=2`
    );
    let item = await res.json();
    let x = res.headers.get("X-Total-Count");
    setTotalItem(x);
    // console.log(x);
    setTodo(item);
  };
  useEffect(() => {
    getData();
  }, [input, currPage]);
  // console.log(todo);

  const add = async (event) => {
    event.preventDefault();

    const newTask = { title: input, completed: false };
    await fetch("http://localhost:5000/data", {
      method: "POST",
      body: JSON.stringify(newTask),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setInput("");
  };
  // console.log("pages", totalPages);

  const RenderPage = () => {
    if (currPage === 1) {
      return (
        <div className="btns">
          <button disabled>Prev</button>
          <p>1</p>
          <button onClick={() => setCurrPage(currPage + 1)}>Next</button>
        </div>
      );
    } else if (currPage > 1 && currPage < totalPages) {
      return (
        <div className="btns">
          <button onClick={() => setCurrPage(currPage - 1)}>Prev</button>
          <p>{currPage}</p>
          <button onClick={() => setCurrPage(currPage + 1)}>Next</button>
        </div>
      );
    } else {
      return (
        <div className="btns">
          <button onClick={() => setCurrPage(currPage - 1)}>Prev</button>
          <p>{currPage}</p>
          <button disabled>Next</button>
        </div>
      );
    }
  };
  console.log(totalPages);

  // const changeCompleted = async (e) => {
  //   console.log(e);
  // };

  const changeStatus = async (e) => {
    console.log(e);
    const newTask = { completed: e.completed ? false : true };
    await fetch(`http://localhost:5000/data/${e.id}`, {
      method: "PATCH",
      body: JSON.stringify(newTask),
      headers: {
        "Content-Type": "application/json",
      },
    });
    getData();
  };

  const delTask = async (e) => {
    await fetch(`http://localhost:5000/data/${e.id}`, {
      method: "DELETE",
    });
    getData();
  };

  const editTask = async (event) => {
    event.preventDefault();
    console.log(editInp);
    const editedTodo = {
      title: editInp,
    };
    await fetch(`http://localhost:5000/data/${showEdit.id}`, {
      method: "PATCH",
      body: JSON.stringify(editedTodo),
      headers: {
        "Content-Type": "application/json",
      },
    });
    getData();
    setShowEdit({
      status: false,
      id: 0,
    });
  };

  return (
    <div className="container">
      <h1>Todo List</h1>
      <div className="todos">
        <form onSubmit={add}>
          <input
            className="inp"
            type="text"
            placeholder="Enter todo here..."
            required
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          <button className="btn" type="submit">
            ADD
          </button>
        </form>
        <form
          className="editForm"
          style={{ display: showEdit.status ? "flex" : "none" }}
          onSubmit={editTask}
        >
          <input
            className="inp"
            type="text"
            placeholder="Edit todo here..."
            required
            value={editInp}
            onChange={(e) => {
              setEditInp(e.target.value);
            }}
          />
          <button className="btn" type="submit">
            EDIT
          </button>
        </form>
        <div className="task">
          {todo.map((e) => {
            console.log(e);
            return (
              <div className="taskItem" key={e.id}>
                <div className="itembegain">
                  <img
                    src={ok}
                    style={{ display: e.completed ? "flex" : "none" }}
                    alt=""
                    onClick={() => changeStatus(e)}
                  />
                  <img
                    src={notok}
                    style={{ display: !e.completed ? "flex" : "none" }}
                    alt=""
                    onClick={() => changeStatus(e)}
                  />
                  <div>{e.title}</div>
                </div>
                <div className="itemends">
                  <img
                    src={edit}
                    alt=""
                    onClick={() => {
                      setShowEdit({
                        status: true,
                        id: e.id,
                      });
                      setEditInp(e.title);
                    }}
                  />
                  <img src={garbage} alt="" onClick={() => delTask(e)} />
                </div>
              </div>
            );
          })}
        </div>
        <RenderPage />
      </div>
    </div>
  );
};

export default Todo;
