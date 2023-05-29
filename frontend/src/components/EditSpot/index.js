import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import { editOneSpot } from '../../store/spots';
import './EditSpot.css';

function EditSpot() {
  const history = useHistory();
  const dispatch = useDispatch();
  const spotsObj = useSelector(state => state.spots.singleSpot);
  const owner = useSelector(state => state.spots.singleSpot.ownerId);
  const [address, setAddress] = useState(spotsObj.address);
  const [city, setCity] = useState(spotsObj.city);
  const [state, setState] = useState(spotsObj.state);
  const [country, setCountry] = useState(spotsObj.country);
  const [name, setName] = useState(spotsObj.name);
  const [description, setDescription] = useState(spotsObj.description)
  const [price, setPrice] = useState(spotsObj.price)
  const [validationErrors, setValidationErrors] = useState([]);
  const sessionUser = useSelector(state => state.session.user);



  useEffect(() => {
    const errors = [];

    if (!sessionUser) {
      errors.push('User must be logged in to edit spot')
    }

    if (sessionUser.id !== owner) {
        errors.push('Must own spot to edit spot')
    }

    if (address.length === 0) {
      errors.push('Street address is required');
    }
    if (city.length === 0) {
      errors.push('City is required');
    }
    if (state.length === 0) {
      errors.push('State is required');
    }
    if (country.length === 0) {
      errors.push('Country is required');
    }
    if (name.length === 0) {
      errors.push('Name is required');
    }
    if (description.length === 0) {
      errors.push('Description is required');
    }
    if (!price || price <= 0) {
      errors.push('Price per day is required');
    }

    if (!Number(price)) {
      errors.push('Price must be a number')
    }


    setValidationErrors(errors);
  }, [sessionUser, owner, address, city, state, country, name, description, price]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const editedSpot = {
      address,
      city,
      state,
      country,
      'lat': 50,
      'lng': 100,
      name,
      description,
      price,
    };

    let spotChanges = await dispatch(editOneSpot(editedSpot, spotsObj.id));
    if (spotChanges) {
      history.push(`/spots/${spotChanges.id}`);
    }
  };

  return (
    <>
      <form className="spot-form"
        onSubmit={handleSubmit}>
        <h1 className='spot-form-header'>Edit Form</h1>
        <ul className="spot-form-errors">
          {validationErrors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
          Address
        <label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
          City
        <label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>
          State
        <label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </label>
          Country
        <label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </label>
          Name
        <label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
          Description
        <label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
          Price
        <label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <button type="submit">Edit Spot</button>
      </form>
    </>
  );
}

export default EditSpot
