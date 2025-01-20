// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');


// router.post('/signup', async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check if user exists
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Email already registered' 
//       });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create user
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword
//     });

//     if (user) {
//       res.status(201).json({
//         success: true,
//         message: 'Registration successful'
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error, please try again'
//     });
//   }
// });


const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const jwt = require('jsonwebtoken');

// Update signup route to handle file upload
router.post('/signup', upload.single('profileImage'), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already registered' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let profileImage = {};

    // Upload image to Cloudinary if provided
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'profile_images',
        width: 500,
        height: 500,
        crop: 'fill'
      });

      profileImage = {
        public_id: result.public_id,
        url: result.secure_url
      };
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImage
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: 'Registration successful'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error, please try again'
    });
  }
});

// Add this login route after the signup route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // res.json({
    //   success: true,
    //   token,
    //   user: {
    //     id: user._id,
    //     name: user.name,
    //     email: user.email
    //   }
    // });


    // In auth.js, update the login route response for profile image
res.json({
  success: true,
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    profileImage: user.profileImage
  }
});

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error, please try again'
    });
  }
});

module.exports = router;