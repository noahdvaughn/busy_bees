<template>
<header>
  <div v-if=" state.currentUser === null || state.currentUser.email === undefined ">
  <h1 class="headerText">Busy Bees</h1>
  </div>
  <div v-else class="loginHeader"> 
    <h1>Welcome {{ state.currentUser.given_name }} {{ state.currentUser.family_name }}</h1>
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
  
  <div class="buttons">
    <button  class="button" @click="Logout">Logout</button>
    <button v-if="state.viewingCompleted === false" class="button" @click="ToggleViewing">View Completed Tasks</button>
    <button v-if="state.viewingCompleted === true" class="button" @click="ToggleViewing">Go Back</button>
  </div>

    <section v-if="state.viewingCompleted === false" class="chat-box">
      <div v-for="message in state.messages" :key="message.key">
        <div v-if="message.email === state.currentUser.email && message.completed === 'false'" class="taskRow">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Eo_circle_green_checkmark.svg/1024px-Eo_circle_green_checkmark.svg.png?20200417132424" class="check" @click="()=>{
            markCompleted(message)
          }"/>
          
          <div class="task">
            <p class="content"> {{ message.content }}</p>
          </div>
          
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Eo_circle_red_letter-x.svg/2048px-Eo_circle_red_letter-x.svg.png" class="check" @click="()=>{
            DeleteMessage(message.id)
          }"/>
          
        </div>
      </div>
    </section>

    <section v-if="state.viewingCompleted === true" class="chat-box-green">
      <div v-for="message in state.messages" :key="message.key">
        <div v-if="message.email === state.currentUser.email && message.completed === 'true'" class="taskRow">
          <div class="task">
            <p class="content"> {{ message.content }}</p>
          </div>

        </div>
      </div>

    </section>

    <footer>
      <form @submit.prevent="SendMessage">
        <input type="text" placeholder="Add a task" v-model="inputMessage" class="input"/>
        <input type="submit" value="Add" class="button"/>
      </form>
    </footer>
  </div>
</template>

<script>
import db from './db'
import {reactive, onMounted, ref, inject} from 'vue'
import { decodeCredential, googleLogout } from 'vue3-google-login'
// import { getStorage, deleteObject } from "firebase/storage";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { update } from '@firebase/database';

export default {
  setup () {
    const callback = (response) => {
      console.log("handle the response", response)
      state.currentUser = decodeCredential(response.credential)
    }
    const inputMessage = ref("")
    
    const state = reactive({
      currentUser: {
      },
      messages: [],
      viewingCompleted: false
    })

    const Logout = () => {
      state.currentUser = null
      // googleLogout()
    }
    const ToggleViewing = () => {
      state.viewingCompleted = !state.viewingCompleted
    }
    
    const SendMessage = () => {
      const messagesRef = db.database().ref("messages");
      if (inputMessage.value === '' || inputMessage.value === null){
          return;
      }
      const message = {
        email: state.currentUser.email,
        content: inputMessage.value,
        completed: 'false'
      }
      messagesRef.push(message)
      inputMessage.value = ""
    }

    const DeleteMessage = (key) => {
      console.log(key)
      const messagesRef = db.database().ref("messages");
      messagesRef.child(key).remove()
    }
    const markCompleted = (message) => {
      const messagesRef = db.database().ref("messages");
      console.log(message)
      let newMessage = {
        ...message,
        completed: 'true'
      }
      messagesRef.child(message.id).update(newMessage)

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
            content: data[key].content,
            completed: data[key].completed
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
      callback,
      DeleteMessage,
      markCompleted,
      ToggleViewing
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
}
.loginHeader{
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 10vh;
  margin: 0;
  padding: 0;
}
.logout{
  margin: 0;
  padding: 0;
}
.buttons{
  display: flex;
  justify-content: center;
  padding-top: 1px;
}
h1{
  color: white;
}
.loginForm{
  text-align: center;
}
.view{
  height: 90vh;
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
}
.taskRow{
  display: flex;
  justify-content: space-evenly;
  align-items: center;

}
.chat-box, .chat-box-green{
  background-color: rgb(255, 198, 41, 0.5);
  border-radius: 20px;
  margin-bottom: 10px;
  margin-top: 10px;
  width: 70vw;
 overflow-y: scroll;
}
.chat-box-green{
  background-color: rgb(0, 200, 0, 0.5);

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
.input{
padding: 5px;
}
::placeholder{
  color: white;
}
.button, .input{
  border-radius: 20px;
  border: 2px solid white;
  margin-left: 5px;
  color: white;
  font-weight: 800;
  background-color: $yellow;
}


</style>
