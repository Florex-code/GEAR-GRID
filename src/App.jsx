import React, { useState, useEffect} from 'react'
import { Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ThemeProvider, useTheme } from './context/ThemeContext.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { CarsProvider, useCars } from './context/CarsContext.jsx'
import { 
  FaSun, FaMoon, FaCar, FaUser, FaHeart, FaBars, 
  FaTimes, FaSearch, FaArrowRight, FaCheckCircle, FaFilter,
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope,
  FaPhone, FaMapMarkerAlt, FaShieldAlt, FaAward, FaUsers,
  FaHandshake, FaStar, FaRegClock, FaHeadset, FaTrash,
  FaEdit, FaPlus, FaChartBar, FaDollarSign, FaEye,
  FaSignOutAlt, FaCog, FaBell
} from 'react-icons/fa'

// ==================== IMAGE API SERVICE ====================
const UNSPLASH_ACCESS_KEY = 'kK0zWuoRy3iHyKnEi0sSFPBOmy9hEqqInsdI6MqFej4'

const imageCache = {}

export const fetchCarImage = async (make, model, year) => {
  const cacheKey = `${year}-${make}-${model}`
  
  if (imageCache[cacheKey]) {
    return imageCache[cacheKey]
  }
  
  try {
    const query = `${year} ${make} ${model} car automotive`
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    )
    
    const data = await response.json()
    
    if (data.results && data.results.length > 0) {
      const imageUrl = data.results[0].urls.regular
      imageCache[cacheKey] = imageUrl
      return imageUrl
    }
    
    return null
  } catch (error) {
    console.error('Error fetching car image:', error)
    return null
  }
}

export const fetchCarGallery = async (make, model, year, count = 4) => {
  const cacheKey = `gallery-${year}-${make}-${model}`
  
  if (imageCache[cacheKey]) {
    return imageCache[cacheKey]
  }
  
  try {
    const query = `${year} ${make} ${model} car automotive`
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    )
    
    const data = await response.json()
    
    if (data.results && data.results.length > 0) {
      const images = data.results.map(img => ({
        regular: img.urls.regular,
        small: img.urls.small,
        thumb: img.urls.thumb
      }))
      imageCache[cacheKey] = images
      return images
    }
    
    return []
  } catch (error) {
    console.error('Error fetching gallery:', error)
    return []
  }
}

// ==================== CONTEXTS ====================





// ==================== EXPANDED CAR DATA (24 CARS) ====================


// ==================== COMPONENTS ====================

const DEALER = {
  name: 'GEAR-GRID Autos',
  phone: '+2349138465408',
  email: 'florexdemilade@gmail.com',
  location: 'Moyosore Street, Irawo, Ikorodu Road, Lagos, Nigeria',
}

