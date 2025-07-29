import { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css'; // Make sure this CSS file contains the styles

function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const [formData, setFormData] = useState({
    campaign_ID: null,
    name: '',
    description: '',
    crm_ID: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedName, setSelectedName] = useState(''); // State for selected name filter

  const fetchCampaigns = () => {
    axios.get('http://localhost:5000/api/campaign')
      .then(response => setCampaigns(response.data))
      .catch(error => console.error(error));
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      axios.delete(`http://localhost:5000/api/campaign?campaign_ID=${id}`)
        .then(() => fetchCampaigns())
        .catch(error => console.error(error));
    }
  };

  const handleEdit = (campaign) => {
    setFormData({ ...campaign });
    setIsEditing(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const apiUrl = isEditing
      ? `http://localhost:5000/api/campaign?campaign_ID=${formData.campaign_ID}`
      : 'http://localhost:5000/api/campaign';
    const method = isEditing ? 'put' : 'post';

    axios[method](apiUrl, formData)
      .then(response => {
        alert(response.data.Message || 'Success');
        fetchCampaigns();
        setFormData({ campaign_ID: null, name: '', description: '', crm_ID: '' });
        setIsEditing(false);
      })
      .catch(error => {
        console.error(error);
        alert('Failed to add/update campaign record.');
      });
  };

  // Filter campaigns based on selected name
  const filterCampaigns = () => {
    const query = searchQuery.toLowerCase();
    return campaigns.filter(campaign => {
      const nameMatch = campaign.name?.toLowerCase().includes(query);
      const descriptionMatch = campaign.description?.toLowerCase().includes(query);
  
      // Safely convert crm_ID to string before calling toLowerCase
      const crmIDMatch = String(campaign.crm_ID).toLowerCase().includes(query);
  
      // Only filter by name if a name is selected
      if (selectedName) {
        return campaign.name === selectedName;
      }
  
      return nameMatch || descriptionMatch || crmIDMatch;
    });
  };
  

  // Get unique campaign names for the filter dropdown
  const uniqueNames = [...new Set(campaigns.map(campaign => campaign.name))];

  return (
    <div className="main-content">
      <h2 className="page-header">
        {isEditing ? 'Edit Campaign Record' : 'Add New Campaign Record'}
      </h2>
  
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Campaign Name"
          required
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
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
          {isEditing ? 'Update Campaign' : 'Add Campaign'}
        </button>
      </form>
  
      {/* Search Section */}
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by Name, Description, or ID"
          className="search-input"
        />
      </div>
  
      {/* Filter Section */}
      <div className="filter-container">
        <select className="filter-select" onChange={(e) => setSelectedName(e.target.value)} value={selectedName}>
          <option value="">Filter by Name</option>
          {uniqueNames.map((name, index) => (
            <option key={index} value={name}>{name}</option>
          ))}
        </select>
      </div>
  
      {/* Filtered Table */}
      <div className="campaigns-table-container">
        <table className="marketer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>CRM ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filterCampaigns().map(campaign => (
              <tr key={campaign.campaign_ID}>
                <td>{campaign.name}</td>
                <td>{campaign.description}</td>
                <td>{campaign.crm_ID}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => handleEdit(campaign)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(campaign.campaign_ID)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CampaignList;
