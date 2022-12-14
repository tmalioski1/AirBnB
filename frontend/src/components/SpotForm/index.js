import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import { createOneSpot } from '../../store/spots';
import './SpotForm.css';

function SpotForm() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState(0)
  const [spotImage, setSpotImage] = useState('')
  const [validationErrors, setValidationErrors] = useState([]);
  const sessionUser = useSelector(state => state.session.user);

  useEffect(() => {
    const errors = [];

    if (!sessionUser) {
      errors.push('User must be logged in to create spot')
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

    if (spotImage.length === 0) {
      errors.push('Spot image must be included')
    }



    setValidationErrors(errors);
  }, [sessionUser, address, city, state, country, name, description, price, spotImage]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const newSpot = {
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

    const newSpotImage = {
      url: spotImage,
      preview: true
    }

    let createdSpot = await dispatch(createOneSpot(newSpot, newSpotImage));
    if (createdSpot) {
      history.push(`/spots/${createdSpot.id}`);
    }
  };

  return (
    <>
        <form className="spot-form"
        onSubmit={handleSubmit}>
        <h1 className='spot-form-header'>Let's Add Your Home</h1>
        <ul className="spot-form-errors">
          {validationErrors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>

          <input
            type="text"
            value={address}
            placeholder= 'Address'
            onChange={(e) => setAddress(e.target.value)}
            required
          />


          <input
            type="text"
            value={city}
            placeholder='City'
            onChange={(e) => setCity(e.target.value)}
            required
          />


          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />


          <input
            type="text"
            value={country}
            placeholder="Country"
            onChange={(e) => setCountry(e.target.value)}
            required
          />


          <input
            type="text"
            value={name}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            required
          />


          <input
            type="text"
            value={description}
            placeholder= "Description"
            onChange={(e) => setDescription(e.target.value)}
            required
          />


          <input
            type="number"
            value={price}
            placeholder="Price"
            onChange={(e) => setPrice(e.target.value)}
            required
          />


          <input
            type="url"
            value={spotImage}
            placeholder= "Url"
            onChange={(e) => setSpotImage(e.target.value)}
            required
          />

        <button type="submit">Create New Spot</button>
      </form>

    </>
  );
}

export default SpotForm
