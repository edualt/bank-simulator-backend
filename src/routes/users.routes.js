import { Router } from "express";
import { methods as UserMethods } from "../controllers/users.controller";

const router = Router();

router.get("/", UserMethods.getUsers);
router.get("/:id", UserMethods.getUser);
router.post("/", UserMethods.addUser);
router.put("/:id", UserMethods.updateUser);
router.delete("/:id", UserMethods.deleteUser);
router.get("verifyAccountNumber/", UserMethods.getAllAccountNumber);

export default router;