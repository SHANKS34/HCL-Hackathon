const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password, role, specialization, licenseNumber } = req.body;
    console.log(req.body);
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!['patient', 'provider'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be patient or provider' });
    }

    if (role === 'provider' && (!specialization || !licenseNumber)) {
      return res.status(400).json({ message: 'Providers must provide specialization and license number' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const userData = {
      name,
      email,
      password,
      role,
    };

    if (role === 'provider') {
      userData.specialization = specialization;
      userData.licenseNumber = licenseNumber;
      userData.yearsOfExperience = req.body.yearsOfExperience;
      userData.bio = req.body.bio;
    }

    const user = await User.create(userData);

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileComplete: user.profileComplete,
      };

      if (user.role === 'patient') {
        userResponse.age = user.age;
        userResponse.gender = user.gender;
        userResponse.healthConditions = user.healthConditions;
      } else if (user.role === 'provider') {
        userResponse.specialization = user.specialization;
        userResponse.licenseNumber = user.licenseNumber;
        userResponse.yearsOfExperience = user.yearsOfExperience;
        userResponse.bio = user.bio;
      }

      res.json(userResponse);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getMe };
