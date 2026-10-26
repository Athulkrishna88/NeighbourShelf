const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Locality = require('../models/Locality');

// Generate JWT token valid for 24 hours (C-2, FR-1.3)
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'neighbourshelf_super_secure_jwt_secret_key_2026_at_least_32_chars';
  return jwt.sign({ id }, secret, { expiresIn: '24h' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, locality, phone, bio } = req.body;

    // FR-1.1 Validation
    if (!name || !email || !password || !locality) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and locality are required.'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.'
      });
    }

    const emailTrimmed = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: emailTrimmed });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Verify locality exists
    const localityObj = await Locality.findById(locality);
    if (!localityObj) {
      return res.status(400).json({
        success: false,
        message: 'Selected locality is invalid.'
      });
    }

    // Hash password (FR-1.2, NFR-2.1)
    const passwordHash = await User.hashPassword(password);

    const user = await User.create({
      name: name.trim(),
      email: emailTrimmed,
      passwordHash,
      locality,
      phone: phone ? phone.trim() : '',
      bio: bio ? bio.trim() : '',
      role: 'member',
      status: 'active'
    });

    const populatedUser = await User.findById(user._id).populate('locality', 'name');
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: populatedUser._id,
        name: populatedUser.name,
        email: populatedUser.email,
        locality: populatedUser.locality,
        role: populatedUser.role,
        status: populatedUser.status,
        phone: populatedUser.phone,
        bio: populatedUser.bio,
        trustScore: populatedUser.trustScore,
        completedLoans: populatedUser.completedLoans
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    const emailTrimmed = email.trim().toLowerCase();
    const user = await User.findOne({ email: emailTrimmed })
      .select('+passwordHash')
      .populate('locality', 'name');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // FR-6.3: A suspended user SHALL NOT be able to log in
    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended by an administrator.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        locality: user.locality,
        role: user.role,
        status: user.status,
        phone: user.phone,
        bio: user.bio,
        trustScore: user.trustScore,
        completedLoans: user.completedLoans
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, generateToken };
