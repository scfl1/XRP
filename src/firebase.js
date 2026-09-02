import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
const firebaseConfig={apiKey:'AIzaSyDa0XdGA05G3vt-enGPBfDTD16K4OdoMik',authDomain:'american-54cbd.firebaseapp.com',projectId:'american-54cbd',storageBucket:'american-54cbd.appspot.com',messagingSenderId:'166955679884',appId:'1:166955679884:web:5d8701f7ed3e3f78d33ba9'}
const app=initializeApp(firebaseConfig)
export const auth=getAuth(app)
export const db=getFirestore(app)
export default app
