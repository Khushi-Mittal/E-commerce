import React,{useEffect} from 'react'
import Navbar from '../Navbar/Navbar'
import AdminProductList from './AdminProductList'
import { useDispatch } from 'react-redux';
import { autoLoginAsync } from '../../Store/authSlice';
export default function AdminHome() {

    const dispatch = useDispatch();

  return (
    <div>
        <Navbar>
           <AdminProductList></AdminProductList>
        </Navbar>
    </div>
  )
}
