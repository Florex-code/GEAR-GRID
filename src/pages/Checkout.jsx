import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaCreditCard, FaPaypal, FaUniversity, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { cars } from '../data/cars';

const steps = ['Review', 'Payment', 'Confirmation'];

const Checkout = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    agreeTerms: false
  });

  useEffect(() => {
    const foundCar = cars.find(c => c.id === parseInt(carId));
    if (!foundCar) {
      navigate('/inventory');
      return;
    }
    setCar(foundCar);
  }, [carId, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep === 0) {
      setCurrentStep(1);
      return;
    }

    if (currentStep === 1) {
      setIsProcessing(true);
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsProcessing(false);
      setCurrentStep(2);
      toast.success('Purchase successful!');
      return;
    }
  };

  if (!car) return <div className="loading">Loading...</div>;

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="checkout-review">
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="car-summary">
                <img src={car.images[0]} alt={car.model} />
                <div>
                  <h4>{car.year} {car.make} {car.model}</h4>
                  <p>{car.trim}</p>
                </div>
                <span className="price">${car.price.toLocaleString()}</span>
              </div>
              
              <div className="price-breakdown">
                <div>
                  <span>Vehicle Price</span>
                  <span>${car.price.toLocaleString()}</span>
                </div>
                <div>
                  <span>Documentation Fee</span>
                  <span>$499</span>
                </div>
                <div>
                  <span>Tax & Registration</span>
                  <span>${(car.price * 0.08).toLocaleString()}</span>
                </div>
                <div className="total">
                  <span>Total</span>
                  <span>${(car.price + 499 + car.price * 0.08).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="contact-info-form">
              <h3>Contact Information</h3>
              <div className="form-grid">
                <input
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
                <input
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                <input
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="full-width"
                />
                <input
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
                <input
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
                <input
                  name="zip"
                  placeholder="ZIP Code"
                  value={formData.zip}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="checkout-payment">
            <div className="payment-methods">
              <h3>Select Payment Method</h3>
              <div className="method-tabs">
                <button 
                  className={paymentMethod === 'card' ? 'active' : ''}
                  onClick={() => setPaymentMethod('card')}
                >
                  <FaCreditCard /> Credit Card
                </button>
                <button 
                  className={paymentMethod === 'paypal' ? 'active' : ''}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <FaPaypal /> PayPal
                </button>
                <button 
                  className={paymentMethod === 'bank' ? 'active' : ''}
                  onClick={() => setPaymentMethod('bank')}
                >
                  <FaUniversity /> Bank Transfer
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="card-form">
                  <div className="secure-badge">
                    <FaLock /> Secure SSL Encryption
                  </div>
                  <input
                    name="cardNumber"
                    placeholder="Card Number"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    maxLength="16"
                  />
                  <div className="card-row">
                    <input
                      name="cardExpiry"
                      placeholder="MM/YY"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      maxLength="5"
                    />
                    <input
                      name="cardCvc"
                      placeholder="CVC"
                      value={formData.cardCvc}
                      onChange={handleInputChange}
                      maxLength="3"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="paypal-info">
                  <p>You will be redirected to PayPal to complete your purchase.</p>
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div className="bank-info">
                  <p>Bank transfer instructions will be sent to your email.</p>
                </div>
              )}

              <label className="terms-checkbox">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  required
                />
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="checkout-confirmation">
            <div className="success-icon">
              <FaCheckCircle />
            </div>
            <h2>Order Confirmed!</h2>
            <p>Thank you for your purchase. Your order #{Math.random().toString(36).substr(2, 9).toUpperCase()} has been received.</p>
            <div className="next-steps">
              <h3>What happens next?</h3>
              <ol>
                <li>Our team will verify your payment within 24 hours</li>
                <li>You will receive a confirmation email with pickup/delivery details</li>
                <li>Schedule your vehicle inspection and pickup</li>
              </ol>
            </div>
            <button 
              className="btn-primary"
              onClick={() => navigate('/dashboard')}
            >
              View Order Status
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Complete Your Purchase</h1>
          <div className="step-indicator">
            {steps.map((step, idx) => (
              <div 
                key={step} 
                className={`step ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
              >
                <div className="step-number">{idx < currentStep ? '✓' : idx + 1}</div>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderStep()}
          </motion.div>

          {currentStep < 2 && (
            <div className="checkout-actions">
              {currentStep > 0 && (
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Back
                </button>
              )}
              <button 
                type="submit" 
                className="btn-primary"
                disabled={currentStep === 1 && (!formData.agreeTerms || isProcessing)}
              >
                {isProcessing ? 'Processing...' : currentStep === 0 ? 'Continue to Payment' : 'Complete Purchase'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Checkout;