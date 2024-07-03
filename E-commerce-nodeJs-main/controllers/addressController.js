const Address = require("../models/Address");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const getAllAddress = async (req, res) => {
  const data = await Address.find({});
  res.send(data);
};

const addAddress = async (req, res) => {
  const data = await Address.create(req.body);
  res.json(data);
};

const removeAddress = async (req, res) => {
   const addressId = req.body._id;
   const data = await Address.findByIdAndDelete({_id:addressId});

   res.json(data)
};

const updateAddress = async (req, res) => {
    const addressId = req.body._id;

    const data =await Address.findOneAndUpdate({_id:addressId},req.body,{
        new: true,
        runValidators: true,
      })

    res.json(data);

};

const getUserAddress = async (req, res) => {
  const email = req.query.email;

  const addresses = await Address.find({ email: email });
  res.json(addresses);
};

module.exports = { getAllAddress, removeAddress,updateAddress,addAddress, getUserAddress };
