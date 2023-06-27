import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatTabs from "../components/ChatTabs";
import Defaultchat from "../components/Defaultchat";
import Messages from "../components/Messages";
import { baseURL } from "../components/config";
import { useDispatch, useSelector } from "react-redux";
const ChatPage = () => {
  const navigate = useNavigate();
    const dispatch = useDispatch();

  const userInfo = JSON.parse(localStorage.getItem("user"));
  const [allNotification, setAllNotification] = useState([]);
  const [contacts, setContacts] = useState([]);
  const selectedUser = useSelector((state) => state.user);

  const addNotification = (value) => {
    fetch(`${baseURL}/addnotification`, {
      method: "put",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: `Bearer ${userInfo.token}`,
      },
      body: JSON.stringify({
        notification: allNotification.concat(value),
      }),
    })
      .then((r) => r.json())
      .then((res) => userNotifications());
  };

  const userNotifications = () => {
    fetch(`${baseURL}/allnotification`, {
      method: "get",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: `Bearer ${userInfo.token}`,
      },
    })
      .then((r) => r.json())
      .then((res) => setAllNotification(res.notification));
  };

  const userContacts = () => {
    fetch(`${baseURL}/allcontacts`, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: `Bearer ${userInfo.token}`,
      },
    })
      .then((r) => r.json())
      .then((res) => setContacts(res));
  };

  const deleteContact = (id) =>{
    fetch(`${baseURL}/deletecontact`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
      body: JSON.stringify({
        deleteUser: id,
      }),
    })
      .then((r) => r.json())
      .then((res) =>{
        if(res == selectedUser){
          dispatch({ type: "selectUser", payload: "" });
        }
         userContacts()
        });
  }
  
  useEffect(() => {
    userNotifications();
    userContacts();
  }, []);
  useEffect(() => {
    if (!userInfo) navigate("/");
  });

  return (
    <div className="chat">
      <ChatTabs
        userInfo={userInfo}
        allNotification={allNotification}
        userNotifications={userNotifications}
        setContacts={setContacts}
        contacts={contacts}
        deleteContact={deleteContact}
      />
      {selectedUser ? (
        <Messages
          userInfo={userInfo}
          userContacts={userContacts}
          addNotification={addNotification}
        />
      ) : (
        <Defaultchat />
      )}
    </div>
  );
};

export default ChatPage;
