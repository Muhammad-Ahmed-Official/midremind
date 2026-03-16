import { View, Text, TouchableOpacity, ScrollView, TextInput, Switch } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router';
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMedicine } from '@/modules/auth/hooks/useMedicine';
import Toast from 'react-native-toast-message';
import Button from '@/components/Button';

const FREQUENCIES = [
  {
    id: "1",
    label: "Once daily",
    icon: "sunny-outline" as const,
    times: ["09:00 AM"],
  },
  {
    id: "2",
    label: "Twice daily",
    icon: "sync-outline" as const,
    times: ["09:00 AM", "09:00 PM"],
  },
  {
    id: "3",
    label: "Three times daily",
    icon: "time-outline" as const,
    times: ["09:00 AM", "03:00 PM", "09:00 PM"],
  },
  {
    id: "4",
    label: "Four times daily",
    icon: "repeat-outline" as const,
    times: ["09:00 AM", "01:00 PM", "05:00 PM", "09:00 PM"],
  },
  { id: "5", label: "As needed", icon: "calendar-outline" as const, times: [] },
];
const DURATIONS = [
  { id: "1", label: "7 days", value: 7 },
  { id: "2", label: "14 days", value: 14 },
  { id: "3", label: "30 days", value: 30 },
  { id: "4", label: "90 days", value: 90 },
  { id: "5", label: "Ongoing", value: -1 },
];

const distributeTimesEvenly = (startTime: string, frequency: number): string[] => {
  // Extract hours, minutes, and period (AM/PM) from startTime like "03:00 AM"
  const [time, period] = startTime.split(' ');
  const [hoursStr, minutesStr] = time.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  
  // Convert to 24-hour for calculation
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  // Calculate interval
  const startMinutes = hours * 60 + minutes;
  const intervalMinutes = Math.floor((24 * 60) / frequency);
  
  // Generate distributed times
  const times: string[] = [];
  for (let i = 0; i < frequency; i++) {
    const totalMinutes = (startMinutes + (intervalMinutes * i)) % (24 * 60);
    const h24 = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    
    // Convert back to 12-hour format with AM/PM
    const p = h24 >= 12 ? 'PM' : 'AM';
    const h12 = h24 % 12 || 12;
    times.push(`${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${p}`);
  }
  
  return times;
};

