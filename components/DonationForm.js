import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function DonationForm({ causes }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCauses, setSelectedCauses] = useState([]);
  const [error, setError] = useState(null);

  const handleCauseChange = (causeId) => {
    if (selectedCauses.includes(causeId)) {
      setSelectedCauses(selectedCauses.filter((id) => id !== causeId));
    } else if (selectedCauses.length < 5) {
      setSelectedCauses([...selectedCauses, causeId]);
    } else {
      alert('You can only select up to 5 causes!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (selectedCauses.length === 0) {
      setError('Please select at least one cause!');
      return;
    }

    const stripe = await stripePromise;
    if (!stripe) {
      setError('Payment system unavailable.');
      return;
    }

    const causeNames = causes
      .filter((cause) => selectedCauses.includes(cause.id))
      .map((cause) => cause.name);

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedCauses: causeNames, email, name }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      setError(errorData.error || 'Failed to initiate payment.');
      return;
    }

    const { sessionId } = await response.json();
    if (sessionId) {
      const result = await stripe.redirectToCheckout({ sessionId });
      if (result.error) {
        setError(result.error.message);
      }
    } else {
      setError('Error creating checkout session.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Select Up to 5 Causes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {causes.map((cause) => (
            <div
              key={cause.id}
              className={`p-4 rounded-lg shadow transition ${
                selectedCauses.includes(cause.id)
                  ? 'bg-blue-200'
                  : 'bg-blue-100 hover:bg-blue-200'
              }`}
            >
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCauses.includes(cause.id)}
                  onChange={() => handleCauseChange(cause.id)}
                  className="h-5 w-5 text-blue-600"
                />
                <div>
                  <h3 className="font-bold text-lg">{cause.name}</h3>
                  <p className="text-gray-600">{cause.description}</p>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600"
        disabled={selectedCauses.length === 0}
      >
        Donate $10
      </button>
    </form>
  );
}