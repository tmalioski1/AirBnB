import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { getOneSpot, deleteOneSpot } from '../../store/spots';
import './SingleSpotPage.css';


const SingleSpotPage = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spotsObj = useSelector(state => state.spots.singleSpot);



  useEffect(() => {
    dispatch(getOneSpot({spotId}))
  }, [spotId, dispatch])

  const deleteSpot = (e) => {
    e.preventDefault();

    dispatch(deleteOneSpot(spotId))
  }

  return (
    <>
   <h1>{spotsObj.description}</h1>
   <div>
   <NavLink to={`/spots/${spotId}/edit`}>Edit Your Spot</NavLink>
   </div>
   <button onClick={deleteSpot}>Delete Spot</button>
   </>


  );
}

export default SingleSpotPage;
