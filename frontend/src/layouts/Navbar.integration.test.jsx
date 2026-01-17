import React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Routes, Route } from "react-router-dom"

import Navbar from "./Navbar"
import { USER_ROLES } from "@/utils/constants"

/* =========================
   MOCK useAuth
========================= */
const mockLogout = vi.fn()

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: () => ({
    user: {
      first_name: "John",
      last_name: "Doe",
      email: "john@doe.com",
      avatar: null,
    },
    userRole: USER_ROLES.MANAGER,
    logout: mockLogout,
  }),
}))

/* =========================
   MOCK useNavigate
========================= */
const mockNavigate = vi.fn()

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

/* =========================
   HELPER RENDER
========================= */
const renderNavbar = (initialPath = "/dashboard/projects") =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="*" element={<Navbar />} />
      </Routes>
    </MemoryRouter>
  )

/* =========================
   TESTS D’INTÉGRATION
========================= */
describe("Navbar – integration tests", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders user name and role from auth context", () => {
    renderNavbar()

    expect(screen.getByText("John Doe")).toBeTruthy()
    expect(screen.getByText("Manager")).toBeTruthy()
  })

  it("renders breadcrumb based on current route", () => {
    renderNavbar("/project/my-project/tasks")

    expect(screen.getByText("Dashboard")).toBeTruthy()
    expect(screen.getByText("project")).toBeTruthy()
    expect(screen.getByText("my project")).toBeTruthy()
    expect(screen.getByText("tasks")).toBeTruthy()
  })

  it("opens user menu on click", async () => {
    renderNavbar()

    await userEvent.click(screen.getByText("John Doe"))

    expect(screen.getByText("Profile")).toBeTruthy()
    expect(screen.getByText("Log out")).toBeTruthy()
  })

  it("logs out and navigates to /login", async () => {
    renderNavbar()

    await userEvent.click(screen.getByText("John Doe"))
    await userEvent.click(screen.getByText("Log out"))

    expect(mockLogout).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith("/login")
  })

  it("closes user menu when clicking outside", async () => {
    renderNavbar()

    await userEvent.click(screen.getByText("John Doe"))
    expect(screen.getByText("Profile")).toBeTruthy()

    await userEvent.click(document.body)

    expect(screen.queryByText("Profile")).toBeNull()
  })
})
