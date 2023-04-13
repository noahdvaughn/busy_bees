<template>
<header>
  <div v-if=" state.currentUser === null || state.currentUser.email === undefined ">
  <h1 class="headerText">DoTheThing</h1>
  </div>
  <div v-else>
    <h1>Welcome {{ state.currentUser.given_name }} {{ state.currentUser.family_name }}</h1>
      <button class="logout" @click="Logout">Logout</button>
    <!-- <googleLogout :callback="callback"/> -->

  </div>

</header>

  <div v-if="state.currentUser === null ||state.currentUser.email === undefined  " class="view">
    <div class="login">
      <h3 class="instruction">Sign in, you busy bee</h3>
      <GoogleLogin :callback="callback"/>
    </div>
  </div>

  <div v-else class="view">

    <section class="chat-box">
      <div v-for="message in state.messages" :key="message.key">
        <div v-if="message.email === state.currentUser.email" class="taskRow">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Eo_circle_green_checkmark.svg/1024px-Eo_circle_green_checkmark.svg.png?20200417132424" class="check"/>
          
          <div class="task">
            <p class="content"> {{ message.content }}</p>
          </div>
          
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Eo_circle_red_letter-x.svg/2048px-Eo_circle_red_letter-x.svg.png" class="check"/>
          
        </div>
      </div>
    </section>

    <footer>
      <form @submit.prevent="SendMessage">
        <input type="text" placeholder="Write a message" v-model="inputMessage"/>
        <input type="submit" value="Send"/>
      </form>
    </footer>
  </div>
</template>

<script>
import db from './db'
import {reactive, onMounted, ref, inject} from 'vue'
import { decodeCredential, googleLogout } from 'vue3-google-login'

export default {
  setup () {
    const callback = (response) => {
      console.log("handle the response", response)
      state.currentUser = decodeCredential(response.credential)
    }
    const inputMessage = ref("")
    
    const state = reactive({
      currentUser: {
        email: 'noahdvaughn@gmail.com'
      },
      messages: []
    })

    const Logout = () => {
      state.currentUser = null
      // googleLogout()
    }
    
    const SendMessage = () => {
      const messagesRef = db.database().ref("messages");
      if (inputMessage.value === '' || inputMessage.value === null){
          return;
      }
      const message = {
        email: state.currentUser.email,
        content: inputMessage.value,
        completed: false
      }
      messagesRef.push(message)
      inputMessage.value = ""
    }

      onMounted(()=>{
      const messagesRef = db.database().ref("messages");
      
      
      messagesRef.on('value', snapshot => {
        // console.log(state.messages)
        const data = snapshot.val()
        let messages = []

        Object.keys(data).forEach(key => {
          messages.push({
            id: key,
            email: data[key].email,
            content: data[key].content
          })
        })
        state.messages = messages
      })
      })
    return{
      state,
      inputMessage,
      SendMessage,
      Logout,
      callback
    }
  }
}
</script>

<style lang="scss">
@import './colors.scss';
@import url('https://fonts.googleapis.com/css2?family=Patua+One&display=swap');

body {
 margin: 0;
 padding: 0;
 font-family: Patua One;
 background-image: url('https://i.etsystatic.com/5247433/r/il/301540/1823642970/il_1588xN.1823642970_6c3g.jpg');
 background-size: 240%;
 background-position: center;
}
header{
  background-color: $yellow;
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
h1{
  color: white;
}
.loginForm{
  text-align: center;
}
.view{
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.login{
  text-align: center;
}
.instruction, .task{
  color: white;
  background-color: $yellow;
  border-radius: 20px;
  border: 2px solid white;
  padding: 10px;
 
}
.task{
  // border: 2px solid black;
  margin: 10px;
  // display: flex;
  // justify-content: space-between;
  // align-items: center;
}
.taskRow{
  display: flex;
  justify-content: space-evenly;
  align-items: center;

}
.chat-box{
  background-color: rgb(255, 198, 41, 0.5);
  border-radius: 20px;
  margin-bottom: 10px;
  width: 70vw;

}
.check{
  max-width: 30px;
}
.content{
  display: flex;
  flex-direction: column;
  overflow-wrap: break-word;

  width: 40vw;
}


</style>
