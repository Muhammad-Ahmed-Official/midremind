import mongoose from 'mongoose';
const medicineSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dosage: {
      type: String,
      required: true,
    },

    frequency: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    notes: {
      type: String,
      default: "",
    },

    reminderEnabled: {
      type: Boolean,
      default: true,
    },

    refillReminder: {
      type: Boolean,
      default: false,
    },

    currentSupply: {
      type: Number,
      default: 0,
    },

    refillAt: {
      type: Number,
      default: 0,
    },

}, { timestamps: true } );

export const Medicine = mongoose.model("Medicine", medicineSchema);