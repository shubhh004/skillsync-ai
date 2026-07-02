import mongoose from 'mongoose';

export default async function connectDB() {
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  console.log(`[db] MongoDB Connected — ${conn.connection.name}`);
}
