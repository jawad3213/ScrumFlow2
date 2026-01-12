import client from '@/lib/axios';

export const getSpecializations = () => {
  return client('/specializations');
};

export const createSpecialization = (data) => {
  return client('/specializations', { body: data });
};

export const updateSpecialization = (id, data) => {
  return client(`/specializations/${id}`, {
    method: 'PUT',
    body: data,
  });
};

export const deleteSpecialization = (id) => {
  return client(`/specializations/${id}`, {
    method: 'DELETE',
  });
};

export const bulkDeleteSpecializations = (ids) => {
  return client('/specializations/bulk-delete', {
    method: 'POST',
    body: { ids },
  });
};
