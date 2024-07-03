import { API_URL } from "../../constants";

export function fetchAllFilters()
{
    return new Promise(async(resolve)=>{
        // we will change after this and make dynamic
        const res = await fetch("/api/filters");
        const data = await res.json();
        resolve(data);
    })
}

export function fetchProductById(id)
{

    return new Promise(async(resolve)=>{
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        resolve(data.product);
    })
}
export function fetchAllProducts()
{
    return new Promise(async(resolve)=>{
        // we will change after this and make dynamic
        const res = await fetch("/api/products");
        const data = await res.json();
        resolve({data:{products:data.products,totalItems:+data.count}});
    })
}

export function fetchProductsByFilter(filter,sort,pagination)
{
    // filter={"category":["samrtphone","laptops"]}
    // sort = {_sort:"price",_order:"desc"}
    // pagination = {_page:"1",_limit=10}

    let queryString = "";
    for(let key in filter)
    {
        const categoryValues = filter[key];
        if(categoryValues.length>1)
        {
            const lastCatValue = categoryValues[categoryValues.length-1];
            queryString+=`${key}=${lastCatValue}&`;
        }
        else
        queryString+=`${key}=${filter[key]}&`
    }

    for(let key in sort)
        queryString+=`${key}=${sort[key]}&`
    // console.log(pagination)
    for(let key in pagination)
        queryString+=`${key}=${pagination[key]}&`


    return new Promise(async(resolve)=>{
        const res = await fetch(`/api/products?`+queryString)
        const data = await res.json();

        resolve({data:{products:data.products,totalItems:+data.count}});
    })
}


export function createProduct(product)
{
    return new Promise(async(resolve)=>{
        const res = await fetch("/api/products/",{
            method:"POST",
            body:JSON.stringify(product),
            headers:{'content-type':'application/json'}
        })

        const data = await res.json();
        resolve({data});
    })
}

export function updateProduct(product)
{
  
    return new Promise(async(resolve)=>{
        const res = await fetch("/api/products/"+product._id,{
            method:"PATCH",
            body:JSON.stringify(product),
            headers:{'content-type':'application/json'}
        })

        const data = await res.json();
        resolve({data});
    })
}
