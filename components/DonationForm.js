import { useState } from 'react';

export default function DonationForm({ causes }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you, ${name}! We'll process your $10 donation for ${email}.`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
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
        <h2 className="text-xl font-semibold mb-4">Our Causes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {causes.map((cause) => (
            <div
              key={cause.id}
              className="p-4 bg-blue-100 rounded-lg shadow hover:bg-blue-200 transition"
            >
              <h3 className="font-bold text-lg">{cause.name}</h3>
              <p className="text-gray-600">{cause.description}</p>
            </div>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600"
      >
        Donate $10
      </button>
    </form>
  );
}