const AddMedication = () => {
  const { createMedicine, loading, error } = useMedicine();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
    startDate: new Date(),
    times: ["09:00 AM"],
    notes: "",
    reminderEnabled: true,
    refillReminder: false,
    currentSupply: 0,
    refillAt: 0,
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");

  const renderFrequencyOptions = () => {
    return (
      <View className="flex-row flex-wrap -mx-1.5">
        {FREQUENCIES.map((freq) => {
          const isSelected = selectedFrequency === freq.label;
  
          return (
            <TouchableOpacity
              key={freq.id}
              className={`w-[45%] rounded-xl p-4 m-1.5 items-center border shadow-md ${
                isSelected ? "bg-green-800 border-green-800" : "bg-white border-gray-200"
              }`}
              onPress={() => {
                setSelectedFrequency(isSelected ? "" : freq.label);
                
                // Set initial times based on frequency
                if (!isSelected) {
                  setForm({ 
                    ...form, 
                    frequency: freq.label,
                    times: freq.times // Use default times initially
                  });
                } else {
                  setForm({ 
                    ...form, 
                    frequency: "",
                    times: ["09:00 AM"]
                  });
                }
              }}
            >
              <View
                className={`w-12 h-12 rounded-full justify-center items-center mb-2 ${
                  isSelected ? "bg-white/20" : "bg-gray-100"
                }`}
              >
                <Ionicons
                  name={freq.icon}
                  size={24}
                  color={isSelected ? "white" : "#666"}
                />
              </View>
              <Text
                className={`text-sm font-semibold text-center ${
                  isSelected ? "text-white" : "text-gray-800"
                }`}
              >
                {freq.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderDurationOptions = () => {
    return (
      <View className="flex-row flex-wrap -mx-1.5">
        {DURATIONS.map((dur) => {
          const isSelected = selectedDuration === dur.label;

          return (
            <TouchableOpacity
              key={dur.id}
              className={`w-[45%] rounded-xl p-4 m-1.5 items-center border shadow-md ${
                isSelected ? "bg-green-800 border-green-800" : "bg-white border-gray-200"
              }`}
              onPress={() => {
                // Toggle selection
                setSelectedDuration(isSelected ? "" : dur.label);
                setForm({ ...form, duration: isSelected ? "" : dur.label });
              }}
            >
              <Text
                className={`text-2xl font-bold mb-1 ${
                  isSelected ? "text-white" : "text-green-800"
                }`}
              >
                {dur.value > 0 ? dur.value : "∞"}
              </Text>
              <Text
                className={`text-sm font-semibold ${
                  isSelected ? "text-white" : "text-gray-800"
                }`}
              >
                {dur.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };


  const onSubmit = async() => {
    const result: any = await createMedicine(form);
    if (result?.meta?.requestStatus === "fulfilled") {
      Toast.show({ type: 'success', text1: 'Medication', text2: 'Added successfully' });
      setForm({
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        startDate: new Date(),
        times: ["09:00 AM"],
        notes: "",
        reminderEnabled: true,
        refillReminder: false,
        currentSupply: 0,
        refillAt: 0,
      });
    } else {
      // const message = (result && result.payload) || error || "Login failed";
      Toast.show({ type: 'error', text1: 'Login', text2: result && result.payload });
    }
  }

return (
  <View className="flex-1 bg-[#f8f9fa]">
    <LinearGradient
      colors={["#1a8e2d", "#146922"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="absolute top-0 left-0 right-0 h-[140px] ios:h-[140px] android:h-[120px]"
    />
    <View className="flex-1 pt-12">
      <View className="flex-row items-center pb-5 z-10 px-4">
        <TouchableOpacity onPress={() => router.replace('/home')} className="w-10 h-10 rounded-full bg-white justify-center items-center shadow-md">
          <Ionicons name="chevron-back" size={28} color="#1a8e2d" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white ml-4">
          New Medication
        </Text>
      </View>

      <ScrollView
        className="px-4"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Inputs */}
        <View className="mb-6">
          <View className={`bg-white rounded-xl mb-3 border border-gray-200 shadow-md `}>
            <TextInput
              placeholder="Medication Name"
              placeholderTextColor="#999"
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              className="text-lg text-gray-800 p-4 outline-none"
            />
          </View>

          <View className={`bg-white rounded-xl mb-3 border border-gray-200 shadow-md `} >
            <TextInput
              placeholder="Dosage (e.g., 500mg)"
              placeholderTextColor="#999"
              value={form.dosage}
              onChangeText={(text) => setForm({ ...form, dosage: text })}
              className="text-lg text-gray-800 p-4 outline-none"
            />
          </View>
        </View>

        {/* Schedule */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-2">How often?</Text>
          {renderFrequencyOptions()}
          <Text className="text-lg font-bold mt-4 mb-2">For how long?</Text>
          {renderDurationOptions()}
          <TouchableOpacity onPress={() => setShowDatePicker(true)} className="flex-row items-center bg-white p-4 rounded-xl mt-4 border border-gray-200 shadow-md">
            <View className="w-10 h-10 bg-gray-100 rounded-full justify-center items-center mr-3">
              <Ionicons name="calendar" size={20} color="#1a8e2d" />
            </View>
            <Text className="flex-1 text-gray-800">Starts: {form.startDate.toLocaleDateString()}</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={form.startDate}
                mode="date"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) setForm({ ...form, startDate: date });
                }}
              />
            )}
            {form.frequency && form.frequency !== "As needed" ? (
                  <View className='mt-5'>
    <Text className='text-[16px] font-semibold text-[#333] mb-2.5'>
      Medication Times ({form.times.length} {form.times.length === 1 ? 'dose' : 'doses'} per day)
    </Text>
    {form.times.map((time, index) => (
      <TouchableOpacity
        key={index}
        className='flex-row items-center bg-white p-4 rounded-xl mt-2 border border-gray-200 shadow-md'
        onPress={() => {
          // Set which time index we're editing
          setShowTimePicker(true);
          // You might want to add a state to track which time is being edited
        }}
      >
        <View className='w-10 h-10 rounded-2xl bg-[#f5f5f5] items-center justify-center mr-2.5'>
          <Ionicons name="time-outline" size={20} color="#1a8e2d" />
        </View>
        <View className="flex-1">
          <Text className='text-[16px] text-[#333] font-semibold'>{time}</Text>
          <Text className='text-[12px] text-gray-500'>Dose {index + 1} of {form.times.length}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </TouchableOpacity>
    ))}
  </View>) : 
                <View></View>
            }
            {showTimePicker && (
  <DateTimePicker
    value={(() => {
      // Parse current time from form.times[0] like "09:00 AM"
      const [time, period] = form.times[0].split(' ');
      const [hoursStr, minutesStr] = time.split(':');
      let hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);
      
      // Convert to 24-hour for Date object
      if (period === 'PM' && hours !== 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }
      
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    })()}
    mode="time"
    onChange={(event, date) => {
      setShowTimePicker(false);
      if (date) {
        // Get hours and minutes from picker
        const hours = date.getHours();
        const minutes = date.getMinutes();
        
        // Convert to 12-hour format with AM/PM
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        const newTime = `${String(hours12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
        
        // Get number of doses from frequency
        const frequencyMap: { [key: string]: number } = {
          "Once daily": 1,
          "Twice daily": 2,
          "Three times daily": 3,
          "Four times daily": 4,
          "As needed": 0,
        };
        
        const doses = frequencyMap[form.frequency] || 1;
        
        // Distribute times evenly
        const distributedTimes = distributeTimesEvenly(newTime, doses);
        
        setForm((prev) => ({
          ...prev,
          times: distributedTimes,
        }));
      }
    }}
  />
)}
        </View>

        {/* Reminder */}
        <View className="mb-6 bg-white rounded-xl p-5 border border-gray-200 shadow-md">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 bg-gray-100 rounded-full justify-center items-center mr-3">
                <Ionicons name="notifications" size={20} color="#1a8e2d" />
              </View>
              <View>
                <Text className="text-base font-semibold text-gray-800">Reminders</Text>
                <Text className="text-xs text-gray-500">
                  Get notified when it's time to take your medication
                </Text>
              </View>
            </View>
            <Switch
              value={form.reminderEnabled}
              onValueChange={(val) => setForm({ ...form, reminderEnabled: val })}
              trackColor={{ false: "#ddd", true: "#1a8e2d" }}
              thumbColor="white"
            />
          </View>
        </View>

        {/* Refill Tracking */}
        <View className='mb-6'>
          <View className="mb-6 bg-white rounded-xl p-5 border border-gray-200 shadow-md">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-gray-100 rounded-full justify-center items-center mr-3">
                  <Ionicons name="reload" size={20} color="#1a8e2d" />
                </View>
                <View>
                  <Text className="text-base font-semibold text-gray-800">Refill Tracking</Text>
                  <Text className="text-xs text-gray-500">
                    Enter how many tablets you currently have
                  </Text>
                </View>
              </View>
              <Switch
                value={form.refillReminder}
                onValueChange={(val) => setForm({ ...form, refillReminder: val })}
                trackColor={{ false: "#ddd", true: "#1a8e2d" }}
                thumbColor="white"
              />
            </View>
            {form.refillReminder && (
                <View className='mt-3.5'>
                  <View className='flex-row mt-3.5 gap-2'>
                  
                    <View className={`flex-1 bg-white rounded-xl mb-3 border border-gray-200 shadow-md`}>
                      <TextInput
                        className={`p-3.5 text-[16px] text-[#333]  outline-none`}
                        placeholder="Pills remaining"
                        placeholderTextColor="#999"
                        value={form.currentSupply ? String(form.currentSupply) : ""}
                        onChangeText={(text) => {
                          setForm({ ...form, currentSupply: Number(text) || 0, });
                        }}
                        keyboardType="numeric"
                      />
                     
                    </View>
                    <View className={`flex-1 bg-white rounded-xl mb-3 border border-gray-200 shadow-md`}>
                      <TextInput
                       className={`p-3.5 text-[16px] text-[#333] outline-none`}
                        placeholder="Alert when this pills left"
                        placeholderTextColor="#999"
                        value={form.refillAt ? String(form.refillAt) : ""}
                        onChangeText={(text) => {
                          setForm({ ...form, refillAt: Number(text) || 0 });
                        }}
                        keyboardType="numeric"
                      />
                      
                    </View>
                  </View>
                </View>
              )}
          </View>
        </View>

        {/* Notes */}
          <View className='mb-6'>
            <View className='bg-white rounded-2xl border border-[#e0e0e0] shadow-md'>
              <TextInput
                className='h-24 p-3.5 text-[16px] text-[#333] outline-none'
                placeholder="Add notes or special instructions..."
                placeholderTextColor="#999"
                value={form.notes}
                onChangeText={(text) => setForm({ ...form, notes: text })}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
      </ScrollView>

      <View className='p-5 bg-white border-t border-t-[#e0e0e0]'>
        <Button title={'Add Medication'} loading={loading} onPress={onSubmit} />
         <TouchableOpacity
            className='py-3.5 mt-2 rounded-2xl border border-[#e0e0e0] justify-center items-center bg-white'
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text className='text-[#666] text-[16px] font-semibold'>Cancel</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            className={`rounded-2xl overflow-hidden mb-3 ${loading && 'opacity-70'}`}
            onPress={handleSave}
            disabled={loading}
          >
            <LinearGradient
              colors={["#1a8e2d", "#146922"]}
              className='py-3.5 justify-center items-center'
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text className='text-white text-[16px] font-bold'>
                {loading ? "Adding..." : "Add Medication"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            className='py-3.5 rounded-2xl border border-[#e0e0e0] justify-center items-center bg-white'
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text className='text-[#666] text-[16px] font-semibold'>Cancel</Text>
          </TouchableOpacity> */}
      </View>

    </View>
  </View>
);
}

export default AddMedication