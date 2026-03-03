import { render, screen, act, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import Toast from "./toast";

describe("Toast Component", () => {
    const onCloseMock = vi.fn();

    beforeEach(() => {
        vi.useFakeTimers();
        onCloseMock.mockClear();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("affiche le message lorsque 'show' est vrai", () => {
        render(<Toast show={true} message="Succès" onClose={onCloseMock} />);
        expect(screen.getByText("Succès")).toBeInTheDocument();
    });

    it("appelle onClose lors du clic sur le bouton de fermeture", () => {
        render(<Toast show={true} message="Test" onClose={onCloseMock} />);
        
        const closeButton = screen.getByRole("button");
        // On utilise fireEvent ici car userEvent entre en conflit avec les Fake Timers
        fireEvent.click(closeButton);

        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it("appelle onClose automatiquement après la durée spécifiée", () => {
        render(<Toast show={true} message="Timer" onClose={onCloseMock} duration={5000} />);
        
        // Avancer de 4000ms : ne doit pas être appelé
        act(() => {
            vi.advanceTimersByTime(4000);
        });
        expect(onCloseMock).not.toHaveBeenCalled();

        // Avancer jusqu'à 5000ms : doit être appelé
        act(() => {
            vi.advanceTimersByTime(1000);
        });
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it("nettoie le timer lors du démontage", () => {
        const spy = vi.spyOn(global, 'clearTimeout');
        const { unmount } = render(<Toast show={true} message="Test" onClose={onCloseMock} />);
        
        unmount();
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
});