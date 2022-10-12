import React from 'react'
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
  const [username, setUsername] = React.useState('');
  const [users, setUsers] = React.useState(null);
  const [err, setErr] = React.useState(null);

  const {user} = React.useContext(AuthContext); 

  const handleSearch = async () => {
    const q = query(collection(db, 'users'), where('displayName', '==', username));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUsers(doc.data());
      });
    } catch (error) {
      setErr(error);
    } 
  };

  const handleKey = (e) => {
    e.code === 'Enter' && handleSearch();
  }

  const handleSelect = async () => {
    //create user chats
    const combinedID = user.uid > users.uid ? user.uid + users.uid : users.uid + user.uid;
    try {
      const res = await getDoc(doc(db, 'chats', combinedID));

      if(!res.exists()){
        //create chat
        await setDoc(doc(db, 'chats', combinedID), {messages: []});

        //create user chats
        await updateDoc(doc(db, 'userChats', user.uid), {
          [combinedID+".userInfo"]: {
            uid: users.uid,
            displayName: users.displayName,
            photoURL: users.photoURL
          },
          [combinedID+".date"]: serverTimestamp()
        });

        await updateDoc(doc(db, 'userChats', users.uid), {
          [combinedID+".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          [combinedID+".date"]: serverTimestamp()
        });

      }
    } catch(err) {}

    setUsers(null);
    setUsername('');
  }

  return (
    <div className="search">
      <div className="searchForm">
        <input value={username} type="text" placeholder="Search an user" onKeyDown={handleKey} onChange={e=>setUsername(e.target.value)}/>
      </div>
      {err && <span>User not found</span>}
      {users && <div className="userChat" onClick={handleSelect}>
        <img src={users.photoURL} alt="user" />
        <div className="userChatInfo">
          <span className="username">{users.displayName}</span>
        </div>
      </div>}
    </div>
  )
}

export default Search