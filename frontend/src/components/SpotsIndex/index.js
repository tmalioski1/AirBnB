import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAllSpots, getOneSpot } from '../../store/spots';
import { NavLink, useParams } from 'react-router-dom';


const SpotsIndex = () => {
  const dispatch = useDispatch();
  const { id } = useParams()
  const spotsObj = useSelector(state => state.spots.allSpots);
  const spots = Object.values(spotsObj)

useEffect(() => {
    dispatch(getAllSpots())
}, [dispatch])

useEffect(() => {
  dispatch(getOneSpot(id))
}, [id, dispatch])

  return (
    <section>
      <ul>
        {
          spots.map(spot => (
            <NavLink
            key={spot.id}
            to={`/spots/${spot.id}`}>
               {spot.address}
              </NavLink>
          ))
        }
      </ul>

    </section>
  );
}

export default SpotsIndex;
