import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTachometerAlt, FaGasPump, FaCog, FaCalendar, FaHeart } from 'react-icons/fa';

const CarCard = ({ car, viewMode = 'grid' }) => {
  return (
    <motion.div 
      className={`car-card ${viewMode}`}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="car-image">
        <img src={car.images[0]} alt={`${car.make} ${car.model}`} loading="lazy" />
        {car.featured && <span className="car-badge">Featured</span>}
        {car.condition === 'new' && <span className="car-badge new">New</span>}
        <button className="car-favorite">
          <FaHeart />
        </button>
      </div>
      
      <div className="car-content">
        <div className="car-header">
          <h3 className="car-title">{car.year} {car.make} {car.model}</h3>
          <p className="car-trim">{car.trim}</p>
        </div>
        
        <div className="car-meta">
          <span><FaCalendar /> {car.year}</span>
          <span><FaTachometerAlt /> {car.mileage.toLocaleString()} mi</span>
          <span><FaGasPump /> {car.fuelType}</span>
          <span><FaCog /> {car.transmission}</span>
        </div>
        
        <div className="car-price">
          <span className="price">${car.price.toLocaleString()}</span>
          <Link to={`/inventory/${car.id}`} className="btn-view">
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;