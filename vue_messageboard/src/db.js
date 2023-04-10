import firebase from 'firebase/compat/app'
import 'firebase/compat/database'

const config = {
  apiKey: 'AIzaSyAOV8XkCKwzxIrPyu1PTRHJ4Une3s4UmNg',
  authDomain: 'vuemessageboard.firebaseapp.com',
  projectId: 'vuemessageboard',
  storageBucket: 'vuemessageboard.appspot.com',
  messagingSenderId: '542822140028',
  appId: '1:542822140028:web:e8cdd075f27d934832a1f9'
}
const db = firebase.initializeApp(config)
export default db
