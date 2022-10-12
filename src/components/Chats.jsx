import React from 'react'
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect } from 'react';
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from '../context/ChatContext';

const Chats = () => {

  const [chats, setChats] = React.useState([]);

  const {user} = React.useContext(AuthContext); 
  const {dispatch} = React.useContext(ChatContext); 

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, 'userChats', user.uid), (doc) =>{
        setChats(doc.data());
      })
  
      return () => {
        unsub();
      }
    }

    user.uid && getChats()
  }, [user.uid]);

  
  const handleSelect = (u) => {
    dispatch({type: 'CHANGE_USER', payload: u})
  };

  return (
    <div className="chats">
      {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map(chat=>(
        <div className="userChat" key={(chat[0])} onClick={()=>handleSelect(chat[1].userInfo)}>
          <img src={chat[1].userInfo.photoURL} alt="user" />
          <div className="userChatInfo">
            <span className="username">{chat[1].userInfo.displayName}</span>
            <p>{chat[1].lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Chats