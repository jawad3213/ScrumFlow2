import React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { AuthProvider, AuthContext } from "./AuthContext"

/* =========================
   MOCKS DES DÉPENDANCES
========================= */

// Mock StorageService
vi.mock("@/utils/storage", () => ({
  default: {
    getUser: vi.fn(),
    getRole: vi.fn(),
    setUser: vi.fn(),
    setRole: vi.fn(),
    clearAuth: vi.fn(),
  },
}))

// Mock Axios token management
vi.mock("@/lib/axios", () => ({
  setAccessToken: vi.fn(),
  clearAccessToken: vi.fn(),
}))

vi.mock("@/features/auth/api/auth", () => ({
  login: vi.fn(),
  refreshToken: vi.fn(),
}))

import { login as apiLogin, refreshToken as apiRefresh } from "@/features/auth/api/auth"
import StorageService from "@/utils/storage"
import { setAccessToken, clearAccessToken } from "@/lib/axios"

/* =========================
   COMPOSANT DE TEST
========================= */

const TestComponent = () => {
  const {
    user,
    userRole,
    token,
    login,
    logout,
    updateUser,
    isAuthenticated,
    loading,
  } = React.useContext(AuthContext)

  return (
    <div>
      <span data-testid="loading">{loading ? "loading" : "ready"}</span>
      <span data-testid="user">{user?.name ?? "no-user"}</span>
      <span data-testid="role">{userRole ?? "no-role"}</span>
      <span data-testid="token">{token ?? "no-token"}</span>
      <span data-testid="auth">{isAuthenticated ? "yes" : "no"}</span>

      <button onClick={() => login({ email: "a@a.com", password: "123" })}>
        login
      </button>
      <button onClick={logout}>logout</button>
      <button onClick={() => updateUser({ name: "Updated User" })}>
        update
      </button>
    </div>
  )
}

/* =========================
   TESTS D’INTÉGRATION
========================= */

describe("AuthContext – integration tests", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    StorageService.getUser.mockReturnValue(null)
    StorageService.getRole.mockReturnValue(null)
    apiRefresh.mockResolvedValue({}) // Default silent refresh failure/empty
  })

  it("initializes from storage with silent refresh", async () => {
    StorageService.getUser.mockReturnValue({ name: "John" })
    StorageService.getRole.mockReturnValue("admin")
    apiRefresh.mockResolvedValue({ access_token: "refreshed-token" })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("ready")
    )

    expect(screen.getByTestId("user").textContent).toBe("John")
    expect(screen.getByTestId("role").textContent).toBe("admin")
    expect(setAccessToken).toHaveBeenCalledWith("refreshed-token")
  })

  it("logs in and updates context + storage (no token in storage)", async () => {
    apiLogin.mockResolvedValue({
      access_token: "token123",
      role: "user",
      user: { name: "Alice" },
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await userEvent.click(screen.getByText("login"))

    await waitFor(() =>
      expect(screen.getByTestId("auth").textContent).toBe("yes")
    )

    expect(StorageService.setRole).toHaveBeenCalledWith("user")
    expect(StorageService.setUser).toHaveBeenCalledWith({ name: "Alice" })
    expect(setAccessToken).toHaveBeenCalledWith("token123")

    expect(screen.getByTestId("user").textContent).toBe("Alice")
    expect(screen.getByTestId("token").textContent).toBe("token123")
  })

  it("logs out and clears context + storage", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await userEvent.click(screen.getByText("logout"))

    expect(StorageService.clearAuth).toHaveBeenCalled()
    expect(clearAccessToken).toHaveBeenCalled()
    expect(screen.getByTestId("auth").textContent).toBe("no")
    expect(screen.getByTestId("user").textContent).toBe("no-user")
  })

  it("updates user correctly", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await userEvent.click(screen.getByText("update"))

    expect(StorageService.setUser).toHaveBeenCalledWith({
      name: "Updated User",
    })
    expect(screen.getByTestId("user").textContent).toBe("Updated User")
  })
})
