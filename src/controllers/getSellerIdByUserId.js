const Seller = require('../models/Seller');
const { CustomError } = require('../utils/error');

const getSellerIdByuserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const seller = await Seller.findOne(
      {
        userId,
      }
    )
    if (!seller) {
      throw new CustomError('Seller not found', 404, false);
    }

    return res
      .status(200)
      .json({
        success: true,
        message: 'Seller found',
        sellerId: seller.id,
      })
  } catch (error) {
    next(error);
  }
}

module.exports = getSellerIdByuserId;
