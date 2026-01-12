import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmployees, getAvailableEmployees, createEmployee, updateEmployee, deleteEmployee, bulkDeleteEmployees } from './employees';

export const useEmployees = () => {
    return useQuery({
        queryKey: ['employees'],
        queryFn: getEmployees,
    });
};

export const useAvailableEmployees = () => {
    return useQuery({
        queryKey: ['employees', 'available'],
        queryFn: getAvailableEmployees,
    });
};

export const useCreateEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        },
    });
};

export const useUpdateEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateEmployee(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        },
    });
};

export const useDeleteEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        },
    });
};

export const useBulkDeleteEmployees = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: bulkDeleteEmployees,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        },
    });
};