function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const { favorites } = useCars()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  
  const bg = theme === 'dark' ? '#1a1a2e' : '#ffffff'
  const text = theme === 'dark' ? '#ffffff' : '#1a1a2e'
  
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/inventory', label: 'Inventory' },
    { path: '/sell', label: 'Sell to Us' },
    { path: '/about', label: 'About' }
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }
  
  return (
    <nav style={{ background: bg, color: text, padding: '1rem 2rem', boxShadow: '0 2px 20px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ff6b35', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaCar /> GEAR<span style={{ color: text }}>GRID</span>
        </Link>
        
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map(link => (
            <motion.div key={link.path} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to={link.path}
                style={{ 
                  color: location.pathname === link.path ? '#ff6b35' : text, 
                  textDecoration: 'none',
                  fontWeight: location.pathname === link.path ? 'bold' : 'normal',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  background: location.pathname === link.path ? (theme === 'dark' ? 'rgba(255,107,53,0.1)' : 'rgba(255,107,53,0.1)') : 'transparent'
                }}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
          
          {/* Favorites Link */}
          {isAuthenticated && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/favorites"
                style={{ 
                  color: location.pathname === '/favorites' ? '#ff6b35' : text, 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  position: 'relative'
                }}
              >
                <FaHeart />
                {favorites.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: '#ff6b35',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {favorites.length}
                  </span>
                )}
              </Link>
            </motion.div>
          )}
          
          {/* Admin Link */}
          {isAdmin && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/admin"
                style={{ 
                  color: location.pathname === '/admin' ? '#ff6b35' : text, 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FaCog /> Admin
              </Link>
            </motion.div>
          )}
          
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme} 
            style={{ background: 'transparent', border: '2px solid #ff6b35', color: '#ff6b35', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </motion.button>
          
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/dashboard" style={{ color: text, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaUser /> {user?.firstName}
              </Link>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout} 
                style={{ background: '#ff6b35', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
              >
                Logout
              </motion.button>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login" style={{ background: '#ff6b35', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', textDecoration: 'none', display: 'inline-block' }}>
                Sign In
              </Link>
            </motion.div>
          )}
        </div>

        <button 
          onClick={() => setMobileOpen(!mobileOpen)} 
          style={{ display: 'none', background: 'none', border: 'none', color: text, fontSize: '1.5rem', cursor: 'pointer' }}
          className="mobile-menu-btn"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ display: 'none', overflow: 'hidden', background: bg, marginTop: '1rem', borderRadius: '8px' }}
            className="mobile-nav"
          >
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path}
                onClick={() => setMobileOpen(false)}
                style={{ display: 'block', padding: '1rem', color: location.pathname === link.path ? '#ff6b35' : text, textDecoration: 'none', borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#eee'}` }}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link to="/favorites" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '1rem', color: text, textDecoration: 'none' }}>
                <FaHeart style={{ marginRight: '0.5rem' }} /> Favorites ({favorites.length})
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '1rem', color: '#ff6b35', textDecoration: 'none' }}>
                <FaCog style={{ marginRight: '0.5rem' }} /> Dealer Admin
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '1rem', color: text, textDecoration: 'none' }}>
                  Dashboard
                </Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} style={{ width: '100%', padding: '1rem', background: 'none', border: 'none', color: '#ff6b35', textAlign: 'left', cursor: 'pointer' }}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '1rem', color: '#ff6b35', textDecoration: 'none' }}>
                Sign In
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .mobile-nav { display: block !important; }
        }
      `}</style>
    </nav>
  )
}

function Footer() {
  const { theme } = useTheme()
  const bg = theme === 'dark' ? '#0a0a14' : '#1a1a2e'
  const text = '#ffffff'
  const accent = '#ff6b35'
  
  const footerLinks = {
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'Careers', path: '#' },
      { label: 'Press', path: '#' },
      { label: 'Blog', path: '#' }
    ],
    support: [
      { label: 'Help Center', path: '#' },
      { label: 'Safety Information', path: '#' },
      { label: 'Cancellation Options', path: '#' },
      { label: 'Report Issue', path: '#' }
    ],
    legal: [
      { label: 'Terms of Service', path: '#' },
      { label: 'Privacy Policy', path: '#' },
      { label: 'Cookie Policy', path: '#' },
      { label: 'GDPR', path: '#' }
    ]
  }
  
  const socialLinks = [
    { icon: FaFacebook, href: '#', label: 'Facebook' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaLinkedin, href: '#', label: 'LinkedIn' }
  ]
  
  return (
    <footer style={{ background: bg, color: text, padding: '4rem 2rem 2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <Link to="/" style={{ fontSize: '1.8rem', fontWeight: 'bold', color: accent, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FaCar /> GEAR<span style={{ color: text }}>GRID</span>
            </Link>
            <p style={{ color: '#aaa', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Premium dealership inventory, transparent pricing, and direct support from a local automotive team.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {socialLinks.map((social) => (
                <motion.a key={social.label} href={social.href} whileHover={{ scale: 1.2, color: accent }} style={{ color: '#aaa', fontSize: '1.5rem' }}>
                  <social.icon />
                </motion.a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 style={{ color: accent, marginBottom: '1rem' }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {footerLinks.company.map((link) => (
                <li key={link.label} style={{ marginBottom: '0.5rem' }}>
                  <Link to={link.path} style={{ color: '#aaa', textDecoration: 'none' }}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 style={{ color: accent, marginBottom: '1rem' }}>Support</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {footerLinks.support.map((link) => (
                <li key={link.label} style={{ marginBottom: '0.5rem' }}>
                  <Link to={link.path} style={{ color: '#aaa', textDecoration: 'none' }}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 style={{ color: accent, marginBottom: '1rem' }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {footerLinks.legal.map((link) => (
                <li key={link.label} style={{ marginBottom: '0.5rem' }}>
                  <Link to={link.path} style={{ color: '#aaa', textDecoration: 'none' }}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div style={{ borderTop: '1px solid #333', borderBottom: '1px solid #333', padding: '2rem 0', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaa' }}>
              <FaMapMarkerAlt style={{ color: accent }} />
              <span>{DEALER.location}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaa' }}>
              <FaPhone style={{ color: accent }} />
              <span>{DEALER.phone}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaa' }}>
              <FaEnvelope style={{ color: accent }} />
              <span>{DEALER.email}</span>
            </div>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
          <p>&copy; {new Date().getFullYear()} GEAR-GRID. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

function MobileBottomNav() {
  const { theme } = useTheme()
  const { isAuthenticated, isAdmin } = useAuth()
  const { favorites } = useCars()
  const location = useLocation()

  const bg = theme === 'dark' ? '#1a1a2e' : '#ffffff'
  const text = theme === 'dark' ? '#ffffff' : '#1a1a2e'
  const links = [
    { path: '/', label: 'Home', icon: FaCar },
    { path: '/inventory', label: 'Inventory', icon: FaSearch },
    { path: '/sell', label: 'Sell', icon: FaPlus },
    isAdmin
      ? { path: '/admin', label: 'Admin', icon: FaCog }
      : { path: isAuthenticated ? '/favorites' : '/login', label: isAuthenticated ? 'Saved' : 'Login', icon: isAuthenticated ? FaHeart : FaUser },
  ]

  return (
    <div className="mobile-bottom-nav" style={{ background: bg, borderTop: `1px solid ${theme === 'dark' ? '#333' : '#e5e5e5'}` }}>
      {links.map((link) => {
        const active = location.pathname === link.path
        const Icon = link.icon

        return (
          <Link key={link.path} to={link.path} style={{ color: active ? '#ff6b35' : text }}>
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              <Icon />
              {link.path === '/favorites' && favorites.length > 0 && (
                <small>{favorites.length}</small>
              )}
            </span>
            <span>{link.label}</span>
          </Link>
        )
      })}
    </div>
  )
}

function CarCard({ car, index, showActions = false, onDelete, onToggleFeatured }) {
  const { theme } = useTheme()
  const { isAuthenticated, isAdmin } = useAuth()
  const { toggleFavorite, isFavorite } = useCars()
  const [imageUrl, setImageUrl] = useState(null)
  const [loading, setLoading] = useState(true)

  const bg = theme === 'dark' ? '#1a1a2e' : '#ffffff'
  const text = theme === 'dark' ? '#ffffff' : '#1a1a2e'
  const carId = car._id || car.id
  const favorite = isFavorite(carId)

  useEffect(() => {
    let isMounted = true

    const loadImage = async () => {
      const url = await fetchCarImage(car.make, car.model, car.year)
      if (isMounted) {
        setImageUrl(url)
        setLoading(false)
      }
    }

    loadImage()

    return () => {
      isMounted = false
    }
  }, [car.make, car.model, car.year])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      style={{ background: bg, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', position: 'relative' }}
    >
      {isAuthenticated && !showActions && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault()
            toggleFavorite(carId)
          }}
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 10,
            background: favorite ? '#ff6b35' : 'rgba(255,255,255,0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: favorite ? 'white' : '#666'
          }}
        >
          <FaHeart />
        </motion.button>
      )}

      {showActions && isAdmin && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 10,
            display: 'flex',
            gap: '0.5rem'
          }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault()
              onToggleFeatured(carId, car.featured)
            }}
            style={{
              background: car.featured ? '#ffd700' : 'rgba(255,255,255,0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '35px',
              height: '35px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: car.featured ? '#000' : '#666'
            }}
          >
            <FaStar />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault()
              onDelete(carId)
            }}
            style={{
              background: '#dc3545',
              border: 'none',
              borderRadius: '50%',
              width: '35px',
              height: '35px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            <FaTrash />
          </motion.button>
        </div>
      )}

      <Link to={`/car/${carId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ height: '220px', overflow: 'hidden', position: 'relative', background: car.color }}>
          {loading ? (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <FaCar style={{ fontSize: '2rem', opacity: 0.3 }} />
              </motion.div>
            </div>
          ) : imageUrl ? (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={imageUrl}
              alt={`${car.year} ${car.make} ${car.model}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '4rem' }}>
              <FaCar />
            </div>
          )}

          {car.featured && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: showActions && isAdmin ? '90px' : '10px',
                background: '#ff6b35',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}
            >
              FEATURED
            </div>
          )}
        </div>

        <div style={{ padding: '1.5rem' }}>
          <h3 style={{ color: text, marginBottom: '0.5rem' }}>{car.year} {car.make} {car.model}</h3>
          <p style={{ color: '#666', marginBottom: '1rem' }}>{car.trim}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#ff6b35', fontSize: '1.5rem', fontWeight: 'bold' }}>
              ${car.price.toLocaleString()}
            </span>
            <span style={{ color: '#666', fontSize: '0.9rem' }}>
              {car.mileage.toLocaleString()} mi
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
// ==================== PAGES ====================

function Home() {
  const { theme } = useTheme()
  const { cars } = useCars()
  const featuredCars = cars.filter(c => c.featured).slice(0, 6)
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <section style={{
        minHeight: '90vh',
        background: theme === 'dark' ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        color: theme === 'dark' ? '#ffffff' : '#1a1a2e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
          <motion.h1 initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }} style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem' }}>
            PREMIUM CARS, <span style={{ color: '#ff6b35' }}>READY</span> TO DRIVE
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.3 }} style={{ fontSize: '1.25rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Browse inspected dealer inventory, request a viewing, or sell your car directly to us.
          </motion.p>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <input type="text" placeholder="Search cars..." style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: 'none', fontSize: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/inventory" style={{ background: '#ff6b35', color: 'white', padding: '1rem 2rem', borderRadius: '8px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaSearch /> Search
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <section style={{ padding: '4rem 2rem', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ color: theme === 'dark' ? '#ffffff' : '#1a1a2e', textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>
            Featured Vehicles
          </motion.h2>
          <div className="mobile-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {featuredCars.map((car, index) => <CarCard key={car._id || car.id} car={car} index={index} />)}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ textAlign: 'center', marginTop: '3rem' }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/inventory" style={{ background: '#ff6b35', color: 'white', padding: '1rem 2rem', borderRadius: '8px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                View All <FaArrowRight />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

function Inventory() {
  const { theme } = useTheme()
  const { cars } = useCars()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterFuel, setFilterFuel] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  
  const filteredCars = cars.filter(car => {
    const matchesSearch = car.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.year.toString().includes(searchTerm)
    const matchesFuel = filterFuel === 'all' || car.fuelType === filterFuel
    return matchesSearch && matchesFuel
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'newest') return b.year - a.year
    if (sortBy === 'mileage') return a.mileage - b.mileage
    return 0
  })

  const fuelTypes = ['all', ...new Set(cars.map(c => c.fuelType))]
  
  return (
    <motion.div className="mobile-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: 'calc(100vh - 80px)', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: theme === 'dark' ? '#ffffff' : '#1a1a2e', padding: '2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem' }}>Dealer Inventory ({filteredCars.length} cars)</h1>
        
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
            <input 
              type="text" 
              placeholder="Search by make, model, or year..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '8px', border: '2px solid #e0e0e0', background: theme === 'dark' ? '#1a1a2e' : '#ffffff', color: 'inherit', fontSize: '1rem' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaFilter style={{ color: '#ff6b35' }} />
            <select value={filterFuel} onChange={(e) => setFilterFuel(e.target.value)} style={{ padding: '1rem', borderRadius: '8px', border: '2px solid #e0e0e0', background: theme === 'dark' ? '#1a1a2e' : '#ffffff', color: 'inherit', cursor: 'pointer' }}>
              {fuelTypes.map(type => <option key={type} value={type}>{type === 'all' ? 'All Fuel Types' : type}</option>)}
            </select>
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '1rem', borderRadius: '8px', border: '2px solid #e0e0e0', background: theme === 'dark' ? '#1a1a2e' : '#ffffff', color: 'inherit', cursor: 'pointer' }}>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="mileage">Lowest Mileage</option>
          </select>
        </motion.div>

        {filteredCars.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
            <FaCar style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.3 }} />
            <h3>No cars found</h3>
            <p>Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <div className="mobile-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {filteredCars.map((car, index) => <CarCard key={car._id || car.id} car={car} index={index} />)}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function Favorites() {
  const { theme } = useTheme()
  const { getFavoriteCars } = useCars()
  const favoriteCars = getFavoriteCars()
  
  return (
    <motion.div className="mobile-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: 'calc(100vh - 80px)', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: theme === 'dark' ? '#ffffff' : '#1a1a2e', padding: '2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem' }}>My Favorites ({favoriteCars.length})</h1>
        
        {favoriteCars.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <FaHeart style={{ fontSize: '4rem', color: '#ff6b35', marginBottom: '1rem', opacity: 0.3 }} />
            <h3>No favorites yet</h3>
            <p style={{ marginBottom: '2rem' }}>Start browsing and save cars you love!</p>
            <Link to="/inventory" style={{ background: '#ff6b35', color: 'white', padding: '1rem 2rem', borderRadius: '8px', textDecoration: 'none' }}>
              Browse Cars
            </Link>
          </div>
        ) : (
          <div className="mobile-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {favoriteCars.map((car, index) => <CarCard key={car._id || car.id} car={car} index={index} />)}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function CarDetail() {
  const { theme } = useTheme()
  const { isAuthenticated } = useAuth()
  const { toggleFavorite, isFavorite } = useCars()
  const navigate = useNavigate()
  const { id } = useParams()
  const { cars } = useCars()
  
  const car = cars.find(c => (c._id || String(c.id)) === id)
  const [gallery, setGallery] = useState([])
  const [mainImage, setMainImage] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const bg = theme === 'dark' ? '#0f0f1e' : '#f8f9fa'
  const text = theme === 'dark' ? '#ffffff' : '#1a1a2e'
  const cardBg = theme === 'dark' ? '#1a1a2e' : '#ffffff'
  const favorite = car ? isFavorite(car._id || car.id) : false
  
  useEffect(() => {
    if (!car) return
    
    let isMounted = true
    
    const loadGallery = async () => {
      const images = await fetchCarGallery(car.make, car.model, car.year, 4)
      if (isMounted) {
        if (images.length > 0) {
          setMainImage(images[0].regular)
          setGallery(images.slice(1))
        }
        setLoading(false)
      }
    }
    
    loadGallery()
    
    return () => { isMounted = false }
  }, [car])
  
  if (!car) {
    return (
      <div style={{ minHeight: 'calc(100vh - 80px)', background: bg, color: text, padding: '2rem', textAlign: 'center' }}>
        <h1>Car not found</h1>
        <Link to="/inventory" style={{ color: '#ff6b35' }}>Back to Inventory</Link>
      </div>
    )
  }
  
  const handleBuy = () => {
    if (!isAuthenticated) {
      toast.warning('Please login to send an inquiry')
      navigate('/login')
    } else {
      toast.success('Inquiry received. Our sales team will contact you shortly.')
    }
  }
  
  return (
    <motion.div className="mobile-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: 'calc(100vh - 80px)', background: bg, color: text, padding: '2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <motion.button whileHover={{ x: -5 }} onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#ff6b35', cursor: 'pointer', marginBottom: '2rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          ← Back
        </motion.button>
        
        <div className="mobile-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <div style={{ height: '400px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem', background: car.color }}>
              {loading ? (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <FaCar style={{ fontSize: '3rem', opacity: 0.3 }} />
                  </motion.div>
                </div>
              ) : mainImage ? (
                <img src={mainImage} alt={`${car.year} ${car.make} ${car.model}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '6rem' }}>
                  <FaCar />
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', height: '100px' }}>
              {gallery.map((img, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    const clickedImage = img.regular
                    setGallery(prev => prev.map((p, i) => i === idx ? { ...p, regular: mainImage } : p))
                    setMainImage(clickedImage)
                  }}
                  style={{ flex: 1, borderRadius: '8px', overflow: 'hidden', cursor: 'pointer' }}
                >
                  <img src={img.small} alt={`View ${idx + 2}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </motion.div>
              ))}
              {[...Array(3 - gallery.length)].map((_, idx) => (
                <div key={`placeholder-${idx}`} style={{ flex: 1, borderRadius: '8px', background: theme === 'dark' ? '#2a2a3e' : '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                  <FaCar />
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{car.year} {car.make} {car.model}</h1>
                <p style={{ color: '#666', marginBottom: '2rem' }}>{car.trim}</p>
              </div>
              {isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleFavorite(car._id || car.id)}
                  style={{
                    background: favorite ? '#ff6b35' : cardBg,
                    border: '2px solid #ff6b35',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: favorite ? 'white' : '#ff6b35',
                    fontSize: '1.5rem'
                  }}
                >
                  <FaHeart />
                </motion.button>
              )}
            </div>
            
            <motion.p initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ fontSize: '3rem', color: '#ff6b35', fontWeight: 'bold', marginBottom: '2rem' }}>
              ${car.price.toLocaleString()}
            </motion.p>
            
            <div className="mobile-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Year', value: car.year },
                { label: 'Mileage', value: `${car.mileage.toLocaleString()} mi` },
                { label: 'Fuel', value: car.fuelType },
                { label: 'Transmission', value: car.transmission }
              ].map((item, idx) => (
                <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + idx * 0.1 }} style={{ background: cardBg, padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ color: '#666', fontSize: '0.9rem' }}>{item.label}</div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{item.value}</div>
                </motion.div>
              ))}
            </div>
            
            <p style={{ marginBottom: '2rem', lineHeight: 1.6, fontSize: '1.1rem' }}>{car.description}</p>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Features</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {car.features.map((f, i) => (
                  <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }} style={{ background: cardBg, padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaCheckCircle style={{ color: '#28a745' }} /> {f}
                  </motion.span>
                ))}
              </div>
            </div>

            {(
              <div style={{ background: cardBg, padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Dealer Contact</h3>
                <div style={{ display: 'grid', gap: '0.85rem', color: '#666' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FaUser style={{ color: '#ff6b35' }} />
                    <span>{DEALER.name}</span>
                  </div>
                  <a href={`tel:${DEALER.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#666', textDecoration: 'none' }}>
                    <FaPhone style={{ color: '#ff6b35' }} />
                    <span>{DEALER.phone}</span>
                  </a>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FaMapMarkerAlt style={{ color: '#ff6b35' }} />
                    <span>{DEALER.location}</span>
                  </div>
                </div>
              </div>
            )}
            
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleBuy} style={{ background: '#ff6b35', color: 'white', padding: '1rem 2rem', borderRadius: '8px', border: 'none', fontSize: '1.1rem', cursor: 'pointer', width: '100%', marginBottom: '1rem' }}>
              {isAuthenticated ? 'Request This Car' : 'Login to Inquire'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

function Login() {
  const { theme } = useTheme()
  const { login } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()
  
  const onSubmit = (data) => {
    const userData = {
      firstName: data.firstName || data.email.split('@')[0],
      lastName: data.lastName || '',
      email: data.email
    }
    login(data.email, data.password, userData)
    navigate('/')
  }
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: 'calc(100vh - 80px)', background: theme === 'dark' ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ background: theme === 'dark' ? '#1a1a2e' : '#ffffff', padding: '3rem', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: theme === 'dark' ? '#ffffff' : '#1a1a2e' }}>Welcome Back</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
          Admin login: <code style={{ background: '#ff6b3520', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Florexstudio.ng@gmail.com</code>
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: '1rem' }}>
            <input type="email" placeholder="Email" {...register('email', { required: 'Email is required' })} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: errors.email ? '2px solid #ff6b35' : '2px solid #e0e0e0', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: 'inherit' }} />
            {errors.email && <span style={{ color: '#ff6b35', fontSize: '0.85rem' }}>{errors.email.message}</span>}
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <input type="password" placeholder="Password" {...register('password', { required: 'Password is required' })} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: errors.password ? '2px solid #ff6b35' : '2px solid #e0e0e0', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: 'inherit' }} />
            {errors.password && <span style={{ color: '#ff6b35', fontSize: '0.85rem' }}>{errors.password.message}</span>}
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" style={{ width: '100%', padding: '1rem', background: '#ff6b35', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
            Sign In
          </motion.button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666' }}>
          Don't have an account? <Link to="/register" style={{ color: '#ff6b35' }}>Sign up</Link>
        </p>
      </motion.div>
    </motion.div>
  )
}

