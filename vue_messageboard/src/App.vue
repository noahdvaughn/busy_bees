<template>
<header>
  <div v-if="state.username === '' || state.username === null"></div>
  <div v-else>
    <h1>Welcome, {{ state.username }}</h1>
      <button class="logout" @click="Logout">Logout</button>
  </div>

</header>

  <div v-if="state.username === '' || state.username === null" class="view login">
    <form @submit.prevent="Login" class="loginForm">
      <h1>Pick your username</h1>
      <label for="username"></label>
      <input type="text" v-model="inputUsername" placeholder="enter username">
      <input type="submit" value="Login">
    </form>

    <h1>Is initialized: {{ Vue3GoogleOauth.isInit }}</h1>
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

export default {
  setup () {
    const Vue3GoogleOauth = inject('Vue3GoogleOauth');
    






    const inputUsername = ref("")
    const inputMessage = ref("")

    const state = reactive({
      username: "",
      messages: []
    })

    const Login = () => {
      if (inputUsername.value !='' || inputUsername.value != null){
        state.username = inputUsername.value
        inputUsername.value = ""
      }
    }

    const Logout = () => {
      state.username = ''
    }
    
    const SendMessage = () => {
      const messagesRef = db.database().ref("messages");

      if (inputMessage.value === '' || inputMessage.value === null){
          return;
      }
      const message = {
        username: state.username,
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
            username: data[key].username,
            content: data[key].content
          })
        })
        state.messages = messages
      })
      })
    return{
      inputUsername,
      Login,
      state,
      inputMessage,
      SendMessage,
      Logout,
      Vue3GoogleOauth
    }
  }
}
</script>

<style lang="scss">

body {
 margin: 0;
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
