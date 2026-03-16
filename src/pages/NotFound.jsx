import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCar, FaHome, FaSearch } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <motion.div
          className="not-found-content"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="error-code">404</div>
          <FaCar className="car-icon" />
          <h1>Page Not Found</h1>
          <p>Oops! Looks like this page has driven off into the sunset.</p>
          
          <div className="not-found-actions">
            <Link to="/" className="btn-primary">
              <FaHome /> Back to Home
            </Link>
            <Link to="/inventory" className="btn-secondary">
              <FaSearch /> Browse Cars
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;