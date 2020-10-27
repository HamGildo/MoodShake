import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import Home from './Home';
import Chatbot from './Chatbot';
import Status from './Status';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={ {headerShown: false} } />
        <Stack.Screen name="Chatbot" component={Chatbot}
        options=
        {{headerStyle: {
          backgroundColor: '#BED297',
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center'
        },
        }}
        /> 
        <Stack.Screen name="Status" component={Status}
        options=
        {{headerStyle: {
          backgroundColor: '#BED297',
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center'
        },
        }}
        />
    
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  Header_container: {
    backgroundColor: '#FFFFFF'
  },
});
