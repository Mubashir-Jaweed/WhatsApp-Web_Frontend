import React, { useEffect, useState } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import ChatIcon from "@mui/icons-material/Chat";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { baseURL } from "./config";
import { useNavigate } from "react-router-dom";
import ProfileTab from "./ProfileTab";
import NewChatTab from "./NewChatTab";
import { useDispatch } from "react-redux";

const ChatTabs = ({
  userInfo,
  allNotification,
  userNotifications,
  contacts,
  deleteContact,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [chatMenuBar, setChatMenuBar] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [activeTab, setActiveTab] = useState("chat-tab");
  const [userDetails, setUserDetails] = useState("");

  const LogOut = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const singleUser = () => {
    fetch(`${baseURL}/singleuser/${userInfo.id}`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    })
      .then((r) => r.json())
      .then((res) => {
        setUserDetails(res);
      });
  };

  const userOptions = () => {
    const tab = document.querySelectorAll(".tab");
    tab.forEach((t) => {
      const btn = t.querySelector(".tab-i");
      const optionGrp = t.querySelector(".tab-opt");
      btn.addEventListener("click", () => {
        tab.forEach((otherTab) => {
          const otherOptionGrp = otherTab.querySelector(".tab-opt");
          if (otherOptionGrp !== optionGrp) {
            otherOptionGrp.classList.remove("tab-o-active");
          }
        });
        optionGrp.classList.toggle("tab-o-active");
      });
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes();
    const amOrPm = date.getHours() >= 12 ? "PM" : "AM";

    return timestamp && `${hours}:${minutes} ${amOrPm}`;
  };

  const lastMessLth = (lastMess) => {
    if (lastMess.length >= 30) {
      var mess = "";
      for (var i = 0; i <= 30; i++) {
        mess = mess + lastMess[i];
      }
      return mess + " ......";
    } else {
      return lastMess;
    }
  };

  const deleteContactLogic = (id) => {
    const tab = document.querySelectorAll(".tab");
    tab.forEach((t) => {
      const optionGrp = t.querySelector(".tab-opt");
      const delBtn = optionGrp.querySelector("button");

      delBtn.addEventListener("click", () => {
        optionGrp.classList.remove("tab-o-active");
        deleteContact(id);
      });
    });
  };

  const notificationLth = (id) => {
    const notifiGrp = {};
    allNotification.map((n) => {
      if (n.from in notifiGrp) {
        notifiGrp[n.from] += 1;
      } else {
        notifiGrp[n.from] = 1;
      }
    });
    for (const [key, value] of Object.entries(notifiGrp)) {
      if (key == id) {
        return <span className="tab-notif">{value}</span>;
      }
    }
  };

  const deleteNotif = (n) => {
    fetch(`${baseURL}/deletenotification`, {
      method: "Delete",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
      body: JSON.stringify({
        deleteNotif:n
      }),
    })
    .then(r=>r.json())
    .then(res=>{
       userNotifications()})
  };

  const sortedContacts = contacts.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  useEffect(() => {
    userOptions();
  });

  useEffect(() => {
    singleUser();
  }, []);
  return (
    <>
      {activeTab == "chat-tab" && (
        <div
          className="chat-tabs toogle"
          onBlur={() => {
            setOpenSearch(false);
          }}>
          <div className="tab-nav">
            <img
              className="tab-nav-img"
              src={userDetails.pic}
              onClick={() => setActiveTab("pro-tab")}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button title="Community" className="tab-btn">
                <GroupsIcon />
              </button>
              <button title="Status" className="tab-btn">
                <DataUsageIcon />
              </button>
              <button
                title="New Chat"
                className="tab-btn"
                onClick={() => {
                  setActiveTab("new-chat-tab");
                  setOpenSearch(true);
                }}>
                <ChatIcon />
              </button>
              <button
                title="Menu"
                className="tab-btn"
                onClick={() => setChatMenuBar(!chatMenuBar)}>
                <MoreVertIcon />
                {chatMenuBar ? (
                  <div className="chat-menu">
                    <button onClick={() => LogOut()}>Log out</button>
                  </div>
                ) : (
                  <></>
                )}
              </button>
            </div>
          </div>

          <div className="tab-search">
            <div className="tab-inp-cont">
              {!openSearch ? (
                <button className="tab-i">
                  <SearchRoundedIcon style={{ fontSize: "20px" }} />
                </button>
              ) : (
                <button
                  onClick={() => setOpenSearch(false)}
                  className="tab-i tab-i-diff">
                  <ArrowBackRoundedIcon style={{ fontSize: "20px" }} />
                </button>
              )}
              <input
                onClick={() => setOpenSearch(true)}
                type="text"
                placeholder="Search or start new chat"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
              />
            </div>
            <button className="tab-i">
              <FilterListRoundedIcon style={{ fontSize: "20px" }} />
            </button>
          </div>

          <div className="tabs-cont">
            {sortedContacts
              .filter((val) =>
                val.name.toLowerCase().includes(searchUser.toLowerCase())
              )
              .map((cont, i) => (
                <div
                  key={i}
                  className="tab"
                  onClick={() => {
                    dispatch({ type: "selectUser", payload: cont._id });
                    deleteNotif(cont._id)
                  }}>
                  <img className="tab-img" src={cont.pic} />
                  <div className="tab-t-c">
                    <span className="tab-h">{cont.name}</span>
                    <span className="tab-t">{lastMessLth(cont.lastMess)}</span>
                  </div>
                  <span className="tab-time">{formatTime(cont.createdAt)}</span>
                  <button className="tab-i tab-i-d">
                    <KeyboardArrowDownRoundedIcon
                      style={{ fontSize: "30px" }}
                    />
                  </button>
                  <div className="chat-menu tab-opt">
                    <button onClick={(e) => deleteContactLogic(cont._id)}>
                      Delete chat
                    </button>
                  </div>
                  {notificationLth(cont._id)}
                </div>
              ))}
          </div>
        </div>
      )}

      {activeTab == "new-chat-tab" && (
        <NewChatTab
          userInfo={userInfo}
          setOpenSearch={setOpenSearch}
          openSearch={openSearch}
          setActiveTab={setActiveTab}
        />
      )}
      {activeTab == "pro-tab" && (
        <ProfileTab userInfo={userInfo} setActiveTab={setActiveTab} />
      )}
    </>
  );
};

export default ChatTabs;
