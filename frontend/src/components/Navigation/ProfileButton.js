import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { useHistory, NavLink } from 'react-router-dom';

import * as sessionActions from '../../store/session';

function ProfileButton({ user }) {
  const history = useHistory()
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push('/')
  };

  const goToTrips = (e) => {
    e.preventDefault();
    setShowMenu(false)
    history.push('/trips')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={openMenu} className={'profile-dropdown'}>
        <i className="fas fa-user-circle" />
      </button>
      <div className="drop-down-elements">
      <ul className={ulClassName}  ref={ulRef}>
        <li>{user.username}</li>
        <li>{user.firstName} {user.lastName}</li>
        <li>{user.email}</li>
        <li>
        <NavLink exact to='/trips' className="your-trips-navlink" onClick={goToTrips}>Trips</NavLink>

        </li>
        <li>
          <button className="log-out-button" onClick={logout}>Log Out</button>
        </li>
      </ul>
      </div>
    </>
  );
}

export default ProfileButton;
