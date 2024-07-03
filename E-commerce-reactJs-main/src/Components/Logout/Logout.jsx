import React, { useEffect } from 'react'
import { selectLoggedInUser, signOutAsync } from '../../Store/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
export default function Logout() {

    const dispatch = useDispatch();
    const user = useSelector(selectLoggedInUser);
     console.log(user)
    useEffect(()=>{
        dispatch(signOutAsync(user));
    })
  return (
    <>
     { !user && <Navigate to="/login" replace={true}></Navigate>}
     </>
  )
}
