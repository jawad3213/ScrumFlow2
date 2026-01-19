import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProfileHeader from './ProfileHeader';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { updateAvatar } from '@/features/auth/api/profile';
import { USER_ROLES } from '@/utils/constants';

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/features/auth/api/profile', () => ({
  updateAvatar: vi.fn(),
}));

describe('ProfileHeader', () => {
  const mockUpdateUser = vi.fn();
  const mockUser = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    avatar: null,
  };

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      user: mockUser,
      userRole: USER_ROLES.MEMBER,
      updateUser: mockUpdateUser,
    });
  });

  it('gère l\'upload d\'une nouvelle photo de profil avec succès', async () => {
    const newAvatarPath = 'avatars/new-photo.jpg';
    updateAvatar.mockResolvedValueOnce({ avatar: newAvatarPath, avatar_url: true });
    
    const { container } = render(<ProfileHeader />);
    
    // Ciblage direct de l'input caché via le DOM
    const input = container.querySelector('input[type="file"]');
    const file = new File(['(binary data)'], 'profile.png', { type: 'image/png' });
    
    fireEvent.change(input, { target: { files: [file] } });

    // Vérifier que le bouton de la caméra passe en état loading (le loader est une div animée)
    const loader = container.querySelector('.animate-spin');
    expect(loader).toBeInTheDocument();

    await waitFor(() => {
      expect(updateAvatar).toHaveBeenCalled();
      expect(mockUpdateUser).toHaveBeenCalledWith(expect.objectContaining({
        avatar: newAvatarPath
      }));
    });
  });

  it('ouvre le sélecteur de fichier lors du clic sur le bouton caméra', () => {
    const { container } = render(<ProfileHeader />);
    
    const input = container.querySelector('input[type="file"]');
    
    // On doit simuler/espionner la méthode click de l'élément DOM
    const clickSpy = vi.spyOn(input, 'click');
    
    // Le bouton est celui qui contient l'icône caméra ou le loader
    const cameraButton = screen.getByRole('button');
    fireEvent.click(cameraButton);
    
    expect(clickSpy).toHaveBeenCalled();
  });
});