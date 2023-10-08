import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyD0X9cxLe53dVqE7goDV-2Rl34LjiuebYc",
    authDomain: "shoeapp-4dd7b.firebaseapp.com",
    databaseURL: "https://shoeapp-4dd7b-default-rtdb.firebaseio.com",
    projectId: "shoeapp-4dd7b",
    storageBucket: "shoeapp-4dd7b.appspot.com",
    messagingSenderId: "85092758334",
    appId: "1:85092758334:web:58f1750f345d8d2888f26f",
    measurementId: "G-8KYWND93DR"
};

// Initialize Firebase
export default initializeApp(firebaseConfig);