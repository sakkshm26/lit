import express from "express";
import { checkUniquePhone, checkUniqueUsername, userLogin, userSignup } from "../controllers/index.js";

var router = express.Router()

router.post('/unique/username', checkUniqueUsername)
router.post('/unique/phone', checkUniquePhone)
router.post('/user/signup', userSignup)
router.post('/user/login', userLogin)

export default router