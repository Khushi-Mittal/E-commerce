import { API_URL } from "../../constants";
export function fetchLoggedInUserOrders(userId)
{
    return new Promise(async(resolve)=>{
        const res = await fetch("http://localhost:3000/orders/?user.id="+userId)
        const data = await res.json();

        resolve({data})
    })
}

export function fetchLoggedInUser(userId)
{
    return new Promise(async(resolve)=>{
        const res = await fetch("http://localhost:3000/users/"+userId)
        const data = await res.json();

        resolve({data})
    })
}

export function updateUser(userInfo)
{

    return new Promise(async(resolve)=>{
        const res = await fetch(API_URL+"/users/"+userInfo._id
        ,{
            method:"PATCH",
            body:JSON.stringify(userInfo),
            headers:{"content-type":"application/json"}
        })
        const data = await res.json();
        console.log(data)
        resolve({data})
    })
}
