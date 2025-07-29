import { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';

function UserList() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    user_ID: null,
    user_name: '',
    user_email: '',
    user_address: '',
    role: '',
    user_type: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users
  const [roleFilter, setRoleFilter] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users
  const fetchUsers = () => {
    axios.get('http://localhost:5000/api/user')
      .then(response => {
        setUsers(response.data);
        setFilteredUsers(response.data); // Initially display all users
      })
      .catch(error => console.log(error));
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    filterUsers(e.target.value);
  };

  // Handle role filter change
  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    filterUsers(searchQuery, e.target.value, userTypeFilter);
  };

  // Handle user type filter change
  const handleUserTypeFilterChange = (e) => {
    setUserTypeFilter(e.target.value);
    filterUsers(searchQuery, roleFilter, e.target.value);
  };

  // Filter users based on search query, role, and user type
  const filterUsers = (query = searchQuery, role = roleFilter, userType = userTypeFilter) => {
    let filtered = users;

    if (query) {
      filtered = filtered.filter(user =>
        user.user_name.toLowerCase().includes(query.toLowerCase()) ||
        user.user_email.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (role) {
      filtered = filtered.filter(user => user.role === role);
    }

    if (userType) {
      filtered = filtered.filter(user => user.user_type === userType);
    }

    setFilteredUsers(filtered);
  };

  const handleDelete = (user_ID) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios.delete(`http://localhost:5000/api/user?user_ID=${user_ID}`)
        .then(response => {
          alert(response.data.Message);
          fetchUsers();
        })
        .catch(error => console.log(error));
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEdit = (user) => {
    setFormData({
      user_ID: user.user_ID,
      user_name: user.user_name,
      user_email: user.user_email,
      user_address: user.user_address,
      role: user.role,
      user_type: user.user_type
    });
    setIsEditing(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const apiUrl = `http://localhost:5000/api/user`;
    const method = isEditing ? 'put' : 'post';

    // Only send relevant fields
    const { user_ID, ...payload } = formData;
    const dataToSend = isEditing ? formData : payload;

    axios[method](apiUrl, dataToSend)
      .then(response => {
        alert(response.data.Message);
        fetchUsers();
        setFormData({ user_ID: null, user_name: '', user_email: '', user_address: '', role: '', user_type: '' });
        setIsEditing(false);
      })
      .catch(error => {
        console.log(error);
        alert("Failed to add/update user. See console for details.");
      });
  };

  return (
    <div className="main-content">
      <h2 className="page-header">{isEditing ? "Edit User" : "Add New User"}</h2>

      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          name="user_name"
          value={formData.user_name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="user_email"
          value={formData.user_email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="user_address"
          value={formData.user_address}
          onChange={handleChange}
          placeholder="Address"
          required
        />
        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Marketer">Marketer</option>
          <option value="Org_Rep">Org_Rep</option>
        </select>
        <select name="user_type" value={formData.user_type} onChange={handleChange} required>
          <option value="">Select User Type</option>
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
        </select>
        <button type="submit" className="btn btn-primary">
          {isEditing ? "Update User" : "Add User"}
        </button>
      </form>

      <h2 className="page-header">All Users</h2>
      
      {/* Filter Section */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by Name or Email"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <select onChange={handleRoleFilterChange} value={roleFilter} className="filter-select">
          <option value="">Filter by Role</option>
          <option value="Admin">Admin</option>
          <option value="Marketer">Marketer</option>
          <option value="Org_Rep">Org_Rep</option>
        </select>
        <select onChange={handleUserTypeFilterChange} value={userTypeFilter} className="filter-select">
          <option value="">Filter by User Type</option>
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>User Name</th>
                <th>User Email</th>
                <th>User Address</th>
                <th>User Role</th>
                <th>User Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.user_ID}>
                  <td>{user.user_ID}</td>
                  <td>{user.user_name}</td>
                  <td>{user.user_email}</td>
                  <td>{user.user_address}</td>
                  <td>{user.role}</td>
                  <td>{user.user_type}</td>
                  <td>
                    <button className="btn" onClick={() => handleEdit(user)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(user.user_ID)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserList;
