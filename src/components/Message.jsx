import React from 'react'
import { useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Message = ({message}) => {

  const {user} = React.useContext(AuthContext);
  const {data} = React.useContext(ChatContext);

  const ref = useRef()

  useEffect(() => {
    ref.current?.scrollIntoView({behavior: "smooth"})
  }, [message])

  console.log(message);
  return (
    <div ref={ref} className={`message ${message.senderId === user.uid && "owner"}`}>
      <div className="messageInfo">
        <img src={message.senderId === user.uid ? user.photoURL : data.user.photoURL } alt="avatar" />
        <span>just now</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.image && <img src={message.image} alt="avatar" />}
      </div>
    </div>
  )
}

export default Message