import React, { useState, useEffect } from 'react';

const AnimatedNumber = ({ value, duration = 2000 }) => {
  // Check if it's a range like "1867-1990"
  const isRange = value.includes('-');
  const parts = isRange ? value.split('-') : [value];
  
  const [counts, setCounts] = useState(parts.map(() => 0));

  useEffect(() => {
    const targets = parts.map(p => parseInt(p.replace(/,/g, '').replace(/\+/g, '')));
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const nextCounts = targets.map(target => Math.floor(progress * target));
      setCounts(nextCounts);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }, [value]);

  return (
    <span>
      {isRange ? (
        `${counts[0]}-${counts[1]}`
      ) : (
        `${counts[0].toLocaleString()}${value.includes('+') ? '+' : ''}`
      )}
    </span>
  );
};

export default AnimatedNumber;
