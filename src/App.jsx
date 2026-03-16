import React, { useState, useEffect, createContext, useContext } from 'react'
import { Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
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

const ThemeContext = createContext()
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  
  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
const useTheme = () => useContext(ThemeContext)

const AuthContext = createContext()
function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const login = (email, password, userData) => {
    // Check for admin login
    const isAdminUser = email === 'admin@geargrid.com'
    
    const newUser = userData || { 
      firstName: isAdminUser ? 'Admin' : email.split('@')[0],
      lastName: '', 
      email, 
      id: Date.now(),
      isAdmin: isAdminUser
    }
    
    setUser(newUser)
    setIsAuthenticated(true)
    setIsAdmin(isAdminUser)
    toast.success(`Welcome back, ${newUser.firstName}!`)
  }

  const register = (userData) => {
    setUser({ ...userData, id: Date.now(), isAdmin: false })
    setIsAuthenticated(true)
    setIsAdmin(false)
    toast.success(`Welcome, ${userData.firstName}! Account created successfully!`)
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    setIsAdmin(false)
    toast.info('Logged out successfully')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
const useAuth = () => useContext(AuthContext)

// ==================== EXPANDED CAR DATA (24 CARS) ====================

const initialCars = [
  // Original 6 cars
  { id: 1, make: 'BMW', model: 'M3', year: 2023, trim: 'Competition', price: 84999, mileage: 12500, fuelType: 'Gasoline', transmission: 'Automatic', color: '#0066b1', featured: true, description: 'Immaculate condition BMW M3 Competition with all options. Ceramic brakes, carbon fiber trim.', features: ['Carbon Ceramic Brakes', 'Executive Package', 'Carbon Fiber Trim', 'Harmon Kardon Sound'] },
  { id: 2, make: 'Porsche', model: '911', year: 2022, trim: 'Carrera S', price: 135000, mileage: 8500, fuelType: 'Gasoline', transmission: 'PDK', color: '#c41230', featured: true, description: 'Stunning 911 Carrera S with Sport Package. One owner, all service records.', features: ['Sport Package', 'Sport Exhaust', 'BOSE Audio', 'Lane Change Assist'] },
  { id: 3, make: 'Tesla', model: 'Model S', year: 2023, trim: 'Plaid', price: 115000, mileage: 3200, fuelType: 'Electric', transmission: 'Automatic', color: '#f4f4f4', featured: true, description: 'Tesla Model S Plaid with Full Self Driving. Acceleration that will take your breath away.', features: ['Full Self Driving', '21" Wheels', 'Yoke Steering', 'Premium Audio'] },
  { id: 4, make: 'Mercedes', model: 'S-Class', year: 2023, trim: 'S580', price: 125000, mileage: 5600, fuelType: 'Gasoline', transmission: 'Automatic', color: '#1a1a1a', featured: false, description: 'The pinnacle of luxury. S-Class with every available option.', features: ['Executive Seating', 'Burmester Audio', 'AR Head-Up Display'] },
  { id: 5, make: 'Audi', model: 'R8', year: 2022, trim: 'V10 Performance', price: 165000, mileage: 4200, fuelType: 'Gasoline', transmission: 'Automatic', color: '#ffea00', featured: true, description: 'Final year R8 V10 Performance. Carbon fiber everywhere.', features: ['Carbon Fiber', 'Laser Headlights', 'B&O Audio', 'Carbon Brakes'] },
  { id: 6, make: 'Lexus', model: 'LC 500', year: 2023, trim: 'Inspiration', price: 105000, mileage: 1800, fuelType: 'Gasoline', transmission: 'Automatic', color: '#001f3f', featured: false, description: 'Limited Inspiration Series LC 500. Stunning blue paintwork.', features: ['Mark Levinson Audio', 'Limited Paint', 'Carbon Fiber Roof'] },
  
  // New cars added
  { id: 7, make: 'Ferrari', model: 'F8', year: 2022, trim: 'Tributo', price: 285000, mileage: 2100, fuelType: 'Gasoline', transmission: 'Automatic', color: '#dc0000', featured: true, description: 'Ferrari F8 Tributo with racing seats and carbon fiber package. Pure Italian excellence.', features: ['Racing Seats', 'Carbon Fiber Package', 'JBL Audio', 'Lift System'] },
  { id: 8, make: 'Lamborghini', model: 'Huracan', year: 2023, trim: 'EVO', price: 245000, mileage: 1500, fuelType: 'Gasoline', transmission: 'Automatic', color: '#87ceeb', featured: true, description: 'Stunning Huracan EVO in baby blue. Magnetic ride suspension, sport exhaust.', features: ['Magnetic Ride', 'Sport Exhaust', 'Apple CarPlay', 'Rear Camera'] },
  { id: 9, make: 'McLaren', model: '720S', year: 2022, trim: 'Performance', price: 295000, mileage: 3200, fuelType: 'Gasoline', transmission: 'Automatic', color: '#ffa500', featured: true, description: 'McLaren 720S Performance. Dihedral doors, track telemetry, carbon ceramics.', features: ['Track Telemetry', 'Carbon Ceramics', 'Bowers & Wilkins', 'Lift System'] },
  { id: 10, make: 'Aston Martin', model: 'DB11', year: 2023, trim: 'V8', price: 185000, mileage: 4500, fuelType: 'Gasoline', transmission: 'Automatic', color: '#2e8b57', featured: false, description: 'British elegance meets performance. DB11 V8 with Bang & Olufsen sound.', features: ['Bang & Olufsen', 'Heated Seats', '360 Camera', 'Night Vision'] },
  { id: 11, make: 'Bentley', model: 'Continental GT', year: 2022, trim: 'W12', price: 225000, mileage: 6800, fuelType: 'Gasoline', transmission: 'Automatic', color: '#4a4a4a', featured: false, description: 'Ultimate grand tourer. W12 power with handcrafted interior.', features: ['Mulliner Package', 'Naim Audio', 'Massage Seats', 'Touring Spec'] },
  { id: 12, make: 'Rolls-Royce', model: 'Ghost', year: 2023, trim: 'Black Badge', price: 385000, mileage: 1200, fuelType: 'Gasoline', transmission: 'Automatic', color: '#000000', featured: true, description: 'Black Badge Ghost. The pinnacle of luxury with sinister styling.', features: ['Starlight Headliner', 'Bespoke Audio', 'Rear Theatre', 'Champagne Cooler'] },
  { id: 13, make: 'Maserati', model: 'MC20', year: 2023, trim: 'Cielo', price: 215000, mileage: 900, fuelType: 'Gasoline', transmission: 'Automatic', color: '#ffffff', featured: false, description: 'MC20 Cielo convertible. Nettuno engine with F1-derived technology.', features: ['Carbon Fiber Tub', 'Sonus Faber Audio', 'Lift System', 'Wireless Charging'] },
  { id: 14, make: 'Jaguar', model: 'F-Type', year: 2023, trim: 'R', price: 105000, mileage: 5600, fuelType: 'Gasoline', transmission: 'Automatic', color: '#800080', featured: false, description: 'F-Type R with supercharged V8. Active exhaust and configurable dynamics.', features: ['Active Exhaust', 'Configurable Dynamics', 'Meridian Audio', 'Panoramic Roof'] },
  { id: 15, make: 'Chevrolet', model: 'Corvette', year: 2023, trim: 'Z06', price: 115000, mileage: 7800, fuelType: 'Gasoline', transmission: 'Manual', color: '#ff4500', featured: true, description: 'C8 Z06 with Z07 package. Flat-plane crank V8 screams to 8,600 RPM.', features: ['Z07 Package', 'Carbon Wheels', 'Brembo Brakes', 'Track Camera'] },
  { id: 16, make: 'Ford', model: 'Mustang', year: 2024, trim: 'Dark Horse', price: 75000, mileage: 1200, fuelType: 'Gasoline', transmission: 'Manual', color: '#1e90ff', featured: false, description: 'Dark Horse with Handling Package. Recaro seats and Tremec manual.', features: ['Handling Package', 'Recaro Seats', 'B&O Audio', 'Magneride'] },
  { id: 17, make: 'Dodge', model: 'Challenger', year: 2023, trim: 'Hellcat Redeye', price: 95000, mileage: 3400, fuelType: 'Gasoline', transmission: 'Automatic', color: '#000080', featured: false, description: 'Hellcat Redeye Widebody. 797 horsepower of American muscle.', features: ['Widebody Package', 'Laguna Leather', 'Alcantara Wheel', 'Launch Control'] },
  { id: 18, make: 'Nissan', model: 'GT-R', year: 2023, trim: 'Nismo', price: 215000, mileage: 2100, fuelType: 'Gasoline', transmission: 'Automatic', color: '#ffffff', featured: false, description: 'GT-R Nismo with carbon fiber everything. Track-ready Godzilla.', features: ['Carbon Fiber Hood', 'Recaro Seats', 'Bose Audio', 'Titanium Exhaust'] },
  { id: 19, make: 'Toyota', model: 'Supra', year: 2023, trim: 'A91 Edition', price: 65000, mileage: 4500, fuelType: 'Gasoline', transmission: 'Automatic', color: '#ffd700', featured: false, description: 'Limited A91 Edition in Refraction Gold. B58 engine with Toyota tuning.', features: ['A91 Edition', 'JBL Audio', 'Heads-Up Display', 'Wireless CarPlay'] },
  { id: 20, make: 'BMW', model: 'M5', year: 2023, trim: 'CS', price: 142000, mileage: 2800, fuelType: 'Gasoline', transmission: 'Automatic', color: '#50c878', featured: true, description: 'M5 CS with 627hp. Lightest and most powerful M5 ever made.', features: ['Carbon Bucket Seats', 'Gold Bronze Wheels', 'M Carbon Ceramic', 'Bowers & Wilkins'] },
  { id: 21, make: 'Mercedes', model: 'AMG GT', year: 2023, trim: 'Black Series', price: 325000, mileage: 1500, fuelType: 'Gasoline', transmission: 'Automatic', color: '#c0c0c0', featured: true, description: 'AMG GT Black Series. Track-focused with adjustable wing.', features: ['Carbon Fiber Wing', 'Track Package', 'Burmester', 'Roll Cage'] },
  { id: 22, make: 'Porsche', model: 'Taycan', year: 2023, trim: 'Turbo S', price: 185000, mileage: 3200, fuelType: 'Electric', transmission: 'Automatic', color: '#ff69b4', featured: false, description: 'Taycan Turbo S in Frozen Berry. 750hp electric supercar.', features: ['Performance Battery+', 'Porsche InnoDrive', 'Burmester', 'Charging Package'] },
  { id: 23, make: 'Audi', model: 'RS e-tron GT', year: 2023, trim: 'Quattro', price: 145000, mileage: 4100, fuelType: 'Electric', transmission: 'Automatic', color: '#228b22', featured: false, description: 'RS e-tron GT with carbon fiber roof. Electric grand touring.', features: ['Carbon Roof', 'Matrix LED', 'B&O Audio', 'Air Suspension'] },
  { id: 24, make: 'Lucid', model: 'Air', year: 2023, trim: 'Dream Edition', price: 169000, mileage: 1800, fuelType: 'Electric', transmission: 'Automatic', color: '#e6e6fa', featured: false, description: 'Air Dream Edition with 516 mile range. Tesla competitor with luxury focus.', features: ['DreamDrive Pro', 'Surreal Sound', 'Glass Canopy', 'Executive Rear'] }
]

// ==================== CARS CONTEXT FOR GLOBAL STATE ====================

const CarsContext = createContext()

function CarsProvider({ children }) {
  const [cars, setCars] = useState(initialCars)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  const addCar = (newCar) => {
    const carWithId = { ...newCar, id: Date.now(), featured: false }
    setCars(prev => [carWithId, ...prev])
    toast.success('Car added successfully!')
  }

  const deleteCar = (id) => {
    setCars(prev => prev.filter(car => car.id !== id))
    toast.success('Car deleted!')
  }

  const toggleFeatured = (id) => {
    setCars(prev => prev.map(car => 
      car.id === id ? { ...car, featured: !car.featured } : car
    ))
  }

  const toggleFavorite = (carId) => {
    setFavorites(prev => {
      if (prev.includes(carId)) {
        toast.info('Removed from favorites')
        return prev.filter(id => id !== carId)
      } else {
        toast.success('Added to favorites!')
        return [...prev, carId]
      }
    })
  }

  const isFavorite = (carId) => favorites.includes(carId)

  const getFavoriteCars = () => cars.filter(car => favorites.includes(car.id))

  return (
    <CarsContext.Provider value={{ 
      cars, 
      addCar, 
      deleteCar, 
      toggleFeatured,
      toggleFavorite,
      isFavorite,
      getFavoriteCars,
      favorites 
    }}>
      {children}
    </CarsContext.Provider>
  )
}

const useCars = () => useContext(CarsContext)

// ==================== COMPONENTS ====================

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
    { path: '/sell', label: 'Sell Car' },
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
                <FaCog style={{ marginRight: '0.5rem' }} /> Admin Dashboard
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
              Your trusted premium car marketplace. Find, buy, and sell exceptional vehicles with confidence.
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
              <span>123 Auto Drive, Motor City, MC 12345</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaa' }}>
              <FaPhone style={{ color: accent }} />
              <span>+1 (555) 123-4567</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaa' }}>
              <FaEnvelope style={{ color: accent }} />
              <span>contact@geargrid.com</span>
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

function CarCard({ car, index, showActions = false, onDelete, onToggleFeatured }) {
  const { theme } = useTheme()
  const { isAuthenticated, isAdmin } = useAuth()
  const { toggleFavorite, isFavorite } = useCars()
  const [imageUrl, setImageUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const bg = theme === 'dark' ? '#1a1a2e' : '#ffffff'
  const text = theme === 'dark' ? '#ffffff' : '#1a1a2e'
  const favorite = isFavorite(car.id)
  
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
    
    return () => { isMounted = false }
  }, [car.make, car.model, car.year])
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      style={{ background: bg, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', position: 'relative' }}
    >
      {/* Favorite Button */}
      {isAuthenticated && !showActions && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault()
            toggleFavorite(car.id)
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
      
      {/* Admin Actions */}
      {showActions && isAdmin && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 10,
          display: 'flex',
          gap: '0.5rem'
        }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault()
              onToggleFeatured(car.id)
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
              onDelete(car.id)
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
      
      <Link to={`/car/${car.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ height: '220px', overflow: 'hidden', position: 'relative', background: car.color }}>
          {loading ? (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
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
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: '#ff6b35',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
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
            FIND YOUR <span style={{ color: '#ff6b35' }}>PERFECT</span> DRIVE
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.3 }} style={{ fontSize: '1.25rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Premium vehicles. Transparent pricing. Unmatched service.
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {featuredCars.map((car, index) => <CarCard key={car.id} car={car} index={index} />)}
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: 'calc(100vh - 80px)', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: theme === 'dark' ? '#ffffff' : '#1a1a2e', padding: '2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem' }}>Browse Inventory ({filteredCars.length} cars)</h1>
        
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {filteredCars.map((car, index) => <CarCard key={car.id} car={car} index={index} />)}
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: 'calc(100vh - 80px)', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: theme === 'dark' ? '#ffffff' : '#1a1a2e', padding: '2rem' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {favoriteCars.map((car, index) => <CarCard key={car.id} car={car} index={index} />)}
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
  
  const car = cars.find(c => c.id === parseInt(id))
  const [gallery, setGallery] = useState([])
  const [mainImage, setMainImage] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const bg = theme === 'dark' ? '#0f0f1e' : '#f8f9fa'
  const text = theme === 'dark' ? '#ffffff' : '#1a1a2e'
  const cardBg = theme === 'dark' ? '#1a1a2e' : '#ffffff'
  const favorite = car ? isFavorite(car.id) : false
  
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
      toast.warning('Please login to purchase')
      navigate('/login')
    } else {
      toast.success('Purchase initiated! Check your email for next steps.')
    }
  }
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: 'calc(100vh - 80px)', background: bg, color: text, padding: '2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <motion.button whileHover={{ x: -5 }} onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#ff6b35', cursor: 'pointer', marginBottom: '2rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          ← Back
        </motion.button>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
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
                  onClick={() => toggleFavorite(car.id)}
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
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
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
            
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleBuy} style={{ background: '#ff6b35', color: 'white', padding: '1rem 2rem', borderRadius: '8px', border: 'none', fontSize: '1.1rem', cursor: 'pointer', width: '100%', marginBottom: '1rem' }}>
              {isAuthenticated ? 'Buy Now' : 'Login to Buy'}
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
          Admin login: <code style={{ background: '#ff6b3520', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>admin@geargrid.com</code>
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: 'calc(100vh - 80px)', background: bg, color: text, padding: '2rem' }}>
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
              {favoriteCars.slice(0, 3).map((car, index) => <CarCard key={car.id} car={car} index={index} />)}
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
  const { cars, addCar, deleteCar, toggleFeatured } = useCars()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  
  const bg = theme === 'dark' ? '#0f0f1e' : '#f8f9fa'
  const text = theme === 'dark' ? '#ffffff' : '#1a1a2e'
  const cardBg = theme === 'dark' ? '#1a1a2e' : '#ffffff'
  
  // Calculate stats
  const totalCars = cars.length
  const totalValue = cars.reduce((sum, car) => sum + car.price, 0)
  const featuredCount = cars.filter(c => c.featured).length
  const avgPrice = Math.round(totalValue / totalCars)
  
  const stats = [
    { icon: FaCar, label: 'Total Cars', value: totalCars, color: '#0066b1' },
    { icon: FaDollarSign, label: 'Total Value', value: `$${(totalValue / 1000000).toFixed(1)}M`, color: '#28a745' },
    { icon: FaStar, label: 'Featured', value: featuredCount, color: '#ffd700' },
    { icon: FaChartBar, label: 'Avg Price', value: `$${avgPrice.toLocaleString()}`, color: '#ff6b35' }
  ]
  
  const onAddCar = (data) => {
    const newCar = {
      ...data,
      year: parseInt(data.year),
      price: parseInt(data.price),
      mileage: parseInt(data.mileage),
      features: data.features.split(',').map(f => f.trim()),
      color: '#666666'
    }
    addCar(newCar)
    reset()
    setActiveTab('inventory')
  }
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: 'calc(100vh - 80px)', background: bg, color: text }}>
      {/* Admin Header */}
      <div style={{ background: cardBg, padding: '1.5rem 2rem', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <FaCog style={{ fontSize: '1.5rem', color: '#ff6b35' }} />
          <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
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
      
      <div style={{ padding: '2rem' }}>
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
                      <tr key={car.id} style={{ borderBottom: '1px solid #222' }}>
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
        
        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Manage Inventory ({cars.length} cars)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
              {cars.map((car, index) => (
                <CarCard 
                  key={car.id} 
                  car={car} 
                  index={index} 
                  showActions={true}
                  onDelete={deleteCar}
                  onToggleFeatured={toggleFeatured}
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Make</label>
                    <input {...register('make', { required: true })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e0e0e0', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: 'inherit' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Model</label>
                    <input {...register('model', { required: true })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e0e0e0', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: 'inherit' }} />
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
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
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
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
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  
  const onSubmit = (data) => {
    toast.success('Car listed successfully!')
    reset()
  }
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: 'calc(100vh - 80px)', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: theme === 'dark' ? '#ffffff' : '#1a1a2e', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Sell Your Car</h1>
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ background: theme === 'dark' ? '#1a1a2e' : '#ffffff', padding: '3rem', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <input type="text" placeholder="Make" {...register('make', { required: true })} style={{ padding: '1rem', borderRadius: '8px', border: '2px solid #e0e0e0', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: 'inherit' }} />
              <input type="text" placeholder="Model" {...register('model', { required: true })} style={{ padding: '1rem', borderRadius: '8px', border: '2px solid #e0e0e0', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: 'inherit' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <input type="number" placeholder="Year" {...register('year', { required: true })} style={{ padding: '1rem', borderRadius: '8px', border: '2px solid #e0e0e0', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: 'inherit' }} />
              <input type="number" placeholder="Price" {...register('price', { required: true })} style={{ padding: '1rem', borderRadius: '8px', border: '2px solid #e0e0e0', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: 'inherit' }} />
            </div>
            <textarea placeholder="Description" rows="4" {...register('description', { required: true })} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '2px solid #e0e0e0', background: theme === 'dark' ? '#0f0f1e' : '#f8f9fa', color: 'inherit', marginBottom: '1rem' }}></textarea>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" style={{ width: '100%', padding: '1rem', background: '#ff6b35', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
              List My Car
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
            Revolutionizing the way people buy and sell premium vehicles. Founded in 2020, we've grown from a small startup to the most trusted name in luxury automotive marketplace.
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
              At GEAR-GRID, we believe that buying or selling a premium vehicle should be an exciting experience, not a stressful one. Our mission is to create the most trusted, transparent, and efficient marketplace for automotive enthusiasts.
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
          </div>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
        </CarsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App