import React from 'react';

const WeatherCard = ({ children, title, className = '' }) => {
  return (
    <div className={`glass-panel ${className}`}>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
};

export default WeatherCard;
