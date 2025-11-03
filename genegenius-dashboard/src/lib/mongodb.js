import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {

 
  // Read MongoDB URI from environment variables
  const MONGODB_URI = "mongodb+srv://vanshgoel979_db_user:VfCVimhNaplN73pu@cluster0.t417x9m.mongodb.net/";
  
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable in .env');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;

