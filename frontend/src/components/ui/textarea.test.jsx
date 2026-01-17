import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import "@testing-library/jest-dom/vitest"
import { Textarea } from "./textarea"

describe("Textarea Component", () => {
    it("rend l'élément textarea correctement", () => {
        render(<Textarea placeholder="Écrivez ici..." />)
        const textarea = screen.getByPlaceholderText("Écrivez ici...")
        expect(textarea).toBeInTheDocument()
        expect(textarea.tagName).toBe("TEXTAREA")
    })

    it("permet à l'utilisateur de saisir du texte", async () => {
        const user = userEvent.setup()
        render(<Textarea placeholder="Message" />)
        const textarea = screen.getByPlaceholderText("Message")

        await user.type(textarea, "Hello World")
        expect(textarea.value).toBe("Hello World")
    })

    it("applique les styles de l'état désactivé (disabled)", () => {
        render(<Textarea disabled placeholder="Désactivé" />)
        const textarea = screen.getByPlaceholderText("Désactivé")

        expect(textarea).toBeDisabled()
        expect(textarea).toHaveClass("disabled:cursor-not-allowed", "disabled:opacity-50")
    })

    it("fusionne les classes CSS personnalisées", () => {
        render(<Textarea className="custom-class" />)
        const textarea = screen.getByRole("textbox")
        
        expect(textarea).toHaveClass("custom-class")
        // Vérifie qu'il garde ses classes de base (ex: flex)
        expect(textarea).toHaveClass("flex")
    })

    it("transmet la ref correctement", () => {
        const ref = { current: null }
        render(<Textarea ref={ref} />)
        expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
    })

    it("réagit aux événements de focus", async () => {
        const user = userEvent.setup()
        render(<Textarea />)
        const textarea = screen.getByRole("textbox")

        await user.click(textarea)
        expect(textarea).toHaveFocus()
    })
})