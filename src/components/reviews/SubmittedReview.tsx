import React from 'react';
import '../../styles/ProviderDashboard.css';
interface Review {
  clientName: string;
  clientAvatar?: string;
  createdAt: string;
  rating: number;
  comment: string;
}

interface ReviewCardProps {
  review: Review;
}

const SubmittedReview: React.FC<ReviewCardProps> = ({ review }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= rating ? 'star-active' : ''}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="review-card">
      <div className="review-content">
        <img
          src={review.clientAvatar || 'https://api.dicebear.com/7.x/initials/svg?seed=client'}
          alt={review.clientName}
          className="user-avatar"
        />
        <div className="review-body">
          <div className="review-header">
            <div className="client-info">
              <div className="client-name">{review.clientName}</div>
              <div className="review-date">
                {new Date(review.createdAt).toLocaleString('en-US')}
              </div>
            </div>
            <div className="star-rating">
              {renderStars(review.rating || 0)}
            </div>
          </div>
          <div className="review-text">
            {review.comment || 'No comment provided'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmittedReview;