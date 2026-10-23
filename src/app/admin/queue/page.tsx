import { QueueStats } from '@/components/admin/QueueStats';

export default function AdminQueuePage() {
  return (
    <section className='container mx-auto space-y-4 py-6'>
      <h1 className='text-2xl font-bold'>Queue</h1>
      <QueueStats />
    </section>
  );
}
