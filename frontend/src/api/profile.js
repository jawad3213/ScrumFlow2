import client from './client';

export const updateAvatar = (formData) => {
    return client('/profile/avatar', {
        method: 'POST',
        body: formData,
        headers: {}, // Let fetch set the boundary for FormData
    });
};

export const updatePassword = (passwordData) => {
    return client('/profile/password', {
        body: passwordData
    });
};

export const updateProfile = (profileData) => {
    return client('/profile', {
        body: profileData
    });
};
