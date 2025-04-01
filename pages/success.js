import Head from 'next/head';

export default function Success() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <Head>
        <title>Thank You - DonationApp</title>
      </Head>
      <h1 className="text-4xl font-bold mb-8 text-green-600">Thank You!</h1>
      <p className="text-xl text-gray-700">Your $10 donation has been successfully processed.</p>
      <p className="text-lg text-gray-600 mt-4">We’ll email you a confirmation soon.</p>
      <a href="/" className="mt-6 bg-blue-500 text-white p-3 rounded hover:bg-blue-600">
        Back to Home
      </a>
    </div>
  );
}