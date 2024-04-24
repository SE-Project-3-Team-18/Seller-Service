const Seller = require('../models/Seller');
const { CustomError } = require('../utils/error');

const getDetails = async (req, res, next) => {
  try {
    const sellerId = req.get('X-Seller-Id');

    const seller = await Seller.findById(sellerId, {
      phoneNo: 1,
      address: 1,
      pinCode: 1,
      companyName: 1,
    })
    if (!seller) {
      throw new CustomError('Seller not found', 404, false);
    }

    return res
      .status(200)
      .json({
        success: true,
        message: 'Seller found',
        details: seller,
      })
  } catch (error) {
    next(error);
  }
}

module.exports = getDetails;
