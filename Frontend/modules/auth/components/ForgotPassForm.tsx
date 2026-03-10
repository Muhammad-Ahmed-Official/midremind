import { Alert, Platform, Pressable, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { StatusBar } from "expo-status-bar";
import BackButton from "@/components/BackButton";
import { hp, wp } from "@/helpers/common";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { router } from "expo-router";

const ForgotPassForm = () => {
  const emailRef = useRef<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async () => {
    if (!emailRef.current) {
      if (Platform.OS === "web") {
        window.alert("Please enter your email");
      } else {
        Alert.alert("Error", "Please enter your email");
      }
      return;
    }

    setLoading(true);

    // TODO: API call for reset password

    setLoading(false);

    if (Platform.OS === "web") {
      window.alert("Password reset link sent to your email");
    } else {
      Alert.alert("Success", "Password reset link sent to your email");
    }
  };

  return (
    <ScreenWrapper className="bg-white">
      <StatusBar style="dark" />

      <View className="flex-1 justify-center gap-10" style={{ paddingHorizontal: wp(6) }}>
        <BackButton />

        <View className="gap-3">
          <Text style={{ fontSize: hp(4), color: theme.colors.text }} className="font-bold" >
            Forgot Password
          </Text>

          <Text className="text-gray-500" style={{ fontSize: hp(1.8) }}>
            Enter your email address and we will send you a link to reset your password.
          </Text>
        </View>

        <View className="gap-6">
          <Input
            icon={ <MaterialCommunityIcons name="email-outline" size={24} color="black" /> }
            placeholder="Enter your email"
            onChangeText={(value: string) => (emailRef.current = value)}
          />

          <Button title="Send Reset Link" loading={loading} onPress={onSubmit} />
        </View>

        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-500">Remember your password? </Text>

          <Pressable onPress={() => router.push("/reset-pass")}>
            <Text style={{ color: theme.colors.primary }} className="font-semibold"> Login </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ForgotPassForm;