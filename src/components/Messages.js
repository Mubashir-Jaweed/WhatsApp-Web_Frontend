import React, { useEffect, useRef, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import { baseURL } from "./config";
import io from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import sendMessAudio from "../assets/sendMess.mp3";
import notificationAudio from "../assets/notification.mp3";
import messRecievedAudio from "../assets/messRecieved.mp3";

var socket = io("http://localhost:5000");
var selectedUserCompare;

const Messages = ({ userInfo, addNotification, userContacts }) => {
  const [userDetails, setUserDetails] = useState("");
  const [chatMenuBar, setChatMenuBar] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const chatContainerRef = useRef(null);
  const selectedUser = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const singleUser = () => {
    fetch(`${baseURL}/singleuser/${selectedUser}`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    })
      .then((r) => r.json())
      .then((res) => setUserDetails(res));
  };
  const fetchMess = () => {
    if (!selectedUser) return;
    fetch(`${baseURL}/allmessage`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    })
      .then((r) => r.json())
      .then((res) => {
        const messages = res.filter((m) => {
          return m.to === selectedUser || m.from === selectedUser;
        });
        setAllMessages(messages);

        socket.emit("select user", selectedUser);
      });
  };
  const sendMess = () => {
    if (newMessage) {
      fetch(`${baseURL}/sendmessage`, {
        method: "post",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          to: selectedUser,
          from: userInfo.id,
          message: newMessage,
        }),
      })
        .then((r) => r.json())
        .then((res) => {
          setAllMessages(allMessages.concat(res));
          socket.emit("new message", res);
        });
      const audioSendMess = new Audio(sendMessAudio);
      audioSendMess.play();
      setNewMessage("");
      addContact(selectedUser);
    }
  };
  const deleteMess = (id) => {
    fetch(`${baseURL}/deletemessage/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: `Bearer ${userInfo.token}`,
      },
    })
      .then((r) => r.json())
      .then((res) => fetchMess());
  };
  const addContact = (receiver) => {
    fetch(`${baseURL}/addcontacts`, {
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: `Bearer ${userInfo.token}`,
      },
      body: JSON.stringify({
        selectedUser: receiver,
      }),
    })
      .then((r) => r.json())
      .then((res) => userContacts());
  };
  useEffect(() => {
    socket.emit("setup", userInfo.id);
    socket.on("connection");
  }, []);

  useEffect(() => {
    singleUser();
    fetchMess();
    selectedUserCompare = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    socket.on("message recieved", (newMessage) => {
      userContacts();
      if (selectedUserCompare === newMessage.from) {
        setAllMessages(allMessages.concat(newMessage));
        const messRecieved = new Audio(messRecievedAudio);
        messRecieved.play();
      } else {
        addNotification(newMessage);
        const audioNotification = new Audio(notificationAudio);
        audioNotification.play();
      }
    });
  });

  // Scroll to the bottom of the chat container whenever a new message is added
  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [allMessages]);

  return (
    <div className="messages">
      <div className="mes-nav">
        <div style={{ display: "flex", gap: "20px" }}>
          <img className="mes-nav-img" src={userDetails.pic} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span className="mes-h">{userDetails.name}</span>
            <span className="mes-t">{userDetails.about}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <button title="Search" className="tab-btn">
            <SearchRoundedIcon />
          </button>
          <button
            title="Menu"
            className="tab-btn"
            onClick={() => setChatMenuBar(!chatMenuBar)}>
            <MoreVertIcon />
            {chatMenuBar ? (
              <div className="mes-menu">
                <button>Contact info</button>
                <button
                  onClick={() => dispatch({ type: "selectUser", payload: "" })}>
                  Close chat
                </button>
                <button>Delete chat</button>
              </div>
            ) : (
              <></>
            )}
          </button>
        </div>
      </div>

      <div className="mes-body">
        <div className="mes-back"></div>
        <div className="all-mes" ref={chatContainerRef}>
          {allMessages.map((m, i) => (
            <div key={i} className={m.from === selectedUser ? "to" : "from"}>
              <span>
                {m.message} <sub> {m.time}</sub>
                <button onClick={() => deleteMess(m._id)} className="mes-del">
                  <DeleteForeverIcon />
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mes-footer">
        <button className="mes-btn">
          <EmojiEmotionsOutlinedIcon className="i" />
        </button>
        <button className="mes-btn">
          <AttachFileIcon className="i" />
        </button>
        <input
          className="mes-inp"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button className="mes-btn">
          {!newMessage ? (
            <MicIcon className="i" />
          ) : (
            <SendIcon className="i" onClick={() => sendMess()} />
          )}
        </button>
      </div>
    </div>
  );
};

export default Messages;
