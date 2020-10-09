import React, { Component } from 'react';
//import * as Notifications from 'expo-notifications';
//import * as Permissions from 'expo-permissions';
import { StyleSheet, Text, SafeAreaView, View, Image } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
//import axios from 'axios';
//import { render } from 'react-dom';
//import Constants from 'expo-constants';
//import {Notifications} from 'expo';



const moodOptions = {
    Pos: {
        statusIcon: require('./assets/pos_icon.png'),
        statusColor: '#0eef',
    },
    Neg: {
        statusIcon: require('./assets/neg_icon.png'),
        statusColor: '#ff4000',
    }
};

const bpmOptions = {
    Normal: {},
    Danger: {},
};

export default class Status extends Component { //나중에 prop으로 상태들을 가져오자
    constructor(props){
        super(props);
        this.state ={
            title: null,
            score: null,
            depression_score: null,
            heartrate: 80,
        };
        this.fitState = {
            items : [],
            isLoaded : false,
        }
    }    

    componentDidMount(){
        fetch('http://192.168.0.12:8889/chat')
        .then(res => res.json())
        .then(data =>this.setState({score: data.data}));

        fetch('http://192.168.0.12:8889/depression')
        .then(res => res.json())
        .then(data =>this.setState({depression_score: data.depression_score}));

        fetch('https://api.fitbit.com/1/user/-/activities.json',{
            method:'GET',
            headers:{
                'Authorization':'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMkJURksiLCJzdWIiOiI4VkQyM1AiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJ3aHIgd3BybyB3bnV0IHdzbGUgd3dlaSB3c29jIHdhY3Qgd3NldCB3bG9jIiwiZXhwIjoxNjAyMjg4Mjg3LCJpYXQiOjE2MDIyNTk0ODd9.CaDruPxpJPokX-lbWsWihnSq0HEYBqbJ8hOg-mAekmk'
                //Bearer 뒷부분 수정필요
            }
        }).then(res =>res.json())
        .then(json =>{
            this.setState({
                isLoaded : true,
                items:json,
            })
        });

        // let target = 'http://192.168.0.7:8889/token';
        // let token = registerForPushNotificationsAsync();
        // console.log(token);
        // console.log(typeof(token));
        // axios({
        //   url: target,
        //   method: 'post',
        //   headers: {
            // 'Content-Type': 'application/json',
        //   },
        //   data: {
            // expo_token : token,
        //   },
            // 
        // })
        // .then( response => {
        //   console.log(JSON.stringify(response))
        // })
        // .catch(err => console.log(err));
    }

    render(){
        const {score} = this.state;
        const {heartrate} = this.state;
        const {depression_score} = this.state;
        const moodStatus = (score >= 50) ? 'Pos' : 'Neg';   
        var {isLoaded,items}=this.state;
        if(!isLoaded){
            return <Text>Now Loading...</Text>;
        }else{
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.statusView}>
                    <View style={{flex: 1}}></View>
                    <View style={{flex: 8, justifyContent: 'center', flexDirection: 'row' }}>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <Image style={styles.icon} source={moodOptions[moodStatus].statusIcon} />
                        </View>
                        <View style={{flex: 2.3, justifyContent: 'center'}}>
                            <Text style={{fontSize:20,}}> {score} </Text>
                            <ProgressBar progress={(score * 0.01)} width={220} height={15} color={moodOptions[moodStatus].statusColor} />
                        </View>
                    </View>
                </View>

                <View style={styles.statusView}>
                    <View style={{flex: 1}}></View>
                        <View style={{flex: 8, justifyContent: 'center', flexDirection: 'row',}}>
                            <View style={{flex: 1, justifyContent: 'center'}}>
                                <Image style={styles.icon} source={require('./assets/stress.png')} />
                            </View>
                            <View style={{flex: 2.3, paddingTop:40 ,justifyContent: 'flex-start', flexDirection: 'row',}}>
                                <Text style={{fontSize:25}}>{depression_score}</Text>
                            </View>
                        </View>
                </View>

                <View style={styles.statusView}>
                    <View style={{flex: 1}}></View>
                    <View style={{flex: 8, justifyContent: 'center', flexDirection: 'row', }}>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <Image style={styles.icon} source={require('./assets/sneakers.png')} />
                        </View>
                        <View style={{flex: 2.3, justifyContent: 'center'}}>
                            <Text>Movement Status</Text>
                        </View>
                    </View>
                </View> 
                <View style={styles.statusView}>
                    <View style={{flex: 1}}></View>
                    <View style={{flex: 8, justifyContent: 'center', flexDirection: 'row', }}>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <Image style={styles.icon} source={require('./assets/heart.png')} />
                        </View>
                        <View style={{flex: 2.3, justifyContent: 'center'}}>
                            <Text style={{fontSize: 30}}> {items.best.total.distance.date} bpm</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.statusView}>
                    <View style={{flex: 1}}></View>
                        <View style={{flex: 8, justifyContent: 'center', flexDirection: 'row',}}>
                            <View style={{flex: 1, justifyContent: 'center'}}>
                                <Image style={styles.icon} source={require('./assets/thermometer.png')} />
                            </View>
                            <View style={{flex: 2.3, justifyContent: 'center'}}>
                                <Text style={{fontSize: 30}}> 36.5 °C</Text>
                            </View>
                        </View>
                    </View>
            </SafeAreaView>
        );}
    }


    

}

// async function registerForPushNotificationsAsync() {
    // let token;
    // if (Constants.isDevice) {
        // const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        // let finalStatus = existingStatus;
        // if (existingStatus !== 'granted') {
        //   const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        //   finalStatus = status;
        // }
        // if (finalStatus !== 'granted') {
        //   alert('Failed to get push token for push notification!');
        //   return;
        // }
        // token = (await Notifications.getExpoPushTokenAsync());
        // console.log(token);
        // console.log(typeof(token));
    //   } else {
        // alert('Must use physical device for Push Notifications');
    //   }
    // 
    //   if (Platform.OS === 'android') {
        // Notifications.createChannelAndroidAsync('default', {
        //   name: 'default',
        //   sound: true,
        //   priority: 'max',
        //   vibrate: [0, 250, 250, 250],
        // });
    //   }
//   
    // return token;
//   }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    statusView: {
        flex: 1,
        backgroundColor: '#FfffFF',
     //   justifyContent: 'center'
    },
    icon: {
        width: '100%',
        height: '60%',
        resizeMode: 'contain',
    },

});















