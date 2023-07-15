import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDf7Yu4NKCHy8zTfoV7fKj0N51WMYyzZeo",
  authDomain: "hungreed-99.firebaseapp.com",
  databaseURL: "https://hungreed-99-default-rtdb.firebaseio.com",
  projectId: "hungreed-99",
  storageBucket: "hungreed-99.appspot.com",
  messagingSenderId: "612043365336",
  appId: "1:612043365336:web:d1f4551df3daf02e5db0ad",
  measurementId: "G-2WGLLPPGTF",


  // apiKey: "AIzaSyAfPpL22gePlOXh3rA3jLmkdn45E1SEXYQ",
  // authDomain: "foodapp-87fd3.firebaseapp.com",
  // databaseURL:"gs://foodapp-87fd3.appspot.com",
  // projectId: "foodapp-87fd3",
  // storageBucket: "foodapp-87fd3.appspot.com",
  // messagingSenderId: "252254899078",
  // appId: "1:252254899078:web:9d1b6c25638b3913c7ba07",
  // measurementId: "G-LHTXVZJ9GK"
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const firestore = getFirestore(app);
const storage = getStorage(app);
const firebaseAuth = getAuth(app);

export { app, firestore, storage, firebaseAuth };
// apiKey: "AIzaSyBJkDJ7LaSE7x0p4528BMeTT8peyGAZ3XU",
// authDomain: "foodapp-d6e5c.firebaseapp.com",
// projectId: "foodapp-d6e5c",
// storageBucket: "foodapp-d6e5c.appspot.com",
// messagingSenderId: "178781685299",
// appId: "1:178781685299:web:444846fc2fcb65d1eb4546",
// measurementId: "G-6BG8SB9YH9"