function Register() {
  const { theme } = useTheme()
  const { register: authRegister } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()
  
  const onSubmit = (data) => {
    authRegister(data)
    navigate('/')
  }
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: 'calc(100vh - 80px)', background: theme === 'dark' ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ background: theme === 'dark' ? '#1a1a2e' : '#ffffff', padding: '3rem', borderRadius: '12px', width: '100%', maxWidth: '450px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: theme === 'dark' ? '#ffffff' : '#1a1a2e' }}>Create Account</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <input type="text" placeholder="First Name" {...register('firstName', { required: true })} style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid #e0e0e0', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: 'inherit' }} />
            <input type="text" placeholder="Last Name" {...register('lastName', { required: true })} style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid #e0e0e0', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: 'inherit' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <input type="email" placeholder="Email" {...register('email', { required: 'Email is required' })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e0e0e0', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: 'inherit' }} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <input type="password" placeholder="Password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e0e0e0', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: 'inherit' }} />
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" style={{ width: '100%', padding: '1rem', background: '#ff6b35', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
            Create Account
          </motion.button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666' }}>
          Already have an account? <Link to="/login" style={{ color: '#ff6b35' }}>Sign in</Link>
        </p>
      </motion.div>
    </motion.div>
  )
}

function Dashboard() {
  const { theme } = useTheme()
  const { user, logout } = useAuth()
  const { getFavoriteCars } = useCars()
  const navigate = useNavigate()
  
  const bg = theme === 'dark' ? '#0f0f1e' : '#f8f9fa'
  const text = theme === 'dark' ? '#ffffff' : '#1a1a2e'
  const cardBg = theme === 'dark' ? '#1a1a2e' : '#ffffff'
  
  const favoriteCars = getFavoriteCars()
  
  const stats = [
    { icon: FaHeart, value: favoriteCars.length, label: 'Saved Cars', color: '#ff6b35' },
    { icon: FaCar, value: '3', label: 'My Listings', color: '#28a745' },
    { icon: FaCheckCircle, value: '5', label: 'Purchases', color: '#0066b1' }
  ]
  
  return (
    <motion.div className="mobile-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: 'calc(100vh - 80px)', background: bg, color: text, padding: '2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <motion.h1 initial={{ x: -20 }} animate={{ x: 0 }} style={{ marginBottom: '2rem' }}>
          Welcome, {user?.firstName}! 👋
        </motion.h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {stats.map((stat, idx) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -5 }} style={{ background: cardBg, padding: '2rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <stat.icon style={{ fontSize: '2.5rem', color: stat.color, marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{stat.value}</h3>
              <p style={{ color: '#666' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
        
        {favoriteCars.length > 0 && (
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Recently Favorited</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {favoriteCars.slice(0, 3).map((car, index) => <CarCard key={car._id || car.id} car={car} index={index} />)}
            </div>
          </div>
        )}
        
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { logout(); navigate('/'); }} style={{ background: '#dc3545', color: 'white', padding: '1rem 2rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
          Logout
        </motion.button>
      </div>
    </motion.div>
  )
}

// ==================== ADMIN DASHBOARD ====================

function AdminDashboard() {
  const { theme } = useTheme()
  const {
    cars,
    pendingCars,
    fetchPendingCars,
    approveCar,
    rejectCar,
    addCar,
    deleteCar,
    toggleFeatured
  } = useCars()
  const { isAdmin, isLoading, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  
  const bg = theme === 'dark' ? '#0f0f1e' : '#f8f9fa'
  const text = theme === 'dark' ? '#ffffff' : '#1a1a2e'
  const cardBg = theme === 'dark' ? '#1a1a2e' : '#ffffff'

  useEffect(() => {
    if (isLoading) return

    if (!isAdmin) {
      navigate('/login')
      return
    }

    const token = localStorage.getItem('gearGridToken')
    if (token) {
      fetchPendingCars(token)
    }
  }, [isAdmin, isLoading, navigate])

  const handleApproveCar = (id) => {
    const token = localStorage.getItem('gearGridToken')
    approveCar(id, token)
  }

  const handleRejectCar = (id) => {
    const token = localStorage.getItem('gearGridToken')
    rejectCar(id, token)
  }

  const handleDeleteCar = (id) => {
    const token = localStorage.getItem('gearGridToken')
    deleteCar(id, token)
  }
  
  // Calculate stats
  const totalCars = cars.length
  const totalValue = cars.reduce((sum, car) => sum + car.price, 0)
  const featuredCount = cars.filter(c => c.featured).length
  
  const stats = [
    { icon: FaCar, label: 'Total Cars', value: totalCars, color: '#0066b1' },
    { icon: FaDollarSign, label: 'Total Value', value: `$${(totalValue / 1000000).toFixed(1)}M`, color: '#28a745' },
    { icon: FaRegClock, label: 'Valuation Leads', value: pendingCars.length, color: '#ff6b35' },
    { icon: FaStar, label: 'Featured', value: featuredCount, color: '#ffd700' }
  ]
  
  const onAddCar = async (data) => {
  const token = localStorage.getItem('gearGridToken')

  const newCar = {
    ...data,
    year: parseInt(data.year),
    price: parseInt(data.price),
    mileage: parseInt(data.mileage),
    features: data.features.split(',').map(f => f.trim()),
    color: '#666666',
    sellerName: data.sellerName || DEALER.name,
    sellerPhone: data.sellerPhone || DEALER.phone,
    sellerLocation: data.sellerLocation || DEALER.location,
    featured: false
  }

  const result = await addCar(newCar, token)

  if (result.success) {
    reset()
    setActiveTab('inventory')
  }
}
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: 'calc(100vh - 80px)', background: bg, color: text }}>
      {/* Admin Header */}
      <div className="admin-header" style={{ background: cardBg, padding: '1.5rem 2rem', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <FaCog style={{ fontSize: '1.5rem', color: '#ff6b35' }} />
          <h1 style={{ margin: 0 }}>Dealer Admin</h1>
        </div>
        <div className="admin-tabs" style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => setActiveTab('overview')}
            style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: '6px', 
              border: 'none',
              background: activeTab === 'overview' ? '#ff6b35' : 'transparent',
              color: activeTab === 'overview' ? 'white' : text,
              cursor: 'pointer'
            }}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('pending')}
            style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: '6px', 
              border: 'none',
              background: activeTab === 'pending' ? '#ff6b35' : 'transparent',
              color: activeTab === 'pending' ? 'white' : text,
              cursor: 'pointer'
            }}
          >
            Leads ({pendingCars.length})
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: '6px', 
              border: 'none',
              background: activeTab === 'inventory' ? '#ff6b35' : 'transparent',
              color: activeTab === 'inventory' ? 'white' : text,
              cursor: 'pointer'
            }}
          >
            Inventory
          </button>
          <button 
            onClick={() => setActiveTab('add')}
            style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: '6px', 
              border: 'none',
              background: activeTab === 'add' ? '#ff6b35' : 'transparent',
              color: activeTab === 'add' ? 'white' : text,
              cursor: 'pointer'
            }}
          >
            Add Car
          </button>
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => { logout(); navigate('/'); }} style={{ background: '#dc3545', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaSignOutAlt /> Logout
          </motion.button>
        </div>
      </div>
      
      <div className="admin-content" style={{ padding: '2rem' }}>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              {stats.map((stat, idx) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  style={{ background: cardBg, padding: '2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}
                >
                  <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <stat.icon style={{ fontSize: '1.8rem', color: stat.color }} />
                  </div>
                  <div>
                    <p style={{ color: '#666', margin: '0 0 0.25rem 0' }}>{stat.label}</p>
                    <h3 style={{ margin: 0, fontSize: '1.8rem' }}>{stat.value}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div style={{ background: cardBg, padding: '2rem', borderRadius: '12px' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Recent Listings</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #333' }}>
                      <th style={{ textAlign: 'left', padding: '1rem' }}>Car</th>
                      <th style={{ textAlign: 'left', padding: '1rem' }}>Year</th>
                      <th style={{ textAlign: 'left', padding: '1rem' }}>Price</th>
                      <th style={{ textAlign: 'left', padding: '1rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cars.slice(0, 5).map(car => (
                      <tr key={car._id || car.id} style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ padding: '1rem' }}>{car.make} {car.model}</td>
                        <td style={{ padding: '1rem' }}>{car.year}</td>
                        <td style={{ padding: '1rem', color: '#ff6b35' }}>${car.price.toLocaleString()}</td>
                        <td style={{ padding: '1rem' }}>
                          {car.featured ? (
                            <span style={{ background: '#ffd700', color: '#000', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem' }}>Featured</span>
                          ) : (
                            <span style={{ background: '#333', color: '#aaa', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem' }}>Standard</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Sell-to-Us Leads Tab */}
        {activeTab === 'pending' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Sell-to-Us Leads ({pendingCars.length})</h2>

            {pendingCars.length === 0 ? (
              <div style={{ background: cardBg, padding: '3rem', borderRadius: '12px', textAlign: 'center', color: '#666' }}>
                <FaRegClock style={{ fontSize: '3rem', color: '#ff6b35', marginBottom: '1rem', opacity: 0.6 }} />
                <h3 style={{ color: text, marginBottom: '0.5rem' }}>No valuation leads</h3>
                <p style={{ margin: 0 }}>Cars submitted through Sell to Us will appear here.</p>
              </div>
            ) : (
              <div className="mobile-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {pendingCars.map((car, index) => {
                  const carId = car._id || car.id

                  return (
                    <motion.div
                      key={carId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      style={{ background: cardBg, borderRadius: '12px', padding: '1.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <h3 style={{ margin: '0 0 0.35rem 0' }}>{car.year} {car.make} {car.model}</h3>
                          <p style={{ margin: 0, color: '#666' }}>{car.trim || 'No trim listed'}</p>
                        </div>
                        <strong style={{ color: '#ff6b35', whiteSpace: 'nowrap' }}>${car.price.toLocaleString()}</strong>
                      </div>

                      <p style={{ color: '#666', lineHeight: 1.6, minHeight: '3rem' }}>{car.description || 'No description provided.'}</p>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.65rem', margin: '1.25rem 0', color: '#666' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaUser style={{ color: '#ff6b35' }} /> {car.sellerName}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaPhone style={{ color: '#ff6b35' }} /> {car.sellerPhone}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaMapMarkerAlt style={{ color: '#ff6b35' }} /> {car.sellerLocation}</span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button onClick={() => handleApproveCar(carId)} style={{ flex: 1, minWidth: '130px', background: '#28a745', color: 'white', border: 'none', padding: '0.85rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                          Add to Inventory
                        </button>
                        <button onClick={() => handleRejectCar(carId)} style={{ flex: 1, minWidth: '130px', background: '#6c757d', color: 'white', border: 'none', padding: '0.85rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                          Decline
                        </button>
                        <button onClick={() => handleDeleteCar(carId)} style={{ width: '48px', background: '#dc3545', color: 'white', border: 'none', padding: '0.85rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FaTrash />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Manage Dealer Inventory ({cars.length} cars)</h2>
            <div className="mobile-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
              {cars.map((car, index) => (
            <CarCard 
  key={car._id || car.id}
  car={car}
  index={index}
  showActions={true}
  onDelete={(id) => {
    const token = localStorage.getItem('gearGridToken')
    deleteCar(id, token)
  }}
  onToggleFeatured={(id, currentFeatured) => {
    const token = localStorage.getItem('gearGridToken')
    toggleFeatured(id, currentFeatured, token)
  }}
/>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Add Car Tab */}
        {activeTab === 'add' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Add New Car</h2>
            <div style={{ background: cardBg, padding: '2rem', borderRadius: '12px' }}>
              <form onSubmit={handleSubmit(onAddCar)}>
                <div className="mobile-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Make</label>
                    <input {...register('make', { required: true })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e0e0e0', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: 'inherit' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Model</label>
                    <input {...register('model', { required: true })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e0e0e0', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: 'inherit' }} />
                  </div>
                </div>
                
                <div className="mobile-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Year</label>
                    <input type="number" {...register('year', { required: true })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e0e0e0', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: 'inherit' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Price</label>
                    <input type="number" {...register('price', { required: true })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e0e0e0', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: 'inherit' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Mileage</label>
                    <input type="number" {...register('mileage', { required: true })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e0e0e0', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: 'inherit' }} />
                  </div>
                </div>
                
                <div className="mobile-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Fuel Type</label>
                    <select {...register('fuelType', { required: true })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e0e0e0', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: 'inherit' }}>
                      <option value="Gasoline">Gasoline</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Diesel">Diesel</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Transmission</label>
                    <select {...register('transmission', { required: true })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e0e0e0', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: 'inherit' }}>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                      <option value="PDK">PDK</option>
                    </select>
                  </div>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Trim/Package</label>
                  <input {...register('trim', { required: true })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e0e0e0', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: 'inherit' }} />
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Description</label>
                  <textarea rows="3" {...register('description', { required: true })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e0e0e0', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: 'inherit' }} />
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Features (comma-separated)</label>
                  <input {...register('features', { required: true })} placeholder="e.g. Leather Seats, Sunroof, Navigation" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e0e0e0', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: 'inherit' }} />
                </div>
                
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" style={{ width: '100%', padding: '1rem', background: '#ff6b35', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <FaPlus /> Add Car to Inventory
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

function SellCar() {
  const { theme } = useTheme()
  const { addCar } = useCars()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      toast.warning('Please sign in first')
      navigate('/login')
      return
    }

    const token = localStorage.getItem('gearGridToken')

  const newCar = {
  make: data.make,
  model: data.model,
  year: parseInt(data.year),
  trim: data.trim,
  price: parseInt(data.price),
  mileage: parseInt(data.mileage),
  fuelType: data.fuelType,
  transmission: data.transmission,
  color: data.color || '#666666',
  featured: false,
  description: data.description,
  features: data.features ? data.features.split(',').map(f => f.trim()) : [],
  sellerName: data.sellerName,
  sellerPhone: data.sellerPhone,
  sellerLocation: data.sellerLocation,
  status: 'pending',
}

    const result = await addCar(newCar, token)

    if (result.success) {
      reset()
      navigate('/')
    }
  }

  return (
    <motion.div
      className="mobile-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        minHeight: 'calc(100vh - 80px)',
        background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa',
        color: theme === 'dark' ? '#ffffff' : '#1a1a2e',
        padding: '2rem'
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '0.75rem' }}>Sell Your Car to Us</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
          Share your vehicle details and our team will review it for a direct purchase or trade-in offer.
        </p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            background: theme === 'dark' ? '#1a1a2e' : '#ffffff',
            padding: '3rem',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
<div
  className="mobile-form-grid"
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '1rem'
  }}
>
  <input
    type="text"
    placeholder="Your Name"
    {...register('sellerName', { required: true })}
    style={{
      padding: '1rem',
      borderRadius: '8px',
      border: '2px solid #e0e0e0',
      background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa',
      color: 'inherit'
    }}
  />
  <input
    type="text"
    placeholder="Phone Number"
    {...register('sellerPhone', { required: true })}
    style={{
      padding: '1rem',
      borderRadius: '8px',
      border: '2px solid #e0e0e0',
      background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa',
      color: 'inherit'
    }}
  />
  <input
    type="text"
    placeholder="Your Location"
    {...register('sellerLocation', { required: true })}
    style={{
      padding: '1rem',
      borderRadius: '8px',
      border: '2px solid #e0e0e0',
      background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa',
      color: 'inherit'
    }}
  />
</div>

<div
  className="mobile-form-grid"
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    marginBottom: '1rem'
  }}
>
  <input
    type="text"
    placeholder="Make"
    {...register('make', { required: true })}
    style={{
      padding: '1rem',
      borderRadius: '8px',
      border: '2px solid #e0e0e0',
      background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa',
      color: 'inherit'
    }}
  />
  <input
    type="text"
    placeholder="Model"
    {...register('model', { required: true })}
    style={{
      padding: '1rem',
      borderRadius: '8px',
      border: '2px solid #e0e0e0',
      background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa',
      color: 'inherit'
    }}
  />
</div>

            <div
              className="mobile-form-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginBottom: '1rem'
              }}
            >
              <input
                type="number"
                placeholder="Year"
                {...register('year', { required: true })}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa',
                  color: 'inherit'
                }}
              />
              <input
                type="text"
                placeholder="Trim"
                {...register('trim', { required: true })}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa',
                  color: 'inherit'
                }}
              />
              <input
                type="number"
                placeholder="Expected Price"
                {...register('price', { required: true })}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa',
                  color: 'inherit'
                }}
              />
            </div>

            <div
              className="mobile-form-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginBottom: '1rem'
              }}
            >
              <input
                type="number"
                placeholder="Mileage"
                {...register('mileage', { required: true })}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa',
                  color: 'inherit'
                }}
              />
              <select
                {...register('fuelType', { required: true })}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa',
                  color: 'inherit'
                }}
              >
                <option value="Gasoline">Gasoline</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Diesel">Diesel</option>
              </select>
              <select
                {...register('transmission', { required: true })}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa',
                  color: 'inherit'
                }}
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="PDK">PDK</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Color hex code, e.g. #111827"
                {...register('color')}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa',
                  color: 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <textarea
                placeholder="Condition, service history, and anything we should know"
                rows="4"
                {...register('description', { required: true })}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa',
                  color: 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <input
                type="text"
                placeholder="Features separated by commas, e.g. Leather Seats, Reverse Camera"
                {...register('features')}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa',
                  color: 'inherit'
                }}
              />
            </div>

            

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              style={{
                width: '100%',
                padding: '1rem',
                background: '#ff6b35',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Request Valuation
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  )
}

function About() {
  const { theme } = useTheme()
  const bg = theme === 'dark' ? '#0f0f1e' : '#f8f9fa'
  const text = theme === 'dark' ? '#ffffff' : '#1a1a2e'
  const cardBg = theme === 'dark' ? '#1a1a2e' : '#ffffff'
  
  const stats = [
    { number: '15K+', label: 'Cars Sold', icon: FaCar },
    { number: '50K+', label: 'Happy Customers', icon: FaUsers },
    { number: '99%', label: 'Satisfaction Rate', icon: FaStar },
    { number: '24/7', label: 'Support', icon: FaHeadset }
  ]
  
  const values = [
    { icon: FaShieldAlt, title: 'Trust & Transparency', description: 'Every vehicle undergoes rigorous inspection. Full history reports provided.' },
    { icon: FaAward, title: 'Quality Assurance', description: 'Only the finest pre-owned vehicles make it to our platform.' },
    { icon: FaHandshake, title: 'Fair Deals', description: 'Competitive pricing with no hidden fees. What you see is what you pay.' },
    { icon: FaRegClock, title: 'Time Efficiency', description: 'Streamlined buying and selling process. Get your dream car fast.' }
  ]
  
  const team = [
    { name: 'Omileke Flourish', role: 'CEO & Founder', color: '#ff6b35' },
    { name: 'Victor Ogbuefi', role: 'Head of Sales', color: '#0066b1' },
    { name: 'Francis Okonkwo', role: 'Chief Inspector', color: '#28a745' },
    { name: 'Arya Starr', role: 'Customer Success', color: '#c41230' }
  ]
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: 'calc(100vh - 80px)', background: bg, color: text }}>
      <section style={{ background: theme === 'dark' ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', padding: '6rem 2rem', textAlign: 'center' }}>
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
            About <span style={{ color: '#ff6b35' }}>GEAR-GRID</span>
          </h1>
          <p style={{ maxWidth: '700px', margin: '0 auto', lineHeight: 1.8, fontSize: '1.2rem', opacity: 0.8 }}>
            A focused automotive business helping buyers find inspected vehicles and helping owners sell their cars directly without stress.
          </p>
        </motion.div>
      </section>
      
      <section style={{ padding: '4rem 2rem', background: bg }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {stats.map((stat, idx) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} style={{ background: cardBg, padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
                <stat.icon style={{ fontSize: '2.5rem', color: '#ff6b35', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#ff6b35' }}>{stat.number}</h3>
                <p style={{ color: '#666' }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <section style={{ padding: '4rem 2rem', background: theme === 'dark' ? '#1a1a2e' : '#ffffff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Our Mission</h2>
            <p style={{ fontSize: '1.2rem', lineHeight: 1.8, opacity: 0.9 }}>
              At GEAR-GRID, we believe buying or selling a vehicle should be clear, fast, and personal. Our mission is to provide quality inventory, honest pricing, and responsive support for every customer.
            </p>
          </motion.div>
        </div>
      </section>
      
      <section style={{ padding: '4rem 2rem', background: bg }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem' }}>Our Values</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {values.map((value, idx) => (
              <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -5 }} style={{ background: cardBg, padding: '2rem', borderRadius: '12px' }}>
                <value.icon style={{ fontSize: '2.5rem', color: '#ff6b35', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>{value.title}</h3>
                <p style={{ color: '#666', lineHeight: 1.6 }}>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <section style={{ padding: '4rem 2rem', background: theme === 'dark' ? '#1a1a2e' : '#ffffff' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem' }}>Meet Our Team</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {team.map((member, idx) => (
              <motion.div key={member.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} style={{ textAlign: 'center' }}>
                <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: member.color, margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'rgba(255,255,255,0.3)' }}>
                  <FaUser />
                </div>
                <h3 style={{ marginBottom: '0.5rem' }}>{member.name}</h3>
                <p style={{ color: '#ff6b35' }}>{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  )
}

// ==================== MAIN APP ====================

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CarsProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/car/:id" element={<CarDetail />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/sell" element={<SellCar />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </main>
            <Footer />
            <MobileBottomNav />
          </div>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
        </CarsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
