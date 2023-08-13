import express from "express";
import { getInstitutesByState, getUsersByInstitute, uploadImageOnSignup} from "../controllers/index.js";

var router = express.Router()

router.get('/institutes/:type/:state_id/:search_value', getInstitutesByState)
router.get('/institute/users/:id/:last_user_id', getUsersByInstitute)
router.post('/uploadImage/:user_id', uploadImageOnSignup)

export default router