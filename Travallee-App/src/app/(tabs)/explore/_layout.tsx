import React from 'react';
import { Stack } from 'expo-router';

export default function ExploreLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
      initialRouteName="index"
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="detail" />
      <Stack.Screen name="search" />
      <Stack.Screen name="map" />
      <Stack.Screen name="filter-price" />
      <Stack.Screen name="filter-search" />
      <Stack.Screen name="filter-language" />
      <Stack.Screen name="select-date" />
      <Stack.Screen name="add-card" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="passcode" />
      <Stack.Screen name="success" />
    </Stack>
  );
}