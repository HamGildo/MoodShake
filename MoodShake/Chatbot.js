import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { Dialogflow_V2 } from 'react-native-dialogflow';
import { dialogflowConfig } from './env';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import axios from 'axios';

const BOT_USER = {
  _id: 2,
  name: 'FAQ Bot',
  avatar: require('./assets/MoodShake_logo.png')
};

const MOOD_SCORE = {
  Pos_score: 0,
  updatePos : 0,
  Neg_score: 0,
  updateNeg : 0,
};

const DEPRESSION_SCORE = {
  Score: 0,
};

//Mood 계산용 Map
// const mood_map = [
  // {
    // mood_id: 0,
    // mood_name: '놀라워',
    // mood_value: 0,
    // isPos: true,
    // willUpdate: 0
  // },
  // {
    // mood_id: 1,
    // mood_name: '활기차',
    // mood_value: 0,
    // isPos: true,
    // willUpdate: 0
  // },
  // {
    // mood_id: 2,
    // mood_name: '마음에 들어',
    // mood_value: 0,
    // isPos: true,
    // willUpdate: 0
  // },
  // {
    // mood_id: 3,
    // mood_name: '자랑스러워',
    // mood_value: 0,
    // isPos: true,
    // willUpdate: 0
  // },
  // {
    // mood_id: 4,
    // mood_name: '열의가 생겨',
    // mood_value: 0,
    // isPos: true,
    // willUpdate: 0
  // },
  // {
    // mood_id: 5,
    // mood_name: '신나',
    // mood_value: 0,
    // isPos: true,
    // willUpdate: 0
  // },
  // {
    // mood_id: 6,
    // mood_name: '흥미로워',
    // mood_value: 0,
    // isPos: true,
    // willUpdate: 0
  // },
  // {
    // mood_id: 7,
    // mood_name: '긴장돼',
    // mood_value: 0,
    // isPos: false,
    // willUpdate: 0
  // },
  // {
    // mood_id: 8,
    // mood_name: '부끄러워',
    // mood_value: 0,
    // isPos: false,
    // willUpdate: 0
  // },
  // {
    // mood_id: 9,
    // mood_name: '예민해',
    // mood_value: 0,
    // isPos: false,
    // willUpdate: 0
  // },
  // {
    // mood_id: 10,
    // mood_name: '짜증나',
    // mood_value: 0,
    // isPos: false,
    // willUpdate: 0
  // },
  // {
    // mood_id: 11,
    // mood_name: '두려워',
    // mood_value: 0,
    // isPos: false,
    // willUpdate: 0
  // },
  // {
    // mood_id: 12,
    // mood_name: '죄책감 들어',
    // mood_value: 0,
    // isPos: false,
    // willUpdate: 0
  // },
  // {
    // mood_id: 13,
    // mood_name: '속상해',
    // mood_value: 0,
    // isPos: false,
    // willUpdate: 0
  // },
  // {
    // mood_id: 14,
    // mood_name: '괴로워',
    // mood_value: 0,
    // isPos: false,
    // willUpdate: 0
  // },
// ]; 



export default class Chatbot extends Component {
  state = {
    messages: [
      {
        _id: 1,
        text: '무드쉐이크 챗봇에 온 것을 환영해!',
        createdAt: new Date(),
        user: BOT_USER
      }
    ]
  };

