import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import ShimmerText from "./shimmer-text"; // Vérifie bien la casse du nom de fichier

describe("ShimmerText Component", () => {
    it("affiche le texte correct passé en prop", () => {
        render(<ShimmerText text="Bonjour" />);
        expect(screen.getByText("Bonjour")).toBeInTheDocument();
    });

    it("possède les classes CSS de l'effet shimmer", () => {
        render(<ShimmerText text="Test" />);
        const element = screen.getByText("Test");
        
        // On vérifie que les classes de dégradé sont bien présentes
        expect(element).toHaveClass("bg-clip-text");
        expect(element).toHaveClass("text-transparent");
    });

    it("utilise un titre H1 pour le rendu", () => {
        render(<ShimmerText />);
        const heading = screen.getByRole("heading", { level: 1 });
        expect(heading).toBeInTheDocument();
    });

    it("applique la classe personnalisée via className", () => {
        render(<ShimmerText className="custom-class" />);
        const heading = screen.getByRole("heading", { level: 1 });
        expect(heading).toHaveClass("custom-class");
    });
});