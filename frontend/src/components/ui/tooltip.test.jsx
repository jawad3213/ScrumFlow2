import { describe, it, expect } from "vitest"
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./tooltip"

const getVisibleTooltip = (text) => {
  const elements = screen.getAllByText(text)
  return elements.find(el => el.getAttribute("data-state") === "delayed-open")
}

describe("Tooltip component", () => {
  it("renders tooltip content on hover", async () => {
    const user = userEvent.setup()

    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )

    await user.hover(screen.getByText("Hover me"))

    const tooltip = getVisibleTooltip("Tooltip text")
    expect(tooltip).toBeInTheDocument()
  })

  it("applies custom className to TooltipContent", async () => {
    const user = userEvent.setup()

    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent className="custom-class">
            Tooltip content
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )

    await user.hover(screen.getByText("Trigger"))

    const tooltip = getVisibleTooltip("Tooltip content")
    expect(tooltip).toHaveClass("custom-class")
  })

  it("respects sideOffset prop", async () => {
    const user = userEvent.setup()

    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent sideOffset={10}>
            Offset tooltip
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )

    const trigger = screen.getByText("Trigger")
    await user.hover(trigger)

    const tooltip = getVisibleTooltip("Offset tooltip")
    expect(tooltip).toBeInTheDocument()
  })
})
