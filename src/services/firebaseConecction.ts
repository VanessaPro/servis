
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDkLnDHcF9ojPzGz72n_zMneVGCnnpSdfE",
  authDomain: "webx-11d75.firebaseapp.com",
  projectId: "webx-11d75",
  storageBucket: "webx-11d75.appspot.com",
  messagingSenderId: "709846987855",
  appId: "1:709846987855:web:2797748129c3a6b8b2263a"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app)
const auth = getAuth(app);
const storage =getStorage(app);

export {db,auth,storage};