import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import FileDropzone from './FileDropzone';

describe('FileDropzone Component', () => {
    const onFileSelected = vi.fn();
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call onFileSelected when a file is selected via input', async () => {
        render(
            <FileDropzone onFileSelected={onFileSelected}>
                <div>Click me</div>
            </FileDropzone>
        );

        // On récupère l'input par sa propriété type
        const input = document.querySelector('input[type="file"]');

        // On simule le changement de fichier directement
        // C'est souvent plus fiable que user.upload pour les inputs cachés
        fireEvent.change(input, {
            target: { files: [file] },
        });

        await waitFor(() => {
            expect(onFileSelected).toHaveBeenCalledWith(file);
        });
    });

    it('should call onFileSelected when a file is dropped', async () => {
        render(
            <FileDropzone onFileSelected={onFileSelected}>
                <div data-testid="dropzone">Drop here</div>
            </FileDropzone>
        );

        const dropzone = screen.getByTestId('dropzone').parentElement;

        fireEvent.drop(dropzone, {
            dataTransfer: { 
                files: [file],
                types: ['Files'] 
            },
        });

        await waitFor(() => {
            expect(onFileSelected).toHaveBeenCalledWith(file);
        });
    });

    it('should trigger input click when container is clicked', () => {
        render(
            <FileDropzone onFileSelected={onFileSelected}>
                <div data-testid="container">Click me</div>
            </FileDropzone>
        );

        const input = document.querySelector('input[type="file"]');
        // On crée un espion sur la méthode click native de l'élément DOM
        const clickSpy = vi.spyOn(input, 'click');

        const container = screen.getByTestId('container').parentElement;
        fireEvent.click(container);

        expect(clickSpy).toHaveBeenCalled();
        clickSpy.mockRestore();
    });
});