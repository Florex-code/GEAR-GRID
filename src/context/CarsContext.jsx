import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const CarsContext = createContext()

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export function CarsProvider({ children }) {
  const [cars, setCars] = useState([])
  const [pendingCars, setPendingCars] = useState([])
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites')
    return saved ? JSON.parse(saved) : []
  })

  const [carsLoading, setCarsLoading] = useState(true)
  const [carsError, setCarsError] = useState(null)

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  const fetchCars = async () => {
    try {
      setCarsLoading(true)
      setCarsError(null)

      const response = await fetch(`${API_URL}/cars`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch cars')
      }

      setCars(data)
    } catch (error) {
      console.error(error)
      setCarsError(error.message)
    } finally {
      setCarsLoading(false)
    }
  }

  const fetchPendingCars = async (token) => {
    try {
      const response = await fetch(`${API_URL}/cars/pending/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch pending cars')
      }

      setPendingCars(data)
      return { success: true, data }
    } catch (error) {
      toast.error(error.message)
      return { success: false, error: error.message }
    }
  }

  useEffect(() => {
    fetchCars()
  }, [])

  const addCar = async (newCar, token) => {
    try {
      const response = await fetch(`${API_URL}/cars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCar),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add car')
      }

      toast.success('Valuation request sent. Our team will review the car details.')
      return { success: true, data }
    } catch (error) {
      toast.error(error.message)
      return { success: false, error: error.message }
    }
  }

  const approveCar = async (id, token) => {
    try {
      const response = await fetch(`${API_URL}/cars/${id}/approve`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to approve car')
      }

      setPendingCars(prev => prev.filter(car => (car._id || car.id) !== id))
      setCars(prev => [data.car || data, ...prev])

      toast.success('Car added to inventory')
      return { success: true, data }
    } catch (error) {
      toast.error(error.message)
      return { success: false, error: error.message }
    }
  }

  const rejectCar = async (id, token) => {
    try {
      const response = await fetch(`${API_URL}/cars/${id}/reject`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reject car')
      }

      setPendingCars(prev => prev.filter(car => (car._id || car.id) !== id))

      toast.success('Lead declined')
      return { success: true, data }
    } catch (error) {
      toast.error(error.message)
      return { success: false, error: error.message }
    }
  }

  const deleteCar = async (id, token) => {
    try {
      const response = await fetch(`${API_URL}/cars/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete car')
      }

      setCars(prev => prev.filter(car => (car._id || car.id) !== id))
      setPendingCars(prev => prev.filter(car => (car._id || car.id) !== id))

      toast.success('Car deleted!')
      return { success: true }
    } catch (error) {
      toast.error(error.message)
      return { success: false, error: error.message }
    }
  }

  const toggleFeatured = async (id, currentFeatured, token) => {
    try {
      const response = await fetch(`${API_URL}/cars/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ featured: !currentFeatured }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update featured status')
      }

      setCars(prev =>
        prev.map(car => ((car._id || car.id) === id ? data : car))
      )

      toast.success('Featured updated!')
      return { success: true }
    } catch (error) {
      toast.error(error.message)
      return { success: false, error: error.message }
    }
  }

  const toggleFavorite = (carId) => {
    setFavorites(prev => {
      if (prev.includes(carId)) {
        toast.info('Removed from favorites')
        return prev.filter(id => id !== carId)
      }

      toast.success('Added to favorites!')
      return [...prev, carId]
    })
  }

  const isFavorite = (carId) => favorites.includes(carId)

  const getFavoriteCars = () =>
    cars.filter(car => favorites.includes(car._id || car.id))

  return (
    <CarsContext.Provider
      value={{
        cars,
        pendingCars,
        carsLoading,
        carsError,
        fetchCars,
        fetchPendingCars,
        addCar,
        approveCar,
        rejectCar,
        deleteCar,
        toggleFeatured,
        toggleFavorite,
        isFavorite,
        getFavoriteCars,
        favorites,
      }}
    >
      {children}
    </CarsContext.Provider>
  )
}

export function useCars() {
  return useContext(CarsContext)
}
