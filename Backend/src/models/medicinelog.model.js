import mongoose from "mongoose";

const medicineLogSchema = new mongoose.Schema({
    medicineId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Medicine", 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    doses: [
    {
      time: { type: String, required: true },
      taken: { type: Boolean, default: false }
    }
  ]
}, { timestamps: true });

medicineLogSchema.index({ userId: 1, date: 1 }); // fast daily query
medicineLogSchema.index({ medicineId: 1, date: 1 }); // for historical tracking

export const MedicineLog = mongoose.model("MedicineLog", medicineLogSchema);