// src/components/UserTable.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserTable.css';
import Papa from 'papaparse';


const UserTable = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://localhost:7243/api/Users/users');
        setUsers(response.data.$values);
      } catch (error) {
        console.error('Error fetching users:', error);
        alert('Error loading users');
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (confirmed) {
      try {
        await axios.delete(`https://localhost:7243/api/Users/${userId}`);
        setUsers(users.filter(user => user.id !== userId)); 
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
  };

  const handleEdit = (userId) => {
    navigate(`/edit-user-admin/${userId}`);
  };

  const handleExport = () => {
    const csv = Papa.unparse(users);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'users.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://localhost:7243/api/Users/users');
        setUsers(response.data.$values);
      } catch (error) {
        console.error('Error fetching users:', error);
        alert('Error loading users');
      } finally {
        setLoading(false);
      }
    };

  fetchUsers();
}, []);

  return (
    <div className="user-table">
      <h3>Users</h3>
      {loading ? (
      <p>Loading users...</p>
    ) : users.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>Postal Code</th>
              <th>Profession</th>
              <th>Date of Birth</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Security Question</th>
              <th>Security Answer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.first_name} {user.last_name}</td>
                <td>{user.email}</td>
                <td>{user.telephone}</td>
                <td>{user.city}</td>
                <td>{user.postal_code}</td>
                <td>{user.profession}</td>
                <td>{new Date(user.date_of_birth).toLocaleDateString()}</td>
                <td>{user.rol.trim()}</td>
                <td>{new Date(user.created_at).toLocaleString()}</td>
                <td>{user.security_question}</td>
                <td>{user.security_answer}</td>
                <td>
                  <button onClick={() => handleEdit(user.id)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p>
      )}
      <button onClick={handleExport}>Export to CSV</button>
    </div>
  );
};

export default UserTable;
