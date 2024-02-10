import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAllSpots } from '../../store/spots';
import { NavLink } from 'react-router-dom';
import './HomePage.css';

import { RootState } from '../../store';

interface Spot {
  id: string;
  city: string;
  state: string;
  previewImage: string;
  avgRating: number;
  price: number;
}

const HomePage: React.FC = () => {
  const dispatch = useDispatch();

  // Use RootState as the type for useSelector
  const spotsObj = useSelector((state: RootState) => state.spots.allSpots);

  // Define spots array as Spot[]
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
