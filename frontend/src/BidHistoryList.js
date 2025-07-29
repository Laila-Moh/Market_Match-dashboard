import { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';

function BidHistoryList() {
  const [bidHistory, setBidHistory] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    amount: '',
    org_rep_ID: '',
    campaign_ID: ''
  });
  const [formData, setFormData] = useState({
    bid_ID: null,
    type: '',
    status: '',
    amount: '',
    date_time: new Date().toISOString().slice(0, 16),
    org_rep_ID: '',
    campaign_ID: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);

  const fetchData = () => {
    axios.get('http://localhost:5000/api/bid_history')
      .then(response => setBidHistory(response.data))
      .catch(error => console.error(error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      axios.delete(`http://localhost:5000/api/bid_history?bid_ID=${id}`)
        .then(() => fetchData())
        .catch(error => console.error(error));
    }
  };

  const handleEdit = (record) => {
    setFormData({ ...record });
    setIsEditing(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const apiUrl = isEditing
      ? `http://localhost:5000/api/bid_history?bid_ID=${formData.bid_ID}`
      : `http://localhost:5000/api/bid_history`;
    const method = isEditing ? 'put' : 'post';

    axios[method](apiUrl, formData)
      .then(response => {
        alert(response.data.Message || "Success");
        fetchData();
        setFormData({
          bid_ID: null,
          type: '',
          status: '',
          amount: '',
          date_time: new Date().toISOString().slice(0, 16),
          org_rep_ID: '',
          campaign_ID: '',
        });
        setIsEditing(false);
      })
      .catch(error => {
        console.error(error);
        alert("Failed to add/update bid history record.");
      });
  };

  // Filtered data based on selected filters
  const filteredBids = bidHistory.filter((bid) => {
    return (
      (filters.type ? bid.type?.toLowerCase().includes(filters.type.toLowerCase()) : true) &&
      (filters.status ? bid.status?.toLowerCase().includes(filters.status.toLowerCase()) : true) &&
      (filters.amount ? String(bid.amount).toLowerCase().includes(filters.amount.toLowerCase()) : true) &&
      (filters.org_rep_ID ? String(bid.org_rep_ID).toLowerCase().includes(filters.org_rep_ID.toLowerCase()) : true) &&
      (filters.campaign_ID ? String(bid.campaign_ID).toLowerCase().includes(filters.campaign_ID.toLowerCase()) : true)
    );
  });

  return (
    <div className="main-content">
      <h2 className="page-header">
        {isEditing ? "Edit Bid History Record" : "Add New Bid History Record"}
      </h2>

      <form onSubmit={handleSubmit} className="form-container">
        <select name="type" value={formData.type} onChange={handleChange} required>
          <option value="">Select Type</option>
          <option value="Standard">Standard</option>
          <option value="Premium">Premium</option>
        </select>

        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount"
          required
        />

        <input
          type="datetime-local"
          name="date_time"
          value={formData.date_time}
          onChange={handleChange}
          readOnly={!isEditing}
        />

        <input
          type="number"
          name="org_rep_ID"
          value={formData.org_rep_ID}
          onChange={handleChange}
          placeholder="Organization Rep ID"
          required
        />

        <input
          type="number"
          name="campaign_ID"
          value={formData.campaign_ID}
          onChange={handleChange}
          placeholder="Campaign ID"
          required
        />

        <button type="submit" className="btn btn-primary">
          {isEditing ? "Update Bid History" : "Add Bid History"}
        </button>
      </form>

      {/* Filter Section */}
      <div className="filter-container">
  <select name="type" value={filters.type} onChange={handleFilterChange}>
    <option value="">Filter by Type</option>
    <option value="Standard">Standard</option>
    <option value="Premium">Premium</option>
  </select>

  <select name="status" value={filters.status} onChange={handleFilterChange}>
    <option value="">Filter by Status</option>
    <option value="Pending">Pending</option>
    <option value="Approved">Approved</option>
    <option value="Rejected">Rejected</option>
  </select>

  <input
    type="number"
    name="amount"
    value={filters.amount}
    onChange={handleFilterChange}
    placeholder="Filter by Amount"
  />

  <input
    type="number"
    name="org_rep_ID"
    value={filters.org_rep_ID}
    onChange={handleFilterChange}
    placeholder="Filter by Org Rep ID"
  />

  <input
    type="number"
    name="campaign_ID"
    value={filters.campaign_ID}
    onChange={handleFilterChange}
    placeholder="Filter by Campaign ID"
  />
</div>


      <table className="bid-history-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Org Rep ID</th>
            <th>Campaign ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBids.map((bid) => (
            <tr key={bid.bid_ID}>
              <td>{bid.type}</td>
              <td>{bid.status}</td>
              <td>{bid.amount}</td>
              <td>{bid.date_time}</td>
              <td>{bid.org_rep_ID}</td>
              <td>{bid.campaign_ID}</td>
              <td>
                <button className="btn btn-edit" onClick={() => handleEdit(bid)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(bid.bid_ID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BidHistoryList;
