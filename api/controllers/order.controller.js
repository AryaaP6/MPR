import createError from "../utils/createError.js";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";
import Stripe from "stripe";

// Create a Stripe checkout session
export const intent = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE);
  console.log(stripe);

  try {
    // Fetch gig by ID
    // const gig = await Gig.findById(req.params.id);
    // if (!gig) return next(createError(404, "Gig not found"));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "test",
              description: "test",
            },
            unit_amount: 100, // Amount in paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173`, // Success URL
      cancel_url: "http://localhost:5173/cancel", // Cancel URL
    });
    // res.send()

    // Save order after successful payment intent
    // const newOrder = new Order({
    //   gigId: gig._id,
    //   img: gig.cover,
    //   title: gig.title,
    //   buyerId: req.userId,
    //   sellerId: gig.userId,
    //   price: gig.price,
    //   payment_intent: session.id, 
    // });

    // await newOrder.save();

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

// Fetch orders
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: true,
    });

    res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
};
