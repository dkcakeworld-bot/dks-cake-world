const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Singleton — only one admin account
const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Instance method: verify a plaintext password against the stored hash
adminSchema.methods.matchPassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

module.exports = mongoose.model('Admin', adminSchema);
