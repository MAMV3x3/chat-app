import React from 'react'
import { ChatContext } from '../context/ChatContext'
import Message from './Message'
import { db } from "../firebase";
import { onSnapshot, doc } from 'firebase/firestore'

const Messages = () => {
  const [messages, setMessages] = React.useState([]);
  const { data } = React.useContext(ChatContext)

  React.useEffect(() => {
    const unsub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    })
    
    return () => {
      unsub();
    }
  }, [data.chatId])
  

  return (
    <div className="messages">
        {messages.map(m=>(
          <Message message={m} key={m.id}/>
        ))}
    </div>
  )
}

export default Messages