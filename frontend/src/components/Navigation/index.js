import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';



function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);



  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <ul className='profile-button-reviews'>
        <div>
          <ProfileButton user={sessionUser} />
        </div>

      </ul>


    );
  } else {
    sessionLinks = (
      <div className='LogIn-SignUp'>
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </div>
    );
  }

  const mimicSpotLink = sessionUser ? (
    <NavLink className='ActualLink' to={'/spots/new'}>AirBnb-Mimic Your Spot</NavLink>
  ) : (
    <OpenModalButton
      buttonText="AirBnb-Mimic Your Spot"
      modalComponent={<LoginFormModal />}
      id='ActualLink-logout'
    />
  );
  return (
    <div className='NavBar'>
      <div className='AirBnbLogoHomeLink'>
        <NavLink exact to="/"><i className="fa-brands fa-airbnb fa-2xl"></i></NavLink>
      </div>
      <div className="Mimic-Spot-Link">
        {mimicSpotLink}
      </div>
      {isLoaded && sessionLinks}
    </div>
  );
}

export default Navigation;
