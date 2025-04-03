const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET; // Add this later

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { email, name, selectedCauses } = session.metadata;

    await resend.emails.send({
      from: 'DonationApp <onboarding@resend.dev>',
      to: email,
      subject: 'Thank You for Your Donation!',
      text: `Hi ${name},\n\nThank you for your $10 donation to DonationApp! Your support for ${selectedCauses} makes a big difference.\n\nBest,\nThe DonationApp Team`,
    });
  }

  res.status(200).json({ received: true });
}

export const config = {
  api: {
    bodyParser: false, // Stripe needs raw body
  },
};