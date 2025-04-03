const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  const { selectedCauses } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: 'Donation', description: `Supporting: ${selectedCauses.join(', ')}` },
        unit_amount: 1000,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${req.headers.origin}/success?email={CHECKOUT_SESSION_EMAIL}`,
    cancel_url: `${req.headers.origin}/`,
  });

  // Note: Email should ideally be sent via webhook after payment confirmation
  // This is a simple demo assuming email is passed (you'd need to modify form)
  const email = 'test@example.com'; // Replace with actual email from form later
  await resend.emails.send({
    from: 'DonationApp <onboarding@resend.dev>',
    to: email,
    subject: 'Thank You for Your Donation!',
    text: `Your $10 donation supports: ${selectedCauses.join(', ')}. We appreciate your generosity!`,
  });

  res.status(200).json({ sessionId: session.id });
}