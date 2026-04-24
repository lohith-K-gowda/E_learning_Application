const express = require('express');
const authenticate = require('../middleware/auth');
const { allowRoles } = require('../middleware/roles');
const { getProfile, getUsers } = require('../controllers/userController');

const router = express.Router();
router.get('/me', authenticate, getProfile);
router.get('/', authenticate, allowRoles('admin'), getUsers);

module.exports = router;
