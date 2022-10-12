import React from 'react'
import Messages from './Messages'
import Input from './Input'
import { ChatContext } from '../context/ChatContext'

const Chat = () => {
  const { data } = React.useContext(ChatContext)

  return (
    <div className='chat'>
      <div className='chat__header'>
        <span className='chat__header__name'>{data.user?.displayName}</span>
      </div>
      <Messages />
      <Input /> 
    </div>
  )
}

export default Chat