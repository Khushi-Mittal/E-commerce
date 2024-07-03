import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { discountPrice } from "../../../constants";
import {
  selectCartItems,
  updateCartAsync,
  deleteFromCartAsync,
  addAddressToItems,
} from "../../Store/cartSlice";
import { useForm } from "react-hook-form";
import { selectLoggedInUser } from "../../Store/authSlice";
import { addOrderAsync, selectOrderStatus } from "../../Store/orderSlice";
import { selectUserInfo, updateUserAsync } from "../../Store/userSlice";
import {
  addAddressAsync,
  addressSelector,
  getAddressAsync,
} from "../../Store/addressSlice";
export default function Checkout() {
  const [open, setOpen] = useState(true);
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  const orderPlaced = useSelector(selectOrderStatus);
  const addresses = useSelector(addressSelector);

  useEffect(() => {
    dispatch(getAddressAsync(user));
  }, []);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const handleQuantity = (e, product) => {
    dispatch(updateCartAsync({ ...product, quantity: +e.target.value }));
  };

  const handleRemove = (e, product) => {
    dispatch(deleteFromCartAsync(product.id));
  };

  const handleOrder = () => {
    const order = {};
    let items = cartItems;
    items = items.map((item) => ({
      ...item,
      address: selectedAddress,
      status: "pending",
      paymentMethod: paymentMethod,
      user:user._id,
      totalAmount:discountPrice(item)*item.quantity
    }));
    dispatch(addAddressToItems(items));
    dispatch(addOrderAsync({"items":items}))
    // const order = {
    //   cartItems,
    //   totalAmount,
    //   totalItems,
    //   user,
    //   paymentMethod,
    //   selectedAddress,
    //   Orderstatus:"pending"
    // };
    // dispatch(addOrderAsync(order));
    // redirect to order success page
    // clear cart after order
    // on server change the stock number
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();
  const totalAmount = cartItems.reduce(
    (amount, item) => discountPrice(item) * item.quantity + amount,
    0
  );
  const totalItems = cartItems.reduce(
    (amount, item) => item.quantity + amount,
    0
  );


  return (
    <>
      {cartItems.length === 0 && <Navigate to="/" replace={true}></Navigate>}
      {orderPlaced && <Navigate to="/payment" replace={true}></Navigate>}
      <div className="grid grid-cols-1  lg:grid-cols-5   mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 gap-10">
        <div className="lg:col-span-3 bg-white p-4 mt-12">
          <form
            noValidate
            onSubmit={handleSubmit((data) => {
              dispatch(addAddressAsync({ ...data }));
              reset();
            })}
          >
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Use a permanent address where you can receive mail.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        {...register("name", { required: "name is required" })}
                        id="name"
                        autoComplete="given-name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        {...register("email", {
                          required: "email is required",
                        })}
                        type="email"
                        autoComplete="email"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Phone
                    </label>
                    <div className="mt-2">
                      <input
                        id="phone"
                        {...register("phone", {
                          required: "phone is required",
                        })}
                        type="phone"
                        autoComplete="phone"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Street address
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        {...register("street", {
                          required: "street is required",
                        })}
                        id="street"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 sm:col-start-1">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      City
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        {...register("city", { required: "city is required" })}
                        id="city"
                        autoComplete="address-level2"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="region"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      State
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        {...register("state", {
                          required: "state is required",
                        })}
                        autoComplete="address-level1"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="postal-code"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      ZIP / Postal code
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        {...register("pinCode", {
                          required: "pin code is required",
                        })}
                        id="postal-code"
                        autoComplete="postal-code"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Add Address
                </button>
              </div>
              <div className="border-b border-gray-900/10 pb-12">
                <div className="mt-10 space-y-10">
                  <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                      Address
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Choose from the existing address
                    </p>
                  </div>
                  <ul role="list" className="">
                    {addresses.map((address, idx) => (
                      <li
                        key={idx}
                        className="flex border-2 gap-x-6 m-2 p-2 justify-between py-5 flex-wrap"
                      >
                        <div className="flex min-w-0 gap-x-4 item-center ">
                          <input
                            onChange={() => {
                              setSelectedAddress(address);
                            }}
                            id="push-everything"
                            name="push-notifications"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          <div className="min-w-0 flex-auto ">
                            <p className="text-sm font-semibold leading-6 text-gray-900">
                              {address.street}
                            </p>
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                              {address.email}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 px-8 sm:flex sm:flex-col sm:items-end">
                          <p className="text-sm leading-6 text-gray-900">
                            {address.phone}
                          </p>
                          {address.lastSeen ? (
                            <p className="mt-1 text-xs leading-5 text-gray-500">
                              {address.city} {address.state}{" "}
                              <time dateTime={address.lastSeenDateTime}>
                                {address.pinCode}
                              </time>
                            </p>
                          ) : (
                            <div className="mt-1 flex items-center gap-x-1.5">

                              <p className="text-xs leading-5 text-gray-500">
                              {address.city}, {address.state}{" "}
                              </p>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <fieldset>
                    <legend className="text-sm font-semibold leading-6 text-gray-900">
                      Payment method
                    </legend>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Please Select a payment method
                    </p>
                    <div className="mt-6 space-y-6">
                      <div className="flex items-center gap-x-3">
                        <input
                          id="payment-method"
                          name="payment-method"
                          type="radio"
                          onChange={() => {
                            setPaymentMethod("Cash on Delivery");
                          }}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label
                          htmlFor="payment-method"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Cash on Delivery
                        </label>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <input
                          onChange={() => {
                            setPaymentMethod("Card");
                          }}
                          id="payment-method"
                          name="payment-method"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label
                          htmlFor="push-email"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Card
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className=" lg:col-span-2  px-4 bg-white shadow-xl mt-12">
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <div class="flex items-start justify-between">
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
                              <Link to={"/product-details/" + product.id}>
                                {product.title}
                              </Link>
                            </h3>
                            <p className="ml-4">{discountPrice(product)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {product.brand}
                          </p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="text-gray-500">
                            <label
                              htmlFor="quantity"
                              className="inline mr-5 text-sm font-medium leading-6 text-gray-900"
                            >
                              Qty
                            </label>
                            <select
                              className="rounded-lg py-1"
                              onChange={(e) => {
                                handleQuantity(e, product);
                              }}
                              value={product.quantity}
                            >
                              {Array.from({ length: 10 }, (_, index) => (
                                <option key={index}>{index + 1}</option>
                              ))}
                            </select>
                          </div>

                          <div className="flex">
                            <button
                              type="button"
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                              onClick={(e) => {
                                handleRemove(e, product);
                              }}
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
              <div
                onClick={() => {
                  handleOrder();
                }}
                className="flex cursor-pointer items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Order Now
              </div>
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
      </div>
    </>
  );
}
