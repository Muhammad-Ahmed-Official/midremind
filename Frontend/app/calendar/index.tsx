import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native'
import React, { JSX, useState, useEffect } from 'react'
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useMedicine } from '@/modules/auth/hooks/useMedicine';
import Toast from 'react-native-toast-message';

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [medications, setMedications] = useState<any[]>([]);
  const [doseHistory, setDoseHistory] = useState<any[]>([]);
  const { getMedicineHistory } = useMedicine();
  const fetchHistory = async () => {
    const result = await getMedicineHistory();
    if (result?.meta?.requestStatus === "fulfilled") {
      const data = result.payload.data;

      // Set medications for reference
      const meds = data.map((med: any) => ({
        id: med.medicineId,
        name: med.name,
        dosage: med.dosage,
        color: "#4CAF50" // you can assign colors dynamically if you want
      }));
      setMedications(meds);

      // Flatten doses for calendar and day view
      const flatHistory: any[] = [];
      data.forEach((med: any) => {
        med.logs.forEach((log: any) => {
          log.doses.forEach((dose: any) => {
            dose.times.forEach((time: any) => {
              flatHistory.push({
                medicationId: med.medicineId,
                name: med.name,
                dosage: med.dosage,
                timestamp: dose.date,
                time: time.time,
                taken: time.taken,
                status: time.status
              });
            });
          });
        });
      });

      setDoseHistory(flatHistory);
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: result?.payload || "Failed to fetch data",
      });
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);


  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(selectedDate);

  const renderCalendar = () => {
    const calendar: JSX.Element[] = [];
    let week: JSX.Element[] = [];

    for (let i = 0; i < firstDay; i++) {
      week.push(<View key={`empty-${i}`} className='flex-1 justify-center items-center rounded-none aspect-square' />);
    }

    for (let day = 1; day <= days; day++) {
  const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
  const isToday = new Date().toDateString() === date.toDateString();

  // Get all doses for this date
  const dayDoses = doseHistory.filter(
    dose => new Date(dose.timestamp).toDateString() === date.toDateString()
  );

const hasTaken = dayDoses.some(d => d.taken);
const hasMissed = dayDoses.some(d => d.status === "missed");

// Only show green/red dot if medicine taken or missed

  week.push(
    <TouchableOpacity
        key={day}
        className={`flex-1 justify-center items-center h-10 ${isToday ? "bg-[#c5f0cc] rounded font-semibold" : ""}`}
        onPress={() => setSelectedDate(date)}
      >
        <Text className={`text-[16px] ${isToday ? "text-[#1a8e2d]" : "text-[#333]"}`}>
          {day}
        </Text>

        {dayDoses.length > 0 && (hasTaken || hasMissed) && (
          <View className="flex-row absolute items-center bottom-1 space-x-1">
            {hasTaken && <View className="w-1.5 h-1.5 rounded-full bg-green-500" />}
            {hasMissed && <View className="w-1.5 h-1.5 rounded-full bg-red-500" />}
          </View>
        )}
      </TouchableOpacity>
    );

    if ((firstDay + day) % 7 === 0 || day === days) {
      calendar.push(<View key={day} className='flex-row'>{week}</View>);
      week = [];
    }
  }
    return calendar;
  };

const renderMedicationsForDate = () => {
  const dateStr = selectedDate.toDateString();

  const dayDoses = doseHistory.filter(
    dose => new Date(dose.timestamp).toDateString() === dateStr
  );

  return medications.map(med => {
    const medDoses = dayDoses.filter(d => d.medicationId === med.id);

    if (medDoses.length === 0) return null;

    return (
      <View
        key={med.id}
        className="bg-white rounded-2xl p-3.5 mb-3 border border-[#e0e0e0]"
      >
        {/* Medicine Info */}
        <View className="flex-row items-center mb-2">
          <View
            className="w-3 h-10 rounded-md mr-3.5"
            style={{ backgroundColor: med.color }}
          />
          <View className="flex-1">
            <Text className="text-gray-800 font-semibold text-base">
              {med.name}
            </Text>
            <Text className="text-gray-600 text-sm">{med.dosage}</Text>
          </View>
        </View>

        {/* 🔥 Show EACH dose separately */}
        {medDoses.map((dose, idx) => (
          <View
            key={idx}
            className="flex-row items-center justify-between bg-gray-50 p-2.5 rounded-xl mb-2"
          >
            {/* Time */}
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text className="ml-2 text-[#333] text-[14px]">
                {dose.time}
              </Text>
            </View>

            {/* Status */}
            {dose.taken ? (
              <View className="flex-row items-center bg-[#E8F5E9] px-3 py-1 rounded-xl">
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color="#4CAF50"
                />
                <Text className="text-green-600 font-semibold text-[12px] ml-1">
                  Taken
                </Text>
              </View>
            ) : dose.status === "missed" ? (
              <View className="flex-row items-center bg-red-100 px-3 py-1 rounded-xl">
                <Ionicons
                  name="close-circle"
                  size={16}
                  color="#F44336"
                />
                <Text className="text-red-600 font-semibold text-[12px] ml-1">
                  Missed
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center bg-yellow-100 px-3 py-1 rounded-xl">
                <Ionicons
                  name="time-outline"
                  size={16}
                  color="#FF9800"
                />
                <Text className="text-yellow-700 font-semibold text-[12px] ml-1">
                  Pending
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
    );
  });
};

  return (
    <View className="flex-1 bg-gray-100">
      <LinearGradient colors={["#1a8e2d", "#146922"]} className="absolute top-0 left-0 right-0 h-[120px] ios:h-[140px]" start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
      <View className="flex-1 pt-[30px] ios:pt-[50px]">
        <View className="flex-row items-center px-5 pb-5 z-10">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white justify-center items-center shadow-md"
          >
            <Ionicons name="chevron-back" size={28} color="#1a8e2d" />
          </TouchableOpacity>
          <Text className="text-[28px] font-bold text-white ml-4">Calendar</Text>
        </View>

        <View className="bg-white rounded-2xl mx-5 p-4 shadow-md">
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity
              onPress={() =>
                setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))
              }
            >
              <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-800">
              {selectedDate.toLocaleString("default", { month: "long", year: "numeric" })}
            </Text>
            <TouchableOpacity
              onPress={() =>
                setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))
              }
            >
              <Ionicons name="chevron-forward" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View className="flex-row mb-2">
            {WEEKDAYS.map(day => <Text key={day} className="flex-1 text-center text-gray-500 font-medium">{day}</Text>)}
          </View>

          {renderCalendar()}
        </View>

        <View className="flex-1 bg-white mt-4 rounded-t-3xl p-5 shadow-md">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            {selectedDate.toLocaleDateString("default", { weekday: "long", month: "long", day: "numeric" })}
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderMedicationsForDate()}
          </ScrollView>
        </View>
      </View>
    </View>
  )
}

export default Calendar;