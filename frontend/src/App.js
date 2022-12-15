import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import HomePage from "./components/HomePage";
import SingleSpotPage from "./components/SingleSpotPage";
import SpotForm from "./components/SpotForm"
import EditSpot from "./components/EditSpot"

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
            path="/spots/new"
          >
            <SpotForm/>
          </Route>
          <Route
            path="/spots/:spotId/new"
          >
            <EditSpot/>
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
