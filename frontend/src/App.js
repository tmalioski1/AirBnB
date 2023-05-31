import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import HomePage from "./components/HomePage";
import SingleSpotPage from "./components/SingleSpotPage";
import SpotForm from "./components/SpotForm"
import EditSpot from "./components/EditSpot"
import UserReviewsPage from "./components/UserReviewsPage.js"
import ReviewForm from "./components/ReviewForm";
import Bookings from "./components/Bookings"


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route
            exact path="/"
          >
            <HomePage />
          </Route>
          <Route
             path="/userReviews"
          >
            <UserReviewsPage />
          </Route>
          <Route
             path="/trips"
          >
            <Bookings/>
          </Route>
          <Route
            path="/spots/new"
          >
            <SpotForm/>
          </Route>
          <Route
            path="/spots/:spotId/edit"
          >
            <EditSpot/>
          </Route>
          <Route
            path="/spots/:spotId/review"
          >
            <ReviewForm/>
          </Route>
          <Route
            path="/spots/:spotId"
          >
            <SingleSpotPage/>
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
