import React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"

import PrivateLayout from "./PrivateLayout"

/* =========================
   MOCK DES DÉPENDANCES
========================= */

// Mock useAuth
vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from "@/features/auth/hooks/useAuth"

// Mock Sidebar et Navbar (on teste l’intégration du layout, pas leur UI interne)
vi.mock("./Sidebar", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}))

vi.mock("./Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}))

/* =========================
   HELPER DE RENDER
========================= */
const renderWithRouter = (authState) => {
  useAuth.mockReturnValue(authState)

  return render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<div>Private Content</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>
  )
}

/* =========================
   TESTS D’INTÉGRATION
========================= */
describe("PrivateLayout – integration tests", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("shows loading spinner when auth is loading", () => {
    renderWithRouter({
      isAuthenticated: false,
      loading: true,
    })

    // Spinner présent
    expect(document.querySelector(".animate-spin")).toBeTruthy()
  })

  it("redirects to /login when user is not authenticated", () => {
    renderWithRouter({
      isAuthenticated: false,
      loading: false,
    })

    expect(screen.getByText("Login Page")).toBeTruthy()
  })

  it("renders sidebar, navbar and outlet when authenticated", () => {
    renderWithRouter({
      isAuthenticated: true,
      loading: false,
    })

    expect(screen.getByTestId("sidebar")).toBeTruthy()
    expect(screen.getByTestId("navbar")).toBeTruthy()
    expect(screen.getByText("Private Content")).toBeTruthy()
  })
})
