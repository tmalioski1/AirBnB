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
      <button onClick={openMenu} className={'profile-button'}>
      <i id='bars' className="fa-solid fa-bars"></i>
        <i className="fas fa-user-circle" />
      </button>
      {showMenu &&
      <div className="drop-down-elements">
      <div className={ulClassName}  ref={ulRef}>
        <div className='all-but-logout'>
        <div id='dropdown-profile-name' className='profile-input'>{user.username}</div>
        <div className='profile-input'>{user.firstName} {user.lastName}</div>
        <div className='profile-input'>{user.email}</div>
        <div  id= 'trippy-trips'className='profile-input'>
        <NavLink exact to='/trips' className="your-trips-navlink" onClick={goToTrips}>Trips</NavLink>
        </div>
        </div>
        <div className='profile-input'>
          <button className="log-out-button" onClick={logout}>Log Out</button>
        </div>
      </div>
      </div>
}
    </>
  );
}

export default ProfileButton;
