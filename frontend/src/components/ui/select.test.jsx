import * as React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import "@testing-library/jest-dom/vitest"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./select";


// Simule les fonctions de capture et de défilement manquantes
HTMLElement.prototype.scrollIntoView = vi.fn();
HTMLElement.prototype.hasPointerCapture = vi.fn(() => false);
HTMLElement.prototype.setPointerCapture = vi.fn();
HTMLElement.prototype.releasePointerCapture = vi.fn();

// Simule l'observateur de taille pour Radix
global.ResizeObserver = class {
    observe() {} unobserve() {} disconnect() {}
};

describe("Select Component", () => {
    const TestSelect = () => (
        <Select defaultValue="apple">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
                <SelectItem value="apple">Pomme</SelectItem>
                <SelectItem value="banana">Banane</SelectItem>
            </SelectContent>
        </Select>
    );

    it("devrait ouvrir le menu et changer la valeur", async () => {
        const user = userEvent.setup();
        render(<TestSelect />);

        // 1. Vérifier la valeur initiale
        expect(screen.getByText("Pomme")).toBeInTheDocument();

        // 2. Cliquer pour ouvrir
        const trigger = screen.getByRole("combobox");
        await user.click(trigger);

        // 3. Attendre que l'option apparaisse (Portal)
        const option = await screen.findByText("Banane");
        await user.click(option);

        // 4. Vérifier que la valeur a changé
        await waitFor(() => {
            expect(screen.getByText("Banane")).toBeInTheDocument();
        });
    });
});