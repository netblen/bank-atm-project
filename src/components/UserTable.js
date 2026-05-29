// src/components/UserTable.js
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import './UserTable.css';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://localhost:7243/api/Users/users');
        setUsers(response.data.$values || []);
      } catch (fetchError) {
        console.error('Error fetching users:', fetchError);
        setError('Error loading users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
      return (
        fullName.includes(query) ||
        (user.email || '').toLowerCase().includes(query) ||
        (user.city || '').toLowerCase().includes(query) ||
        (user.rol || '').toLowerCase().includes(query)
      );
    });
  }, [searchTerm, users]);

  const adminCount = users.filter((user) => (user.rol || '').trim() === 'Admin').length;

  const handleDelete = async (userId) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    try {
      await axios.delete(`https://localhost:7243/api/Users/${userId}`);
      setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userId));
    } catch (deleteError) {
      console.error('Error deleting user:', deleteError);
      setError('Error deleting user.');
    }
  };

  const handleEdit = (userId) => {
    navigate(`/edit-user-admin/${userId}`);
  };

  const handleExport = () => {
    const csv = Papa.unparse(filteredUsers);
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

  return (
    <main className="users-page">
      <section className="users-shell">
        <header className="users-header">
          <div>
            <p className="users-eyebrow">User management</p>
            <h1>Manage simulator users.</h1>
            <p>Search accounts, review roles, export user data, and jump into profile editing.</p>
          </div>

          <div className="users-summary">
            <div>
              <strong>{users.length}</strong>
              <span>Total users</span>
            </div>
            <div>
              <strong>{adminCount}</strong>
              <span>Admins</span>
            </div>
          </div>
        </header>

        <section className="users-toolbar">
          <label>
            <span>Search users</span>
            <input
              type="search"
              value={searchTerm}
              placeholder="Search name, email, city, role..."
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          <button type="button" onClick={handleExport} disabled={filteredUsers.length === 0}>
            Export CSV
          </button>
        </section>

        {error && <div className="users-message">{error}</div>}

        <section className="users-table-card">
          {loading ? (
            <p className="users-empty">Loading users...</p>
          ) : filteredUsers.length > 0 ? (
            <div className="users-table-wrap">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>City</th>
                    <th>Postal</th>
                    <th>Profession</th>
                    <th>Birth date</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>
                        <strong>{user.first_name} {user.last_name}</strong>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.telephone}</td>
                      <td>{user.city}</td>
                      <td>{user.postal_code}</td>
                      <td>{user.profession}</td>
                      <td>{new Date(user.date_of_birth).toLocaleDateString()}</td>
                      <td>
                        <span className={`users-role ${(user.rol || '').trim() === 'Admin' ? 'is-admin' : ''}`}>
                          {(user.rol || '').trim()}
                        </span>
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="users-actions">
                          <button type="button" onClick={() => handleEdit(user.id)}>Edit</button>
                          <button type="button" className="is-danger" onClick={() => handleDelete(user.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="users-empty">No users found.</p>
          )}
        </section>
      </section>
    </main>
  );
};

export default UserTable;
