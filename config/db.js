// mongoose
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(
    colors.blue.underline(`MongoDB Connected: ${conn.connection.host}`)
  );
};
module.exports = connectDB;
