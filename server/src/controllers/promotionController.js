import { Promotion } from "../models/Promotion.js";

export const getPromotions = async (req, res, next) => {
  try {
    const includeInactive = req.query.includeInactive === "true";
    const query = includeInactive ? {} : { isActive: true };
    const promotions = await Promotion.find(query).sort({ code: 1 });
    res.json(promotions);
  } catch (error) {
    next(error);
  }
};

export const createPromotion = async (req, res, next) => {
  try {
    const promotion = await Promotion.create(req.body);
    res.status(201).json(promotion);
  } catch (error) {
    next(error);
  }
};

export const deletePromotion = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Promotion.findByIdAndDelete(id);
    res.json({ message: "Promotion deleted" });
  } catch (error) {
    next(error);
  }
};

export const validatePromo = async (req, res, next) => {
  try {
    const { code } = req.query;
    if (!code) return res.json({ valid: false, discountPct: 0 });

    const promo = await Promotion.findOne({ 
      code: code.toUpperCase(), 
      isActive: true 
    });

    if (!promo) {
      return res.json({ valid: false, discountPct: 0 });
    }

    // Check expiry
    if (promo.expiryDate && new Date() > promo.expiryDate) {
      return res.json({ valid: false, discountPct: 0, message: "Expired" });
    }

    res.json({ valid: true, discountPct: promo.discountPct });
  } catch (error) {
    next(error);
  }
};
