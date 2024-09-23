
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
const firebaseConfig = {
  apiKey: "AIzaSyBd3Rdnsv2eGg3WLTEoEfXZ363Uwt-SvH4",
  authDomain: "chat-app-js-d8baa.firebaseapp.com",
  projectId: "chat-app-js-d8baa",
  storageBucket: "chat-app-js-d8baa.appspot.com",
  messagingSenderId: "744642495825",
  appId: "1:744642495825:web:0ed75885eee99a018dff70",
  measurementId: "G-1YYHS7NJGF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const signup = async (username, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        username: username.toLowerCase(),
        email,
        name: "",
        avatar: "",
        bio: "Hey, There I am using chat app",
        lastSeen: Date.now(),
      });
      await setDoc(doc(db, "chats", user.uid), {
        chatsData: [],
      });
      toast.success("User registered successfully!"); // Add a success toast
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error(error.code.split('/')[1].split('-').join(" "));
    }
  };
  
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!"); 
    } catch (error) {
      console.error("Error during login:", error);
      toast.error(error.code.split('/')[1].split('-').join(" "));
    }
  };
  
  const logout = async ()=>{
    try {
      await signOut(auth)
    } catch (error) {
      toast.error(error.code.split('/')[1].split('-').join(" "));
    }
  }
  
  const resetPass = async (email) => {
    if (!email) {
      toast.error("Enter your email");
      return null;
    }
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("email", "==", email));
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        await sendPasswordResetEmail(auth, email);
        toast.success("Reset Email Sent");
      } else {
        toast.error("Email doesn't exists");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  
  
  export { signup, login, logout, auth, db, resetPass };