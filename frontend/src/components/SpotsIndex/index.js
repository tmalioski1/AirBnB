import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAllSpots } from '../../store/spots';
import { NavLink } from 'react-router-dom';


const SpotsIndex = () => {
  const dispatch = useDispatch();
  const spotsObj = useSelector(state => state.spots.allSpots);
  const spots = Object.values(spotsObj)

useEffect(() => {
    dispatch(getAllSpots())
}, [dispatch])

  return (
    <section>
      <ul>
        {
          spots.map(spot => (
            <NavLink to={`/spots/${spot.id}`}>
               {spot.address}
              </NavLink>
          ))
        }
      </ul>

    </section>
  );
}

export default SpotsIndex;
