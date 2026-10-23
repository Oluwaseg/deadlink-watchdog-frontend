import { WebsitesModerationTable } from '@/components/admin/WebsitesModerationTable';

export default function AdminWebsitesPage() {
  return (
    <section className='container mx-auto space-y-4 py-6'>
      <h1 className='text-2xl font-bold'>Website Moderation</h1>
      <WebsitesModerationTable />
    </section>
  );
}
