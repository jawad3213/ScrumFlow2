import client from './client';

export const getEmployees = () => {
  return client('/employees');
};

export const getAvailableEmployees = () => {
  return client('/employees/available');
};

export const createEmployee = (employeeData) => {
  return client('/employees', { body: employeeData });
};

export const updateEmployee = (id, employeeData) => {
  return client(`/employees/${id}`, {
    method: 'PUT',
    body: employeeData,
  });
};

export const deleteEmployee = (id) => {
  return client(`/employees/${id}`, {
    method: 'DELETE',
  });
};

export const bulkDeleteEmployees = (ids) => {
  return client('/employees/bulk-delete', {
    method: 'POST',
    body: { ids },
  });
};
