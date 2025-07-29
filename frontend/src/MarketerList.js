import { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';

function MarketerList() {
  const [marketers, setMarketers] = useState([]);
  const [formData, setFormData] = useState({
    marketer_ID: null,
    email: '',
    password: '',
    authorization: '',
    years_of_experience: '',
    certifications: '',
    crm_ID: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [crmFilter, setCrmFilter] = useState('');

  const fetchMarketers = () => {
    axios.get('http://localhost:5000/api/marketer')
      .then(response => setMarketers(response.data))
      .catch(error => console.error(error));
  };

  useEffect(() => {
    fetchMarketers();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const apiUrl = isEditing
      ? `http://localhost:5000/api/marketer?marketer_ID=${formData.marketer_ID}`
      : 'http://localhost:5000/api/marketer';
    const method = isEditing ? 'put' : 'post';

    axios[method](apiUrl, formData)
      .then(response => {
        alert(response.data.Message || 'Success');
        fetchMarketers();
        setFormData({
          marketer_ID: null,
          email: '',
          password: '',
          authorization: '',
          years_of_experience: '',
          certifications: '',
          crm_ID: ''
        });
        setIsEditing(false);
      })
      .catch(error => {
        console.error(error);
        alert('Failed to add/update marketer record.');
      });
  };

  const handleEdit = (marketer) => {
    setFormData({ ...marketer });
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this marketer?')) {
      axios.delete(`http://localhost:5000/api/marketer?marketer_ID=${id}`)
        .then(() => fetchMarketers())
        .catch(error => console.error(error));
    }
  };

  const filterMarketers = () => {
    const query = searchQuery.toLowerCase();
    return marketers.filter(marketer => {
      const email = String(marketer.email || '').toLowerCase();
      const crm = String(marketer.crm_ID || '').toLowerCase();
      const certifications = String(marketer.certifications || '').toLowerCase();
      return (
        email.includes(query) &&
        crm.includes(crmFilter.toLowerCase()) &&
        certifications.includes(query)
      );
    });
  };

  return (
    <div className="main-content">
      <h2 className="page-header">{isEditing ? 'Edit Marketer' : 'Add New Marketer'}</h2>

      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <input
          type="text"
          name="authorization"
          value={formData.authorization}
          onChange={handleChange}
          placeholder="Authorization"
          required
        />
        <input
          type="text"
          name="years_of_experience"
          value={formData.years_of_experience}
          onChange={handleChange}
          placeholder="Years of Experience"
          required
        />
        <input
          type="text"
          name="certifications"
          value={formData.certifications}
          onChange={handleChange}
          placeholder="Certifications"
          required
        />
        <input
          type="text"
          name="crm_ID"
          value={formData.crm_ID}
          onChange={handleChange}
          placeholder="CRM ID"
          required
        />
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Update Marketer' : 'Add Marketer'}
        </button>
      </form>

      <div className="filter-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Email or Certifications"
          className="search-input"
        />

        <select
          value={crmFilter}
          onChange={(e) => setCrmFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Filter by CRM ID</option>
          {marketers.map((marketer, index) => (
            <option key={index} value={marketer.crm_ID}>
              {marketer.crm_ID}
            </option>
          ))}
        </select>
      </div>

      <div className="campaigns-table-container">
        <table className="campaigns-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Authorization</th>
              <th>Years of Experience</th>
              <th>Certifications</th>
              <th>CRM ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filterMarketers().map(marketer => (
              <tr key={marketer.marketer_ID}>
                <td>{marketer.email}</td>
                <td>{marketer.authorization}</td>
                <td>{marketer.years_of_experience}</td>
                <td>{marketer.certifications}</td>
                <td>{marketer.crm_ID}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => handleEdit(marketer)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(marketer.marketer_ID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MarketerList;
