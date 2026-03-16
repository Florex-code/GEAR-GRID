import React from 'react';
import { motion } from 'framer-motion';
import { FaAward, FaUsers, FaCar, FaGlobe, FaCheckCircle } from 'react-icons/fa';

const stats = [
  { icon: <FaCar />, number: '10,000+', label: 'Cars Sold' },
  { icon: <FaUsers />, number: '50,000+', label: 'Happy Customers' },
  { icon: <FaAward />, number: '15', label: 'Industry Awards' },
  { icon: <FaGlobe />, number: '25', label: 'States Covered' }
];

const values = [
  {
    title: 'Transparency',
    description: 'We believe in complete honesty. No hidden fees, no surprises. Every car history is fully disclosed.'
  },
  {
    title: 'Quality',
    description: 'Every vehicle on our platform undergoes rigorous inspection and verification before listing.'
  },
  {
    title: 'Innovation',
    description: 'We leverage cutting-edge technology to make car buying and selling seamless and enjoyable.'
  },
  {
    title: 'Customer First',
    description: 'Your satisfaction is our priority. Our team is dedicated to supporting you at every step.'
  }
];

const team = [
  {
    name: 'Alex Thompson',
    role: 'CEO & Founder',
    image: '/images/team/alex.jpg',
    bio: 'Former automotive executive with 20+ years of industry experience.'
  },
  {
    name: 'Sarah Chen',
    role: 'Chief Technology Officer',
    image: '/images/team/sarah.jpg',
    bio: 'Tech visionary who previously led engineering at major Silicon Valley companies.'
  },
  {
    name: 'Marcus Johnson',
    role: 'Head of Operations',
    image: '/images/team/marcus.jpg',
    bio: 'Operations expert specializing in logistics and customer experience.'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Chief Marketing Officer',
    image: '/images/team/emily.jpg',
    bio: 'Award-winning marketer with a passion for automotive brands.'
  }
];

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="about-hero-content"
          >
            <h1>Revolutionizing the Way You Buy and Sell Cars</h1>
            <p>Founded in 2020, GEAR-GRID has quickly become the most trusted premium car marketplace in the nation.</p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-box"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="stat-icon">{stat.icon}</div>
                <h3>{stat.number}</h3>
                <p>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-content">
              <h2>Our Mission</h2>
              <p>To create the most transparent, efficient, and enjoyable car marketplace that puts customers first. We believe buying or selling a car should be as exciting as driving one.</p>
              <ul className="mission-list">
                <li><FaCheckCircle /> Verified vehicle history reports</li>
                <li><FaCheckCircle /> 7-day money-back guarantee</li>
                <li><FaCheckCircle /> Secure payment processing</li>
                <li><FaCheckCircle /> Nationwide delivery available</li>
              </ul>
            </div>
            <div className="mission-image">
              <img src="/images/about-mission.jpg" alt="Our mission" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <div className="container">
          <h2 className="section-title text-center">Our Core Values</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="value-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <div className="container">
          <h2 className="section-title text-center">Meet Our Leadership</h2>
          <div className="team-grid">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="team-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <img src={member.image} alt={member.name} />
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <span className="role">{member.role}</span>
                  <p>{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Experience the GEAR-GRID Difference?</h2>
            <p>Join thousands of satisfied customers who have found their perfect car with us.</p>
            <div className="cta-buttons">
              <a href="/inventory" className="btn-primary">Browse Inventory</a>
              <a href="/sell" className="btn-secondary">Sell Your Car</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;