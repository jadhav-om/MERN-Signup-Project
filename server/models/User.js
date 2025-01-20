// const mongoose = require('mongoose');
// const validator = require('validator');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Please add a name'],
//     trim: true,
//     minlength: [2, 'Name must be at least 2 characters']
//   },
//   email: {
//     type: String,
//     required: [true, 'Please add an email'],
//     unique: true,
//     lowercase: true,
//     validate: [validator.isEmail, 'Please provide a valid email']
//   },
//   password: {
//     type: String,
//     required: [true, 'Please add a password'],
//     minlength: [8, 'Password must be at least 8 characters']
//   }
// }, {
//   timestamps: true
// });

// module.exports = mongoose.model('User', userSchema);


const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  profileImage: {
    public_id: String,
    url: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);