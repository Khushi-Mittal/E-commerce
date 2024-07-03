// const mongoose = require('mongoose');

// const connectDB = ("mongodb://127.0.0.1:27017") => {
//   return mongoose.connect("mongodb://127.0.0.1:27017");
// };

// module.exports = connectDB;

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/E-commerce", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;

