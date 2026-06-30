import { Router } from "express";
import categoryController from "../controllers/categoryController.js";

const router = Router();

router.get("/", categoryController.getAll);

router.post("/", categoryController.create);

router.put("/:id", categoryController.update);

router.delete("/:id", categoryController.delete);

router.get("/:id", categoryController.getById);

export default router;