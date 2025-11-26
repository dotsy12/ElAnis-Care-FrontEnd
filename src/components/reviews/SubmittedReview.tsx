import React from 'react';
import StarRating from './StarRating';

interface SubmittedReviewProps {
  review: any;
}

export default function SubmittedReview({ review }: SubmittedReviewProps) {
  if (!review) return null;
  return (
    <div className="p-4 border rounded-md bg-white">
      <div className="flex items-start gap-3">
        <img src={review.clientAvatar || 'https://api.dicebear.com/7.x/initials/svg?seed=client'} alt={review.clientName} className="w-12 h-12 rounded-full object-cover" />
        <div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{review.clientName}</div>
              <div className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleString()}</div>
            </div>
            <div>
              <StarRating value={review.rating || 0} readOnly />
            </div>
          </div>
          <div className="mt-3 text-gray-700">{review.comment || ''}</div>
        </div>
      </div>
    </div>
  );
}
