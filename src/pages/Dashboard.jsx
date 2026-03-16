import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCar, 
  FaHeart, 
  FaShoppingBag, 
  FaUser, 
  FaCog, 
  FaSignOutAlt,
  FaEdit,
  FaTrash,
  FaEye
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { cars } from '../data/cars';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [favorites, setFavorites] = useState([]);
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Load favorites from localStorage
    const favIds = JSON.parse(localStorage.getItem('favorites') || '[]');
    const favCars = cars.filter(car => favIds.includes(car.id));
    setFavorites(favCars);

    // Mock listings (cars posted by user)
    setListings(cars.slice(0, 2));
    
    // Mock orders
    setOrders([
      {
        id: 'ORD-001',
        car: cars[0],
        date: '2024-03-15',
        status: 'completed',
        price: 45000
      }
    ]);
  }, []);

  const removeFavorite = (carId) => {
    const newFavorites = favorites.filter(f => f.id !== carId);
    setFavorites(newFavorites);
    const favIds = newFavorites.map(f => f.id);
    localStorage.setItem('favorites', JSON.stringify(favIds));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="dashboard-overview">
            <div className="stats-grid">
              <div className="stat-card">
                <FaShoppingBag className="stat-icon" />
                <div>
                  <h3>{orders.length}</h3>
                  <p>Total Orders</p>
                </div>
              </div>
              <div className="stat-card">
                <FaHeart className="stat-icon" />
                <div>
                  <h3>{favorites.length}</h3>
                  <p>Saved Cars</p>
                </div>
              </div>
              <div className="stat-card">
                <FaCar className="stat-icon" />
                <div>
                  <h3>{listings.length}</h3>
                  <p>Active Listings</p>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Recent Activity</h3>
              {orders.length > 0 ? (
                <div className="activity-list">
                  {orders.map(order => (
                    <div key={order.id} className="activity-item">
                      <img src={order.car.images[0]} alt={order.car.model} />
                      <div className="activity-details">
                        <h4>Purchased {order.car.year} {order.car.make} {order.car.model}</h4>
                        <p>{new Date(order.date).toLocaleDateString()} • ${order.price.toLocaleString()}</p>
                      </div>
                      <span className={`status-badge ${order.status}`}>{order.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-activity">No recent activity</p>
              )}
            </div>
          </div>
        );

      case 'favorites':
        return (
          <div className="dashboard-favorites">
            <h3>Saved Cars ({favorites.length})</h3>
            {favorites.length > 0 ? (
              <div className="favorites-grid">
                {favorites.map(car => (
                  <div key={car.id} className="favorite-card">
                    <img src={car.images[0]} alt={car.model} />
                    <div className="favorite-info">
                      <h4>{car.year} {car.make} {car.model}</h4>
                      <p>${car.price.toLocaleString()}</p>
                    </div>
                    <div className="favorite-actions">
                      <Link to={`/inventory/${car.id}`} className="btn-icon">
                        <FaEye />
                      </Link>
                      <button 
                        className="btn-icon delete"
                        onClick={() => removeFavorite(car.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <FaHeart className="empty-icon" />
                <p>No saved cars yet</p>
                <Link to="/inventory" className="btn-primary">Browse Cars</Link>
              </div>
            )}
          </div>
        );

      case 'listings':
        return (
          <div className="dashboard-listings">
            <div className="listings-header">
              <h3>My Listings ({listings.length})</h3>
              <Link to="/sell" className="btn-primary">
                <FaCar /> Add New Listing
              </Link>
            </div>
            {listings.length > 0 ? (
              <div className="listings-table">
                <table>
                  <thead>
                    <tr>
                      <th>Car</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Views</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map(car => (
                      <tr key={car.id}>
                        <td>
                          <div className="listing-car">
                            <img src={car.images[0]} alt={car.model} />
                            <div>
                              <h4>{car.year} {car.make} {car.model}</h4>
                              <p>Listed on {new Date(car.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </td>
                        <td>${car.price.toLocaleString()}</td>
                        <td><span className="status-badge active">Active</span></td>
                        <td>{car.views || 124}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-icon"><FaEdit /></button>
                            <button className="btn-icon delete"><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <FaCar className="empty-icon" />
                <p>No active listings</p>
                <Link to="/sell" className="btn-primary">Sell Your Car</Link>
              </div>
            )}
          </div>
        );

      case 'orders':
        return (
          <div className="dashboard-orders">
            <h3>Order History</h3>
            {orders.length > 0 ? (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <span className="order-id">{order.id}</span>
                      <span className={`status-badge ${order.status}`}>{order.status}</span>
                    </div>
                    <div className="order-details">
                      <img src={order.car.images[0]} alt={order.car.model} />
                      <div>
                        <h4>{order.car.year} {order.car.make} {order.car.model}</h4>
                        <p>Order Date: {new Date(order.date).toLocaleDateString()}</p>
                        <p className="order-price">${order.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="order-actions">
                      <button className="btn-secondary">View Details</button>
                      <button className="btn-primary">Track Order</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <FaShoppingBag className="empty-icon" />
                <p>No orders yet</p>
                <Link to="/inventory" className="btn-primary">Start Shopping</Link>
              </div>
            )}
          </div>
        );

      case 'settings':
        return (
          <div className="dashboard-settings">
            <h3>Account Settings</h3>
            <form className="settings-form">
              <div className="form-section">
                <h4>Profile Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input type="text" defaultValue={user?.firstName} />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" defaultValue={user?.lastName} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" defaultValue={user?.email} disabled />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" defaultValue={user?.phone} />
                </div>
              </div>

              <div className="form-section">
                <h4>Change Password</h4>
                <div className="form-group">
                  <label>Current Password</label>
                  <input type="password" />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input type="password" />
                </div>
              </div>

              <div className="form-section">
                <h4>Notifications</h4>
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  Email notifications for new messages
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  Price drop alerts for saved cars
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" />
                  Marketing emails and promotions
                </label>
              </div>

              <button type="submit" className="btn-primary">Save Changes</button>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-layout">
          {/* Sidebar */}
          <aside className="dashboard-sidebar">
            <div className="user-profile">
              <div className="avatar">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <h3>{user?.firstName} {user?.lastName}</h3>
              <p>{user?.email}</p>
            </div>

            <nav className="dashboard-nav">
              <button 
                className={activeTab === 'overview' ? 'active' : ''}
                onClick={() => setActiveTab('overview')}
              >
                <FaUser /> Overview
              </button>
              <button 
                className={activeTab === 'favorites' ? 'active' : ''}
                onClick={() => setActiveTab('favorites')}
              >
                <FaHeart /> Saved Cars
              </button>
              <button 
                className={activeTab === 'listings' ? 'active' : ''}
                onClick={() => setActiveTab('listings')}
              >
                <FaCar /> My Listings
              </button>
              <button 
                className={activeTab === 'orders' ? 'active' : ''}
                onClick={() => setActiveTab('orders')}
              >
                <FaShoppingBag /> Orders
              </button>
              <button 
                className={activeTab === 'settings' ? 'active' : ''}
                onClick={() => setActiveTab('settings')}
              >
                <FaCog /> Settings
              </button>
              <button onClick={logout} className="logout-btn">
                <FaSignOutAlt /> Logout
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="dashboard-main">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;