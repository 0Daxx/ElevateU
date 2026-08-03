import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link, Stack } from 'expo-router'

const login = () => {
  return (
    <View  style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>login</Text>
      {/* <Button onPress={Stack.} > Register </Button> */} 
      <Link href="/(auth)/register" style={{ color: 'blue' }}>
        Go to Register
      </Link> 
    </View>
  )
}

export default login

const styles = StyleSheet.create({})