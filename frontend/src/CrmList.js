import { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css'; // Assuming this file contains CRM-style styling

function CrmList() {
  const [crmList, setCrmList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    crm_id: null,
    client_name: '',
    email: '',
    phone: '',
    company_name: '',
    industry: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [industryFilter, setIndustryFilter] = useState('');

  // Fetch CRM List
  const fetchData = () => {
    axios.get('http://localhost:5000/api/crm')
      .then(response => setCrmList(response.data))
      .catch(error => console.error(error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle Deletion of CRM Record
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      axios.delete(`http://localhost:5000/api/crm?crm_id=${id}`)
        .then(() => fetchData())
        .catch(error => console.error(error));
    }
  };

  // Handle Editing of CRM Record
  const handleEdit = (record) => {
    setFormData({ ...record });
    setIsEditing(true);
  };

  // Handle Form Submission (Create or Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    const apiUrl = isEditing
      ? `http://localhost:5000/api/crm?crm_id=${formData.crm_id}`
      : `http://localhost:5000/api/crm`;
    const method = isEditing ? 'put' : 'post';

    axios[method](apiUrl, formData)
      .then(response => {
        alert(response.data.Message || "Success");
        fetchData();
        setFormData({
          crm_id: null,
          client_name: '',
          email: '',
          phone: '',
          company_name: '',
          industry: ''
        });
        setIsEditing(false);
      })
      .catch(error => {
        console.error(error);
        alert("Failed to add/update CRM record.");
      });
  };

  // Handle Search Query
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter CRM Records by Search and Industry
  const filteredCrmList = crmList.filter(record => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = record.email.toLowerCase().includes(query) ||
      record.phone.toLowerCase().includes(query) ||
      record.company_name.toLowerCase().includes(query);

    const matchesIndustry = industryFilter 
      ? record.industry.toLowerCase() === industryFilter.toLowerCase() 
      : true;  // If no industry filter, match all

    return matchesSearch && matchesIndustry;  // Both filters must match
  });

  // Get unique industries for the filter dropdown
  const uniqueIndustries = [...new Set(crmList.map(record => record.industry))];

  return (
    <div className="main-content">
      <h2 className="page-header">
        {isEditing ? "Edit CRM Record" : "Add New CRM Record"}
      </h2>

      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          name="client_name"
          value={formData.client_name}
          onChange={handleChange}
          placeholder="Client Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
          placeholder="Company Name"
          required
        />
        <input
          type="text"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          placeholder="Industry"
          required
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
        />
        <button type="submit" className="btn btn-primary">
          {isEditing ? "Update CRM" : "Add CRM"}
        </button>
      </form>

      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by Email, Phone, or Company"
          className="search-input"
        />
      </div>

      <div className="filter-container">
        {/* Industry Filter */}
        <select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Filter by Industry</option>
          {uniqueIndustries.map((industry, index) => (
            <option key={index} value={industry}>
              {industry}
            </option>
          ))}
        </select>
      </div>

      <h2 className="page-header">All CRM Records</h2>
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Client Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Industry</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCrmList.map(record => (
                <tr key={record.crm_id}>
                  <td>{record.crm_id}</td>
                  <td>{record.client_name}</td>
                  <td>{record.email}</td>
                  <td>{record.phone}</td>
                  <td>{record.company_name}</td>
                  <td>{record.industry}</td>
                  <td>
                    <button className="btn" onClick={() => handleEdit(record)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(record.crm_id)}>Delete</button>
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

export default CrmList;
