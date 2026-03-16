import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { 
  FaSearch, 
  FaCar, 
  FaShieldAlt, 
  FaMoneyBillWave, 
  FaHeadset,
  FaArrowRight,
  FaStar
} from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import CarCard from '../components/CarCard';
import { cars } from '../data/cars';

const features = [
  {
    icon: <FaShieldAlt />,
    title: 'Verified Sellers',
    description: 'Every seller is thoroughly vetted and verified for your peace of mind.'
  },
  {
    icon: <FaMoneyBillWave />,
    title: 'Best Prices',
    description: 'Competitive pricing with no hidden fees. Get the best value for your money.'
  },
  {
    icon: <FaHeadset />,
    title: '24/7 Support',
    description: 'Our dedicated team is here to help you every step of the way.'
  },
  {
    icon: <FaCar />,
    title: 'Wide Selection',
    description: 'From luxury sedans to rugged SUVs, find your perfect match.'
  }
];

const testimonials = [
  {
    name: "Michael Chen",
    role: "Car Enthusiast",
    content: "Found my dream BMW within a week. The process was seamless and the verification gave me confidence.",
    rating: 5,
    image: "/images/testimonials/michael.jpg"
  },
  {
    name: "Sarah Johnson",
    role: "First-time Buyer",
    content: "As a first-time buyer, I was nervous. But GEAR-GRID made everything so easy and transparent.",
    rating: 5,
    image: "/images/testimonials/sarah.jpg"
  },
  {
    name: "David Rodriguez",
    role: "Collector",
    content: "The premium selection here is unmatched. Found a rare classic I had been hunting for years.",
    rating: 5,
    image: "/images/testimonials/david.jpg"
  }
];

const Home = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate API call with filtering
    const featured = cars
      .filter(car => car.featured)
      .slice(0, 6);
    setFeaturedCars(featured);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to inventory with search query
    window.location.href = `/inventory?search=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            className="hero-swiper"
          >
            <SwiperSlide>
              <div className="hero-slide" style={{backgroundImage: 'url(/images/hero/hero-1.jpg)'}} />
            </SwiperSlide>
            <SwiperSlide>
              <div className="hero-slide" style={{backgroundImage: 'url(/images/hero/hero-2.jpg)'}} />
            </SwiperSlide>
            <SwiperSlide>
              <div className="hero-slide" style={{backgroundImage: 'url(/images/hero/hero-3.jpg)'}} />
            </SwiperSlide>
          </Swiper>
          <div className="hero-overlay" />
        </div>

        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text"
          >
            <h1 className="hero-title">
              FIND YOUR <span className="highlight">PERFECT</span> DRIVE
            </h1>
            <p className="hero-subtitle">
              Premium vehicles. Transparent pricing. Unmatched service.
            </p>
            
            <form onSubmit={handleSearch} className="hero-search">
              <div className="search-input-wrapper">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by make, model, or year..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              <button type="submit" className="search-btn">
                Search
              </button>
            </form>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Cars Sold</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">5K+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">98%</span>
                <span className="stat-label">Satisfaction Rate</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <span>Scroll to explore</span>
          <div className="scroll-line" />
        </motion.div>
      </section>

      {/* Brands Section */}
      <section className="brands-section">
        <div className="container">
          <h3 className="section-subtitle">Trusted Brands</h3>
          <div className="brands-grid">
            {['BMW', 'Mercedes', 'Audi', 'Porsche', 'Tesla', 'Lexus', 'Toyota', 'Honda'].map((brand) => (
              <motion.div 
                key={brand}
                className="brand-item"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img src={`/images/brands/${brand.toLowerCase()}.svg`} alt={brand} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Vehicles</h2>
              <p className="section-description">Hand-picked premium cars just for you</p>
            </div>
            <Link to="/inventory" className="view-all-btn">
              View All <FaArrowRight />
            </Link>
          </div>

          <div className="cars-grid">
            {featuredCars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title text-center">Why Choose GEAR-GRID</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Sell Your Car?</h2>
            <p>Get an instant quote and sell your car within 24 hours</p>
            <Link to="/sell" className="cta-btn">
              Sell Your Car Now
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title text-center">What Our Customers Say</h2>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            className="testimonials-swiper"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="testimonial-card">
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="star-icon" />
                    ))}
                  </div>
                  <p className="testimonial-content">"{testimonial.content}"</p>
                  <div className="testimonial-author">
                    <img src={testimonial.image} alt={testimonial.name} />
                    <div>
                      <h4>{testimonial.name}</h4>
                      <span>{testimonial.role}</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Subscribe to get the latest car listings and exclusive offers</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;