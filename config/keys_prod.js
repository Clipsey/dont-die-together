require('dotenv').config();
console.log(process.env.MONGO_URI);
console.log(process.env.SECRET_OR_KEY);
console.log(process.env.JWT_SECRET);
console.log(process.env.SECRET);
module.exports = {
  mongoURI: process.env.MONGO_URI,
  secretOrKey: process.env.SECRET_OR_KEY
}