import React, { useContext } from 'react'
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="navbar">
      <span className="logo">Dagon Chat</span>
      <div className="user">
        <img src={user.photoURL} alt="user" />
        <span className="username">{user.displayName}</span>
        <button onClick={()=>signOut(auth)} className="logout">Logout</button>
      </div>
    </div>
  )
}

export default Navbar