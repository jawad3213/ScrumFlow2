import client from '@/lib/axios';

export const getProjects = () => client('/projects');

export const getProject = (id) => client(`/projects/${id}`);

export const createProject = (data) => client('/projects', { body: data });

export const updateProject = (id, data) => client(`/projects/${id}`, { 
    method: 'PUT',
    body: data 
});

export const deleteProject = (id) => client(`/projects/${id}`, { method: 'DELETE' });
