import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { baseURL } from './config';
const Login = () => {


   const route = useLocation().pathname;
 const navigate = useNavigate();
 const [email, setEmail] = useState();
 const [password, setPassword] = useState();
 useEffect(() => {
   const user = JSON.parse(localStorage.getItem("user"));
   if(user)navigate("/chats")
 }, [navigate])
 

 const submitHandler = (e) => {
   e.preventDefault();
   fetch(`${baseURL}/login`, {
     method: "post",
     headers: {
       "Content-Type": "application/json;charset=utf-8",
     },
     body: JSON.stringify({
       email: email,
       password: password,
     }),
   })
     .then((r) => r.json())
     .then((res) => {
       if (res.err) {
         alert(res.err);
        } else {
          localStorage.setItem('user',JSON.stringify(res))
          alert('Login Successfully');
          navigate("/chats");
       }
     });
 };


  return (
    <div className="home">
      <div className="home-head">
        <Link
          to="/"
          className={`home-link ${route === "/" ? "active-btn" : ""}`}>
          Login
        </Link>
        <Link
          to="/signup"
          className={`home-link ${route ==="/signup" ? "active-btn" : ""}`}>
          Sign Up
        </Link>
      </div>
      <form onSubmit={submitHandler} className="home-body">
        <input type="email" onChange={(e)=>setEmail(e.target.value)} placeholder="Email" />
        <input type="password" onChange={(e)=>setPassword(e.target.value)} placeholder="password" />
        <button type='submit'>Login</button>
      </form>
    </div>
  );
}

export default Login