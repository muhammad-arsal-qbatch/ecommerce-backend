const {
  PORT,
  MONGO_URL,
} = process.env;
const secretKey = 'secretKey';

export {
  PORT,
  MONGO_URL,
  secretKey
}

// above code is extracting values from environment variables and exporting, so that u can use it in other files