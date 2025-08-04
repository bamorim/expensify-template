import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "./page";
import { db } from "~/server/db";

// Mock the database layer
vi.mock("~/server/db", () => ({
  db: {
    $queryRaw: vi.fn(),
  },
}));

// Mock the database to avoid actual database calls
const mockDb = vi.mocked(db);

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the page with example data", async () => {
    // Mock the database response
    const mockExampleData = [{ id: "123e4567-e89b-12d3-a456-426614174000" }];
    mockDb.$queryRaw.mockResolvedValue(mockExampleData);

    // Render the async component
    render(await HomePage());

    // Check that the database was called
    expect(mockDb.$queryRaw).toHaveBeenCalledTimes(1);

    // Check that the ID is displayed
    expect(screen.getByText(/ID:/)).toBeInTheDocument();
    expect(
      screen.getByText(/123e4567-e89b-12d3-a456-426614174000/),
    ).toBeInTheDocument();
  });
});
