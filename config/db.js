import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
 async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        }

     cached.promise = mongoose.connect(`${process.env.MONGODB_URI}/merocart`,opts).then(mongoose => {
      return mongoose
     })
      
    }
    catched.conn = await cached.promise
    return catched.conn
  }

export default connectDB
