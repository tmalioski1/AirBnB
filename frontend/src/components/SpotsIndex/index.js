import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAllSpots } from '../../store/spots';

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
            <li
              id={spot.id}
              >
               {spot.address}
              </li>
          ))
        }
      </ul>

    </section>
  );
}

export default SpotsIndex;
