// src/components/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Llama a la API para obtener la lista de usuarios
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://localhost:7243/api/admin/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        alert('Error loading users');
      }
    };
    
    fetchUsers();
  }, []);

  const handleUserClick = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="user-list">
        <h3>Users</h3>
        {users.length > 0 ? (
          <ul>
            {users.map(user => (
              <li key={user.id} onClick={() => handleUserClick(user.id)}>
                {user.email}
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
