import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import  { Spot, getAllSpots } from '../../store/spots';
import './HomePage.css';
import { RootState } from '../../store';


const HomePage: React.FC = (): JSX.Element => {
  const dispatch = useDispatch();

  const spotsObj = useSelector((state: RootState) => state.spots.allSpots);

  const spots: Spot[] = Object.values(spotsObj);

  useEffect(() => {
    dispatch(getAllSpots());
    document.title = 'Home';
  }, [dispatch]);

  return (
    <section>
      <div id='main-container'>
        {spots.map((spot) => (
          <div className='spot-container' key={spot.id}>
            <NavLink to={`/spots/${spot.id}`} style={{ textDecoration: 'none' }}>
              <img className='spot-image-container' src={spot.previewImage} alt='prevImage' />
              <div className='top-line'>
                <div id='left-side'>{spot.city}, {spot.state}</div>
                <div id='right-side'>
                  <div className='star-emoticon'>
                    <i className="fa-solid fa-star fa-sm"></i>
                    {spot.avgRating}
                  </div>
                </div>
              </div>
              <div className='price'>${spot.price.toFixed(2)} night</div>
            </NavLink>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomePage;
