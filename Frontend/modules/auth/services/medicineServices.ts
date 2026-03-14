import api from "@/constants/api";

export const addMedicine = async (data: {   
    name: string,
    dosage: string,
    frequency: string,
    duration: string,
    startDate: Date,
    times: string[],
    notes: string,
    reminderEnabled: boolean,
    refillReminder: boolean,
    currentSupply?: number,
    refillAt?: number,
}) => {
  try {
    const response = await api.post("medicine/createMedicine", data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "CreateMedicine failed");
  }
};


export const getTodaysMedicine = async () => {
  try {
    const response = await api.get("medicine");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Get today's Medicine data failed");
  }
};