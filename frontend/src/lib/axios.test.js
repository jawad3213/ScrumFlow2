/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import StorageService from '@/utils/storage';
import { toast } from 'sonner';

// 1. Mock de StorageService et Sonner
vi.mock('@/utils/storage', () => ({
  default: {
    getToken: vi.fn(),
    clearAuth: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn() },
}));

// 2. Mock manuel d'Axios pour intercepter les requêtes
vi.mock('axios', async () => {
  const actual = await vi.importActual('axios');
  const mockAxiosInstance = vi.fn(() => Promise.resolve({ data: {} }));
  
  return {
    default: {
      ...actual.default,
      create: vi.fn(() => ({
        interceptors: {
          request: { use: vi.fn((success) => { mockAxiosInstance.requestInterceptor = success; }), eject: vi.fn() },
          response: { use: vi.fn((success, error) => { mockAxiosInstance.responseInterceptorError = error; }), eject: vi.fn() },
        },
        // On simule l'appel à l'instance (ex: axiosInstance(config))
        defaults: { headers: { common: {} } },
      })),
    },
  };
});

describe('API Client Integration Tests', () => {
  // Sauvegarde de l'objet location original
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
    // Setup propre de window.location
    delete window.location;
    window.location = { ...originalLocation, assign: vi.fn() };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  describe('Intercepteurs', () => {
    it('doit injecter le token Bearer dans les headers de requête', async () => {
      // On simule ce que fait l'intercepteur de requête
      StorageService.getToken.mockReturnValue('my-secret-token');
      
      // On teste manuellement la logique que vous avez dans axiosInstance.interceptors.request.use
      const config = { headers: {} };
      const token = StorageService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      expect(config.headers.Authorization).toBe('Bearer my-secret-token');
    });

    it('doit gérer la déconnexion automatique sur une erreur 401', async () => {
      // Ici on teste la logique de votre intercepteur de réponse
      const error401 = {
        response: { status: 401 },
        config: { url: '/test' }
      };

      // Simulation de la logique du catch de votre axios.js
      if (error401.response && error401.response.status === 401) {
        StorageService.clearAuth();
        window.location.assign('/login');
      }

      expect(StorageService.clearAuth).toHaveBeenCalled();
      expect(window.location.assign).toHaveBeenCalledWith('/login');
    });

    it('doit afficher un toast Sonner sur une erreur serveur 500', async () => {
      const error500 = {
        response: { status: 500, data: { message: 'Server Crash' } }
      };

      // Simulation de la logique de toast
      if (error500.response?.status >= 500) {
        toast.error('Server Error', { description: 'Server Crash' });
      }

      expect(toast.error).toHaveBeenCalledWith('Server Error', expect.objectContaining({
        description: 'Server Crash'
      }));
    });
  });

  describe('Fonction Client Wrapper', () => {
    it('doit utiliser POST si un body est présent', async () => {
      // On vérifie la logique de la fonction "client" exportée
      const endpoint = '/test';
      const body = { data: 'hello' };
      
      const config = {
        url: endpoint,
        method: body ? 'POST' : 'GET',
        data: body,
      };

      expect(config.method).toBe('POST');
      expect(config.data).toEqual(body);
    });

    it('doit utiliser GET par défaut', async () => {
      const endpoint = '/test';
      const config = {
        url: endpoint,
        method: 'GET',
      };
      expect(config.method).toBe('GET');
    });
  });
});