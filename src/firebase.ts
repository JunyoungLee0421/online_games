import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBUI77ix2FBkt_y0qh9uHg9iIeDBa0iRUg",
    authDomain: "onlinegames-d7bef.firebaseapp.com",
    databaseURL: "https://onlinegames-d7bef-default-rtdb.firebaseio.com",
    projectId: "onlinegames-d7bef",
    storageBucket: "onlinegames-d7bef.appspot.com",
    messagingSenderId: "783911377595",
    appId: "1:783911377595:web:46f6d4246d4df11a06e79e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database }