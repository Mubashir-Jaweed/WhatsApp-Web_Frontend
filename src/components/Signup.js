import React, { useEffect, useState } from 'react'
import { Link ,useLocation,useNavigate } from "react-router-dom";
import {baseURL} from './config'

const Signup = () => {
 const route = useLocation().pathname;
 const navigate = useNavigate()
const [name, setName] = useState()
const [email, setEmail] = useState()
const [password, setPassword] = useState()
 useEffect(() => {
   const user = JSON.parse(localStorage.getItem("user"));
   if (user) navigate("/chats");
 }, [navigate]);
 
 const submitHandler = (e) =>{
      e.preventDefault();
  fetch(`${baseURL}/signup`, {
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      name:name,
      email:email,
      password:password
    }),
  })
    .then((r) =>r.json())
    .then((res) =>{
      if(res.mes){
        alert(res.mes)
        navigate("/")
      }
      else{
        alert(res.err)
      }
    });
 }
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
          className={`home-link ${route === "/signup" ? "active-btn" : ""}`}>
          Sign Up
        </Link>
      </div>
      <form onSubmit={submitHandler} className="home-body">
        <input type="name" onChange={(e)=>setName(e.target.value)} placeholder="Name" />
        <input type="email" onChange={(e)=>setEmail(e.target.value)} placeholder="Email" />
        <input type="password" onChange={(e)=>setPassword(e.target.value)} placeholder="password" />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup