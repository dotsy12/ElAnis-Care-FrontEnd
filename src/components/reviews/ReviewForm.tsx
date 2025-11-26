import React, { useState } from 'react';
import StarRating from './StarRating';
import { submitReview } from '../../api/reviews';

interface ReviewFormProps {
  serviceRequestId: string;
  onSuccess: (review: any) => void;
  onClose?: () => void;
}

export default function ReviewForm({ serviceRequestId, onSuccess, onClose }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await submitReview({ serviceRequestId, rating, comment: comment || null });
      if (res && res.succeeded) {
        // update parent with the created review
        onSuccess(res.data);
      } else {
        // show error using toast if available
        // import toast from project if desired; fallback to alert
        // toast.error(res?.message || 'Failed to submit review');
        alert(res?.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('submit review error', err);
      alert('Failed to submit review');
    } finally {
      setIsSubmitting(false);
      if (onClose) onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Rating</label>
        <div className="mt-2">
          <StarRating value={rating} onChange={(v) => setRating(v)} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full mt-2 p-2 border rounded-md"
          rows={4}
          placeholder="Share your experience (optional)"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-100">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-md bg-[#FFA726] text-white">
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
}
