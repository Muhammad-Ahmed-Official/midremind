import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as medicineServices from "../modules/auth/services/medicineServices";

interface MedicineState {
  user: any;
  loading: boolean;
  error: string | null;
}

const initialState: MedicineState = {
  user: null,
  loading: false,
  error: null,
};


export const createMedicineUser = createAsyncThunk("/medicine/createMedicine",
  async (data: { name: string, dosage: string, frequency: string, duration: string, startDate: Date, times: string[], notes: string, reminderEnabled: boolean,refillReminder: boolean, currentSupply?: number, refillAt?: number }, thunkAPI) => {
    try {
      return await medicineServices.addMedicine(data);
    } catch (error: any) {
      const message = error?.message
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const getTodaysMedicineUser = createAsyncThunk("/medicine/",
  async (_, thunkAPI) => {
    try {
      return await medicineServices.getTodaysMedicine();
    } catch (error: any) {
      const message = error?.message
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const getMedicineHistoryUser = createAsyncThunk("/medicine/history",
  async (_, thunkAPI) => {
    try {
      return await medicineServices.getHistory();
    } catch (error: any) {
      const message = error?.message
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const TodaysMedicineTakenUser = createAsyncThunk("/medicine/taken",
  async (data: { logId: string, time: string }, thunkAPI) => {
    try {
      return await medicineServices.TodaysMedicineTaken(data);
    } catch (error: any) {
      const message = error?.message
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const deleteMedicineUser = createAsyncThunk("/medicine/delete",
  async (data: { _id: string }, thunkAPI) => {
    try {
      return await medicineServices.deleteMedicine(data);
    } catch (error: any) {
      const message = error?.message
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const medicineSlice = createSlice({
  name: "medicine",
  initialState,
  reducers: {},

  extraReducers: builder => {
    builder
        .addCase(createMedicineUser.pending, state => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createMedicineUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(createMedicineUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        .addCase(getTodaysMedicineUser.pending, state => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getTodaysMedicineUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(getTodaysMedicineUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        .addCase(getMedicineHistoryUser.pending, state => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getMedicineHistoryUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(getMedicineHistoryUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        .addCase(TodaysMedicineTakenUser.pending, state => {
            state.loading = true;
            state.error = null;
        })
        .addCase(TodaysMedicineTakenUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(TodaysMedicineTakenUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        .addCase(deleteMedicineUser.pending, state => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteMedicineUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(deleteMedicineUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
    }
});

export default medicineSlice.reducer;