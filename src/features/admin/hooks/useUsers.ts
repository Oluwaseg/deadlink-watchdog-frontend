import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../api/adminApi';

interface UseUsersOptions {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'user' | 'admin';
  isActive?: boolean;
}

export const useUsers = ({
  page = 1,
  limit = 20,
  role,
}: UseUsersOptions = {}) => {
  return useQuery({
    queryKey: ['admin', 'users', { page, limit, role }],
    queryFn: () => getUsers({ page, limit, role }),
  });
}; 