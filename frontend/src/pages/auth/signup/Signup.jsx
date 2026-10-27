import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom';
import { Form,Button,Alert} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearAuthError, selectAuthError, selectAuthStatus } from '../../../store/authSlice';
import "./Signup.css";

export default function Signup() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const error = useSelector(selectAuthError);
  const loading = useSelector(selectAuthStatus) === "loading";

  // Don't carry an error over from another page
  useEffect(()=>{
    dispatch(clearAuthError());
  },[dispatch]);

  const[formData, setFormData]= useState({
    email:'',
    name:'',
    password:''
  })

  const handleInputChange=(event)=>{
    const{name,value}=event.target;
    setFormData({
      ...formData,
      [name]:value
    })
  }

  const handleSubmit= async(e)=>{
    e.preventDefault();
    try{
      await dispatch(register(formData)).unwrap();
      navigate("/login");
    } catch{
      // Error message is shown from the store; keep name/email, clear the password
      setFormData({
        ...formData,
        password:""
      })
    }
  }
  return (
    <div className='center-form'>
      <Form onSubmit={handleSubmit}>
        <h1>Signup</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group controlId='formBasicEmail'>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder='Enter Email'
            value= {formData.email}
            onChange={handleInputChange}
            required
            />
        </Form.Group>
        <Form.Group controlId='formBasicName'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder='Enter Name'
            value= {formData.name}
            onChange={handleInputChange}
            required
            />
        </Form.Group>
        <Form.Group controlId='formBasicPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            minLength={6}
            name="password"
            placeholder='Enter password'
            value= {formData.password}
            onChange={handleInputChange}
            required
            />
        </Form.Group>
        <Button variant = "primary" type="submit" className="w-100" disabled={loading}>
          {loading ? "Creating account..." : "Signup"}
        </Button>
      </Form>
    </div>
  )
}
