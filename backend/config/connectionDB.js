import mongoose from 'mongoose';

const connectionDB = async () => {
  await mongoose.connect(process.env.CONNECTION_DB)
  .then(() => console.log('connected db'))
  .catch((err) => console.error('DB connection error:', err));
};

export default connectionDB;