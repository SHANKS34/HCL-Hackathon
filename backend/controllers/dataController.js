const User = require('../models/User');
const Goal = require('../models/Goal');

const getProfile = async (req, res) => {
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

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;

      if (user.role === 'patient') {
        user.age = req.body.age || user.age;
        user.gender = req.body.gender || user.gender;
        user.healthConditions = req.body.healthConditions || user.healthConditions;

        if (user.age && user.gender) {
          user.profileComplete = true;
        }
      } else if (user.role === 'provider') {
        user.specialization = req.body.specialization || user.specialization;
        user.yearsOfExperience = req.body.yearsOfExperience || user.yearsOfExperience;
        user.bio = req.body.bio || user.bio;

        if (user.specialization && user.licenseNumber) {
          user.profileComplete = true;
        }
      }

      const updatedUser = await user.save();

      const userResponse = {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profileComplete: updatedUser.profileComplete,
      };

      if (updatedUser.role === 'patient') {
        userResponse.age = updatedUser.age;
        userResponse.gender = updatedUser.gender;
        userResponse.healthConditions = updatedUser.healthConditions;
      } else if (updatedUser.role === 'provider') {
        userResponse.specialization = updatedUser.specialization;
        userResponse.licenseNumber = updatedUser.licenseNumber;
        userResponse.yearsOfExperience = updatedUser.yearsOfExperience;
        userResponse.bio = updatedUser.bio;
      }

      res.json(userResponse);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createGoal = async (req, res) => {
  try {
    const { title, description, category, targetValue, unit, endDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Please provide a goal title' });
    }

    const goal = await Goal.create({
      user: req.user._id,
      title,
      description,
      category,
      targetValue,
      unit,
      endDate,
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this goal' });
    }

    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (updatedGoal.targetValue) {
      updatedGoal.calculateProgress();
      await updatedGoal.save();
    }

    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this goal' });
    }

    await goal.deleteOne();

    res.json({ message: 'Goal removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProviders = async (req, res) => {
  try {
    const providers = await User.find({ role: 'provider' }).select('-password');
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProviderById = async (req, res) => {
  try {
    const provider = await User.findOne({
      _id: req.params.id,
      role: 'provider'
    }).select('-password');

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPatientData = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'Please provide userId' });
    }

    const patient = await User.findOne({
      _id: userId,
      role: 'patient'
    }).select('-password');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const goals = await Goal.find({ user: userId }).sort({ createdAt: -1 });

    const patientData = {
      _id: patient._id,
      name: patient.name,
      email: patient.email,
      age: patient.age,
      gender: patient.gender,
      healthConditions: patient.healthConditions,
      profileComplete: patient.profileComplete,
      goals: goals
    };

    res.json(patientData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addPatientIllness = async (req, res) => {
  try {
    const { userId, illness } = req.body;

    if (!userId || !illness) {
      return res.status(400).json({ message: 'Please provide userId and illness' });
    }

    const patient = await User.findOne({
      _id: userId,
      role: 'patient'
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    if (patient.healthConditions.includes(illness)) {
      return res.status(400).json({ message: 'Illness already exists in health conditions' });
    }

    patient.healthConditions.push(illness);
    await patient.save();

    res.json({
      message: 'Illness added successfully',
      healthConditions: patient.healthConditions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProviders = async (req, res) => {
  try {
    const providers = await User.find({ role: 'provider' }).select('_id name');

    const providersList = providers.map(provider => ({
      userId: provider._id,
      name: provider.name
    }));

    res.json(providersList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const assignProvider = async (req, res) => {
  try {
    const { patientId, providerId } = req.body;

    if (!patientId || !providerId) {
      return res.status(400).json({ message: 'Please provide patientId and providerId' });
    }

    const patient = await User.findOne({
      _id: patientId,
      role: 'patient'
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const provider = await User.findOne({
      _id: providerId,
      role: 'provider'
    });

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    patient.assignedProvider = providerId;
    await patient.save();

    res.json({
      message: 'Provider assigned successfully',
      patient: {
        _id: patient._id,
        name: patient.name,
        assignedProvider: providerId,
        assignedProviderName: provider.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
