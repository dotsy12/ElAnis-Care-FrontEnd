import React from 'react';

interface StarRatingProps {
  value: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
  size?: number;
}

export default function StarRating({ value, onChange, readOnly = false, size = 20 }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => !readOnly && onChange && onChange(s)}
          className={`cursor-${readOnly ? 'default' : 'pointer'} focus:outline-none`}
          aria-label={`${s} star`}
          title={`${s} star`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={s <= value ? '#F59E0B' : 'none'}
            stroke={s <= value ? '#F59E0B' : '#9CA3AF'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 .587l3.668 7.431L24 9.748l-6 5.854L19.335 24 12 19.897 4.665 24 6 15.602 0 9.748l8.332-1.73z" />
          </svg>
        </button>
      ))}
    </div>
  );
}
