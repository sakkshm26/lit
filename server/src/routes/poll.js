import express from "express";
import { answerPoll, getPollQuestions, getPollOptions, revealPoll, sendNewPollNotification } from "../controllers/index.js";

var router = express.Router()

router.get('/questions', getPollQuestions)
router.get('/options', getPollOptions)
router.post('/answer', answerPoll)
router.post('/reveal', revealPoll)
router.post('/new-poll-notification', sendNewPollNotification)

export default router;