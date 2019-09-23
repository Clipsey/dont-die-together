console.log("process.env.NODE_ENV", process.env.NODE_ENV);
console.log("==========================================");
// console.log("")
let env = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./keys_prod');
} else {
  module.exports = require('./keys_dev');
}