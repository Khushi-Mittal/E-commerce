import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCartItems, updateCartAsync ,deleteFromCartAsync} from "../../Store/cartSlice";
import { discountPrice } from "../../../constants";


export default function Cart() {
  const [open, setOpen] = useState(true);
  const cartItems = useSelector(selectCartItems);

  const dispatch = useDispatch();
  const handleQuantity = (e,product)=>{
    dispatch(updateCartAsync({...product,quantity:+e.target.value,totalAmount:e.target.value*discountPrice(product)}))
  }

  const handleRemove = (e,product)=>{
      dispatch(deleteFromCartAsync(product))
  }
  const totalAmount  = cartItems.reduce((amount,item)=>discountPrice(item)*item.quantity+amount,0);
  const totalItems = cartItems.reduce((amount,item)=>item.quantity+amount,0);
  return (
    <>
    {cartItems.length===0 && <Navigate to="/" replace={true}></Navigate>}
    <div className="flex h-full flex-col overflow-y-scroll mx-auto max-w-7xl px-4 bg-white shadow-xl mt-12">
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start justify-between">
            <h2
              className="text-lg font-medium text-gray-900"
              id="headlessui-dialog-title-:r2:"
              data-headlessui-state="open"
            >
              Shopping cart
            </h2>
            <div className="ml-3 flex h-7 items-center">
              <button
                type="button"
                className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
              >
                <span className="absolute -inset-0.5"></span>
                <span className="sr-only">Close panel</span>
              </button>
            </div>
          </div>
          <div className="ml-3 flex h-7 items-center">
            <button
              type="button"
              className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
              onClick={() => setOpen(false)}
            >
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Close panel</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-8">
          <div className="flow-root">
            <ul role="list" className="-my-6 divide-y divide-gray-200">
              {cartItems.map((product) => (
                <li key={product.id} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={product.thumbnail}
                      alt={product.thumbnail}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <Link to={"/product-details/"+product.id}>{product.title}</Link>
                        </h3>
                        <p className="ml-4">{discountPrice(product)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {product.brand}
                      </p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="text-gray-500">
                        <label htmlFor="quantity"
                         className="inline mr-5 text-sm font-medium leading-6 text-gray-900">
                            Qty
                         </label>
                         <select className="rounded-lg py-1" onChange={(e)=>{handleQuantity(e,product)}}  value={product.quantity}>
                         {Array.from({ length: 10 }, (_, index) => (
                        <option key={index}>{index + 1}</option>
                        ))}
                         </select>
                      </div>

                      <div className="flex">
                        <button
                          type="button"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                          onClick={(e)=>{handleRemove(e,product)}}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
        <div className="flex justify-between my-2 text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <p>₹ {totalAmount}</p>
        </div>
        <div className="flex justify-between my-2 text-base font-medium text-gray-900">
          <p>Total Items in Cart</p>
          <p>{totalItems} items</p>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">
          Shipping and taxes calculated at checkout.
        </p>
        <div className="mt-6">
          <Link to="/checkout"
            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Checkout
          </Link>
        </div>
        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
          <p>
            or &nbsp;
            <Link to="/">
            <button
              type="button"
              className="font-medium text-indigo-600 hover:text-indigo-500"
              onClick={() => setOpen(false)}
            >
              Continue Shopping
              <span aria-hidden="true"> &rarr;</span>
            </button>
            </Link>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
