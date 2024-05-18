import { Redirect, Stack } from "expo-router";

import React from "react";

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="goal"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="current-weight"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="goalweight"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="gender"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="dof"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="height"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ethnicity"
          options={{
            headerShown: false,
          }}
        />
		        <Stack.Screen
          name="results"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
};

export default AuthLayout;
