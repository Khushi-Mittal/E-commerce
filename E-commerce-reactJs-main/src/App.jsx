import { useEffect, useState } from 'react'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import { fetchItemsByUserIdAsync } from './Store/cartSlice'
import { useDispatch, useSelector } from 'react-redux'

import { fetchLoggedInUserAsync } from './Store/userSlice'
import Protected from "./Components/Protected/Protected.jsx";
import NotFound from './Components/NotFound/NotFound.jsx'
import Success from "./Components/Success/Success.jsx";
import UserOrdersPage from "./Components/User/UserOrdersPage.jsx";
import ProfilePage from "./Components/User/ProfilePage.jsx";
import Logout from "./Components/Logout/Logout.jsx";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword.jsx";
import AdminHome from "./Components/Admin/AdminHome.jsx";
import AdminProductPage from "./Components/Admin/AdminProductPage.jsx";
import ProductFormPage from "./Components/Admin/ProductFormPage.jsx";
import AdminOrders from "./Components/Admin/AdminOrders.jsx";
import VerifyPage from "./Components/Login/Verify.jsx";
import ForgotPass from "./Components/Login/ForgotPass.jsx";
import ResetPass from "./Components/Login/ResetPass.jsx"
import Login from "./Components/Login/Login.jsx";
import Signup from "./Components/Signup/Signup.jsx";
import CartPage from "./Components/CartPage/CartPage.jsx";
import Checkout from "./Components/Checkout/Checkout.jsx";
import ProductPage from "./Components/ProductPage/ProductPage.jsx";
import { Provider } from "react-redux";
import { appStore } from './Store/Store.js'

import Home from './Components/Home/Home.jsx'
import { authStateSelector, autoLoginAsync, errorSelector, selectLoggedInUser } from './Store/authSlice';
import Payment from './Components/Payment/Payment.jsx'
function App() {

    const appRouter = createBrowserRouter([
        {
          path: "/",
          element: <Protected><Home/></Protected>,
        },
        {
          path: "/admin",
          element: <Protected><AdminHome></AdminHome></Protected>,
        },
        {
          path: "/admin/product-details/:id",
          element: <Protected><AdminProductPage/></Protected>,
        },
        {
          path:"/admin/product-form",
          element:(

                  <ProductFormPage></ProductFormPage>

          )
        },
        {
          path:"/admin/product/edit/:id",
          element:(
                <Protected>
                     <ProductFormPage></ProductFormPage>
                </Protected>


          )
        },
        {
          path:"/admin/orders",
          element:(
              <Protected>
                  <AdminOrders></AdminOrders>
              </Protected>
          )
        },
        {
          path: "/home",
          element: <Protected><Home /></Protected>,
        },
        {
          path: "/signup",
          element:  <Protected>
         <Signup />
      </Protected>,
        },
        {
          path: "/login",
          element:
         <Login />

        },
        {
          path: "/cart",
          element:<CartPage />,
        },
        {
          path: "/checkout",
          element: <Checkout />,
        },
        {
          path: "/product-details/:id",
          element:<ProductPage />,
        },
        {
          path:"/payment",
          element: <Protected>
      <Payment/>
      </Protected>
        },
        {
          path:"/orders",
          element: <Protected>
       <UserOrdersPage/>
      </Protected>
        },
        {
          path:"/profile",
          element: <Protected>
          <ProfilePage></ProfilePage>
      </Protected>
        },
        {
            path:"/success",
            element: <Protected>
          <Success/>
        </Protected>
          },
        {
          path:"/logout",
          element:<Logout></Logout>

        },
        {
          path:"/forgot-password",
          element:<ForgotPassword></ForgotPassword>
        },
        {
          path:"/user/verify-email",
          element:<VerifyPage/>
        },
        {
          path:"/user/forgot-password",
          element:<ForgotPass/>

        },
        {
          path:"/user/reset-password",
          element:<ResetPass/>
        },
        {
          path:"*",
          element:<NotFound></NotFound>
        },
      ]);

  return (
    <Provider store={appStore}>
    <RouterProvider router={appRouter} />
    </Provider>
  )

}

export default App

{/* <Auth0Provider
    domain="bahubali.us.auth0.com"
    clientId="LTRByvsBFmNpyO1rPuncNEGLlIRhP5PR"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
     <Provider store={appStore}>
  <RouterProvider router={appRouter} />
  </Provider>
  </Auth0Provider> */}
