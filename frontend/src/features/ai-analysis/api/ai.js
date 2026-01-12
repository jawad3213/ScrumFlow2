import client from '@/lib/axios';
import { AI_SERVICE_URL } from '@/utils/api';

/**
 * Sends a staffing analysis request to the AI engine.
 * @param {FormData} formData - The form data containing the file and parameters.
 * @returns {Promise<Object>} - The response data from the AI service.
 */
export const analyzeStaffing = (formData) => {
    return client(`${AI_SERVICE_URL}/analyze-staffing`, {
        body: formData
    });
};

/**
 * Sends a backlog analysis request to the AI engine.
 * @param {FormData} formData - The form data containing the file and parameters.
 * @returns {Promise<Object>} - The response data from the AI service.
 */
export const analyzeBacklog = (formData) => {
    return client(`${AI_SERVICE_URL}/analyze-backlog`, {
        body: formData
    });
};

/**
 * Sends a stack analysis request to the AI engine.
 * @param {FormData} formData - The form data containing the file (backlog json) and api key.
 * @returns {Promise<Object>} - The response data from the AI service.
 */
export const analyzeStack = (formData) => {
    return client(`${AI_SERVICE_URL}/analyze-stack`, {
        body: formData
    });
};
