import { verifyToken } from "../middleware/AuthMiddleware.js";
import { searchContact } from "../controllers/ContactsControllers.js";
import { Router } from "express";

const contactsRoutes = Router();
contactsRoutes.post("/search", verifyToken, searchContact);

export default contactsRoutes;
