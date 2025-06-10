import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { changePassword, getCurrentUser, updateProfile } from '../api/authApi';
import type { ChangePasswordForm, User } from '../types';

export const useCurrentUser = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await getCurrentUser();
      return response.data.user;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<Pick<User, 'firstName' | 'lastName' | 'email'>>) => {
      const response = await updateProfile(data);
      return response.data.user;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['currentUser'], updatedUser);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePasswordForm) => {
      return changePassword(data);
    },
  });

  return {
    ...query,
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    changePassword: changePasswordMutation.mutate,
    isChangingPassword: changePasswordMutation.isPending,
  };
}; 