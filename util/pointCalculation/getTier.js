import React from 'react';

const getTier = (level) => {
  const tier =
    level === 1
      ? 'minor'
      : level === 2
      ? 'moderate'
      : level === 3
      ? 'superior'
      : level === 4
      ? 'ultra'
      : 'free';

  return tier;
};

export default getTier;
