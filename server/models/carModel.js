import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    trim: { type: String, default: '', trim: true },
    price: { type: Number, required: true },
    mileage: { type: Number, default: 0 },
    fuelType: { type: String, default: '', trim: true },
    transmission: { type: String, default: '', trim: true },
    color: { type: String, default: '', trim: true },
    featured: { type: Boolean, default: false },
    description: { type: String, default: '', trim: true },
    features: { type: [String], default: [] },
    sellerName: { type: String, required: true, trim: true },
    sellerPhone: { type: String, required: true, trim: true },
    sellerLocation: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Car = mongoose.model('Car', carSchema);

export default Car;
