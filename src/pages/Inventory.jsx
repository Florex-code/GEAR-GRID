import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaSort, FaGrid, FaList, FaTimes } from 'react-icons/fa';
import CarCard from '../components/CarCard';
import FilterSidebar from '../components/FilterSidebar';
import { cars } from '../data/cars';

const ITEMS_PER_PAGE = 12;

const Inventory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredCars, setFilteredCars] = useState(cars);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    make: [],
    model: [],
    year: { min: 1990, max: 2024 },
    price: { min: 0, max: 200000 },
    mileage: { min: 0, max: 200000 },
    fuelType: [],
    transmission: [],
    bodyType: [],
    condition: []
  });

  // Parse URL params
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    const makeParam = searchParams.get('make');
    
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      setFilteredCars(cars.filter(car => 
        car.make.toLowerCase().includes(searchLower) ||
        car.model.toLowerCase().includes(searchLower) ||
        car.year.toString().includes(searchQuery)
      ));
    } else if (makeParam) {
      setFilters(prev => ({ ...prev, make: [makeParam] }));
    }
  }, [searchParams]);

  // Apply filters
  useEffect(() => {
    let result = [...cars];

    // Apply all filters
    if (filters.make.length > 0) {
      result = result.filter(car => filters.make.includes(car.make));
    }
    if (filters.model.length > 0) {
      result = result.filter(car => filters.model.includes(car.model));
    }
    if (filters.fuelType.length > 0) {
      result = result.filter(car => filters.fuelType.includes(car.fuelType));
    }
    if (filters.transmission.length > 0) {
      result = result.filter(car => filters.transmission.includes(car.transmission));
    }
    if (filters.bodyType.length > 0) {
      result = result.filter(car => filters.bodyType.includes(car.bodyType));
    }
    if (filters.condition.length > 0) {
      result = result.filter(car => filters.condition.includes(car.condition));
    }

    // Range filters
    result = result.filter(car => 
      car.price >= filters.price.min && car.price <= filters.price.max &&
      car.year >= filters.year.min && car.year <= filters.year.max &&
      car.mileage >= filters.mileage.min && car.mileage <= filters.mileage.max
    );

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'year-new':
        result.sort((a, b) => b.year - a.year);
        break;
      case 'mileage-low':
        result.sort((a, b) => a.mileage - b.mileage);
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredCars(result);
    setCurrentPage(1);
  }, [filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE);
  const paginatedCars = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCars.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCars, currentPage]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      make: [],
      model: [],
      year: { min: 1990, max: 2024 },
      price: { min: 0, max: 200000 },
      mileage: { min: 0, max: 200000 },
      fuelType: [],
      transmission: [],
      bodyType: [],
      condition: []
    });
    setSearchParams({});
  };

  return (
    <div className="inventory-page">
      <div className="inventory-header">
        <div className="container">
          <h1>Browse Inventory</h1>
          <p>{filteredCars.length} vehicles available</p>
        </div>
      </div>

      <div className="container inventory-container">
        {/* Mobile Filter Toggle */}
        <button 
          className="mobile-filter-toggle"
          onClick={() => setIsMobileFilterOpen(true)}
        >
          <FaFilter /> Filters
        </button>

        {/* Sidebar */}
        <AnimatePresence>
          {(isMobileFilterOpen || window.innerWidth > 768) && (
            <motion.aside 
              className={`filter-sidebar ${isMobileFilterOpen ? 'mobile-open' : ''}`}
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
            >
              {isMobileFilterOpen && (
                <button 
                  className="close-mobile-filter"
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  <FaTimes />
                </button>
              )}
              <FilterSidebar 
                filters={filters} 
                onChange={handleFilterChange}
                onClear={clearFilters}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Overlay for mobile */}
        {isMobileFilterOpen && (
          <div 
            className="mobile-overlay"
            onClick={() => setIsMobileFilterOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="inventory-main">
          {/* Toolbar */}
          <div className="inventory-toolbar">
            <div className="sort-controls">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="year-new">Year: Newest First</option>
                <option value="mileage-low">Mileage: Low to High</option>
              </select>
            </div>

            <div className="view-toggle">
              <button 
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
              >
                <FaGrid />
              </button>
              <button 
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
              >
                <FaList />
              </button>
            </div>
          </div>

          {/* Results */}
          {filteredCars.length === 0 ? (
            <div className="no-results">
              <h3>No cars found</h3>
              <p>Try adjusting your filters to see more results.</p>
              <button onClick={clearFilters} className="clear-btn">
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className={`cars-container ${viewMode}`}>
                {paginatedCars.map((car, index) => (
                  <motion.div
                    key={car.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <CarCard car={car} viewMode={viewMode} />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={currentPage === i + 1 ? 'active' : ''}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;