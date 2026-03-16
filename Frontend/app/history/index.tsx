import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMedicine } from '@/modules/auth/hooks/useMedicine';
import Toast from 'react-native-toast-message';

const History = () => {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [expandedMedIds, setExpandedMedIds] = useState<string[]>([]); // toggle open/close
  const { getMedicineHistory } = useMedicine();
  const colors = ["#4CAF50", "#FF9800", "#2196F3", "#9C27B0", "#E91E63", "#00BCD4"];

  const fetchHistory = async () => {
    const result = await getMedicineHistory();
    if (result?.meta?.requestStatus === "fulfilled") {
      setHistory(result?.payload.data);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: result?.payload || 'Failed to fetch data'
      });
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const toggleExpand = (medId: string) => {
    setExpandedMedIds(prev => prev.includes(medId) ? prev.filter(id => id !== medId) : [...prev, medId]);
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header Gradient */}
      <LinearGradient
        colors={["#1a8e2d", "#146922"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="absolute top-0 left-0 right-0 h-[120px] ios:h-[140px]"
      />

      <View className="flex-1 pt-[30px] ios:pt-[50px]">
        {/* Header */}
        <View className="flex-row items-center px-5 pb-5 z-10">
          <TouchableOpacity
            onPress={() => router.replace('/home')}
            className="w-10 h-10 rounded-full bg-white justify-center items-center shadow-md"
          >
            <Ionicons name="chevron-back" size={28} color="#1a8e2d" />
          </TouchableOpacity>
          <Text className="text-2xl font-extrabold text-white ml-4">History Log</Text>
        </View>

        {/* History List */}
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5 pt-10">
          {history.map((med, medIndex) => {
            const isExpanded = expandedMedIds.includes(med.medicineId);
            const color = colors[medIndex % colors.length];

            return (
              <View key={med.medicineId} className="mb-4 bg-white rounded-2xl p-4 shadow-md border border-gray-200">
                {/* Medicine Header */}
                <View className="flex-row items-center justify-between mb-2.5">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 rounded-3xl items-center justify-center mr-3.5" style={{ backgroundColor: color }}>
                      <Ionicons name='medical' size={24} color="#fff" />
                    </View>
                    <View>
                      <Text className="text-lg font-semibold text-[#333]">{med.name}</Text>
                      <Text className="text-[14px] text-[#666]">{med.dosage}</Text>
                      {med.notes ? <Text className="text-[12px] text-[#999] mt-1">{med.notes}</Text> : null}
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => toggleExpand(med.medicineId)}
                    className="p-2 rounded-full bg-gray-100"
                  >
                    <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="#333" />
                  </TouchableOpacity>
                </View>

                {/* Logs Section */}
                {isExpanded && med.logs.map((log: any) => (
                  <View key={log.logId} className="mb-3">
                    {log.doses.map((dose: any, idx: number) => (
                      <View key={idx} className="flex-row items-center justify-between mb-2.5 p-3 rounded-xl bg-gray-50">
                        <View>
                          <Text className="text-gray-600 text-sm font-semibold">{new Date(dose.date).toLocaleDateString()}</Text>
                          {dose.times.map((t: any, tIdx: number) => (
                            <View key={tIdx} className="flex-row items-center justify-between mt-1">
                              <Text className="text-[#333] text-[14px]">{t.time}</Text>
                              <View className={`flex-row items-center px-3 py-1 rounded-full ${t.taken ? 'bg-green-100' : (t.status === 'missed' ? 'bg-red-100' : 'bg-gray-100')}`}>
                                <Ionicons name={t.taken ? "checkmark-circle" : (t.status === 'missed' ? "close-circle" : "time-outline")} size={16} color={t.taken ? "#4CAF50" : (t.status === 'missed' ? "#F44336" : "#666")} />
                                <Text className={`ml-1 text-sm font-semibold ${t.taken ? "text-green-600" : (t.status === 'missed' ? "text-red-600" : "text-gray-600")}`}>
                                  {t.taken ? "Taken" : (t.status === 'missed' ? "Missed" : "Pending")}
                                </Text>
                              </View>
                            </View>
                          ))}
                        </View>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default History;