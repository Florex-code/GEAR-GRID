import React from 'react';
import { FaTimes } from 'react-icons/fa';

const makes = ['BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Tesla', 'Lexus', 'Toyota', 'Honda', 'Ford', 'Chevrolet'];
const fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];
const transmissions = ['Automatic', 'Manual', 'CVT'];
const bodyTypes = ['Sedan', 'SUV', 'Coupe', 'Convertible', 'Truck', 'Van', 'Wagon'];
const conditions = ['New', 'Used', 'Certified Pre-Owned'];

const FilterSidebar = ({ filters, onChange, onClear }) => {
  const handleCheckboxChange = (category, value) => {
    const currentValues = filters[category];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onChange({ ...filters, [category]: newValues });
  };

  const handleRangeChange = (category, field, value) => {
    onChange({
      ...filters,
      [category]: { ...filters[category], [field]: parseInt(value) || 0 }
    });
  };

  const FilterGroup = ({ title, children }) => (
    <div className="filter-group">
      <h4>{title}</h4>
      {children}
    </div>
  );

  return (
    <div className="filter-sidebar-content">
      <div className="filter-header">
        <h3>Filters</h3>
        <button onClick={onClear} className="clear-filters">
          <FaTimes /> Clear All
        </button>
      </div>

      <FilterGroup title="Make">
        <div className="filter-options">
          {makes.map(make => (
            <label key={make} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.make.includes(make)}
                onChange={() => handleCheckboxChange('make', make)}
              />
              {make}
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Price Range">
        <div className="range-inputs">
          <input
            type="number"
            placeholder="Min"
            value={filters.price.min}
            onChange={(e) => handleRangeChange('price', 'min', e.target.value)}
          />
          <span>to</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.price.max}
            onChange={(e) => handleRangeChange('price', 'max', e.target.value)}
          />
        </div>
      </FilterGroup>

      <FilterGroup title="Year">
        <div className="range-inputs">
          <input
            type="number"
            placeholder="From"
            value={filters.year.min}
            onChange={(e) => handleRangeChange('year', 'min', e.target.value)}
          />
          <span>to</span>
          <input
            type="number"
            placeholder="To"
            value={filters.year.max}
            onChange={(e) => handleRangeChange('year', 'max', e.target.value)}
          />
        </div>
      </FilterGroup>

      <FilterGroup title="Fuel Type">
        <div className="filter-options">
          {fuelTypes.map(type => (
            <label key={type} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.fuelType.includes(type)}
                onChange={() => handleCheckboxChange('fuelType', type)}
              />
              {type}
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Transmission">
        <div className="filter-options">
          {transmissions.map(t => (
            <label key={t} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.transmission.includes(t)}
                onChange={() => handleCheckboxChange('transmission', t)}
              />
              {t}
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Body Type">
        <div className="filter-options">
          {bodyTypes.map(type => (
            <label key={type} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.bodyType.includes(type)}
                onChange={() => handleCheckboxChange('bodyType', type)}
              />
              {type}
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Condition">
        <div className="filter-options">
          {conditions.map(c => (
            <label key={c} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.condition.includes(c)}
                onChange={() => handleCheckboxChange('condition', c)}
              />
              {c}
            </label>
          ))}
        </div>
      </FilterGroup>
    </div>
  );
};

export default FilterSidebar;