import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import "@testing-library/jest-dom/vitest"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs"

describe("Tabs Component", () => {
    const TestTabs = () => (
        <Tabs defaultValue="account" className="w-[400px]">
            <TabsList>
                <TabsTrigger value="account">Compte</TabsTrigger>
                <TabsTrigger value="password">Sécurité</TabsTrigger>
                <TabsTrigger value="disabled" disabled>Désactivé</TabsTrigger>
            </TabsList>
            <TabsContent value="account">Contenu du compte</TabsContent>
            <TabsContent value="password">Contenu de la sécurité</TabsContent>
        </Tabs>
    )

    it("affiche le contenu de l'onglet par défaut", () => {
        render(<TestTabs />)
        
        // L'onglet actif doit être visible
        expect(screen.getByText("Contenu du compte")).toBeInTheDocument()
        // L'autre contenu ne doit pas être dans le DOM (Radix démonte par défaut)
        expect(screen.queryByText("Contenu de la sécurité")).not.toBeInTheDocument()
    })

    it("change de contenu lors du clic sur un autre onglet", async () => {
        const user = userEvent.setup()
        render(<TestTabs />)

        const passwordTab = screen.getByRole("tab", { name: /sécurité/i })
        await user.click(passwordTab)

        // Le nouveau contenu doit apparaître
        expect(screen.getByText("Contenu de la sécurité")).toBeInTheDocument()
        // L'ancien contenu doit disparaître
        expect(screen.queryByText("Contenu du compte")).not.toBeInTheDocument()
    })

    it("vérifie les attributs d'état (active/inactive)", async () => {
        render(<TestTabs />)
        
        const accountTab = screen.getByRole("tab", { name: /compte/i })
        const passwordTab = screen.getByRole("tab", { name: /sécurité/i })

        expect(accountTab).toHaveAttribute("data-state", "active")
        expect(passwordTab).toHaveAttribute("data-state", "inactive")
    })

    it("ne change pas d'onglet si le trigger est désactivé", async () => {
        const user = userEvent.setup()
        render(<TestTabs />)

        const disabledTab = screen.getByRole("tab", { name: /désactivé/i })
        
        // Vérifie l'attribut disabled de Radix
        expect(disabledTab).toBeDisabled()
        
        await user.click(disabledTab)
        
        // Le contenu par défaut doit toujours être là
        expect(screen.getByText("Contenu du compte")).toBeInTheDocument()
    })

    it("permet la navigation au clavier avec les flèches", async () => {
        const user = userEvent.setup()
        render(<TestTabs />)

        const accountTab = screen.getByRole("tab", { name: /compte/i })
        accountTab.focus()

        // Flèche droite pour aller au suivant
        await user.keyboard("{ArrowRight}")
        
        // Radix active l'onglet automatiquement au focus clavier (comportement par défaut)
        expect(screen.getByText("Contenu de la sécurité")).toBeInTheDocument()
    })
})