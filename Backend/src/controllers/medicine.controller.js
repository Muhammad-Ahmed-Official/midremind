import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Medicine } from "../models/medicine.model.js";
import { MedicineLog } from "../models/medicinelog.model.js";


export const addMedicine = asyncHandler(async (req, res) => {
  const { name, dosage, frequency, duration, startDate, times, notes, reminderEnabled, refillReminder, currentSupply, refillAt } = req.body;

  if (!name || !dosage || !frequency || !duration || !startDate) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      status: StatusCodes.BAD_REQUEST,
      message: "Fields required"
    });
  }

  const userId = "69b1399ed542722a3eafbe8d";

  // 1️⃣ Create the medicine
  const medicine = await Medicine.create({
    userId,
    name,
    dosage,
    frequency,
    duration,
    startDate,
    notes,
    reminderEnabled,
    refillReminder,
    currentSupply,
    refillAt
  });

  // 2️⃣ Prepare doses for the entire duration
  const start = new Date(startDate); // user's startDate
  const totalDays = parseInt(duration, 10);

  const dosesArray = [];
  for (let i = 0; i < totalDays; i++) {
    // Create doseDate based on startDate, preserving local time
    const doseDate = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i, start.getHours(), start.getMinutes(), start.getSeconds());

    const timesForDay = times.map(time => ({
      time,
      taken: false,
      status: "pending"
    }));

    dosesArray.push({
      date: doseDate,
      times: timesForDay
    });
  }

  await MedicineLog.create({
    medicineId: medicine._id,
    userId,
    doses: dosesArray
  });

  res.status(StatusCodes.CREATED).send({
    status: true,
    message: "Medicine created successfully with all doses in a single log"
  });
});


const isActiveToday = (startDate, duration) => {
  const start = new Date(startDate);
  start.setHours(0,0,0,0);

  const end = new Date(start);
  end.setDate(start.getDate() + parseInt(duration) - 1);

  const today = new Date();
  today.setHours(0,0,0,0);

  return today >= start && today <= end;
};

const timeStringToMinutes = (timeStr) => {
  const [time, modifier] = timeStr.split(" "); // "10:00", "AM"
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

export const getTodayMedicines = asyncHandler(async (req, res) => {
  const userId = "69b1399ed542722a3eafbe8d";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Fetch all medicines of the user
  const meds = await Medicine.find({ userId });
  const result = [];

  for (const med of meds) {
    // Skip if medicine is not active today
    if (!isActiveToday(med.startDate, med.duration)) continue;

    // Fetch the single medicine log
    const medLog = await MedicineLog.findOne({ medicineId: med._id }).lean();

    if (!medLog) continue;

    // Get the dose object for today
    const todayDose = medLog.doses.find(d => {
      const doseDate = new Date(d.date);
      return doseDate.getFullYear() === today.getFullYear() && doseDate.getMonth() === today.getMonth() && doseDate.getDate() === today.getDate();
    });

    if (!todayDose) continue;

    // Update missed status for doses that are past time
    const updatedTimes = todayDose.times.map(t => {
    const doseMinutes = timeStringToMinutes(t.time);
      return {
        ...t,
        status: !t.taken && doseMinutes < currentMinutes ? "missed" : t.status
      };
    });

    result.push({
      logId: medLog._id,
      medicineId: med._id,
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      notes: med.notes, // include notes
      times: updatedTimes
    });
  }

  res.status(200).send({
    status: true,
    data: result
  });
});

export const getHistory = asyncHandler(async (req, res) => {
  const userId = "69b1399ed542722a3eafbe8d";

  // 1️⃣ Fetch all medicines of the user
  const medicines = await Medicine.find({ userId }).sort({ startDate: -1 }).lean().select("-frequency -startDate -duration");

  // 2️⃣ Fetch logs for these medicines
  const medicineIds = medicines.map(med => med._id);
  const logs = await MedicineLog.find({ medicineId: { $in: medicineIds } }).lean();

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // 3️⃣ Map logs to medicines with real-time status update
  const history = medicines.map(med => {
    const medLogs = logs
      .filter(log => log.medicineId.toString() === med._id.toString())
      .map(log => ({
        logId: log._id,
        doses: log.doses.map(d => {
          const doseDate = new Date(d.date);

          // Update times only if date is today or past
          const updatedTimes = d.times.map(t => {
            const doseMinutes = timeStringToMinutes(t.time);
            let status = t.status;

            if (!t.taken && doseDate <= now && doseMinutes < currentMinutes) {
              status = "missed";
            }

            return {
              ...t,
              status,
            };
          });

          return {
            ...d,
            times: updatedTimes,
          };
        }),
      }));

    return {
      medicineId: med._id,
      name: med.name,
      dosage: med.dosage,
      notes: med.notes,
      logs: medLogs,
    };
  });

  res.status(200).json({
    status: true,
    data: history,
  });
});


export const markDoseTaken = asyncHandler(async (req, res) => {
  const { logId, time } = req.body;

  if (!logId || !time) {
    return res.status(400).send({
      status: false,
      message: "Fields required",
    });
  }

  // ✅ Today's date at 00:00
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // ✅ Update ONLY today's dose AND specific time
  const result = await MedicineLog.updateOne(
    {
      _id: logId,
      "doses.date": { $gte: today, $lt: tomorrow },
    },
    {
      $set: {
        "doses.$[dose].times.$[t].taken": true,
        "doses.$[dose].times.$[t].status": "taken",
      },
    },
    {
      arrayFilters: [
        { "dose.date": { $gte: today, $lt: tomorrow } },
        { "t.time": time },
      ],
    }
  );

  if (result.modifiedCount === 0) {
    return res.status(404).send({
      status: false,
      message: "Dose not found for today",
    });
  }

  res.status(200).send({
    status: true,
    message: "Medicine taken successfully",
  });
});



export const deleteMedicine = asyncHandler(async(req, res) => {
  const { _id } = req.query; 
  const userId = "69b1399ed542722a3eafbe8d";
  if(!_id || !userId) {
    return res.status(StatusCodes.BAD_REQUEST).send({status: StatusCodes.BAD_REQUEST, message: "Fields required"});
  };

  const deletedMedicine = await Medicine.findByIdAndDelete(_id);
  if (!deletedMedicine) {
    return res.status(StatusCodes.NOT_FOUND).send({ status: StatusCodes.NOT_FOUND, message: "Medicine not found" });
  };
   
  await MedicineLog.deleteMany({ medicineId: _id });
  res.status(StatusCodes.OK).send({ status: StatusCodes.OK, message: "Medicine and related logs deleted successfully" });
});