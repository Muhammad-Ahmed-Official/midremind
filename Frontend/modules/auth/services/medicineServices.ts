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


export const getHistory = async () => {
  try {
    const response = await api.get("medicine/history");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Get Medicine history data failed");
  }
};


export const TodaysMedicineTaken = async (data: { logId: string, time: string }) => {
  try {
    const response = await api.patch("medicine/markTaken", data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Get today's Medicine taken failed");
  }
};


export const deleteMedicine = async (data: { _id: string }) => {
  try {
    console.log(data)
    const response = await api.delete("medicine/deleteMedicine", { params: { _id: data} } );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Get today's Medicine taken failed");
  }
};