import { useEffect,useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { resetCartAsync } from "../../Store/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectLoggedInUser } from "../../Store/authSlice";
import { resetOrder, selectOrderDetails } from "../../Store/orderSlice";
import RenderRazorpay from "../Razerpay/RazerPay";
export default function Payment({ order }) {

  const orderInstance = useSelector(selectOrderDetails)
  const user = useSelector(selectLoggedInUser)
  const [displayRazorpay, setDisplayRazorpay] = useState(true);
  const [orderDetails, setOrderDetails] = useState({orderId:orderInstance.order_id,
    currency:"INR",
    amount:orderInstance.amount});

const [paymentStatus,setPaymentStatus] = useState("pending");
console.log(paymentStatus)
  return(
    <div>
{paymentStatus==="success" && <Navigate to="/success" replace={true}></Navigate>}
  {displayRazorpay && paymentStatus==="pending" && ( <RenderRazorpay
    amount={orderInstance.amount}
    currency={orderInstance.currency}
    orderId={orderInstance.order_Id}
    keyId={"rzp_test_uiuLy9EqinpEBV"}
    keySecret={"o8y2JICpIeCXEOWvnc3sY0v3"}
    user = {user}
    setPaymentStatus={setPaymentStatus}
  /> )}
  </div>
  )

}
