console.log(process.env.MONGO_URI);
console.log(process.env.SECRET_OR_KEY);
module.exports = {
  mongoURI: process.env.MONGO_URI,
  secretOrKey: process.env.SECRET_OR_KEY
}