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
  const [price, setPrice] = useState('')
  const [spotImage, setSpotImage] = useState('')
  const sessionUser = useSelector(state => state.session.user);
  const [errors, setErrors] = useState([])





  const handleSubmit = async (e) => {
    e.preventDefault();

    const image = new Image();
    image.src = spotImage;

    image.onload = () => {
      if (image.width === 0 || image.height === 0) {
        setErrors(['Invalid image URL - please choose another image']);
      } else {
        const newSpot = {
          address,
          city,
          state,
          country,
          lat: 50,
          lng: 100,
          name,
          description,
          price,
        };

        const newSpotImage = {
          url: spotImage,
          preview: true,
        };

        dispatch(createOneSpot(newSpot, newSpotImage))
          .then((createdSpot) => {
            history.push(`/spots/${createdSpot.id}`);
          })
          .catch((error) => {
            setErrors([error.message]);
          });
      }
    };

    image.onerror = () => {
      setErrors(['Invalid image URL - please choose another image']);
    };
  };

  return (
    <>
        <form className="spot-form"
        onSubmit={handleSubmit}>
        <h1 className='spot-form-header'>Let's Add Your Home</h1>
        {errors.length > 0 && (
        <div className="error-messages">
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

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
  type="text"
  value={price}
  placeholder="Price"
  onChange={(e) => {
    const enteredValue = e.target.value;
    const regex = /^\d*(\.\d{0,2})?$/; // Regex pattern to allow up to two decimal places
    if (regex.test(enteredValue) || enteredValue === "") {
      setPrice(enteredValue);
    }
  }}
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
