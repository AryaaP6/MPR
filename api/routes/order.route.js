import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { getOrders, intent } from "../controllers/order.controller.js";
import Gig from "../models/gig.model.js";


const router = express.Router();

// router.post("/:gigId", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
// router.post("/create-payment-intent", intent);
// router.put("/", verifyToken, confirm);

router.post('/create-payment-intent', async (req, res) => {
    try {
      const { gigId } = req.body;
      const gig = await Gig.findById(gigId);  // Fetch gig by id
      
      if (!gig) {
        throw new Error('Gig not found');  // Handle missing gig
      }
  
      // Stripe payment logic
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: gig.title,
              },
              unit_amount: gig.price * 100, // Price in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
      });
  
      res.status(200).json({ id: session.id });
    } catch (error) {
      console.error('Error in creating payment intent:', error);
      res.status(500).json({ message: 'Internal server error' });  // Return 500 with error message
    }
  });
  
  

export default router;