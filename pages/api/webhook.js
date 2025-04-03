const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Resend } = require('resend');

// Initialize Resend with error handling
let resend;
try {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set in environment variables');
  }
  resend = new Resend(process.env.RESEND_API_KEY);
  //console.log('Resend initialized successfully');
} catch (error) {
  console.error('Failed to initialize Resend:', error.message);
}

// Buffer the raw request body
export default async function handler(req, res) {
  //console.log('Webhook received:', req.method);
  //console.log('Headers:', req.headers);

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Read the raw body
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const rawBody = Buffer.concat(chunks).toString('utf8');
  //console.log('Raw body:', rawBody);

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    console.log('Event constructed:', event.type);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { email, name, selectedCauses } = session.metadata;
    console.log('Session metadata:', { email, name, selectedCauses });

    if (!email || !name || !selectedCauses) {
      console.error('Missing metadata:', { email, name, selectedCauses });
      return res.status(200).json({ received: true });
    }

    if (!resend) {
      console.error('Cannot send email: Resend not initialized');
      return res.status(200).json({ received: true });
    }

    try {
      await resend.emails.send({
        from: 'DonationApp <onboarding@resend.dev>',
        to: email,
        subject: 'Thank You for Your Donation!',
        text: `Hi ${name},\n\nThank you for your $10 donation to DonationApp! Your support for ${selectedCauses} makes a big difference.\n\nBest,\nThe DonationApp Team`,
      });
      console.log('Email sent to:', email);
    } catch (emailErr) {
      console.error('Resend Error:', emailErr.message);
    }
  }

  res.status(200).json({ received: true });
}

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parser
  },
};