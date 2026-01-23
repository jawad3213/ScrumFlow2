import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSpecializations, createSpecialization, updateSpecialization, deleteSpecialization, bulkDeleteSpecializations } from './specializations';

export const useSpecializations = () => {
    return useQuery({
        queryKey: ['specializations'],
        queryFn: getSpecializations,
    });
};

export const useCreateSpecialization = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createSpecialization,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['specializations'] });
        },
    });
};

export const useUpdateSpecialization = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateSpecialization(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['specializations'] });
        },
    });
};

export const useDeleteSpecialization = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteSpecialization,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['specializations'] });
        },
    });
};

export const useBulkDeleteSpecializations = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: bulkDeleteSpecializations,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['specializations'] });
        },
    });
};
