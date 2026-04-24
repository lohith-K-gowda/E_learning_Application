exports.getProfile = async (req, res) => {
  res.json(req.user);
};

exports.getUsers = async (req, res) => {
  try {
    const users = await require('../models/User').find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load users', error: error.message });
  }
};
