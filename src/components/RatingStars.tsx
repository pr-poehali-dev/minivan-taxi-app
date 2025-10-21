import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface RatingStarsProps {
  rating?: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
}

const RatingStars = ({ rating = 0, onRate, readonly = false, size = 20 }: RatingStarsProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value: number) => {
    if (!readonly && onRate) {
      onRate(value);
    }
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = (hoverRating || rating) >= star;
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            disabled={readonly}
            className={`transition-all ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            }`}
          >
            <Icon
              name="Star"
              size={size}
              className={`${
                isFilled
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-300'
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;
