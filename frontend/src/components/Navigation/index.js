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
  const history = useHistory()

  const getReviews = (e) => {
    e.preventDefault();
    history.push('/userReviews')
  }
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

  return (
    <div className='NavBar'>
      <div className='AirBnbLogoHomeLink'>
        <NavLink exact to="/"><i className="fa-brands fa-airbnb fa-2xl"></i></NavLink>
      </div>
      <div className="Mimic-Spot-Link">
        <NavLink className='ActualLink' to={'/spots/new'}>AirBnb-Mimic Your Spot</NavLink>
      </div>
      {isLoaded && sessionLinks}
    </div>
  );
}

export default Navigation;
