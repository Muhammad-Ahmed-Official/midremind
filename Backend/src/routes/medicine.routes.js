import { Router } from 'express'
import { addMedicine, getTodayMedicines } from '../controllers/medicine.controller.js';

const medicineRouter = Router();

medicineRouter.route("/createMedicine").post(addMedicine);
medicineRouter.route("/").get(getTodayMedicines);

export default medicineRouter