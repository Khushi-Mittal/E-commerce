import { API_URL } from "../../constants";

export function addToCart(item) {
    return new Promise(async (resolve, reject) => {
      try {

        const res = await fetch("/api/cart/add", {
          method: "POST",
          body: JSON.stringify(item),
          headers: { 'content-type': 'application/json' },
        });

        if (!res.ok) {
          // Check if the response status is not OK (e.g., 4xx or 5xx)
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();

        resolve({ data });
      } catch (error) {

        reject(error); // Reject the promise with the encountered error
      }
    });
  }

export function fetchItemsByUserId(user)
{
    return new Promise(async(resolve)=>{
        const res = await fetch("/api/cart?user="+user.email)
        const data = await res.json();
        resolve({data});
    })
}

export function updateCart(update)
{
    return new Promise(async(resolve)=>{


        const res = await fetch("/api/cart",
        {
            method:"PATCH",
            body:JSON.stringify(update),
            headers:{'content-type':'application/json'}
        })
        const data = await res.json();

        resolve({data})
    })
}

export function deleteFromCart(item)
{

    return new Promise(async(resolve,reject)=>{
        const res = await fetch("/api/cart"
        ,{
            method:"DELETE",
            body:JSON.stringify(item),
            headers:{'Content-Type': 'application/json',}
        });
        const data = await res.json();

        resolve({data:data})
    })
}

export function resetCart(user)
{
    return new Promise(async(resolve)=>{
        const res = await fetchItemsByUserId(user);
        const items = res.data;
    
        for(let i=0;i<items.length;i++)
        {
            await deleteFromCart(items[i]);
        }

        resolve({status:"success"})
    })
}
