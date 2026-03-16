import { Router } from 'express'
import { addMedicine, deleteMedicine, getHistory, getTodayMedicines, markDoseTaken } from '../controllers/medicine.controller.js';

const medicineRouter = Router();

medicineRouter.route("/createMedicine").post(addMedicine);
medicineRouter.route("/").get(getTodayMedicines);
medicineRouter.route("/history").get(getHistory);
medicineRouter.route("/markTaken").patch(markDoseTaken);
medicineRouter.route("/deleteMedicine").delete(deleteMedicine);

export default medicineRouter