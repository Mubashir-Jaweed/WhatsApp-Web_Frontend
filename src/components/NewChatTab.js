import React, { useEffect, useState } from "react";
import { baseURL } from "./config";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import {useDispatch} from 'react-redux'


const NewChatTab = ({
  userInfo,
  openSearch,
  setOpenSearch,
  setActiveTab,
}) => {
  const [users, setUsers] = useState([]);
  const [alp, setAlp] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const dispatch = useDispatch()

  const allUser = () => {
    fetch(`${baseURL}/alluser`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    })
      .then((r) => r.json())
      .then((res) => {
        if (res) {
          const firstLetter = [];
          setUsers(res);
          res.map((u) => {
            if (!firstLetter.includes(u.name[0].toUpperCase())) {
              firstLetter.push(u.name[0]);
            }
          });
          setAlp(firstLetter.sort());
        }
      });
  };
  useEffect(() => {
    allUser();
  }, []);

  return (
    <div className="new-chat-tab" onBlur={() => setOpenSearch(false)}>
      <div className="new-chat-nav">
        <div style={{ display: "flex", gap: "20px", margin: "15px" }}>
          <button
            className="new-nav-btn"
            onClick={() => {
              setOpenSearch(false);
              setActiveTab("chat-tab");
            }}>
            <ArrowBackRoundedIcon />
          </button>
          <span>New chat</span>
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
      </div>

      <div className="new-chat-tabs-cont">
        <p className="new-chat-con-h">CONTACTS ON WHATSAPP</p>

        {alp.map((a, index) => (
          <>
            {!searchUser && (
              <p key={index} className="new-chat-con-h">
                {a}
              </p>
            )}
            {users
              .filter((val) =>
                val.name.toLowerCase().includes(searchUser.toLowerCase())
              )
              .map((u, i) => (
                <>
                  {u.name[0].toLowerCase() == a.toLowerCase() && (
                    <div
                      className="new-tab"
                      key={i}
                      onClick={ ()=>{
                        setActiveTab("chat-tab");
                      dispatch({ type: "selectUser" ,payload:u._id});
                      }}>
                      <img className="tab-img" src={u.pic} />
                      <div className="new-tab-t-c">
                        <span className="tab-h">{u.name}</span>
                        <span className="tab-t">{u.email}</span>
                      </div>
                    </div>
                  )}
                </>
              ))}
          </>
        ))}
      </div>
    </div>
  );
};

export default NewChatTab;
