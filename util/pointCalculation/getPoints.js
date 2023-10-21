import React from 'react';

const getPoints = (level) => {
  const base = 10;
  const boosted =
    level.toLowerCase() === 'minor'
      ? 10
      : level.toLowerCase() === 'moderate'
      ? 15
      : level.toLowerCase() === 'superior'
      ? 30
      : level.toLowerCase() === 'ultra'
      ? 50
      : 0;

  return base + boosted;
};

export default getPoints;
