import { UsersTable } from '@/components/admin/UsersTable';

export default function AdminUsersPage() {
  return (
    <section className='container mx-auto space-y-4 py-6'>
      <h1 className='text-2xl font-bold'>Users</h1>
      <UsersTable />
    </section>
  );
}
