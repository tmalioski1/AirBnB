import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAllSpots } from '../../store/spots';
import { NavLink } from 'react-router-dom';
import './HomePage.css';


const HomePage = () => {
  const dispatch = useDispatch();
  const spotsObj = useSelector(state => state.spots.allSpots);
  const spots = Object.values(spotsObj)

  useEffect(() => {
    dispatch(getAllSpots())
  }, [dispatch])



  return (
    <section>
      <ul className= 'main-container'>
        {
          spots.map(spot => (
            <div className = 'spot-container' key={spot.id}>
              <NavLink
                to={`/spots/${spot.id}`}>
              <img className = 'spot-image-container' src={spot.previewImage} alt='prevImage'></img>
              <div className = 'top-line'>{spot.city}, {spot.state} *{spot.avgRating}</div>
              <p className = 'price'>${Number(spot.price).toFixed(2)} night</p>
              </NavLink>

            </div>
          ))
        }
      </ul>

    </section>
  );
}

export default HomePage;
