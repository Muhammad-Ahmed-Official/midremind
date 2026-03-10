import { Alert, Platform, Pressable, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons'
import { theme } from '@/constants/theme'
import { StatusBar } from 'expo-status-bar'
import BackButton from '@/components/BackButton'
import { hp, wp } from '@/helpers/common'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { router } from 'expo-router'

const SignupForm = () => {
  const nameRef = useRef<string>("");
  const emailRef = useRef<string>("");
  const passwordRef = useRef<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async() => {
    if(!nameRef || !emailRef.current || !passwordRef.current){
      if(Platform.OS === "web"){
        window.alert("Please fill all fields");
      } else {
        Alert.alert("Signup", "Please fill all fields");
      }
      return;
    }
    let name = nameRef.current.trim();
    let email = emailRef.current.trim();
    let passwoes = passwordRef.current.trim();

  }

  return (
    <ScreenWrapper className='bg-white'>
      <StatusBar style='dark' />
      <View className='flex-1 gap-11' style={{ paddingHorizontal: wp(5)}}> 
          <BackButton /> 
          <View>
            <Text style={{ fontSize: hp(4), color: theme.colors.text }} className='font-bold'>Let's</Text>
            <Text style={{ fontSize: hp(4), color: theme.colors.text }} className='font-bold'>Get Started</Text>
          </View>
          <View className='gap-5'>
            <Text className='font-semibold' style={{ fontSize: hp(1.7), color: theme.colors.text }}>Please fill the details to create an account</Text>
            <Input 
              icon={<SimpleLineIcons name="user" size={24} color="black" />}
              placeholder='Enter your name' onChangeText={(value:string)=> nameRef.current = value} 
            />
            <Input 
              icon={<MaterialCommunityIcons name="email-outline" size={24} color="black" />}
              placeholder='Enter your email' onChangeText={(value:string)=> emailRef.current = value} 
              />
            <Input 
              icon={<MaterialCommunityIcons name="lock-outline" size={24} color="black" />}
              placeholder='Enter your password' onChangeText={(value:string)=> passwordRef.current = value} 
              secureTextEntry={!showPassword}
              rightIcon={
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <MaterialCommunityIcons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#555" />
                </Pressable>
              }
            />
            <Button title={'Sign up'} loading={loading} onPress={onSubmit} />
        </View>
        <View className='flex-row justify-center gap-1 items-center'>
          <Text className='text-center' style={{ color: theme.colors.text, fontSize: hp(1.6)}}>Alredy have an account?</Text>
          <Pressable onPress={() => router.push("/(auth)/sign-in")}>
            <Text className='text-center font-semibold' style={{ color: theme.colors.primaryDark, fontSize: hp(1.6)}}>Sign in</Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default SignupForm

// import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'
// import React, { useState } from 'react'
// import { Feather, FontAwesome } from '@expo/vector-icons'
// import { Link } from 'expo-router'

// const SignupForm = () => {
//   const [showPassword, setShowPassword] = useState<boolean>(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

//   return (
//     <View className="flex-1" style={{ backgroundColor: '#2a1080' }}>
//       <ScrollView
//         contentContainerStyle={{ flexGrow: 1 }}
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//       >
//         {/* ── TOP SECTION: dark purple background with logo + title ── */}
//         <View className="px-6 pt-12 pb-10">
//           {/* CareMe brand */}
//           <View className="flex-row items-center mb-8">
//             <View
//               className="mr-2 h-7 w-7 items-center justify-center rounded-md"
//               style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
//             >
//               <Text className="text-white text-base font-bold">+</Text>
//             </View>
//             <Text className="text-white text-base font-semibold tracking-widest">
//               CareMe
//             </Text>
//           </View>

//           {/* Hero heading */}
//           <Text className="text-white text-4xl font-bold">
//             Create Account
//           </Text>
//           <Text className="text-white/60 text-sm mt-1">
//             Sign up to get started
//           </Text>
//         </View>

//         {/* ── BOTTOM SECTION: white card with form ── */}
//         <View className="rounded-t-3xl bg-white px-6 pt-8 pb-10">
//           {/* Username */}
//           <View className="mb-4">
//             <Text className="mb-1 text-xs font-medium text-slate-500">
//               Username
//             </Text>
//             <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
//               <TextInput
//                 className="flex-1 text-sm text-slate-800"
//                 placeholder="Your username"
//                 autoCapitalize="none"
//                 placeholderTextColor="#94A3B8"
//               />
//             </View>
//           </View>

//           {/* Email */}
//           <View className="mb-4">
//             <Text className="mb-1 text-xs font-medium text-slate-500">
//               Email Address
//             </Text>
//             <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
//               <TextInput
//                 className="flex-1 text-sm text-slate-800"
//                 placeholder="you@example.com"
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 autoComplete="email"
//                 placeholderTextColor="#94A3B8"
//               />
//             </View>
//           </View>

//           {/* Password */}
//           <View className="mb-4">
//             <Text className="mb-1 text-xs font-medium text-slate-500">
//               Password
//             </Text>
//             <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
//               <TextInput
//                 className="flex-1 text-sm text-slate-800"
//                 placeholder="Create a password"
//                 secureTextEntry={!showPassword}
//                 autoCapitalize="none"
//                 placeholderTextColor="#94A3B8"
//               />
//               <TouchableOpacity
//                 className="ml-2"
//                 onPress={() => setShowPassword(!showPassword)}
//               >
//                 <Feather
//                   name={showPassword ? 'eye-off' : 'eye'}
//                   size={18}
//                   color="#94A3B8"
//                 />
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Confirm Password */}
//           <View className="mb-6">
//             <Text className="mb-1 text-xs font-medium text-slate-500">
//               Confirm Password
//             </Text>
//             <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
//               <TextInput
//                 className="flex-1 text-sm text-slate-800"
//                 placeholder="Repeat your password"
//                 secureTextEntry={!showConfirmPassword}
//                 autoCapitalize="none"
//                 placeholderTextColor="#94A3B8"
//               />
//               <TouchableOpacity
//                 className="ml-2"
//                 onPress={() => setShowConfirmPassword(!showConfirmPassword)}
//               >
//                 <Feather
//                   name={showConfirmPassword ? 'eye-off' : 'eye'}
//                   size={18}
//                   color="#94A3B8"
//                 />
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Sign Up button */}
//           <TouchableOpacity
//             className="w-full items-center rounded-full py-4 mb-5"
//             style={{ backgroundColor: '#6c47ff' }}
//           >
//             <Text className="text-base font-semibold text-white tracking-wide">
//               Sign Up
//             </Text>
//           </TouchableOpacity>

//           {/* Divider */}
//           <View className="flex-row items-center mb-5">
//             <View className="h-px flex-1 bg-slate-200" />
//             <Text className="px-3 text-xs text-slate-400">or Sign up with</Text>
//             <View className="h-px flex-1 bg-slate-200" />
//           </View>

//           {/* Social buttons */}
//           <View className="flex-row items-center justify-center mb-6">
//             <TouchableOpacity className="mx-3 h-11 w-11 items-center justify-center rounded-full border border-slate-200">
//               <FontAwesome name="facebook" size={20} color="#1877F2" />
//             </TouchableOpacity>
//             <TouchableOpacity className="mx-3 h-11 w-11 items-center justify-center rounded-full border border-slate-200">
//               <Text className="text-base font-bold" style={{ color: '#EA4335' }}>G</Text>
//             </TouchableOpacity>
//             <TouchableOpacity className="mx-3 h-11 w-11 items-center justify-center rounded-full border border-slate-200">
//               <FontAwesome name="apple" size={20} color="#000000" />
//             </TouchableOpacity>
//           </View>

//           {/* Sign in link */}
//           <View className="flex-row justify-center">
//             <Text className="text-sm text-slate-500">
//               Already have an account?{' '}
//             </Text>
//             <Link href="/(auth)/sign-in" asChild>
//               <TouchableOpacity>
//                 <Text className="text-sm font-semibold" style={{ color: '#6c47ff' }}>
//                   Sign in
//                 </Text>
//               </TouchableOpacity>
//             </Link>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   )
// }

// export default SignupForm