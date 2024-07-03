import { useSelector } from "react-redux";
import { API_URL } from "../../constants";
import { authStateSelector } from "../Store/authSlice";

export function createUser(userData)
{
    return new Promise(async(resolve,reject)=>{
        const res = await fetch("/api/auth/register"
        ,{
            method:"POST",
            body:JSON.stringify(userData),
            headers:{"content-type":"application/json"}
        })
        if(res.status===201)
        {
            const data = await res.json();
            resolve({data})
        }
        else
        {
            reject("error while initializing")
        }
    })
}

export function checkUser(loginInfo)
{

    return new Promise(async(resolve,reject)=>{
        const res = await fetch("/api/auth/login",
        {
            method:"POST",
            body:JSON.stringify(loginInfo),
            headers:{"content-type":"application/json"}
        })
        if(res.status===200)
        {
             const data = await res.json();

             resolve(data);
        }
        else
        {
            reject("Invalid crendetials")
        }



    })
}

export function signOut(loginInfo)
{
    return new Promise(async(resolve,reject)=>{

        //  TODO : on server will remove user session info
        resolve({data:"success"})
    })
}

export function verifyMail(verifyBody)
{

    return new Promise(async(resolve,reject)=>{
        const res = await fetch("/api/auth/verify-email",
        {
            method:"POST",
            body:JSON.stringify(verifyBody),
            headers:{"content-type":"application/json"}
        })

        const data = await res.json();

        resolve({data})
    })
}
export function resetPass(verifyBody)
{
    return new Promise(async(resolve,reject)=>{
        const res = await fetch("/api/auth/reset-password",
        {
            method:"POST",
            body:JSON.stringify(verifyBody),
            headers:{"content-type":"application/json"}
        })

        const data = await res.json();


        resolve({data})
    })
}
export function forgotPassword(mail)
{
    return new Promise(async(resolve,reject)=>{
        const res = await fetch("/api/auth/forgot-password",
        {
            method:"POST",
            body:JSON.stringify(mail),
            headers:{"content-type":"application/json"}
        })
        const data = await res.json();
        resolve({data})
    })
}

export function autoLogin()
{
    return new Promise(async(resolve,reject)=>{
        const res = await fetch("/api/auth/auto-login",
        {
            method:"POST"
        })
        const data = await res.json();
       
        resolve({data});
    })
}



// const { data } = await axios.post('/api/v1/auth/verify-email', {
//     verificationToken: query.get('token'),
//     email: query.get('email'),
// });
