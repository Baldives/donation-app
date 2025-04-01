import Head from 'next/head';
import DonationForm from '../components/DonationForm';

export default function Home() {
  const causes = [
    { id: 'clean-water', name: 'Clean Water Access', description: 'Provide safe drinking water globally.' },
    { id: 'education', name: 'Education for All', description: 'Support education for underprivileged kids.' },
    { id: 'climate', name: 'Climate Action', description: 'Combat climate change with reforestation.' },
    { id: 'healthcare', name: 'Healthcare Access', description: 'Deliver medical care to underserved areas.' },
    { id: 'hunger', name: 'Hunger Relief', description: 'Feed those in need.' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <Head>
        <title>DonationApp</title>
      </Head>
      <h1 className="text-4xl font-bold mb-8">Support Great Causes</h1>
      <DonationForm causes={causes} />
    </div>
  );
}