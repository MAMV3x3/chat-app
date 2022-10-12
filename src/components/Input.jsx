import React from 'react';
import Img from "../images/img.png";
import Attach from "../images/attach.png";
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { v4 as uuid } from 'uuid';
import { db, storage } from "../firebase";
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const Input = () => {

  const [text, setText] = React.useState('');
  const [image, setImage] = React.useState(null);

  const {user} = React.useContext(AuthContext);
  const {data} = React.useContext(ChatContext);

  const handleSend = async () => {
    if(image){

      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        (error) => {
          //setError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then( async(downloadURL) => {
            await updateDoc(doc(db, 'chats', data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: user.uid, 
                date: Timestamp.now(),
                image: downloadURL,
              }),
          });
        });
      }
    );
    } else{
      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: user.uid, 
          date: Timestamp.now(),
        }),
    });
  }

  await updateDoc(doc(db, 'userChats', user.uid), {
    [data.chatId+".lastMessage"]: {
      text,
    },
    [data.chatId+".date"]: serverTimestamp()
  });  
  await updateDoc(doc(db, 'userChats', data.user.uid), {
    [data.chatId+".lastMessage"]: {
      text,
    },
    [data.chatId+".date"]: serverTimestamp()
  }); 

  setText('');
  setImage(null);

};  

  return (
    <div className="input">
      <input type="text" placeholder="Type a message" onChange={e=>setText(e.target.value)} value={text}/>
      <div className="input__buttons">
        <img src={Attach} alt="attach" />
        <input type="file" id="file" style={{display: 'none'}} onChange={e=>setImage(e.target.files[0])}/>
        <label htmlFor="file">
          <img src={Img} alt="img" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default Input;