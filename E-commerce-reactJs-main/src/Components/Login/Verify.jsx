import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./Spinner.css";
import { verifyMailAsync } from "../../Store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { authStateSelector } from "../../Store/authSlice";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const VerifyPage = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const state = useSelector(authStateSelector);
  const query = useQuery();
  const dispatch = useDispatch();
console.log("man this is pure bs")
  useEffect(() => {
    const verifyBody = {
        verificationToken:query.get("token"),
        email:query.get("email")
    }
    dispatch(verifyMailAsync(verifyBody))
  }, []);

  return (
    <div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Verifying Your Account
          </h2>
          {state === "loading" ? (
            <div className="spinner-container flex justify-center">
              <div className="loading-spinner pl-8"></div>
            </div>
          ) : (
            <div className="flex justify-center gap-3">
              <div className="pl-8">Email Verified You can Now </div>
              <Link to="/login" className="text-blue-500">log in</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
