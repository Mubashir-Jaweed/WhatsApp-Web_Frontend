import React, { useEffect, useState } from 'react'
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { baseURL } from "./config";

const ProfileTab = ({ userInfo, setActiveTab }) => {
  const initialState = {
    name: "",
    about: "",
  };
  const [userDetails, setUserDetails] = useState(initialState);
  const { name, about } = userDetails;
  const [editName, setEditName] = useState(false);
  const [editAbout, setEditAbout] = useState(false);

  const singleUser = () => {
    fetch(`${baseURL}/singleuser/${userInfo.id}`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    })
      .then((r) => r.json())
      .then((res) => setUserDetails(res));
  };
  const editUserName = (e) => {
    e.preventDefault();

    fetch(`${baseURL}/editname/${userInfo.id}`, {
      method: "put",
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
      }),
    })
      .then((r) => r.json())
      .then((res) => alert(res));
    singleUser();
  };
  const editUserAbout = (e) => {
    e.preventDefault();

    fetch(`${baseURL}/editabout/${userInfo.id}`, {
      method: "put",
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        about: about,
      }),
    })
      .then((r) => r.json())
      .then((res) => alert(res));
    singleUser();
  };
  const onValueChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    singleUser();
  }, []);
  return (
    <div className="pro-tab">
      <div className="new-chat-nav">
        <div style={{ display: "flex", gap: "20px", margin: "15px" }}>
          <button className="new-nav-btn" onClick={() => setActiveTab("chat-tab")}>
            <ArrowBackRoundedIcon />
          </button>
          <span>Profile</span>
        </div>
      </div>
      <div className="pro-body">
        <div className="pro-img">
          <img src={userDetails.pic} />
        </div>
        <div className="pro-name">
          <p className="pro-t">Your name</p>
          <div className={`pro-inp-con ${editName ? "border" : ""}`}>
            {!editName ? (
              <p
                style={{ margin: "0px", padding: "0px", fontSize: "18px" }}
                className="input">
                {userDetails.name}
              </p>
            ) : (
              <input
                className="input"
                name="name"
                type="text"
                onChange={(e) => onValueChange(e)}
                value={name}
              />
            )}
            {editName ? (
              <CheckIcon
                onClick={(e) => {
                  setEditName(false);
                  editUserName(e);
                }}
              />
            ) : (
              <EditIcon className="pro-i" onClick={() => setEditName(true)} />
            )}
          </div>
        </div>
        <p className="pro-txt">
          This is not your username or pin. This name will be visible to your
          WhatsApp contacts.
        </p>
        <div className="pro-name">
          <p className="pro-t">About</p>
          <div className={`pro-inp-con ${editAbout ? "border" : ""}`}>
            {!editAbout ? (
              <p
                style={{ margin: "0px", padding: "0px", fontSize: "18px" }}
                className="input">
                {userDetails.about}
              </p>
            ) : (
              <input
                className="input"
                name="about"
                type="text"
                onChange={(e) => onValueChange(e)}
                value={about}
              />
            )}
            {editAbout ? (
              <CheckIcon
                onClick={(e) => {
                  setEditAbout(false);
                  editUserAbout(e);
                }}
              />
            ) : (
              <EditIcon className="pro-i" onClick={() => setEditAbout(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab