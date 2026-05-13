import express from 'express';
import {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getPendingCars,
  approveCar,
  rejectCar,
} from '../controllers/carcontroller.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();
const admin = [protect, adminOnly];

router.get('/', getCars);
router.get('/pending/all', admin, getPendingCars);
router.get('/:id', getCarById);
router.post('/', protect, createCar);
router.put('/:id/approve', admin, approveCar);
router.put('/:id/reject', admin, rejectCar);
router.put('/:id', admin, updateCar);
router.delete('/:id', admin, deleteCar);

export default router;
