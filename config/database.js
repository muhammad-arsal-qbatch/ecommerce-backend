import mongoose from 'mongoose';

const { MONGO_URL } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

(function SetupDatabase() {
  const { readyState } = mongoose.connection;
  if (
        readyState !== 1 || readyState !== 2
    ) {
    mongoose.set('strictQuery', false)
    mongoose.connect(MONGO_URL, options)
            .then(() => {
              console.log('INFO - MongoDB Database connected.');
            })
            .catch(err => console.log('ERROR - Unable to connect to the database:', err));
  }
}());
