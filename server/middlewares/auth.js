const jwt = require('jsonwebtoken');
const User = require('../models/user');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'dumbKey';

const authMiddleware = async (req, res, next) => {
  // extract token from auth headers
  const authHeaders = req.headers['authorization'];
  if (!authHeaders) return res.sendStatus(403);
  const token = authHeaders.split(' ')[1];

  try {
    // verify & decode token payload,
    const { _id } = jwt.verify(token, JWT_SECRET_KEY);
    // attempt to find user object and set to req
    const user = await User.findOne({ _id }); // FIX: change to findById(_id)
    if (!user) return res.sendStatus(401);
    req.user = user;
    next();
  } catch (error) {
    res.sendStatus(401);
  }
};

module.exports = authMiddleware;