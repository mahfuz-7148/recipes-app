import mongoose from 'mongoose';

const connectionDB = async () => {
  await mongoose.connect(process.env.CONNECTION_DB)
};

export default connectionDB;