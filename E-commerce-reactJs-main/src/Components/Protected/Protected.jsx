import {useDispatch, useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom';
import { authStateSelector, autoLoginAsync, errorSelector, selectLoggedInUser } from '../../Store/authSlice';
import { useEffect } from 'react';
import Loader from '../Loader/Loader';
export default function Protected({children})
{
    const dispatch = useDispatch();
    const authState = useSelector(authStateSelector)
    const user = useSelector(selectLoggedInUser);
    const authError = useSelector(errorSelector)
    useEffect(()=>{
        dispatch(autoLoginAsync());
    },[])

    if(!user)
        return <Navigate to="/login"></Navigate>
    if(user)
    return children
}
