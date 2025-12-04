const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  getAllProviders,
  getProviderById,
  getPatientData,
  addPatientIllness,
  getProviders,
  assignProvider,
} = require('../controllers/dataController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

router.get('/goals', protect, restrictTo('patient'), getGoals);
router.post('/goals', protect, restrictTo('patient'), createGoal);
router.put('/goals/:id', protect, restrictTo('patient'), updateGoal);
router.delete('/goals/:id', protect, restrictTo('patient'), deleteGoal);

router.get('/providers', protect, getAllProviders);
router.get('/providers/:id', protect, getProviderById);

router.post('/getPatientData', protect, getPatientData);
router.post('/addPatientIllness', protect, addPatientIllness);
router.get('/getProviders', protect, getProviders);
router.post('/assignProvider', protect, assignProvider);

module.exports = router;
