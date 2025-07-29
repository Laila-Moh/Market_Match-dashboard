import { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';

function OrganizationRepList() {
  const [orgReps, setOrgReps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    org_rep_ID: null,
    organization_name: '',
    industry_focus: '',
    department: '',
    annual_budget: '',
    position: '',
    size: '',
    crm_ID: '',
    email: '',
    password: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const [positionFilter, setPositionFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');

  // Fetch data from the API
  const fetchData = () => {
    axios
      .get(`http://localhost:5000/api/organization_representative`)
      .then((response) => setOrgReps(response.data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      axios
        .delete(`http://localhost:5000/api/organization_representative?org_rep_ID=${id}`)
        .then(() => fetchData())
        .catch((error) => console.error(error));
    }
  };

  const handleEdit = (rep) => {
    setFormData({ ...rep });
    setIsEditing(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const apiUrl = isEditing
      ? `http://localhost:5000/api/organization_representative?org_rep_ID=${formData.org_rep_ID}`
      : `http://localhost:5000/api/organization_representative`;

    const method = isEditing ? 'put' : 'post';
    const dataToSend = { ...formData };

    axios[method](apiUrl, dataToSend)
      .then(response => {
        alert(response.data.Message);
        fetchData();
        setFormData({
          org_rep_ID: null,
          organization_name: '',
          industry_focus: '',
          department: '',
          annual_budget: '',
          position: '',
          size: '',
          crm_ID: '',
          email: '',
          password: '',
        });
        setIsEditing(false);
      })
      .catch(error => {
        console.error(error);
        alert("Failed to add/update organization representative.");
      });
  };

  // Extract unique values for position and industry_focus
  const uniquePositions = [...new Set(orgReps.map(rep => rep.position))];
  const uniqueIndustries = [...new Set(orgReps.map(rep => rep.industry_focus))];

  // Filter organization representatives based on search term, position, and industry
  const filteredOrgReps = orgReps.filter((rep) =>
    (rep.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.industry_focus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.position.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (positionFilter ? rep.position === positionFilter : true) &&
    (industryFilter ? rep.industry_focus === industryFilter : true)
  );

  return (
    <div className="main-content">
      <h2 className="page-header">
        {isEditing ? "Edit Organization Representative" : "Add New Organization Representative"}
      </h2>

      <form onSubmit={handleSubmit} className="form-container">
        <input type="text" name="organization_name" value={formData.organization_name} onChange={handleChange} placeholder="Organization Name" required />
        <input type="text" name="industry_focus" value={formData.industry_focus} onChange={handleChange} placeholder="Industry Focus" required />
        <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Department" required />
        <input type="number" name="annual_budget" value={formData.annual_budget} onChange={handleChange} placeholder="Annual Budget" required />
        <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Position" required />
        <input type="text" name="size" value={formData.size} onChange={handleChange} placeholder="Organization Size" required />
        <input type="text" name="crm_ID" value={formData.crm_ID} onChange={handleChange} placeholder="CRM ID" />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />

        <button type="submit" className="btn btn-primary">
          {isEditing ? "Update Representative" : "Add Representative"}
        </button>
      </form>

      <h2 className="page-header">All Organization Representatives</h2>

      {/* Filter Section */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by name, industry, department"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          onChange={(e) => setPositionFilter(e.target.value)}
          value={positionFilter}
          className="filter-select"
        >
          <option value="">Filter by Position</option>
          {uniquePositions.map((position) => (
            <option key={position} value={position}>{position}</option>
          ))}
        </select>

        <select
          onChange={(e) => setIndustryFilter(e.target.value)}
          value={industryFilter}
          className="filter-select"
        >
          <option value="">Filter by Industry</option>
          {uniqueIndustries.map((industry) => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Org Name</th>
                <th>Industry</th>
                <th>Department</th>
                <th>Budget</th>
                <th>Position</th>
                <th>Size</th>
                <th>CRM ID</th>
                <th>Email</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrgReps.map((rep) => (
                <tr key={rep.org_rep_ID}>
                  <td>{rep.org_rep_ID}</td>
                  <td>{rep.organization_name}</td>
                  <td>{rep.industry_focus}</td>
                  <td>{rep.department}</td>
                  <td>{rep.annual_budget}</td>
                  <td>{rep.position}</td>
                  <td>{rep.size}</td>
                  <td>{rep.crm_ID}</td>
                  <td>{rep.email}</td>
                  <td>{rep.password}</td>
                  <td>
                    <button className="btn" onClick={() => handleEdit(rep)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(rep.org_rep_ID)}>Delete</button>
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

export default OrganizationRepList;
