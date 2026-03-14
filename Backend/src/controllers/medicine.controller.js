import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Medicine } from "../models/medicine.model.js";
import { MedicineLog } from "../models/medicinelog.model.js";


export const addMedicine = asyncHandler(async (req, res) => {
    const { name, dosage, frequency, duration, startDate, times, notes, reminderEnabled, refillReminder, currentSupply, refillAt } = req.body;
    if(!name || !dosage || !frequency || !duration || !startDate ){
        return res.status(StatusCodes.BAD_REQUEST).send({status: StatusCodes.BAD_REQUEST, message: "Fields required"});
    };

    const medicine = await Medicine.create({
      userId: "69b1399ed542722a3eafbe8d",
      name,
      dosage,
      frequency,
      duration,
      startDate,
      notes,
      reminderEnabled,
      refillReminder,
      currentSupply,
      refillAt,
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to start of day

    const doses = times.map(time => ({ time, taken: false }));

    await MedicineLog.create({
      medicineId: medicine._id,
      userId:  "69b1399ed542722a3eafbe8d",
      date: today,
      doses
    });

    res.status(StatusCodes.CREATED).send({ status: true, message: "Medicine created successfully" });
})


// It won’t match anything because new Date() has the current time (like 16:23), and 2026-03-15T09:00:00 ≠ 2026-03-15T16:23:00.


export const getTodayMedicines = asyncHandler(async (req, res) => {
    const userId = "69b1399ed542722a3eafbe8d";
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Find logs for today where at least one dose is not taken
    const logs = await MedicineLog.find({
      userId,
      date: { $gte: today, $lt: tomorrow },
      "doses.taken": false
    }).populate("medicineId");

    const medicines = logs.map(log => ({
      logId: log._id,
      medicineId: log.medicineId._id,
      name: log.medicineId.name,
      dosage: log.medicineId.dosage,
      times: log.doses.map(d => ({ time: d.time, taken: d.taken }))
    }));

    res.status(StatusCodes.OK).send({ status: true, data: medicines });
});


export const markDoseTaken = asyncHandler(async() => {
    const { logId, time } = req.body;
    if(!logId || !time) {
        return res.status(StatusCodes.BAD_REQUEST).send({status: StatusCodes.BAD_REQUEST, message: "Fields required"});
    };

    await MedicineLog.updateOne(
      { _id: logId, "doses.time": time },
      { $set: { "doses.$.taken": true } }
    );

    res.status(StatusCodes.OK).send({ status: true, message: "Medicine taken successfully" });
})