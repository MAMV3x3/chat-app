import React from 'react'
import UploadIcon from "../images/upload.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [error, setError] = React.useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password)

      const storageRef = ref(storage, displayName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        (error) => {
          setError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then( async(downloadURL) => {
            await updateProfile(res.user, {
              displayName, 
              photoURL: downloadURL,
            })
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          });
        }
      );
    } catch (error) {
      setError(true)
    }
    
  }

  return (
    <div className='formContainer'>
        <div className='formWrapper'>
            <span className='logo'>Dagon Chat</span>
            <span className='formTitle'>Register</span>
            <form onSubmit={handleSubmit}>
                <input type={'text'} placeholder={'Username'} />
                <input type={'email'} placeholder={'Email'} />
                <input type={'password'} placeholder={'Password'} />
                <input style={{display: 'none'}} type={'file'} id='fileInput'/>
                <label htmlFor='fileInput'>
                    <img src={UploadIcon} alt='upload'/>
                    <span>Add an avatar</span>
                </label>
                <button className='formButton'>Sign Up</button>
                {error && <span className='error'>Something went wrong</span>}
            </form>
            <p>Already signed up? <Link to={"/login"}>Login</Link></p>
        </div>
    </div>
  )
}

export default Register