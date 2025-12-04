const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a goal title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['fitness', 'nutrition', 'mental_health', 'sleep', 'other'],
      default: 'other',
    },
    targetValue: {
      type: Number,
    },
    currentValue: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused', 'abandoned'],
      default: 'active',
    },
    progress: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

goalSchema.methods.calculateProgress = function () {
  if (this.targetValue && this.targetValue > 0) {
    this.progress = Math.min((this.currentValue / this.targetValue) * 100, 100);
  }
  return this.progress;
};

module.exports = mongoose.model('Goal', goalSchema);
