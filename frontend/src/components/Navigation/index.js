import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';



function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const history = useHistory()

  const getReviews = (e) => {
    e.preventDefault();
    history.push('/userReviews')
  }
  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <ul>
      <li>
        <ProfileButton user={sessionUser} />
      </li>
      <div>
      <button onClick={getReviews}>Your Reviews</button>
      </div>
      </ul>


    );
  } else {
    sessionLinks = (
      <div className='LogIn-SignUp'>
        <OpenModalButton
          className='LogInButton'
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
          className='SignUpButton'
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </div>
    );
  }

  return (
    <ul className='NavBar'>
        <div className="AirBnbLogo">
        <i class="fa-brands fa-airbnb"></i>
        </div>
      <div className='HomeLink'>
        <NavLink exact to="/">Home</NavLink>
      </div>
        <div className="Mimic-Spot-Link">
        <NavLink to={'/spots/new'}>AirBnb-Mimic Your Spot</NavLink>
      </div>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;
