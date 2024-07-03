import { API_URL } from "../../constants";

export function addOrder(order) {
    return new Promise(async (resolve, reject) => {
      try {

        const res = await fetch(API_URL+"/orders", {
          method: "POST",
          body: JSON.stringify(order),
          headers: { 'content-type': 'application/json' },
        });

        if (!res.ok) {
          // Check if the response status is not OK (e.g., 4xx or 5xx)
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        resolve({ data });
      } catch (error) {
        console.error('Error in addToCart:', error);
        reject(error); // Reject the promise with the encountered error
      }
    });
}

export function updateOrder(order) {
    return new Promise(async (resolve) => {

        const res = await fetch(API_URL+"/orders/"+order._id, {
          method: "PATCH",
          body: JSON.stringify(order),
          headers: { 'content-type': 'application/json' },
        });

        const data = await res.json();

        const totalItems = await res.headers.get("X-Total-Count")
        resolve({ data:data,totalItems });
    });
  }


export function fetchAllOrders(pagination)
{
      // filter={"category":["samrtphone","laptops"]}
      // sort = {_sort:"price",_order:"desc"}
      // pagination = {_page:"1",_limit=10}
      let queryString = "";

      for(let key in pagination)
          queryString+=`${key}=${pagination[key]}&`

      return new Promise(async(resolve)=>{
          const res = await fetch(API_URL+`/orders?`+queryString)
          const data = await res.json();
          console.log(data)
          const totalOrders = await res.headers.get("X-Total-Count")
          resolve({data:{orders:data,totalOrders:+totalOrders}});
      })
}

export function fetchUserOrders(user)
{
    return new Promise(async(resolve,reject)=>{
        const res = await fetch(API_URL+"/orders?user="+user.email);
        const data =await res.json();
        resolve({data});
    })
}
