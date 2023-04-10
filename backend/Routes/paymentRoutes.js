import express from "express";
import {subscriptionPayment, checkPayment, updateSessionId, cancelSubscription, changeSubscription} from "../Controller/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-checkout-session", subscriptionPayment);

paymentRouter.delete("/v1/customers/:id", cancelSubscription);

paymentRouter.put("/updateSessionId", updateSessionId);

paymentRouter.put("/changeSubscription", changeSubscription);

paymentRouter.post('/webhook', express.raw({type: 'application/json'}), checkPayment)

export default paymentRouter;