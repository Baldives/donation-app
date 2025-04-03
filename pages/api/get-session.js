const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    res.status(200).json({
      name: session.metadata.name,
      email: session.metadata.email,
      selectedCauses: session.metadata.selectedCauses,
      amount: session.amount_total,
      created: session.created,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}