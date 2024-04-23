const axios = require('axios')
const Seller = require('../models/Seller')
const { CustomError } = require('../utils/error')
const ServiceRegistryClient = require('../utils/serviceRegistry')

const hitUserManagement = async (userId) => {
  try {
    const baseUrl = await ServiceRegistryClient
      .getInstance()
      .getUrl('User-Management')
    const url = new URL('/api/upgrade-to-seller', baseUrl).toString()

    const response = await axios.post(url, {
      userId,
    })
  } catch (e) {
    let error = null
    if (axios.isAxiosError(e) === true) {
      if (e.response) {
        error = new CustomError(e.response?.data?.message, e.response?.status, false)
      } else {
        error = new CustomError(`Axios Error: ${e.message}`, 500, true)
      }
    } else {
      error = new CustomError(e.message, 500, true)
    }
    throw error
  }
}

/**
 * Note that this signUp not the authentication signUp. 
 * this signUp means signUp as seller, for selling products.
 * This signUp is to be hit only after user completes the normal 
 * authentication SignUp from User-Management Service
 */
const signUp = async (req, res, next) => {
  try {
    const userId = req.get('X-User-Id')
    const {
      companyName,
      phoneNo,
      address,
      pinCode,
    } = req.body

    if(
      !companyName ||
      !phoneNo ||
      !address ||
      !pinCode
    ) {
      throw new CustomError('Required Fields missing', 400, false)
    }
    
    const existingSeller = await Seller.findOne({
      userId,
    })
    if (existingSeller) {
      throw new CustomError('Seller already exists', 400, false)
    }

    await hitUserManagement(userId)

    const seller = new Seller({
      userId,
      phoneNo,
      verified: false,
      address,
      pinCode,
      companyName,
    })
    await seller.save()

    return res
      .status(201)
      .json({
        success: true,
        message: 'upgraded to Seller successfully',
      })
  } catch (e) {
    next(e)
  }
}

module.exports = signUp