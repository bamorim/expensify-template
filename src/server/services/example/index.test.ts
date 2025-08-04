import { describe, it, expect } from "vitest";
import z from "zod";
import { exampleService } from ".";

describe("ExampleService", () => {
  it("should return a random uuid", async () => {
    const result = await exampleService.getExample();
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBeDefined();
    expect(() => z.string().uuid().parse(result[0]?.id)).not.toThrow();
  });
});
