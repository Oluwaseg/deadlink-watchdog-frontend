'use client';

import type React from 'react';

import {
  createWebsite,
  deleteWebsite,
  getWebsite,
  triggerCrawl,
  updateWebsite,
} from '@/api-routes/websites-api';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useWebsites } from '@/hooks/use-websites';
import {
  Activity,
  AlertTriangle,
  Filter,
  Globe,
  LinkIcon,
  MoreVertical,
  Pencil,
  Plus,
  RefreshCcw,
  Save,
  Search,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

interface WebsiteFormData {
  name: string;
  url: string;
  description: string;
  category: string;
  crawlFrequency: string;
  notificationEmail: string;
  webhookUrl: string;
}

interface Website {
  id: string;
  name: string;
  url: string;
  description?: string;
  category?: string;
  crawlFrequency?: 'daily' | 'weekly' | 'monthly';
  notificationEmail?: string;
  webhookUrl?: string;
  isActive: boolean;
  healthScore: number;
  totalLinks: number;
  lastCrawledAt: string | null;
}

const initialFormData: WebsiteFormData = {
  name: '',
  url: '',
  description: '',
  category: '',
  crawlFrequency: '',
  notificationEmail: '',
  webhookUrl: '',
};

export default function WebsitesPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loadingWebsites, setLoadingWebsites] = useState<Set<string>>(
    new Set()
  );

  // Create Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createFormData, setCreateFormData] =
    useState<WebsiteFormData>(initialFormData);

  // Edit Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);
  const [editFormData, setEditFormData] =
    useState<WebsiteFormData>(initialFormData);

  const {
    data,
    isLoading,
    error: fetchError,
    refetch,
  } = useWebsites(
    page,
    12,
    category === 'all' ? '' : category,
    isActive === undefined ? undefined : isActive
  );

  const resetCreateForm = () => {
    setCreateFormData({ ...initialFormData });
    setCreateError(null);
  };

  const resetEditForm = () => {
    setEditFormData({ ...initialFormData });
    setEditError(null);
    setEditingWebsite(null);
  };

  const handleCreateWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateError(null);

    try {
      const websiteData = {
        name: createFormData.name,
        url: createFormData.url,
        description: createFormData.description || undefined,
        category:
          createFormData.category === 'none'
            ? undefined
            : createFormData.category || undefined,
        crawlFrequency:
          createFormData.crawlFrequency === 'manual'
            ? undefined
            : (createFormData.crawlFrequency as
                | 'daily'
                | 'weekly'
                | 'monthly'
                | undefined),
        notificationEmail: createFormData.notificationEmail || undefined,
        webhookUrl: createFormData.webhookUrl || undefined,
        isActive: true,
        healthScore: 100,
        totalLinks: 0,
        lastCrawledAt: null,
      };

      await createWebsite(websiteData);
      setIsCreateModalOpen(false);
      resetCreateForm();
      refetch();
    } catch (err) {
      setCreateError(
        err instanceof Error
          ? err.message
          : 'An error occurred while creating the website'
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWebsite) return;

    setIsEditing(true);
    setEditError(null);

    try {
      const websiteData = {
        name: editFormData.name,
        url: editFormData.url,
        description: editFormData.description || undefined,
        category:
          editFormData.category === 'none'
            ? undefined
            : editFormData.category || undefined,
        crawlFrequency:
          editFormData.crawlFrequency === 'manual'
            ? undefined
            : (editFormData.crawlFrequency as
                | 'daily'
                | 'weekly'
                | 'monthly'
                | undefined),
        notificationEmail: editFormData.notificationEmail || undefined,
        webhookUrl: editFormData.webhookUrl || undefined,
      };

      await updateWebsite(editingWebsite.id, websiteData);
      setIsEditModalOpen(false);
      resetEditForm();
      refetch();
    } catch (err) {
      setEditError(
        err instanceof Error
          ? err.message
          : 'An error occurred while updating the website'
      );
    } finally {
      setIsEditing(false);
    }
  };

  const handleOpenEditModal = async (website: Website) => {
    setEditingWebsite(website);
    setEditFormData({
      name: website.name,
      url: website.url,
      description: website.description || '',
      category: website.category || 'none',
      crawlFrequency: website.crawlFrequency || 'manual',
      notificationEmail: website.notificationEmail || '',
      webhookUrl: website.webhookUrl || '',
    });
    setEditError(null);
    setIsEditModalOpen(true);
  };

  const handleCreateInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateSelectChange = (name: string, value: string) => {
    setCreateFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSelectChange = (name: string, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = async (websiteId: string) => {
    try {
      await deleteWebsite(websiteId);
      refetch();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while deleting the website'
      );
    }
  };

  const handleTriggerCrawl = async (websiteId: string) => {
    setLoadingWebsites((prev) => new Set(prev).add(websiteId));
    try {
      await triggerCrawl(websiteId);
      await getWebsite(websiteId);
      refetch();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while crawling the website'
      );
    } finally {
      setLoadingWebsites((prev) => {
        const newSet = new Set(prev);
        newSet.delete(websiteId);
        return newSet;
      });
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90)
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getHealthScoreIcon = (score: number) => {
    if (score >= 90) return <TrendingUp className='h-4 w-4' />;
    if (score >= 70) return <Activity className='h-4 w-4' />;
    return <AlertTriangle className='h-4 w-4' />;
  };

  if (isLoading) {
    return (
      <div className='space-y-8'>
        {/* Header Skeleton */}
        <div className='flex items-center justify-between'>
          <div className='space-y-2'>
            <Skeleton className='h-8 w-48' />
            <Skeleton className='h-4 w-96' />
          </div>
          <Skeleton className='h-10 w-32' />
        </div>

        {/* Filters Skeleton */}
        <div className='flex gap-4'>
          <Skeleton className='h-10 w-80' />
          <Skeleton className='h-10 w-40' />
          <Skeleton className='h-10 w-40' />
        </div>

        {/* Cards Skeleton */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className='overflow-hidden'>
              <CardHeader className='pb-3'>
                <div className='flex items-start justify-between'>
                  <div className='space-y-2'>
                    <Skeleton className='h-5 w-32' />
                    <Skeleton className='h-4 w-48' />
                  </div>
                  <Skeleton className='h-8 w-8 rounded-full' />
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center gap-4'>
                  <Skeleton className='h-6 w-16' />
                  <Skeleton className='h-6 w-20' />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <Skeleton className='h-12 w-full' />
                  <Skeleton className='h-12 w-full' />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <div className='text-center space-y-4'>
          <AlertTriangle className='h-12 w-12 text-destructive mx-auto' />
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Error loading websites</h3>
            <p className='text-muted-foreground'>{fetchError.message}</p>
          </div>
          <Button onClick={() => refetch()} variant='outline'>
            <RefreshCcw className='h-4 w-4 mr-2' />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Check if we have no websites at all
  const hasNoWebsites =
    !data?.data?.websites || data.data.websites.length === 0;

  if (hasNoWebsites) {
    return (
      <div className='space-y-8'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <h1 className='text-3xl font-bold tracking-tight'>Websites</h1>
            <p className='text-muted-foreground'>
              Monitor and manage your website health and performance
            </p>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button size='lg' className='shadow-lg' onClick={resetCreateForm}>
                <Plus className='h-5 w-5 mr-2' />
                Add Website
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle className='flex items-center gap-2'>
                  <Globe className='h-5 w-5 text-primary' />
                  Add New Website
                </DialogTitle>
                <DialogDescription>
                  Add a new website to monitor its health and performance
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateWebsite} className='space-y-4'>
                {createError && (
                  <Alert variant='destructive'>
                    <AlertTriangle className='h-4 w-4' />
                    <AlertDescription>{createError}</AlertDescription>
                  </Alert>
                )}

                <div className='grid gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='create-name'>Website Name *</Label>
                    <Input
                      id='create-name'
                      name='name'
                      placeholder='My Awesome Website'
                      value={createFormData.name}
                      onChange={handleCreateInputChange}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='create-url'>Website URL *</Label>
                    <Input
                      id='create-url'
                      name='url'
                      type='url'
                      placeholder='https://example.com'
                      value={createFormData.url}
                      onChange={handleCreateInputChange}
                      required
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='create-description'>Description</Label>
                  <Textarea
                    id='create-description'
                    name='description'
                    placeholder='Brief description of your website...'
                    value={createFormData.description}
                    onChange={handleCreateInputChange}
                    rows={3}
                  />
                </div>

                <div className='grid gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='create-category'>Category</Label>
                    <Select
                      value={createFormData.category}
                      onValueChange={(value) =>
                        handleCreateSelectChange('category', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select a category' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='none'>No category</SelectItem>
                        <SelectItem value='news'>News</SelectItem>
                        <SelectItem value='government'>Government</SelectItem>
                        <SelectItem value='business'>Business</SelectItem>
                        <SelectItem value='education'>Education</SelectItem>
                        <SelectItem value='entertainment'>
                          Entertainment
                        </SelectItem>
                        <SelectItem value='financial'>Financial</SelectItem>
                        <SelectItem value='other'>Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='create-crawlFrequency'>
                      Crawl Frequency
                    </Label>
                    <Select
                      value={createFormData.crawlFrequency}
                      onValueChange={(value) =>
                        handleCreateSelectChange('crawlFrequency', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Manual only' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='manual'>Manual only</SelectItem>
                        <SelectItem value='daily'>Daily</SelectItem>
                        <SelectItem value='weekly'>Weekly</SelectItem>
                        <SelectItem value='monthly'>Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h4 className='text-sm font-medium'>
                    Notifications (Optional)
                  </h4>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label htmlFor='create-notificationEmail'>
                        Email Notifications
                      </Label>
                      <Input
                        id='create-notificationEmail'
                        name='notificationEmail'
                        type='email'
                        placeholder='notifications@example.com'
                        value={createFormData.notificationEmail}
                        onChange={handleCreateInputChange}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='create-webhookUrl'>Webhook URL</Label>
                      <Input
                        id='create-webhookUrl'
                        name='webhookUrl'
                        type='url'
                        placeholder='https://api.example.com/webhook'
                        value={createFormData.webhookUrl}
                        onChange={handleCreateInputChange}
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setIsCreateModalOpen(false)}
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    disabled={isCreating}
                    className='min-w-32'
                  >
                    {isCreating ? (
                      <>
                        <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2' />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className='h-4 w-4 mr-2' />
                        Create Website
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Empty State */}
        <div className='flex h-96 items-center justify-center'>
          <div className='text-center space-y-6 max-w-md'>
            <div className='mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center'>
              <Globe className='h-12 w-12 text-muted-foreground' />
            </div>
            <div className='space-y-2'>
              <h3 className='text-xl font-semibold'>No websites yet</h3>
              <p className='text-muted-foreground'>
                Get started by adding your first website to monitor its health
                and performance.
              </p>
            </div>
            <Dialog
              open={isCreateModalOpen}
              onOpenChange={setIsCreateModalOpen}
            >
              <DialogTrigger asChild>
                <Button size='lg' onClick={resetCreateForm}>
                  <Plus className='h-5 w-5 mr-2' />
                  Add Your First Website
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                  <DialogTitle className='flex items-center gap-2'>
                    <Globe className='h-5 w-5 text-primary' />
                    Add New Website
                  </DialogTitle>
                  <DialogDescription>
                    Add a new website to monitor its health and performance
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateWebsite} className='space-y-4'>
                  {createError && (
                    <Alert variant='destructive'>
                      <AlertTriangle className='h-4 w-4' />
                      <AlertDescription>{createError}</AlertDescription>
                    </Alert>
                  )}

                  <div className='grid gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label htmlFor='empty-create-name'>Website Name *</Label>
                      <Input
                        id='empty-create-name'
                        name='name'
                        placeholder='My Awesome Website'
                        value={createFormData.name}
                        onChange={handleCreateInputChange}
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='empty-create-url'>Website URL *</Label>
                      <Input
                        id='empty-create-url'
                        name='url'
                        type='url'
                        placeholder='https://example.com'
                        value={createFormData.url}
                        onChange={handleCreateInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='empty-create-description'>
                      Description
                    </Label>
                    <Textarea
                      id='empty-create-description'
                      name='description'
                      placeholder='Brief description of your website...'
                      value={createFormData.description}
                      onChange={handleCreateInputChange}
                      rows={3}
                    />
                  </div>

                  <div className='grid gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label htmlFor='empty-create-category'>Category</Label>
                      <Select
                        value={createFormData.category}
                        onValueChange={(value) =>
                          handleCreateSelectChange('category', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select a category' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='none'>No category</SelectItem>
                          <SelectItem value='news'>News</SelectItem>
                          <SelectItem value='government'>Government</SelectItem>
                          <SelectItem value='business'>Business</SelectItem>
                          <SelectItem value='education'>Education</SelectItem>
                          <SelectItem value='entertainment'>
                            Entertainment
                          </SelectItem>
                          <SelectItem value='financial'>Financial</SelectItem>
                          <SelectItem value='other'>Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='empty-create-crawlFrequency'>
                        Crawl Frequency
                      </Label>
                      <Select
                        value={createFormData.crawlFrequency}
                        onValueChange={(value) =>
                          handleCreateSelectChange('crawlFrequency', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Manual only' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='manual'>Manual only</SelectItem>
                          <SelectItem value='daily'>Daily</SelectItem>
                          <SelectItem value='weekly'>Weekly</SelectItem>
                          <SelectItem value='monthly'>Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <h4 className='text-sm font-medium'>
                      Notifications (Optional)
                    </h4>
                    <div className='grid gap-4 md:grid-cols-2'>
                      <div className='space-y-2'>
                        <Label htmlFor='empty-create-notificationEmail'>
                          Email Notifications
                        </Label>
                        <Input
                          id='empty-create-notificationEmail'
                          name='notificationEmail'
                          type='email'
                          placeholder='notifications@example.com'
                          value={createFormData.notificationEmail}
                          onChange={handleCreateInputChange}
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='empty-create-webhookUrl'>
                          Webhook URL
                        </Label>
                        <Input
                          id='empty-create-webhookUrl'
                          name='webhookUrl'
                          type='url'
                          placeholder='https://api.example.com/webhook'
                          value={createFormData.webhookUrl}
                          onChange={handleCreateInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => setIsCreateModalOpen(false)}
                      disabled={isCreating}
                    >
                      Cancel
                    </Button>
                    <Button
                      type='submit'
                      disabled={isCreating}
                      className='min-w-32'
                    >
                      {isCreating ? (
                        <>
                          <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2' />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className='h-4 w-4 mr-2' />
                          Create Website
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    );
  }

  const { websites, pagination } = data.data;

  const filteredWebsites = websites.filter(
    (website) =>
      website.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      website.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h1 className='text-3xl font-bold tracking-tight'>Websites</h1>
          <p className='text-muted-foreground'>
            Monitor and manage your website health and performance
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button size='lg' className='shadow-lg' onClick={resetCreateForm}>
              <Plus className='h-5 w-5 mr-2' />
              Add Website
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2'>
                <Globe className='h-5 w-5 text-primary' />
                Add New Website
              </DialogTitle>
              <DialogDescription>
                Add a new website to monitor its health and performance
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateWebsite} className='space-y-4'>
              {createError && (
                <Alert variant='destructive'>
                  <AlertTriangle className='h-4 w-4' />
                  <AlertDescription>{createError}</AlertDescription>
                </Alert>
              )}

              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='main-create-name'>Website Name *</Label>
                  <Input
                    id='main-create-name'
                    name='name'
                    placeholder='My Awesome Website'
                    value={createFormData.name}
                    onChange={handleCreateInputChange}
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='main-create-url'>Website URL *</Label>
                  <Input
                    id='main-create-url'
                    name='url'
                    type='url'
                    placeholder='https://example.com'
                    value={createFormData.url}
                    onChange={handleCreateInputChange}
                    required
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='main-create-description'>Description</Label>
                <Textarea
                  id='main-create-description'
                  name='description'
                  placeholder='Brief description of your website...'
                  value={createFormData.description}
                  onChange={handleCreateInputChange}
                  rows={3}
                />
              </div>

              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='main-create-category'>Category</Label>
                  <Select
                    value={createFormData.category}
                    onValueChange={(value) =>
                      handleCreateSelectChange('category', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select a category' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='none'>No category</SelectItem>
                      <SelectItem value='news'>News</SelectItem>
                      <SelectItem value='government'>Government</SelectItem>
                      <SelectItem value='business'>Business</SelectItem>
                      <SelectItem value='education'>Education</SelectItem>
                      <SelectItem value='entertainment'>
                        Entertainment
                      </SelectItem>
                      <SelectItem value='financial'>Financial</SelectItem>
                      <SelectItem value='other'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='main-create-crawlFrequency'>
                    Crawl Frequency
                  </Label>
                  <Select
                    value={createFormData.crawlFrequency}
                    onValueChange={(value) =>
                      handleCreateSelectChange('crawlFrequency', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Manual only' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='manual'>Manual only</SelectItem>
                      <SelectItem value='daily'>Daily</SelectItem>
                      <SelectItem value='weekly'>Weekly</SelectItem>
                      <SelectItem value='monthly'>Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='space-y-4'>
                <h4 className='text-sm font-medium'>
                  Notifications (Optional)
                </h4>
                <div className='grid gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='main-create-notificationEmail'>
                      Email Notifications
                    </Label>
                    <Input
                      id='main-create-notificationEmail'
                      name='notificationEmail'
                      type='email'
                      placeholder='notifications@example.com'
                      value={createFormData.notificationEmail}
                      onChange={handleCreateInputChange}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='main-create-webhookUrl'>Webhook URL</Label>
                    <Input
                      id='main-create-webhookUrl'
                      name='webhookUrl'
                      type='url'
                      placeholder='https://api.example.com/webhook'
                      value={createFormData.webhookUrl}
                      onChange={handleCreateInputChange}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={isCreating}
                  className='min-w-32'
                >
                  {isCreating ? (
                    <>
                      <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2' />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className='h-4 w-4 mr-2' />
                      Create Website
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Pencil className='h-5 w-5 text-primary' />
              Edit Website
            </DialogTitle>
            <DialogDescription>
              Update your website information and settings
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditWebsite} className='space-y-4'>
            {editError && (
              <Alert variant='destructive'>
                <AlertTriangle className='h-4 w-4' />
                <AlertDescription>{editError}</AlertDescription>
              </Alert>
            )}

            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='edit-name'>Website Name *</Label>
                <Input
                  id='edit-name'
                  name='name'
                  placeholder='My Awesome Website'
                  value={editFormData.name}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='edit-url'>Website URL *</Label>
                <Input
                  id='edit-url'
                  name='url'
                  type='url'
                  placeholder='https://example.com'
                  value={editFormData.url}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='edit-description'>Description</Label>
              <Textarea
                id='edit-description'
                name='description'
                placeholder='Brief description of your website...'
                value={editFormData.description}
                onChange={handleEditInputChange}
                rows={3}
              />
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='edit-category'>Category</Label>
                <Select
                  value={editFormData.category}
                  onValueChange={(value) =>
                    handleEditSelectChange('category', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='none'>No category</SelectItem>
                    <SelectItem value='news'>News</SelectItem>
                    <SelectItem value='government'>Government</SelectItem>
                    <SelectItem value='business'>Business</SelectItem>
                    <SelectItem value='education'>Education</SelectItem>
                    <SelectItem value='entertainment'>Entertainment</SelectItem>
                    <SelectItem value='financial'>Financial</SelectItem>
                    <SelectItem value='other'>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='edit-crawlFrequency'>Crawl Frequency</Label>
                <Select
                  value={editFormData.crawlFrequency}
                  onValueChange={(value) =>
                    handleEditSelectChange('crawlFrequency', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Manual only' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='manual'>Manual only</SelectItem>
                    <SelectItem value='daily'>Daily</SelectItem>
                    <SelectItem value='weekly'>Weekly</SelectItem>
                    <SelectItem value='monthly'>Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='space-y-4'>
              <h4 className='text-sm font-medium'>Notifications (Optional)</h4>
              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='edit-notificationEmail'>
                    Email Notifications
                  </Label>
                  <Input
                    id='edit-notificationEmail'
                    name='notificationEmail'
                    type='email'
                    placeholder='notifications@example.com'
                    value={editFormData.notificationEmail}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='edit-webhookUrl'>Webhook URL</Label>
                  <Input
                    id='edit-webhookUrl'
                    name='webhookUrl'
                    type='url'
                    placeholder='https://api.example.com/webhook'
                    value={editFormData.webhookUrl}
                    onChange={handleEditInputChange}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsEditModalOpen(false)}
                disabled={isEditing}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isEditing} className='min-w-32'>
                {isEditing ? (
                  <>
                    <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2' />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className='h-4 w-4 mr-2' />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Stats Overview */}
      {(() => {
        const activeCount = websites.filter((w) => w.isActive).length;
        const activePct = websites.length
          ? Math.round((activeCount / websites.length) * 100)
          : 0;
        const avgHealth = websites.length
          ? Math.round(
              websites.reduce((acc, w) => acc + w.healthScore, 0) /
                websites.length
            )
          : 0;
        const totalLinks = websites.reduce((acc, w) => acc + w.totalLinks, 0);
        const healthTone =
          avgHealth >= 90
            ? 'bg-emerald-500'
            : avgHealth >= 70
              ? 'bg-yellow-500'
              : 'bg-red-500';
        const stats = [
          {
            label: 'Total Websites',
            value: pagination.total.toLocaleString(),
            hint: `${websites.length} on this page`,
            icon: Globe,
          },
          {
            label: 'Active',
            value: activeCount.toLocaleString(),
            hint: `${activePct}% of monitored sites`,
            icon: Activity,
            bar: { pct: activePct, tone: 'bg-emerald-500' },
          },
          {
            label: 'Avg Health',
            value: `${avgHealth}%`,
            hint:
              avgHealth >= 90
                ? 'Looking healthy'
                : avgHealth >= 70
                  ? 'Needs some attention'
                  : 'Critical issues',
            icon: TrendingUp,
            bar: { pct: avgHealth, tone: healthTone },
          },
          {
            label: 'Total Links',
            value: totalLinks.toLocaleString(),
            hint: 'Across all crawled pages',
            icon: LinkIcon,
          },
        ];
        return (
          <div className='rounded-xl border bg-card shadow-sm'>
            <div className='grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x'>
              {stats.map((s) => (
                <div key={s.label} className='p-5 space-y-3'>
                  <div className='flex items-center justify-between'>
                    <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                      {s.label}
                    </p>
                    <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-muted'>
                      <s.icon className='h-4 w-4 text-muted-foreground' />
                    </div>
                  </div>
                  <p className='text-3xl font-semibold tracking-tight tabular-nums'>
                    {s.value}
                  </p>
                  {s.bar ? (
                    <div className='space-y-1.5'>
                      <div className='h-1.5 w-full overflow-hidden rounded-full bg-muted'>
                        <div
                          className={`h-full rounded-full transition-all ${s.bar.tone}`}
                          style={{ width: `${s.bar.pct}%` }}
                        />
                      </div>
                      <p className='text-xs text-muted-foreground'>{s.hint}</p>
                    </div>
                  ) : (
                    <p className='text-xs text-muted-foreground'>{s.hint}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Toolbar */}
      <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
        {/* Status segmented control */}
        <div className='inline-flex w-fit items-center rounded-lg border bg-muted/50 p-1'>
          {[
            { label: 'All', value: undefined },
            { label: 'Active', value: true },
            { label: 'Inactive', value: false },
          ].map((opt) => (
            <button
              key={opt.label}
              type='button'
              onClick={() => setIsActive(opt.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                isActive === opt.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
          <div className='relative sm:w-72'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Search by name or URL...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='h-9 pl-9'
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className='h-9 sm:w-44'>
              <Filter className='h-4 w-4 mr-2 text-muted-foreground' />
              <SelectValue placeholder='All Categories' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Categories</SelectItem>
              <SelectItem value='news'>News</SelectItem>
              <SelectItem value='government'>Government</SelectItem>
              <SelectItem value='business'>Business</SelectItem>
              <SelectItem value='education'>Education</SelectItem>
              <SelectItem value='entertainment'>Entertainment</SelectItem>
              <SelectItem value='financial'>Financial</SelectItem>
              <SelectItem value='other'>Other</SelectItem>
            </SelectContent>
          </Select>
          {(searchQuery ||
            (category && category !== 'all') ||
            isActive !== undefined) && (
            <Button
              variant='ghost'
              size='sm'
              className='h-9 text-muted-foreground'
              onClick={() => {
                setSearchQuery('');
                setCategory('');
                setIsActive(undefined);
              }}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className='border-destructive bg-destructive/5'>
          <CardContent className='p-4'>
            <div className='flex items-center gap-2 text-destructive'>
              <AlertTriangle className='h-4 w-4' />
              <span className='text-sm font-medium'>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Websites Table */}
      <Card className='overflow-hidden shadow-sm'>
        <div className='flex items-center justify-between border-b px-4 py-3'>
          <p className='text-sm font-medium'>
            {filteredWebsites.length}{' '}
            {filteredWebsites.length === 1 ? 'website' : 'websites'}
          </p>
          {searchQuery && (
            <p className='text-xs text-muted-foreground'>
              Matching &quot;{searchQuery}&quot;
            </p>
          )}
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='bg-muted/40 border-b'>
              <tr className='text-left text-xs uppercase tracking-wider text-muted-foreground'>
                <th className='px-4 py-3 font-medium'>Website</th>
                <th className='px-4 py-3 font-medium'>Category</th>
                <th className='px-4 py-3 font-medium'>Status</th>
                <th className='px-4 py-3 font-medium'>Health</th>
                <th className='px-4 py-3 font-medium text-right'>Links</th>
                <th className='px-4 py-3 font-medium'>Last Crawl</th>
                <th className='px-4 py-3 font-medium text-right'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWebsites.map((website) => (
                <tr
                  key={website.id}
                  className={`border-b last:border-0 transition-colors hover:bg-muted/30 ${
                    loadingWebsites.has(website.id)
                      ? 'opacity-75 pointer-events-none'
                      : ''
                  }`}
                >
                  <td className='px-4 py-3 max-w-[280px]'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-semibold uppercase text-muted-foreground'>
                        {website.name.charAt(0)}
                      </div>
                      <div className='min-w-0'>
                        <p className='font-medium truncate'>{website.name}</p>
                        <p className='text-xs text-muted-foreground truncate'>
                          {website.url}
                        </p>
                      </div>
                    </div>
                    {website.description && (
                      <p className='text-xs text-muted-foreground line-clamp-1 mt-1 pl-12'>
                        {website.description}
                      </p>
                    )}
                  </td>
                  <td className='px-4 py-3'>
                    {website.category ? (
                      <Badge variant='secondary' className='text-xs'>
                        {website.category}
                      </Badge>
                    ) : (
                      <span className='text-muted-foreground'>—</span>
                    )}
                  </td>
                  <td className='px-4 py-3'>
                    <Badge
                      variant={website.isActive ? 'default' : 'secondary'}
                      className={
                        website.isActive
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100'
                          : ''
                      }
                    >
                      {website.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className='px-4 py-3'>
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium ${getHealthScoreColor(
                        website.healthScore
                      )}`}
                    >
                      {getHealthScoreIcon(website.healthScore)}
                      {website.healthScore}%
                    </div>
                  </td>
                  <td className='px-4 py-3 text-right font-medium'>
                    {website.totalLinks.toLocaleString()}
                  </td>
                  <td className='px-4 py-3 font-medium whitespace-nowrap'>
                    {website.lastCrawledAt
                      ? new Date(website.lastCrawledAt).toLocaleDateString()
                      : 'Never'}
                  </td>
                  <td className='px-4 py-3 text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0'
                        >
                          <MoreVertical className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                          onClick={() => handleOpenEditModal(website)}
                        >
                          <Pencil className='h-4 w-4 mr-2' />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleTriggerCrawl(website.id)}
                          disabled={loadingWebsites.has(website.id)}
                        >
                          <RefreshCcw
                            className={`h-4 w-4 mr-2 ${
                              loadingWebsites.has(website.id)
                                ? 'animate-spin'
                                : ''
                            }`}
                          />
                          Crawl Now
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className='h-4 w-4 mr-2' />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Website
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;
                                {website.name}
                                &quot;? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(website.id)}
                                className='bg-destructive hover:bg-destructive/90'
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Card className='p-4'>
          <div className='flex items-center justify-between'>
            <p className='text-sm text-muted-foreground'>
              Showing page {page} of {pagination.pages} ({pagination.total}{' '}
              total)
            </p>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  setPage((p) => Math.min(pagination.pages, p + 1))
                }
                disabled={page === pagination.pages}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
