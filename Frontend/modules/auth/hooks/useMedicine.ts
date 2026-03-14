import { createMedicineUser, getTodaysMedicineUser } from "@/store/medicineSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux"

export const useMedicine = () => {
    const dispatch = useDispatch<AppDispatch>();
    const medicine = useSelector((state: RootState) => state.medicine);

    const createMedicine = (data: { name: string, dosage: string, frequency: string, duration: string, startDate: Date, times: string[], notes: string, reminderEnabled: boolean,refillReminder: boolean, currentSupply?: number, refillAt?: number }) =>
        dispatch(createMedicineUser(data));

    const getTodaysMedicine = () => 
        dispatch(getTodaysMedicineUser())

    return {
        ...medicine,
        createMedicine,
        getTodaysMedicine,
    };
};