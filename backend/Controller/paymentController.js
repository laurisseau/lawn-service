import stripe from "stripe";
import expressAsyncHandler from "express-async-handler";
import { generateToken } from "../utils.js";
import User from "../Models/userModel.js";

export const subscriptionPayment = expressAsyncHandler(async (req, res) => {
  const { priceId } = req.body;

  console.log(req.get('host'))

  console.log(
    "/---------------------------------------------------------------------------------------------"
  );
  //console.log(`${req.protocol}://${req.get("x-forwarded-host")}/profile`);
  console.log(req.get('origin'))
  console.log(
    "/---------------------------------------------------------------------------------------------"
  );


  const session = await stripe(
    "sk_test_51Mp2ZIK7StTt0Prs2Jdz5cw5AXDVXdF2b4SWt1JMVXuvzAyWTIR02xIFuYjvZI7KOXi4K9cO8mn270twMEcrwY1L00whAcYOkd"
  ).checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        // For metered billing, do not pass quantity
        quantity: 1,
      },
    ],
    // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
    // the actual Session ID is returned in the query parameter when your customer
    // is redirected to the success page.
    success_url: `${req.protocol}://${req.get("x-forwarded-host")}/profile`,
    cancel_url: `${req.protocol}://${req.get("x-forwarded-host")}/`,
  });

  res.send(session);
});

export const cancelSubscription = async (req, res) => {
  try {
    const deleted = await stripe(
      "sk_test_51Mp2ZIK7StTt0Prs2Jdz5cw5AXDVXdF2b4SWt1JMVXuvzAyWTIR02xIFuYjvZI7KOXi4K9cO8mn270twMEcrwY1L00whAcYOkd"
    ).customers.del(req.params.id);

    const stripeCustomerId = deleted.id;

    const delMongoSub = await User.updateOne(
      { stripeCustomerId: stripeCustomerId },
      {
        subscribed: false,
        subscriptionPrice: "",
        subscriptionId: "",
        sessionId: "",
        stripeCustomerId: "",
      }
    );

    res.send("subscription deleted successfully");
  } catch (err) {
    console.log(err);
  }
};

export const changeSubscription = async (req, res) => {
  try {
    const pickedPrice = req.body.pickedPrice;
    const subscriptionId = req.body.userSubscriptionId;

    const subscription = await stripe(
      "sk_test_51Mp2ZIK7StTt0Prs2Jdz5cw5AXDVXdF2b4SWt1JMVXuvzAyWTIR02xIFuYjvZI7KOXi4K9cO8mn270twMEcrwY1L00whAcYOkd"
    ).subscriptions.retrieve(subscriptionId);

    const changed = await stripe(
      "sk_test_51Mp2ZIK7StTt0Prs2Jdz5cw5AXDVXdF2b4SWt1JMVXuvzAyWTIR02xIFuYjvZI7KOXi4K9cO8mn270twMEcrwY1L00whAcYOkd"
    ).subscriptions.update(subscription.id, {
      cancel_at_period_end: false,
      proration_behavior: "create_prorations",
      items: [
        {
          id: subscription.items.data[0].id,
          price: pickedPrice,
        },
      ],
    });

    const customer = changed.customer;

    const changeUserSubData = await User.updateOne(
      { stripeCustomerId: customer },
      {
        subscriptionPrice: pickedPrice,
      }
    );

    const user = await User.findOne({ stripeCustomerId: customer });

    res.send({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      number: user.number,
      isUser: user.isUser,
      subscriptionId: user.subscriptionId,
      subscriptionPrice: user.subscriptionPrice,
      token: generateToken(user),
    });
  } catch (err) {
    console.log(err);
  }
};

export const updateSessionId = async (req, res) => {
  try {
    const updateSession = await User.findByIdAndUpdate(req.body.userId, {
      sessionId: req.body.sessionId,
    });

    res.send("updated successful");
  } catch (err) {
    console.log(err);
  }
};

export const checkPayment = async (req, res) => {
  let event;
  const signature = req.headers["stripe-signature"];
  const webhookSecret = "whsec_8Q0frf7eiCFqVrcXv1JZHaWbYNqe1UTp";

  const payload = req.body;
  try {
    event = stripe(
      "sk_test_51Mp2ZIK7StTt0Prs2Jdz5cw5AXDVXdF2b4SWt1JMVXuvzAyWTIR02xIFuYjvZI7KOXi4K9cO8mn270twMEcrwY1L00whAcYOkd"
    ).webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.log(err);
  }

  const eventType = event.type;
  const stripeSessionId = event.data.object.id;
  const stripeCustomerId = event.data.object.customer;
  const subscriptionId = event.data.object.subscription;
  const unpaidLink = event.data.object.hosted_invoice_url;

  switch (eventType) {
    case "checkout.session.completed":
      const subscription = await stripe(
        "sk_test_51Mp2ZIK7StTt0Prs2Jdz5cw5AXDVXdF2b4SWt1JMVXuvzAyWTIR02xIFuYjvZI7KOXi4K9cO8mn270twMEcrwY1L00whAcYOkd"
      ).subscriptions.retrieve(subscriptionId);

      const subscriptionPrice = subscription.plan.id;

      await User.updateOne(
        { sessionId: stripeSessionId },
        {
          stripeCustomerId: stripeCustomerId,
          subscriptionId: subscriptionId,
          subscriptionPrice: subscriptionPrice,
          subscribed: true,
        }
      );

      break;
    case "invoice.payment_failed":
      await User.updateOne(
        { stripeCustomerId: stripeCustomerId },
        {
          subscribed: false,
          unpaidLink: unpaidLink,
        }
      );
      break;
    case "invoice.payment_succeeded":
      await User.updateOne(
        { stripeCustomerId: stripeCustomerId },
        {
          subscribed: true,
          unpaidLink: "",
        }
      );
      break;
    default:
    // Unhandled event type
  }
};
