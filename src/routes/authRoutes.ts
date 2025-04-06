import {Router} from "express";
import { login,register } from "../controllers/authController";

const router = Router()
router.post("/register",register)
router.post("/login",login)
router.get("/test", (req, res) => {
    res.send("Auth routes working!");
  });
  
export default router;