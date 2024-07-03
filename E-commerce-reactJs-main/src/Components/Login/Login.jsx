import React, { useEffect } from 'react'
import { Link,Navigate } from 'react-router-dom'
import {useForm} from 'react-hook-form';
import { selectLoggedInUser,createUserAsync, errorSelector, autoLoginAsync} from '../../Store/authSlice';
import { useSelector, useDispatch} from 'react-redux';
import { checkUserAsync } from '../../Store/authSlice';
export default function Login() {
    const dispatch = useDispatch();
    const {register,handleSubmit,watch,formState:{errors}} = useForm();

    const user = useSelector(selectLoggedInUser);
    const error = useSelector(errorSelector)

    console.log("user = ",user)
    return (
    <div>
      {user && <Navigate to="/" replace={true}></Navigate>}
     <>
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
         Log in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit((data)=>{
           dispatch(checkUserAsync(data))
        })}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                {...register("email", {required:"email is required",
                pattern:{value:/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
                message:"email is not valid"}})}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="text-sm">
                <Link to="/user/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </Link>
              </div>
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>
            <div className="mt-2">
              <input
                id="password"
                {...register("password", {required:"password is required",
                pattern:{value:/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                message:"password should contain minimum 8 charactors and  at least 1 uppercase, lowercase, digit  "}})}
                type="password"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        {error && <p className="text-red-500">{error.message}</p>}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Log in
            </button>

          </div>
          <div className="flex gap-4">
                    <button className="bg-[#1D9BF0] w-1/2 py-1 rounded-md text-white font-bold cursor-pointer hover:bg-[#181196]">Google</button>
                    <button className="bg-[#24292F] w-1/2 py-1 rounded-md text-white font-bold cursor-pointer hover:bg-[#181196]">Github</button>
          </div>

        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{' '}
          <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
           Create an account
          </Link>
        </p>
      </div>


    </div>

  </></div>
  )
}
