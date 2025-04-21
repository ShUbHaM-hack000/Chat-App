import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";


const firebaseConfig = {
  apiKey: "AIzaSyCNnZCPLkWuHFF3SBYePSWU7-0AtJcVhqs",
  authDomain: "chat-app-a8adc.firebaseapp.com",
  projectId: "chat-app-a8adc",
  storageBucket: "chat-app-a8adc.firebasestorage.app",
  messagingSenderId: "466088218072",
  appId: "1:466088218072:web:7084eb5f3e1ea95e27f6ad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    // store data in firebase
    // whenever user create a account this 2 collection is created
    // signup method
    await setDoc(doc(db, "users", user.uid), {
      // create object
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey ,There i am using Chat App",
      lastSeen: Date.now()
    })
    await setDoc(doc(db, "chats", user.uid), {
      chatsData: []
    })
  } catch (error) {
    console.error(error)
    toast.error(error.code.split('/')[1].split('-').join(" "));

  }

}
const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
}

const logout = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.log(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
}

const resetPass = async (email) => {
  if (!email) {
    toast.error("Enter Your Email");
    return null;
  }
  try {
    const userRef= collection(db,'users');
    const q= query(userRef,where("email","==",email));
    const querySnap =await getDocs(q);
    if (!querySnap.empty){
      await sendPasswordResetEmail(auth,email);
      toast.success("Reset Email Sent");
    }
    else{
      toast.error("Email doesn't exist")
    }

  } catch (error) { 
    console.error(error);
    toast.error(error.message);
    
  }
}

export { signup, login, logout, auth, db, resetPass}