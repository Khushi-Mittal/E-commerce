import { API_URL } from "../../constants";

export function getAddress(user)
{
    return new Promise(async(resolve,reject)=>{
        try {
            const res = await fetch(`/api/address?email=${user.email}`)
            const data = await res.json();

            resolve({data});

        } catch (error) {
        
            reject(error);
        }
    })
}

export function addAddress(address)
{
    return new Promise(async(resolve,reject)=>{
        try {
            const res = await fetch("/api/address", {
                method:"POST",
                body:JSON.stringify(address),
                headers:{"content-type":"application/json"}
            })

            const data = await res.json();
            resolve({data});

        } catch (error) {
            reject(error);
        }
    })
}
export function removeAddress(address)
{
    return new Promise(async(resolve,reject)=>{
        try {
            const res = await fetch("/api/address", {
                method:"DELETE",
                body:JSON.stringify(address),
                headers:{"content-type":"application/json"}
            })

            const data = await res.json();
            resolve({data});

        } catch (error) {
            reject(error);
        }
    })
}

export function updateAddress(address)
{
    return new Promise(async(resolve,reject)=>{
        try {
            const res = await fetch("/api/address", {
                method:"PATCH",
                body:JSON.stringify(address),
                headers:{"content-type":"application/json"}
            })

            const data = await res.json();
            resolve({data});

        } catch (error) {
            reject(error);
        }
    })
}
