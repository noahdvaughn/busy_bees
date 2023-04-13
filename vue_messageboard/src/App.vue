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
        <div v-if="message.email === state.currentUser.email">
          <div class="message-inner"> {{ message.content }}</div>
          <div class="username"> - {{ message.email }}</div>

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
      currentUser: {},
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
        content: inputMessage.value
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
.instruction{
  color: white;
  background-color: $yellow;
  border-radius: 20px;
  border: 2px solid white;
  padding: 10px;
}


</style>
