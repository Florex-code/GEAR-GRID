import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCar, 
  FaDollarSign, 
  FaCalendar, 
  FaTachometerAlt, 
  FaGasPump, 
  FaCog,
  FaPalette,
  FaCamera,
  FaCheckCircle
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const steps = ['Car Details', 'Specifications', 'Photos', 'Pricing', 'Review'];

const SellCar = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    trim: '',
    mileage: '',
    price: '',
    condition: 'excellent',
    fuelType: 'gasoline',
    transmission: 'automatic',
    color: '',
    interiorColor: '',
    engine: '',
    horsepower: '',
    description: '',
    features: [],
    images: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // In real app, upload to cloud storage
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        return formData.make && formData.model && formData.year && formData.trim;
      case 1:
        return formData.mileage && formData.fuelType && formData.transmission;
      case 2:
        return formData.images.length > 0;
      case 3:
        return formData.price && parseInt(formData.price) > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep()) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success('Your car has been listed successfully!');
    navigate('/dashboard');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="sell-step">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Make *</label>
                <select name="make" value={formData.make} onChange={handleChange} required>
                  <option value="">Select Make</option>
                  <option value="BMW">BMW</option>
                  <option value="Mercedes">Mercedes-Benz</option>
                  <option value="Audi">Audi</option>
                  <option value="Porsche">Porsche</option>
                  <option value="Tesla">Tesla</option>
                  <option value="Lexus">Lexus</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                </select>
              </div>
              <div className="form-group">
                <label>Model *</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g., M3, S-Class, Model S"
                  required
                />
              </div>
              <div className="form-group">
                <label>Year *</label>
                <select name="year" value={formData.year} onChange={handleChange} required>
                  <option value="">Select Year</option>
                  {[...Array(35)].map((_, i) => (
                    <option key={i} value={2024 - i}>{2024 - i}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Trim *</label>
                <input
                  type="text"
                  name="trim"
                  value={formData.trim}
                  onChange={handleChange}
                  placeholder="e.g., Competition, AMG, Plaid"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="sell-step">
            <h3>Specifications</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Mileage *</label>
                <div className="input-with-icon">
                  <FaTachometerAlt />
                  <input
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                    placeholder="e.g., 25000"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Condition *</label>
                <select name="condition" value={formData.condition} onChange={handleChange}>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
              <div className="form-group">
                <label>Fuel Type *</label>
                <select name="fuelType" value={formData.fuelType} onChange={handleChange}>
                  <option value="gasoline">Gasoline</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="plugin-hybrid">Plug-in Hybrid</option>
                </select>
              </div>
              <div className="form-group">
                <label>Transmission *</label>
                <select name="transmission" value={formData.transmission} onChange={handleChange}>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                  <option value="cvt">CVT</option>
                </select>
              </div>
              <div className="form-group">
                <label>Exterior Color</label>
                <div className="input-with-icon">
                  <FaPalette />
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="e.g., Alpine White"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Interior Color</label>
                <input
                  type="text"
                  name="interiorColor"
                  value={formData.interiorColor}
                  onChange={handleChange}
                  placeholder="e.g., Black Leather"
                />
              </div>
              <div className="form-group">
                <label>Engine</label>
                <input
                  type="text"
                  name="engine"
                  value={formData.engine}
                  onChange={handleChange}
                  placeholder="e.g., 3.0L Inline-6 Twin Turbo"
                />
              </div>
              <div className="form-group">
                <label>Horsepower</label>
                <input
                  type="number"
                  name="horsepower"
                  value={formData.horsepower}
                  onChange={handleChange}
                  placeholder="e.g., 473"
                />
              </div>
            </div>

            <div className="features-section">
              <h4>Features</h4>
              <div className="features-grid">
                {[
                  'Leather Seats', 'Sunroof', 'Navigation', 'Bluetooth',
                  'Backup Camera', 'Parking Sensors', 'Heated Seats', 'Ventilated Seats',
                  'Keyless Entry', 'Remote Start', 'Apple CarPlay', 'Android Auto',
                  'Premium Audio', 'LED Headlights', 'Adaptive Cruise', 'Lane Assist'
                ].map(feature => (
                  <label key={feature} className="feature-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                    />
                    {feature}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="sell-step">
            <h3>Upload Photos</h3>
            <p className="step-description">Add at least 5 photos. First photo will be the cover image.</p>
            
            <div className="image-upload-area">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                id="car-images"
                hidden
              />
              <label htmlFor="car-images" className="upload-label">
                <FaCamera />
                <span>Click to upload photos</span>
                <small>or drag and drop</small>
              </label>
            </div>

            {formData.images.length > 0 && (
              <div className="uploaded-images">
                {formData.images.map((img, idx) => (
                  <div key={idx} className={`uploaded-image ${idx === 0 ? 'cover' : ''}`}>
                    <img src={img} alt={`Upload ${idx + 1}`} />
                    {idx === 0 && <span className="cover-badge">Cover</span>}
                    <button 
                      className="remove-image"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== idx)
                      }))}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="sell-step">
            <h3>Pricing</h3>
            <div className="pricing-form">
              <div className="form-group">
                <label>Asking Price *</label>
                <div className="input-with-icon price-input">
                  <FaDollarSign />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g., 45000"
                    required
                  />
                </div>
              </div>

              <div className="price-suggestions">
                <h4>Market Analysis</h4>
                <div className="suggestion-cards">
                  <div className="suggestion-card">
                    <span className="label">Low Market</span>
                    <span className="price">${formData.price ? (parseInt(formData.price) * 0.9).toLocaleString() : '---'}</span>
                  </div>
                  <div className="suggestion-card recommended">
                    <span className="label">Recommended</span>
                    <span className="price">${formData.price ? parseInt(formData.price).toLocaleString() : '---'}</span>
                  </div>
                  <div className="suggestion-card">
                    <span className="label">High Market</span>
                    <span className="price">${formData.price ? (parseInt(formData.price) * 1.1).toLocaleString() : '---'}</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Describe your car's condition, history, and any unique features..."
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="sell-step review-step">
            <h3>Review Your Listing</h3>
            <div className="review-card">
              <div className="review-images">
                {formData.images[0] && <img src={formData.images[0]} alt="Main" />}
              </div>
              <div className="review-details">
                <h2>{formData.year} {formData.make} {formData.model}</h2>
                <p className="trim">{formData.trim}</p>
                <p className="price">${parseInt(formData.price).toLocaleString()}</p>
                
                <div className="review-specs">
                  <div><FaTachometerAlt /> {parseInt(formData.mileage).toLocaleString()} miles</div>
                  <div><FaGasPump /> {formData.fuelType}</div>
                  <div><FaCog /> {formData.transmission}</div>
                  <div><FaCalendar /> {formData.year}</div>
                </div>

                <div className="review-features">
                  <h4>Features ({formData.features.length})</h4>
                  <div className="feature-tags">
                    {formData.features.map(f => (
                      <span key={f} className="feature-tag">{f}</span>
                    ))}
                  </div>
                </div>

                <div className="review-description">
                  <h4>Description</h4>
                  <p>{formData.description || 'No description provided.'}</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="sell-car-page">
      <div className="container">
        <div className="sell-header">
          <h1>Sell Your Car</h1>
          <p>List your vehicle in minutes and reach thousands of buyers</p>
        </div>

        <div className="sell-progress">
          {steps.map((step, idx) => (
            <div 
              key={step} 
              className={`progress-step ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
            >
              <div className="step-number">{idx < currentStep ? <FaCheckCircle /> : idx + 1}</div>
              <span>{step}</span>
            </div>
          ))}
        </div>

        <motion.div 
          className="sell-form-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={currentStep}
        >
          {renderStep()}

          <div className="form-actions">
            {currentStep > 0 && (
              <button className="btn-secondary" onClick={handleBack}>
                Back
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button className="btn-primary" onClick={handleNext}>
                Continue
              </button>
            ) : (
              <button 
                className="btn-primary" 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Publishing...' : 'Publish Listing'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SellCar;