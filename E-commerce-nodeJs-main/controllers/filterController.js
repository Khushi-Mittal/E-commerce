const Filter = require("../models/Filter")
const {StatusCodes} = require("http-status-codes")
const CustomError = require("../errors")

const getAllFilters = async (req,res)=>{
    const filters = await Filter.find({})
    res.send(filters)
}

module.exports = {getAllFilters}
