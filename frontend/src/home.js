import './dashboard.css';  // Import the CSS specific to the home page

function Home() {
  return (
    <div>
      <div className="part1">
        <h1 className="p1-title">Welcome to Market Match</h1>
        <div style={{ textAlign: 'center', paddingTop: '20px' }}>
          <button className="btn-find">Get Started</button>
        </div>
      </div>

      <div className="part2">
        <h2 className="p2-title">Your Marketing is Our Market</h2>
      </div>

      <div>
        <h3 className="pt3h3">Why Choose Us?</h3>
        <div className="pt3-title">
          <div>
            <p>Premium Services</p>
          </div>
          <div>
            <p>Fast Delivery</p>
          </div>
          <div>
            <p>Verified Agencies</p>
          </div>
          <div>
            <p>Customer Focused</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="pt5-title">Explore More</h2>
        <div className="shapsp5">
          <span>🔍</span>
          <span>📈</span>
          <span>📊</span>
        </div>
      </div>
    </div>
  );
}

export default Home;
