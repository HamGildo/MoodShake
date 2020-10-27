import * as React from 'react';
import { StyleSheet, Text, View, Image, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CustomButton from './CustomButton';



export default function Home({ navigation }) {

        return (
            <View style={styles.container}>
                <View style={styles.divide1}>
                    <Image style={styles.logo} source={require('./assets/Home_image.png')} />
                    <StatusBar barStyle="dark-content" hidden={true} />
                </View>
                <View style={styles.divide2}>
                <CustomButton
                        buttonColor={'#9DB570'}
                        title={'Profile'}
                        //onPress={() => navigation.navigate('Status')}
                        />
                    <CustomButton
                        buttonColor={'#9DB589'}
                        title={'My Status'}
                        onPress={() => navigation.navigate('Status')}
                        />
                    <CustomButton
                        buttonColor={'#5F805D'}
                        title={'Start Chat'}
                        onPress={() => navigation.navigate('Chatbot')}/> 
        
                    
                </View>
    
            </View>
        );
    
} 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    divide1: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center', 
        backgroundColor: '#FFFFFF',
        paddingBottom: 100
    },
    divide2: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding:15
    },

    logo: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    }
});
