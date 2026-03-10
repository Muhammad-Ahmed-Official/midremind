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

const ResetPassForm = () => {
  const codeRef = useRef<string>("");
  const passwordRef = useRef<string>("");
  const confirmPasswordRef = useRef<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async () => {
    if (!codeRef.current || !passwordRef.current || !confirmPasswordRef.current) {
      if (Platform.OS === "web") {
        window.alert("Please fill all fields");
      } else {
        Alert.alert("Error", "Please fill all fields");
      }
      return;
    }

    if (passwordRef.current !== confirmPasswordRef.current) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);

    // TODO: Verify code and update password API

    setLoading(false);

    Alert.alert("Success", "Password updated successfully");

    router.replace("/(auth)/sign-in");
  };

  return (
    <ScreenWrapper className="bg-white">
      <StatusBar style="dark" />

      <View className="flex-1 justify-center gap-10" style={{ paddingHorizontal: wp(6) }}>
        <BackButton />

        <View className="items-center">
          <MaterialCommunityIcons name="lock-reset" size={hp(8)} color={theme.colors.primary} />
        </View>

        <View className="gap-3">
          <Text style={{ fontSize: hp(4), color: theme.colors.text }} className="font-bold text-center" >
            Reset Password
          </Text>

          <Text className="text-gray-500 text-center" style={{ fontSize: hp(1.8) }} >
            Enter the verification code sent to your email and create a new password.
          </Text>
        </View>

        {/* Form */}
        <View className="gap-5">

            <Input
                icon={ <MaterialCommunityIcons name="shield-key-outline" size={22} color="black" /> }
                placeholder="Enter verification code"
                onChangeText={(value: string) => (codeRef.current = value)}
            />

            <Input icon={ <MaterialCommunityIcons name="lock-outline" size={22} color="black" /> }
                placeholder="New password"
                secureTextEntry={!showPassword}
                rightIcon={
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                        <MaterialCommunityIcons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#555" />
                    </Pressable>
                }
                onChangeText={(value: string) => (passwordRef.current = value)}
            />

            <Input
                icon={ <MaterialCommunityIcons name="lock-check-outline" size={22} color="black" /> }
                placeholder="Confirm password"
                secureTextEntry={!showConfirmPassword}
                rightIcon={
                    <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <MaterialCommunityIcons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#555" />
                    </Pressable>
            }
            onChangeText= { (value: string) =>(confirmPasswordRef.current = value) }
            />

          <Button title="Update Password" loading={loading} onPress={onSubmit} />
        </View>

      </View>
    </ScreenWrapper>
  );
};

export default ResetPassForm;