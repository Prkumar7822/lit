// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import Ui from './src/screens/Ui';  // Import your actual Home screen
// import ProfileScreen from './src/screens/Profile';
// import actual from './src/screens/actual';
// import prac from './src/screens/prac';  
// import HomeScreen from "./src/screens/Homescreen";
// import Main from "./src/screens/Main";
// // Define your StackParamList
// export type StackParamList = {
//   Home: undefined; // Home screen without parameters
//   ProfileScreen: undefined; // Profile screen without parameters
// };

// // Create the stack navigator with the type
// const Stack = createStackNavigator<StackParamList>();

// function App(): React.JSX.Element {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Home">
//         {/* Home screen should be the Ui component */}
//         <Stack.Screen name="Home" component={Main} options={{ headerShown: false }} />
//         <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// export default App;


// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import LoginPage from './src/screens/Login';
// import VerifyOtpPage from './src/screens/verifyOtpPage';

// type RootStackParamList = {
//   LoginPage: undefined;
//   VerifyOtpPage: { mobileNumber: string };
// };

// const Stack = createStackNavigator<RootStackParamList>();

// const App = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="LoginPage">
//         <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
//         <Stack.Screen name="VerifyOtpPage" component={VerifyOtpPage} options={{ headerShown: false }} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;



// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { AuthProvider } from './src/context/AuthContext';
// import LoginPage from './src/screens/LoginPage';
// import VerifyOtpPage from './src/screens/verifyOtpPage';
// // import HomePage from './src/screens/HomePage';
// import actual from './src/screens/actual';

// // import { LogBox } from 'react-native';
// // LogBox.ignoreLogs([
// //   'Support for defaultProps will be removed from function components',
// // ]);

// type RootStackParamList = {
//   LoginPage: undefined;
//   VerifyOtpPage: { mobileNumber: string };
//   actual: undefined;
//   Home: undefined; // Home screen without parameters
//   ProfileScreen: undefined; // Profile screen without parameters
// };

// const Stack = createStackNavigator<RootStackParamList>();

// const App = () => {
//   return (
//     <AuthProvider>
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName="LoginPage">
//           <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
//           <Stack.Screen name="VerifyOtpPage" component={VerifyOtpPage} options={{ headerShown: false }} />
//           <Stack.Screen name="actual" component={actual} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </AuthProvider>
//   );
// };

// export default App;


import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginPage from "./src/screens/LoginPage"; // Your Login Page component
import VerifyOtpPage from "./src/screens/verifyOtpPage"; // Your Verify OTP component
import actual from "./src/screens/actual"; // Your Actual Page component
import ProfileScreen from "./src/screens/Profile"; // Your Profile component
import Main from "./src/screens/Main"; // Your Main component

// Define your StackParamList
export type StackParamList = {
  LoginPage: undefined; // Login Page doesn't require any parameters
  VerifyOtpPage: { mobileNumber: string }; // Verify OTP Page requires mobileNumber
  Home: undefined; // Actual Page doesn't require any parameters
  ProfileScreen: undefined; // Profile Screen doesn't require any parameters
};

// Create the stack navigator with the type
const Stack = createStackNavigator<StackParamList>();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Login Page */}
        <Stack.Screen 
          name="LoginPage" 
          component={LoginPage} 
          options={{ headerShown: false }} 
        />
        
        {/* Verify OTP Page */}
        <Stack.Screen 
          name="VerifyOtpPage" 
          component={VerifyOtpPage} 
          options={{
            title: 'Verify OTP',
            headerStyle: { backgroundColor: '#000' },
            headerTintColor: '#fff',
          }} 
        />
        
        {/* Actual Page */}
        <Stack.Screen 
          name="Home" 
          component={actual} 
          options={{
           headerShown: false
          }} 
        />
        
        {/* Profile Screen */}
        <Stack.Screen 
          name="ProfileScreen" 
          component={ProfileScreen} 
          options={{
            title: 'Profile',
            headerStyle: { backgroundColor: '#000' },
            headerTintColor: '#fff',
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;


