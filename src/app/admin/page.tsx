import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  return (
    <section className='container mx-auto space-y-4 py-6'>
      <h1 className='text-2xl font-bold'>Admin Dashboard</h1>
      <AdminDashboard />
    </section>
  );
}
