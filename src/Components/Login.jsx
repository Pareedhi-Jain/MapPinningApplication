import "./login.css";
import PushPinIcon from '@mui/icons-material/PushPin';
import { useRef, useState } from "react";
import axios from "axios";
import ClearIcon from '@mui/icons-material/Clear';


export default function Login({setShowLogin,myStorage,setCurrentUsername}){
    
    const [error, setError] = useState(false);
    const usernameRef = useRef();
    
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();//will not refresh the page
        const user = {
          username: usernameRef.current.value,
          
          password: passwordRef.current.value,
        };
        try {
            const res =await axios.post("/users/login", user);
            myStorage.setItem("user",res.data.username);
            setCurrentUsername(res.data.username);
            setShowLogin(false);
            setError(false);
            
          } catch (err) {
            setError(true);
          }
    };

    return(
        
        <div className="loginContainer">
            <div className="logo">
                <PushPinIcon/>
                Pin<b>IT</b>

            </div>



            <form onSubmit={handleSubmit}>
                <input autoFocus type="text" placeholder="username"ref={usernameRef}></input>
                <input type="password" placeholder="password"ref={passwordRef}></input>
                <button className="loginBtn" type="submit">Login</button>
                
                {error && <span className="failure">Something went wrong!</span>}



            </form>
            <ClearIcon className="loginCancel" onClick={()=>setShowLogin(false)}/>


        </div>

)}