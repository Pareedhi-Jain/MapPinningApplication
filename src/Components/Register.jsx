import "./register.css";
import PushPinIcon from '@mui/icons-material/PushPin';
import { useRef, useState } from "react";
import axios from "axios";
import ClearIcon from '@mui/icons-material/Clear';


export default function Register({setShowRegister}){
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();//will not refresh the page
        const newUser = {
          username: usernameRef.current.value,
          email: emailRef.current.value,
          password: passwordRef.current.value,
        };
        try {
            await axios.post("/users/register", newUser);
            setError(false);
            setSuccess(true);
          } catch (err) {
            setError(true);
          }
    };

    return(
        
        <div className="registerContainer">
            <div className="logo">
                <PushPinIcon/>
                Pin<b>IT</b>

            </div>



            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="username"ref={usernameRef}></input>
                <input type="email" placeholder="email"ref={emailRef}></input>
                <input type="password" placeholder="password"ref={passwordRef}></input>
                <button className="registerBtn" type="submit">Register</button>
                { success && <span className="success">Successfull. You can login now!</span>}
                {error && <span className="failure">Something went wrong!</span>}



            </form>
            <ClearIcon className="registerCancel" onClick={()=>setShowRegister(false)}/>


        </div>

)}