import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCalendar, 
  FaTachometerAlt, 
  FaGasPump, 
  FaCog, 
  FaPalette,
  FaCheckCircle,
  FaPhone,
  FaEnvelope,
  FaHeart,
  FaShare,
  FaArrowLeft
} from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { cars } from '../data/cars';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [car, setCar] = useState(null);
  const [activeThumb, setActiveThumb] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    // Simulate API fetch
    const foundCar = cars.find(c => c.id === parseInt(id));
    if (foundCar) {
      setCar(foundCar);
      // Check if in favorites
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.includes(parseInt(id)));
    }
    setIsLoading(false);
  }, [id]);

  const handleFavoriteToggle = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorite) {
      const newFavorites = favorites.filter(fid => fid !== parseInt(id));
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
      toast.info('Removed from favorites');
    } else {
      favorites.push(parseInt(id));
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
      toast.success('Added to favorites');
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent! The seller will contact you soon.');
    setContactForm({ name: '', email: '', phone: '', message: '' });
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.warning('Please login to purchase');
      navigate('/login', { state: { from: `/checkout/${id}` } });
      return;
    }
    navigate(`/checkout/${id}`);
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (!car) return <div className="not-found">Car not found</div>;

  return (
    <div className="car-details-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back to Inventory
        </button>

        <div className="car-details-grid">
          {/* Left Column - Images */}
          <div className="car-images-section">
            <Swiper
              modules={[Navigation, Thumbs]}
              navigation
              thumbs={{ swiper: activeThumb }}
              className="main-image-swiper"
            >
              {car.images.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img src={img} alt={`${car.make} ${car.model} ${idx + 1}`} />
                </SwiperSlide>
              ))}
            </Swiper>
            
            <Swiper
              modules={[Thumbs]}
              watchSlidesProgress
              onSwiper={setActiveThumb}
              slidesPerView={4}
              spaceBetween={10}
              className="thumb-swiper"
            >
              {car.images.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img src={img} alt={`Thumbnail ${idx + 1}`} />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="image-actions">
              <button 
                className={`action-btn ${isFavorite ? 'active' : ''}`}
                onClick={handleFavoriteToggle}
              >
                <FaHeart /> {isFavorite ? 'Saved' : 'Save'}
              </button>
              <button className="action-btn" onClick={() => {
                navigator.share({
                  title: `${car.year} ${car.make} ${car.model}`,
                  url: window.location.href
                }).catch(() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link copied to clipboard');
                });
              }}>
                <FaShare /> Share
              </button>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="car-info-section">
            <div className="car-header">
              <div>
                <h1>{car.year} {car.make} {car.model}</h1>
                <p className="car-trim">{car.trim}</p>
              </div>
              <div className="price-tag">
                <span className="price">${car.price.toLocaleString()}</span>
                <span className="price-note">{car.financing ? 'or $' + car.monthlyPayment + '/mo' : ''}</span>
              </div>
            </div>

            <div className="quick-specs">
              <div className="spec-item">
                <FaCalendar />
                <span>{car.year}</span>
              </div>
              <div className="spec-item">
                <FaTachometerAlt />
                <span>{car.mileage.toLocaleString()} mi</span>
              </div>
              <div className="spec-item">
                <FaGasPump />
                <span>{car.fuelType}</span>
              </div>
              <div className="spec-item">
                <FaCog />
                <span>{car.transmission}</span>
              </div>
            </div>

            <div className="car-description">
              <h3>Description</h3>
              <p>{car.description}</p>
            </div>

            <div className="car-features">
              <h3>Features</h3>
              <ul>
                {car.features.map((feature, idx) => (
                  <li key={idx}><FaCheckCircle /> {feature}</li>
                ))}
              </ul>
            </div>

            <div className="car-specs-detailed">
              <h3>Specifications</h3>
              <div className="specs-grid">
                <div>
                  <span>Engine</span>
                  <strong>{car.specs.engine}</strong>
                </div>
                <div>
                  <span>Horsepower</span>
                  <strong>{car.specs.horsepower} hp</strong>
                </div>
                <div>
                  <span>Torque</span>
                  <strong>{car.specs.torque} lb-ft</strong>
                </div>
                <div>
                  <span>0-60 mph</span>
                  <strong>{car.specs.acceleration}s</strong>
                </div>
                <div>
                  <span>Fuel Economy</span>
                  <strong>{car.specs.mpg} mpg</strong>
                </div>
                <div>
                  <span>Drivetrain</span>
                  <strong>{car.specs.drivetrain}</strong>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn-primary btn-large" onClick={handleBuyNow}>
                Buy Now
              </button>
              <button className="btn-secondary btn-large">
                <FaPhone /> Call Seller
              </button>
            </div>
          </div>
        </div>

        {/* Contact Seller Section */}
        <div className="contact-section">
          <h3>Contact Seller</h3>
          <form onSubmit={handleContactSubmit} className="contact-form">
            <div className="form-row">
              <input
                type="text"
                placeholder="Your Name"
                value={contactForm.name}
                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                required
              />
            </div>
            <input
              type="tel"
              placeholder="Phone Number"
              value={contactForm.phone}
              onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
            />
            <textarea
              placeholder="I'm interested in this vehicle..."
              rows={4}
              value={contactForm.message}
              onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
              required
            />
            <button type="submit" className="btn-primary">
              <FaEnvelope /> Send Message
            </button>
          </form>
        </div>

        {/* Similar Cars */}
        <div className="similar-cars-section">
          <h3>Similar Vehicles</h3>
          <div className="similar-cars-grid">
            {cars
              .filter(c => c.make === car.make && c.id !== car.id)
              .slice(0, 3)
              .map(similarCar => (
                <motion.div 
                  key={similarCar.id}
                  className="similar-car-card"
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/inventory/${similarCar.id}`)}
                >
                  <img src={similarCar.images[0]} alt={similarCar.model} />
                  <div className="similar-car-info">
                    <h4>{similarCar.year} {similarCar.model}</h4>
                    <span>${similarCar.price.toLocaleString()}</span>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;