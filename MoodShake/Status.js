import React, { Component } from 'react';
//import * as Notifications from 'expo-notifications';
//import * as Permissions from 'expo-permissions';
import { StyleSheet, Text, Button, SafeAreaView, View, Image,Alert } from 'react-native';
import Iframe from "react-native-youtube-iframe";
import ProgressBar from 'react-native-progress/Bar';
import { TextInput } from 'react-native';
import axios from 'axios';
//import { render } from 'react-dom';
//import Constants from 'expo-constants';
//import {Notifications} from 'expo';

const fitbit_token = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMkJURksiLCJzdWIiOiI4VkQyM1AiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJ3aHIgd251dCB3cHJvIHdzbGUgd3dlaSB3c29jIHdzZXQgd2FjdCB3bG9jIiwiZXhwIjoxNjAzOTgyMzQ0LCJpYXQiOjE2MDM5NTM1NDR9.gl_zUPHJItqDvwp59KW9-X9UkkYU_-yl3wPTs0I5pI8'

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
const temp="";

function Users(){
    
    }

export default class Status extends Component { //나중에 prop으로 상태들을 가져오자
    constructor(props){
        super(props);
        this.state ={
            title: null,
            score: null,
            depression_score: null,
            songTitle: "",
            songId:"dzesepwhtqo",
        };
        this.stepState = {
            steps : [],
            isLoaded : false,
        };
        this.heartState = {
            bpm : [],
            isLoaded2 : false,
        };
        this.youtubeState = {
            youtube : [],
            isLoaded3 : false,
        };
    }    

    checkNull = () => {
        if(this.state.songTitle == ""){
            Alert.alert("검색어를 입력해주세요.");
        }else{
            this.getVideoId();
        }
    };

    changeText = (e) => {
        this.setState({songTitle:e});
    };

    getVideoId = async () => {
        axios.get('https://www.googleapis.com/youtube/v3/search?key=AIzaSyBcRb0seNUW7Jy2Urb6wxeeZeL0fEqmYTs', { //https://api.androidhive.info/contacts/
            params: {
                q: this.state.songTitle,
                type: 'video',
            }
        }).then(response => {
            this.setState({
                youtube: response.data,
                songId: response.data["items"][0].id.videoId
            });
        });
    };

    componentDidMount(){
        fetch('http://192.168.0.12:8889/chat')
        .then(res => res.json())
        .then(data =>this.setState({score: data.data}));

        fetch('http://192.168.0.12:8889/depression')
        .then(res => res.json())
        .then(data =>this.setState({depression_score: data.depression_score}));


        fetch('https://api.fitbit.com/1/user/-/activities/steps/date/today/today.json',{   //걸음수 요청 api
            method:'GET',
            headers:{
                'Authorization': fitbit_token
                //Bearer 뒷부분 수정필요
            }
        }).then(res =>res.json())
        .then(json =>{
            this.setState({
                isLoaded : true,
                steps:json,
            })
        });

        fetch('https://api.fitbit.com/1/user/-/activities/heart/date/today/today/1min.json',{  //심박수 요청 api
            method:'GET',
            headers:{
                'Authorization': fitbit_token
                //Bearer 뒷부분 수정필요
            }
        }).then(res =>res.json())
        .then(json =>{
            this.setState({
                isLoaded2 : true,
                bpm:json,
            })
        });
    }

    render(){
        const {score} = this.state;
        const {depression_score} = this.state;
        const moodStatus = (score >= 50) ? 'Pos' : 'Neg';   
        var {isLoaded,steps}=this.state;
        var {isLoaded2,bpm}=this.state;
        var {isLoaded3, youtube} = this.state;
        if(!(isLoaded&&isLoaded2)){
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
                            <Text style={{fontSize: 30}}>{steps["activities-steps"][0].value}걸음</Text>
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
                            { <Text style={{fontSize: 30}}> {bpm["activities-heart-intraday"]["dataset"]["dataset".length - 1].value} bpm</Text>}
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
                                <Text style={{fontSize: 30}}> 36</Text>
                            </View>
                    </View>
                </View>
                <View >
                    <View>
                        <TextInput
                            style={styles.searchBar}
                            underlineColorAndroid="transparent"
                            value={this.state.songTitle}
                            placeholder="노래 제목"
                            placeholderTextColor="#9DB789"
                            onChangeText={this.changeText}
                        />
                        <Button title="검색" onPress={() => this.checkNull()} color="#9DB589" />
                    </View>
                    <Iframe
                        height={200}
                        play={false}
                        videoId={this.state.songId}
                        //onChangeState={onStateChange}
                    />
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
    searchBar: {
        margin: 15,
        padding:10,
        height: 40,
        width: 270,
        borderColor: "#9DB589",
        borderWidth: 1
    },
    searchButton: {
        width:100
    }

});















