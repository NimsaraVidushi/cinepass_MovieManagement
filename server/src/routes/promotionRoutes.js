import { Router } from "express";
import { 
  getPromotions, 
  createPromotion, 
  deletePromotion, 
  validatePromo 
} from "../controllers/promotionController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/validate", validatePromo);
router.get("/active", getPromotions); // Publicly viewable active promos

// Admin only
router.get("/", protect, admin, getPromotions);
router.post("/", protect, admin, createPromotion);
router.delete("/:id", protect, admin, deletePromotion);

export default router;
