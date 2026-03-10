import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { theme } from '@/constants/theme'
import { hp } from '@/helpers/common'

const Input = (props:any) => {
  return (
    <View className='flex-row items-center justify-center rounded-xl gap-3 px-4' style={[props.containerStyles && props.containerStyles, 
    { height: hp(7.2), borderWidth: 0.4, borderColor: theme.colors.darkLight, borderCurve: 'continuous'}]}>
        { 
            props.icon && props.icon
        }
        <TextInput className='flex-1 outline-none' placeholderTextColor={theme.colors.textLight} ref={props.inputRef && props.inputRef} {...props} />
        { props.rightIcon && <View className="ml-2">{props.rightIcon}</View> }
    </View>
  )
}

export default Input