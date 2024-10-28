import React, { useState } from 'react';

const SecurityPassword = () => {
  const [password, setPassword] = useState('');

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes hacer una petición para actualizar la contraseña
    alert('Password updated successfully!');
  };

  return (
    <div>
      <h2>Security and Password</h2>
      <form onSubmit={handleSubmit}>
        <label>
          New Password:
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </label>
        <br />
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default SecurityPassword;
