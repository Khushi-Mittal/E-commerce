import { useEffect,useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { resetCartAsync } from "../../Store/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectLoggedInUser } from "../../Store/authSlice";
import { resetOrder, selectOrderDetails } from "../../Store/orderSlice";
export default function Success() {

  const user = useSelector(selectLoggedInUser)
  const dispatch = useDispatch();
  useEffect(()=>{
      dispatch(resetCartAsync(user));
      dispatch(resetOrder())
  },)
  return (
    <>
       <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
         <div className="text-center">
           <p className="text-base font-semibold text-indigo-600">Order Successfully Placed</p>
              <p className="mt-6 text-base leading-7 text-gray-600">
                You can check your orders in My Account - My Orders
                </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
             <Link
                     to='/home'
               className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
             >
               Go back home
             </Link>
           </div>
         </div>
       </main>
     </>
  )
}
