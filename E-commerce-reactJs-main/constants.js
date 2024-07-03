export function discountPrice(item)
{
    return Math.round(item.price*(1-item.discountPercentage/100),2)
}

export const API_URL = "https://node-ecommerce-ufd9.onrender.com/api/v1"
export const CLOUD_NAME = "dstos3wub"
export const CLOUD_API = "714818252818465"
export const CLOUD_SECRET = "YjeV5bY3jWOYNamnFFwfCkaK8wM"

//https://node-ecommerce-ufd9.onrender.com/api/v1
//http://localhost:5000/api/v1
