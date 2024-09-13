import { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [edit, setEdit] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState({
    id: "",
    name: "",
  });
  const [editUsername, setEditUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const API_URL = "https://user-backend-mf7u.onrender.com";

  const addusers = async (user) => {
    try {
      const response = await axios.post(`${API_URL}/users`, {
        name: user,
      });
      if (response) {
        getusers();
        setUsername("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getusers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteusers = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/users/${id}`);
      if (response.data.message) {
        getusers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const editusers = (user, id) => {
    setEdit(true);
    setCurrentUserToEdit({
      id: id,
      name: user,
    });
    setEditUsername(user);
  };

  const saveEdit = async (id, user) => {
    try {
      const response = await axios.put(`${API_URL}/users${id}`, {
        name: user,
      });
      if (response.data) {
        getusers();
      }
    } catch (error) {
      console.log(error);
    }
    setEdit(false);
    setCurrentUserToEdit({
      id: "",
      name: "",
    });
    setEditUsername("");
  };

  useEffect(() => {
    getusers();
  }, []);
  return (
    <div
      className="d-flex flex-column align-items-center p-3"
      style={{ height: "100vh" }}
    >
      <h2>Users</h2>
      <div className="d-flex gap-2">
        <input
          type="text"
          value={edit ? editUsername : username}
          onChange={(e) =>
            edit ? setEditUsername(e.target.value) : setUsername(e.target.value)
          }
        />
        {!edit ? (
          <button
            className="btn btn-primary"
            onClick={() => addusers(username)}
          >
            Add
          </button>
        ) : (
          <button
            className="btn btn-success"
            onClick={() => saveEdit(currentUserToEdit.id, editUsername)}
          >
            Save
          </button>
        )}
      </div>
      {loading ? (
        <div></div>
      ) : users?.length > 0 ? (
        users?.map((user, index) => (
          <div key={index} className="d-flex align-items-center p-3 gap-2">
            <div>{user.name}</div>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => editusers(user?.name, user?._id)}
            >
              Edit
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => deleteusers(user?._id)}
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <div className="d-flex align-items-center p-3 gap-2">
          No Users added
        </div>
      )}
    </div>
  );
}

export default App;
