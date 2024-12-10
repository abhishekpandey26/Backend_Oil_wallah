import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  mobileNumber: { type: String, required: true }, // Common field with Payment
  name: { type: String, required: true },
  pinCode: { type: String, required: true },
  houseAddress: { type: String, required: true },
  locality: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
});

const Address = mongoose.model('Address', addressSchema);

export default Address;
