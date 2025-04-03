import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Success() {
  const router = useRouter();
  const { session_id } = router.query;
  const [donationDetails, setDonationDetails] = useState(null);

  useEffect(() => {
    if (session_id) {
      fetch(`/api/get-session?session_id=${session_id}`)
        .then((res) => res.json())
        .then((data) => {
          setDonationDetails(data);
        })
        .then((err) => console.error('Error fetching session:', err));
    }
  }, [session_id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Thank You for Your Donation!</h1>
        {donationDetails ? (
          <div>
            <p><strong>Name:</strong> {donationDetails.name}</p>
            <p><strong>Email:</strong> {donationDetails.email}</p>
            <p><strong>Amount:</strong> ${(donationDetails.amount / 100).toFixed(2)}</p>
            <p><strong>Causes:</strong> {donationDetails.selectedCauses}</p>
            <p><strong>Date:</strong> {new Date(donationDetails.created * 1000).toLocaleString()}</p>
          </div>
        ) : (
          <p>Loading donation details...</p>
        )}
        <a href="/" className="mt-4 inline-block text-blue-500 hover:underline">
          Back to Home
        </a>
      </div>
    </div>
  );
}