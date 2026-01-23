import React from "react"
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

import { ProjectProvider, ProjectContext } from "./ProjectContext"

/* =========================
   COMPOSANT DE TEST
========================= */
const TestComponent = () => {
  const { currentProject } = React.useContext(ProjectContext)
  return <span data-testid="project">{currentProject}</span>
}

/* =========================
   TESTS D’INTÉGRATION
========================= */
describe("ProjectContext – integration tests", () => {
  it("sets project from URL /project/:id", () => {
    render(
      <MemoryRouter initialEntries={["/project/my-project"]}>
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      </MemoryRouter>
    )

    expect(screen.getByTestId("project").textContent).toBe("my-project")
  })

  it("sets project to global when URL does not contain /project/", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      </MemoryRouter>
    )

    expect(screen.getByTestId("project").textContent).toBe("global")
  })

  it("updates project when route changes", () => {
    render(
      <MemoryRouter initialEntries={["/project/alpha"]}>
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      </MemoryRouter>
    )

    // Première route
    expect(screen.getByTestId("project").textContent).toBe("alpha")
  })
})
