import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import SiriOrb from "./siri-orb";

describe("SiriOrb Component", () => {
    it("applique les dimensions et les variables CSS par défaut", () => {
        const { container } = render(<SiriOrb />);
        const orb = container.firstChild;

        // Vérification des dimensions de base
        expect(orb.style.width).toBe("192px");
        expect(orb.style.height).toBe("192px");

        // Vérification des variables CSS calculées par défaut
        // blur = 192 * 0.08 = 15.36px
        expect(orb.style.getPropertyValue("--blur-amount")).toBe("15.36px");
        // contrast = 192 * 0.003 = 0.576 (mais Math.max avec 1.8 donc 1.8)
        expect(orb.style.getPropertyValue("--contrast-amount")).toBe("1.8");
        expect(orb.style.getPropertyValue("--animation-duration")).toBe("20s");
    });

    it("calcule correctement le flou et le contraste pour une taille personnalisée", () => {
        const { container } = render(<SiriOrb size="400px" />);
        const orb = container.firstChild;

        // blur = 400 * 0.08 = 32px
        expect(orb.style.getPropertyValue("--blur-amount")).toBe("32px");
        // contrast = 400 * 0.003 = 1.2 (donc le max est 1.8)
        expect(orb.style.getPropertyValue("--contrast-amount")).toBe("1.8");
    });

    it("écrase les couleurs par défaut avec la prop 'colors'", () => {
        const customColors = {
            c1: "rgb(255, 0, 0)",
            bg: "black"
        };
        const { container } = render(<SiriOrb colors={customColors} />);
        const orb = container.firstChild;

        expect(orb.style.getPropertyValue("--c1")).toBe("rgb(255, 0, 0)");
        expect(orb.style.getPropertyValue("--bg")).toBe("black");
        // c2 doit rester la valeur par défaut oklch
        expect(orb.style.getPropertyValue("--c2")).toBe("oklch(80% 0.12 200)");
    });

    it("fusionne la classe personnalisée avec la classe de base", () => {
        const { container } = render(<SiriOrb className="custom-orb" />);
        expect(container.firstChild).toHaveClass("siri-orb", "custom-orb");
    });

    it("met à jour la durée de l'animation", () => {
        const { container } = render(<SiriOrb animationDuration={5} />);
        expect(container.firstChild.style.getPropertyValue("--animation-duration")).toBe("5s");
    });
});