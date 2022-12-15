import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { getOneSpot } from '../../store/spots';
import './SingleSpotPage.css';


const SingleSpotPage = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spotsObj = useSelector(state => state.spots.singleSpot);



  useEffect(() => {
    dispatch(getOneSpot({spotId}))
  }, [spotId, dispatch])



  return (
    <>
   <h1>{spotsObj.description}</h1>
   <div>
   <NavLink to={'/spots/:spotId/edit'}>Edit Your Spot</NavLink>
   </div>
   </>


  );
}

export default SingleSpotPage;
