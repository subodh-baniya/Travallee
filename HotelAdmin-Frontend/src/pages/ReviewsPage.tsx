import React from 'react';

const ReviewsPage: React.FC = () => {
  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Guest Reviews</div>
          <div className="page-sub">All feedback and ratings</div>
        </div>
      </div>
      <div className="stats-grid">
        <div className="stat-card c1">
          <div className="stat-label">Avg. Rating</div>
          <div className="stat-value">
            4.7 <small>/ 5</small>
          </div>
          <div className="badge up">↑ 0.2 this month</div>
        </div>
        <div className="stat-card c2">
          <div className="stat-label">5 Star Reviews</div>
          <div className="stat-value">64</div>
          <div className="badge up">45% of total</div>
        </div>
        <div className="stat-card c3">
          <div className="stat-label">Total Reviews</div>
          <div className="stat-value">142</div>
          <div className="badge ne">All time</div>
        </div>
        <div className="stat-card c4">
          <div className="stat-label">Needs Response</div>
          <div className="stat-value">5</div>
          <div className="badge dn">Please reply</div>
        </div>
      </div>
      <div className="rv-grid">
        <div className="rv-card">
          <div className="rv-top">
            <div>
              <div className="rv-guest">Priya Sharma</div>
              <div className="rv-room2">Room 101 · Deluxe · Mar 27</div>
            </div>
            <div className="stars">★★★★★</div>
          </div>
          <div className="rv-text">
            "Absolutely wonderful stay. The room was spotless and the staff were incredibly warm and helpful. The breakfast was a highlight — fresh and delicious."
          </div>
          <div className="rv-foot">
            <span>Cleanliness: ★★★★★</span>
            <span>Service: ★★★★★</span>
          </div>
        </div>
        <div className="rv-card">
          <div className="rv-top">
            <div>
              <div className="rv-guest">David Lee</div>
              <div className="rv-room2">Room 310 · Suite · Mar 27</div>
            </div>
            <div className="stars">★★★★☆</div>
          </div>
          <div className="rv-text">
            "Great location and lovely room. The suite was spacious and comfortable. The only downside was the Wi-Fi was a bit slow at times but overall a great experience."
          </div>
          <div className="rv-foot">
            <span>Location: ★★★★★</span>
            <span>Wi-Fi: ★★★☆☆</span>
          </div>
        </div>
        <div className="rv-card">
          <div className="rv-top">
            <div>
              <div className="rv-guest">Aisha Gurung</div>
              <div className="rv-room2">Room 208 · Standard · Mar 25</div>
            </div>
            <div className="stars">★★★★★</div>
          </div>
          <div className="rv-text">
            "My 7th stay here and it just keeps getting better. The team recognises me now which is such a personal touch. The mountain view from the window is breathtaking."
          </div>
          <div className="rv-foot">
            <span>Value: ★★★★★</span>
            <span>Staff: ★★★★★</span>
          </div>
        </div>
        <div className="rv-card">
          <div className="rv-top">
            <div>
              <div className="rv-guest">Rajan Thapa</div>
              <div className="rv-room2">Room 305 · Standard · Mar 20</div>
            </div>
            <div className="stars">★★★☆☆</div>
          </div>
          <div className="rv-text">
            "Room was okay but the hot water was inconsistent. Housekeeping was responsive when I raised the issue. Would suggest fixing the water heater for future guests."
          </div>
          <div className="rv-foot">
            <span>Cleanliness: ★★★☆☆</span>
            <span>Service: ★★★★☆</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewsPage;