  componentDidMount() {
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id
    );
  }

  handleGoogleResponse(result) {
    let text = null;
    let intent_name;
    
    let moodScore = this.handleMoodScore(result);
    let depressionScore = this.handleDepressionScore(result);

    if ('platform' in result.queryResult.fulfillmentMessages[0]) {
      // console.log("if문 들어감");
      // console.log(result.queryResult.fulfillmentMessages[0].simpleResponses);
      // console.log(result.queryResult.fulfillmentMessages[1].suggestions.suggestions);
      // text = result.queryResult.fulfillmentMessages[0].simpleResponses.simpleResponses[0].textToSpeech;
      
    } else {
      console.log(result.queryResult.fulfillmentMessages);
      // text = result.queryResult.fulfillmentMessages[0].text.text[0];
      text = result.queryResult.fulfillmentMessages.map(txt => txt.text.text[0]);
      intent_name = result.queryResult.intent.displayName;
      if(intent_name == 'sum_mood_point'){
        text.push('너의 점수는... '+ String(moodScore.toFixed(2)));
      }
      if(intent_name == 'sum_depression_point'){
        text.push('너의 점수는... '+ String(depressionScore));
      }
      console.log(text);
    }
    
    this.sendBotResponse(text);
  }

  onSend(messages = []) {
    console.log('on send');
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));

    let message = messages[0].text;
    Dialogflow_V2.requestQuery(
      message,
      result => {
        this.handleGoogleResponse(result)
      },
      error => console.log(error)
    );
  }

  sendBotResponse(text) {

    for(let i in text) {
      let msg = {
        _id: this.state.messages.length + 1,
        text: text[i],
        createdAt: new Date(),
        user: BOT_USER
      };
  
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, [msg])
      }));
    }
      
  }

  handleDepressionScore(result){
    let intent_name = result.queryResult.intent.displayName;
    let queryText = result.queryResult.queryText;
    let total_Score = DEPRESSION_SCORE.Score;

    switch(intent_name){
      case 'check_depression_1/10':
        DEPRESSION_SCORE.Score = 0;
        break;
      case 'check_depression_2/10':
        if(queryText == '전혀')
          DEPRESSION_SCORE.Score = total_Score+0;
        else if(queryText == '며칠정도')
          DEPRESSION_SCORE.Score = total_Score+1;
        else if(queryText == '7일 이상')
          DEPRESSION_SCORE.Score = total_Score+2;
        else if(queryText == '거의 매일')
          DEPRESSION_SCORE.Score = total_Score+3;
        console.log(DEPRESSION_SCORE.Score);        
        break;

      case 'check_depression_3/10':
        if(queryText == '전혀')
          DEPRESSION_SCORE.Score = total_Score+0;
        else if(queryText == '며칠정도')
          DEPRESSION_SCORE.Score = total_Score+1;
        else if(queryText == '7일 이상')
          DEPRESSION_SCORE.Score = total_Score+2;
        else if(queryText == '거의 매일')
          DEPRESSION_SCORE.Score = total_Score+3;
        console.log(DEPRESSION_SCORE.Score);        
        break;
      
      case 'check_depression_4/10':
        if(queryText == '전혀')
          DEPRESSION_SCORE.Score = total_Score+0;
        else if(queryText == '며칠정도')
          DEPRESSION_SCORE.Score = total_Score+1;
        else if(queryText == '7일 이상')
          DEPRESSION_SCORE.Score = total_Score+2;
        else if(queryText == '거의 매일')
          DEPRESSION_SCORE.Score = total_Score+3;
        console.log(DEPRESSION_SCORE.Score);     
        break;  
      
      case 'check_depression_5/10':
        if(queryText == '전혀')
          DEPRESSION_SCORE.Score = total_Score+0;
        else if(queryText == '며칠정도')
          DEPRESSION_SCORE.Score = total_Score+1;
        else if(queryText == '7일 이상')
          DEPRESSION_SCORE.Score = total_Score+2;
        else if(queryText == '거의 매일')
          DEPRESSION_SCORE.Score = total_Score+3;
        console.log(DEPRESSION_SCORE.Score);        
        break;
        
      case 'check_depression_6/10':
        if(queryText == '전혀')
          DEPRESSION_SCORE.Score = total_Score+0;
        else if(queryText == '며칠정도')
          DEPRESSION_SCORE.Score = total_Score+1;
        else if(queryText == '7일 이상')
          DEPRESSION_SCORE.Score = total_Score+2;
        else if(queryText == '거의 매일')
          DEPRESSION_SCORE.Score = total_Score+3;
        console.log(DEPRESSION_SCORE.Score);        
        break;
      
      case 'check_depression_7/10':
        if(queryText == '전혀')
          DEPRESSION_SCORE.Score = total_Score+0;
        else if(queryText == '며칠정도')
          DEPRESSION_SCORE.Score = total_Score+1;
        else if(queryText == '7일 이상')
          DEPRESSION_SCORE.Score = total_Score+2;
        else if(queryText == '거의 매일')
          DEPRESSION_SCORE.Score = total_Score+3;
        console.log(DEPRESSION_SCORE.Score);     
        break;  

      case 'check_depression_8/10':
        if(queryText == '전혀')
          DEPRESSION_SCORE.Score = total_Score+0;
        else if(queryText == '며칠정도')
          DEPRESSION_SCORE.Score = total_Score+1;
        else if(queryText == '7일 이상')
          DEPRESSION_SCORE.Score = total_Score+2;
        else if(queryText == '거의 매일')
          DEPRESSION_SCORE.Score = total_Score+3;
        console.log(DEPRESSION_SCORE.Score);     
        break;

      case 'check_depression_9/10':
        if(queryText == '전혀')
          DEPRESSION_SCORE.Score = total_Score+0;
        else if(queryText == '며칠정도')
          DEPRESSION_SCORE.Score = total_Score+1;
        else if(queryText == '7일 이상')
          DEPRESSION_SCORE.Score = total_Score+2;
        else if(queryText == '거의 매일')
          DEPRESSION_SCORE.Score = total_Score+3;
        console.log(DEPRESSION_SCORE.Score);     
        break;
      
      case 'check_depression_10/10':
        if(queryText == '전혀')
          DEPRESSION_SCORE.Score = total_Score+0;
        else if(queryText == '며칠정도')
          DEPRESSION_SCORE.Score = total_Score+1;
        else if(queryText == '7일 이상')
          DEPRESSION_SCORE.Score = total_Score+2;
        else if(queryText == '거의 매일')
          DEPRESSION_SCORE.Score = total_Score+3;
        console.log(DEPRESSION_SCORE.Score);     
        break;  
      
      case 'sum_depression_point':
        if(queryText == '전혀')
          DEPRESSION_SCORE.Score = total_Score+0;
        else if(queryText == '약간')
          DEPRESSION_SCORE.Score = total_Score+1;
        else if(queryText == '많이')
          DEPRESSION_SCORE.Score = total_Score+2;
        else if(queryText == '매우 많이')
          DEPRESSION_SCORE.Score = total_Score+3;
        console.log(DEPRESSION_SCORE.Score);
        
        let target = 'http://192.168.0.12:8889/depression';
        axios({
          url: target,
          method: 'post',
          data: {
            depression_score : total_Score.toFixed(2),  
          },
        })
        .then( response => {
          console.log(response)
        })
        .catch(err => console.log(err));
        break;
        
      default: return -1;  
    }

    return DEPRESSION_SCORE.Score;
  }

  handleMoodScore(result){
    let intent_name = result.queryResult.intent.displayName;
    let parameter = result.queryResult.parameters;
    let total_Score = 0;
    switch(intent_name){
      case 'check_Pos_or_Neg_PANAS':
        console.log(MOOD_SCORE);
        break;

      case 'check_Neg_PANAS - custom':
        MOOD_SCORE.updateNeg = 1;
        console.log(MOOD_SCORE);
        break;
      
      case 'check_Pos_PANAS - custom':
        MOOD_SCORE.updatePos = 1;
        console.log(MOOD_SCORE);
        break;  

      case 'check_another_PANAS':
        if(MOOD_SCORE.updateNeg == 1){
          let negScore = MOOD_SCORE.Neg_score; 
          if(parameter.degree_PANAS == '아주 많이')
            MOOD_SCORE.Neg_score = negScore + 5;
          else if(parameter.degree_PANAS == '많이')
            MOOD_SCORE.Neg_score = negScore + 4;
          else if(parameter.degree_PANAS == '그냥 보통')
            MOOD_SCORE.Neg_score = negScore + 3;
          else if(parameter.degree_PANAS == '조금')
            MOOD_SCORE.Neg_score = negScore + 2;
          else if(parameter.degree_PANAS == '아주 조금')
            MOOD_SCORE.Neg_score = negScore + 1;
          
          MOOD_SCORE.updateNeg = 0;  
          console.log(MOOD_SCORE);
        }
        else if(MOOD_SCORE.updatePos == 1){
          let posScore = MOOD_SCORE.Pos_score;
          if(parameter.degree_PANAS == '아주 많이')
            MOOD_SCORE.Pos_score = posScore + 5;
          else if(parameter.degree_PANAS == '많이')
            MOOD_SCORE.Pos_score = posScore + 4;
          else if(parameter.degree_PANAS == '그냥 보통')
            MOOD_SCORE.Pos_score = posScore + 3;
          else if(parameter.degree_PANAS == '조금')
            MOOD_SCORE.Pos_score = posScore + 2;
          else if(parameter.degree_PANAS == '아주 조금')
            MOOD_SCORE.Pos_score = posScore + 1;

          MOOD_SCORE.updatePos = 0;  
          console.log(MOOD_SCORE);
        }
        break;
        
      case 'sum_mood_point': 
        let pos = (MOOD_SCORE.Pos_score / 35) * 50;
        let neg = (MOOD_SCORE.Neg_score / 40) * 50;
        total_Score = 50 + pos - neg;
        console.log(total_Score);
        console.log(MOOD_SCORE);

        MOOD_SCORE.Pos_score = 0;
        MOOD_SCORE.Neg_score = 0;

        //서버에 보내기
        let target = 'http://192.168.0.12:8889/chat';
        axios({
          url: target,
          method: 'post',
          data: {
            mood_score : total_Score.toFixed(2),  
          },
        })
        .then( response => {
          console.log(response)
        })
        .catch(err => console.log(err));
        //
        break;
      
      default : return -1;  
    }

    return total_Score;
  }

  renderBubble(props){
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: '#FFFFFF',
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: '#FFFFFF',
          },
          right: {
            backgroundColor: '#5F805D',
          }
        }}
      />
    );
  }


  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#EBEED5', }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          renderBubble={props => this.renderBubble(props)}
          user={{
            _id: 1
          }}
        />
        <StatusBar
          barStyle="dark-content"
          hidden={true}
        />
      </View>
    
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
