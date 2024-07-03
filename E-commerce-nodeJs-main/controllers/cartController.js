const Cart = require("../models/Cart")
const {StatusCodes} = require("http-status-codes")
const CustomError = require("../errors")

const addToCart = async (req,res)=>{
    const data = await Cart.create(req.body);
    res.status(StatusCodes.CREATED).json(data)
}

const removeFromCart = async(req,res)=>{
    const id = req.params.id;
    const data = await Cart.findOneAndRemove({_id:id})
    res.json({msg:"removed from the cart"})
}

const getCartItems = async(req,res)=>{
    const email = req.query.user
    const items = await Cart.find({user:email})
    res.send(items);

}

const deleteCartItem = async(req,res)=>{
    const id = req.body._id;
    const item = await Cart.findOneAndDelete({_id:id})
    res.json(item);
}

const updateCartItem = async(req,res)=>{

    const id = req.body._id;
    const item = await Cart.findOneAndUpdate({_id:id},req.body,{
        new: true,
        runValidators: true,
      })

    res.json(item)

}

module.exports = {deleteCartItem,addToCart,updateCartItem,removeFromCart,getCartItems}
