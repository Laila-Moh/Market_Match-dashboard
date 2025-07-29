import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserList from './UserList';
import CrmList from './CrmList'; 
import OrganizationRepList from './OrganizationRepList';
import MarketerList from './MarketerList';
import CampaignList from './CampaignList'; 
import BidHistoryList from './BidHistoryList';
import Home from './home';
import './dashboard.css';

function App() {
  return (
    <Router>
      <div className="dashboard-container">
        <nav className="sidebar">
          <h2 className="logo">Dashboard</h2>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li> {/* Link to Home page */}
            <li><Link to="/user">Users</Link></li>
            <li><Link to="/crm">CRM</Link></li>
            <li><Link to="/organization_representative">Organization Reps</Link></li>
            <li><Link to="/marketer">Marketers</Link></li>
            <li><Link to="/campaign">Campaigns</Link></li>
            <li><Link to="/bid-history">Bid History</Link></li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/user" element={<UserList />} />
            <Route path="/crm" element={<CrmList />} />
            <Route path="/organization_representative" element={<OrganizationRepList />} />
            <Route path="/marketer" element={<MarketerList />} /> 
            <Route path="/campaign" element={<CampaignList />} />
            <Route path="/bid-history" element={<BidHistoryList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
