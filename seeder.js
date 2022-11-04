const fs = require('fs'); // Import fs module to read files
const mongoose = require('mongoose'); // Import mongoose
const colors = require('colors'); // Import colors
const dotenv = require('dotenv'); // Import dotenv

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Bootcamp = require('./models/Bootcamp');

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  //   useCreateIndex: true,
  //   useFindAndModify: false,
  useUnifiedTopology: true,
});

// Parse JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Parse command line arguments to run the script with the correct command
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}

// Run in terminal:
// node seeder -i
// node seeder -d