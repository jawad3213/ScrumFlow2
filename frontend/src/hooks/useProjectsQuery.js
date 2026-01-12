import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjects, getProject, createProject, updateProject, deleteProject } from '../api/projects';

export const useProjects = () => {
    return useQuery({
        queryKey: ['projects'],
        queryFn: getProjects,
    });
};

export const useProjectDetails = (id) => {
    return useQuery({
        queryKey: ['projects', id],
        queryFn: () => getProject(id),
        enabled: !!id,
    });
};

export const useCreateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
};

export const useUpdateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateProject(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
        },
    });
};

export const useDeleteProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
};
