import React, { useState } from 'react';
import './App.css';

function UserForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
    nationality: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    idType: '',
    idNumber: '',
    expiryDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="container">
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid-two">
          <label>Full Name
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
          </label>
          <label>Date of Birth
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
          </label>
        </div>

        <div className="grid-two">
          <label>Gender
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
          <label>Nationality
            <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} />
          </label>
        </div>

        <div className="grid-two">
          <label>Email
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </label>
          <label>Phone
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
          </label>
        </div>

        <div className="section-title">Address</div>

        <div className="grid-two">
          <label>Street
            <input type="text" name="street" value={formData.street} onChange={handleChange} />
          </label>
          <label>City
            <input type="text" name="city" value={formData.city} onChange={handleChange} />
          </label>
        </div>

        <div className="grid-two">
          <label>State
            <input type="text" name="state" value={formData.state} onChange={handleChange} />
          </label>
          <label>Postal Code
            <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} />
          </label>
        </div>

        <label>Country
          <input type="text" name="country" value={formData.country} onChange={handleChange} />
        </label>

        <div className="section-title">Identification</div>

        <div className="grid-two">
          <label>ID Type
            <input type="text" name="idType" value={formData.idType} onChange={handleChange} />
          </label>
          <label>ID Number
            <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} />
          </label>
        </div>

        <label>Expiry Date
          <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} />
        </label>

        <button type="submit">Save User</button>
      </form>
    </div>
  );
}

export default UserForm;
