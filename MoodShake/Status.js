import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import axios from 'axios';
import { render } from 'react-dom';


const moodOptions = {
    Pos: {
        iconName: "pos_icon.png",
        statusColor: '#0eef',
    },
    neg: {
        iconName: "neg_icon.png",
        statusColor: '#ff4000',
    }
}

export default class Status extends Component { //나중에 prop으로 상태들을 가져오자
    constructor(props){
        super(props);
        this.state ={
            title: null,
            score: null
        }
    }    

    componentDidMount(){
        fetch('http://192.168.0.12:8889/chat')
        .then(res => res.json())
        .then(data =>this.setState({score: data.data}));
    }

    render(){
        const {score} = this.state;
    return (
        <View style={styles.container}>
            <View style={styles.statusView}>
                <Image style={styles.logo} source={require('./assets/Home_image.png')} />
            </View>
            <View style={styles.statusView}>
                <Text>Your latest Mood Score is </Text>
            </View>
            <View style={styles.statusView}>
                <Text>
                    {score ? `${score}` : 'test'}
                </Text>
            </View> 
            <View style={styles.statusView}>

            </View>
        </View>
    );
    }

    // getMoodScore(){
    // let target = 'http://172.30.1.52:8889/chat';
    //     axios({
    //       url: target,
    //       method: 'get',
    //       data: {
    //         mood_score : total_Score.toFixed(2),  
    //       },
    //     })
    //     .then( response => {
    //       console.log(response)
    //     })
    //     .catch(err => console.log(err));
    // }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    statusView: {
        flex: 1,
    },
    icon: {

    }

});
