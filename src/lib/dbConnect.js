import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://Faisalharoon2001:faisal16@cluster0.lcbopcq.mongodb.net/clipflicks?retryWrites=true&w=majority&appName=Cluster0s";

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;

  return cached.conn;
}

export default dbConnect;
