<template>
<header>
  <div v-if="state.currentUser.email === undefined || state.currentUser === null"></div>
  <div v-else>
    <h1>Welcome {{ state.currentUser.given_name }} {{ state.currentUser.family_name }}</h1>
      <button class="logout" @click="Logout">Logout</button>
    <googleLogout :callback="callback"/>

  </div>

</header>

  <div v-if="state.currentUser.email === undefined  || state.currentUser === null" class="view login">
    <form @submit.prevent="Login" class="loginForm">
      <h1>Pick your username</h1>
      <label for="username"></label>
      <input type="text" v-model="inputUsername" placeholder="enter username">
      <input type="submit" value="Login">
    </form>

    <GoogleLogin :callback="callback"/>
  </div>

  <div v-else class="view">
    <section class="chat-box">
      <div v-for="message in state.messages" :key="message.key" :class="(message.username == state.username ? 'message current' : 'message')">
      <div class="message-inner"> {{ message.content }}</div>
      <div class="username"> - {{ message.username }}</div>
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
    
    
    
    const inputUsername = ref("")
    const inputMessage = ref("")
    
    const state = reactive({
      currentUser: {},
      messages: []
    })

    const Logout = () => {
      state.currentUser = null
      googleLogout()
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
      inputUsername,
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

body, h1 {
 margin: 0;
 padding: 0;
}
header{
  background-color: grey;
  height: 10vh;
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
  
  &.login{
   }
}


</style>
