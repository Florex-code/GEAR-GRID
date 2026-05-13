import mongoose from 'mongoose';
import Car from '../models/carModel.js';

const ADMIN_EMAIL = 'florexstudio.ng@gmail.com';
const isAdminUser = (user) =>
  user?.isAdmin || user?.email?.toLowerCase() === ADMIN_EMAIL;
const isValidCarId = (id) => mongoose.isValidObjectId(id);

const updateCarStatus = async (req, res, status) => {
  try {
    if (!isValidCarId(req.params.id)) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    car.status = status;
    const updatedCar = await car.save();

    res.json(updatedCar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCars = async (req, res) => {
  try {
    const cars = await Car.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCarById = async (req, res) => {
  try {
    if (!isValidCarId(req.params.id)) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const car = await Car.findOne({
      _id: req.params.id,
      status: 'approved',
    });

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCar = async (req, res) => {
  try {
    const {
      make,
      model,
      year,
      trim,
      price,
      mileage,
      fuelType,
      transmission,
      color,
      featured,
      description,
      features,
      sellerName,
      sellerPhone,
      sellerLocation,
    } = req.body;

    if (
      !make ||
      !model ||
      !year ||
      !price ||
      !sellerName ||
      !sellerPhone ||
      !sellerLocation
    ) {
      return res.status(400).json({ message: 'Missing required car fields' });
    }

    const existingCar = await Car.findOne({
      make,
      model,
      year,
      trim,
      price,
      sellerPhone,
    });

    if (existingCar) {
      return res.status(400).json({ message: 'Car already exists' });
    }

    const car = await Car.create({
      make,
      model,
      year,
      trim: trim || '',
      price,
      mileage: mileage || 0,
      fuelType: fuelType || '',
      transmission: transmission || '',
      color: color || '',
      featured: isAdminUser(req.user) ? Boolean(featured) : false,
      description: description || '',
      features: features || [],
      sellerName,
      sellerPhone,
      sellerLocation,
      status: isAdminUser(req.user) ? 'approved' : 'pending',
    });

    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingCars = async (req, res) => {
  try {
    const cars = await Car.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveCar = async (req, res) => {
  return updateCarStatus(req, res, 'approved');
};

export const rejectCar = async (req, res) => {
  return updateCarStatus(req, res, 'rejected');
};

export const updateCar = async (req, res) => {
  try {
    if (!isValidCarId(req.params.id)) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCar = async (req, res) => {
  try {
    if (!isValidCarId(req.params.id)) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
