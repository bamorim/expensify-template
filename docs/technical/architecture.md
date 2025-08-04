# Architecture Documentation

## Overview

This document outlines the technical architecture of the Expensify application, built using the T3 Stack with Next.js, TypeScript, Prisma, and Vitest.

## Technology Stack

### Core Technologies

- **Next.js** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Database ORM with PostgreSQL
- **Tailwind CSS** - Utility-first CSS framework
- **Zod** - Schema validation and type inference

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing framework
- **pnpm** - Package manager

## Service Architecture

### Domain-Driven Service Structure

The application follows a domain-driven design pattern with clear service boundaries. Each service is organized in its own directory under `src/server/`:

```
src/server/
├── db.ts                   # Database connection and configuration
├── services/               # Domain-driven design services
│   ├── example/
│   │   ├── index.ts        # Service implementation
│   │   └── index.test.ts   # Service tests
│   └── [other-services]/
│       ├── index.ts
│       └── index.test.ts
```

### Service Implementation Pattern

Services follow a consistent pattern:

```typescript
import { db } from "~/server/db";
import type { PrismaClient } from "@prisma/client";

class ExampleService {
  constructor(private readonly prisma: PrismaClient) {}

  async getExample() {
    return await this.prisma.$queryRaw<
      [{ id: string }]
    >`SELECT gen_random_uuid() AS id`;
  }
}

const exampleService = new ExampleService(db);
export { exampleService, ExampleService };
```

**Key Benefits:**

- **Dependency Injection**: Services receive Prisma client as dependency
- **Testability**: Easy to mock dependencies for unit tests
- **Type Safety**: Full TypeScript support with Prisma types
- **Singleton Pattern**: Single service instance exported for reuse

## Testing Strategy

### Vitest Configuration

The project uses Vitest with a multi-environment setup, where tests in `src/server` run in `node` and `src/app` run in `jsdom`.

### Testing Patterns

#### Server-Side Testing

If you want more of an integration-type testing, you can have something like this:

```typescript
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
```

However if you want more of a unit test type of scenario,
you can rely on `vitest-mock-extended`

```typescript
import { describe, it, expect } from "vitest";
import { ExampleService } from ".";
import { mockDeep } from "vitest-mock-extended";
import type { PrismaClient } from "@prisma/client";

describe("ExampleService", () => {
  it("should return a random uuid", async () => {
    const id = "123e4567-e89b-12d3-a456-426614174000";
    const db = mockDeep<PrismaClient>();
    db.$queryRaw.mockResolvedValue([{ id }]);
    const service = new ExampleService(db);
    const result = await service.getExample();

    expect(result).toEqual([{ id }]);
  });
});
```

For cases where dependency injection is not easy, you can use `vi.mock`:

```typescript
import { describe, it, expect, vi } from "vitest";
import { exampleService } from ".";
import { db } from "~/server/db";

vi.mock("~/server/db");

describe("ExampleService", () => {
  it("should return a random uuid", async () => {
    const id = "123e4567-e89b-12d3-a456-426614174000";
    vi.mocked(db.$queryRaw).mockResolvedValue([{ id }]);
    const result = await exampleService.getExample();

    expect(result).toEqual([{ id }]);
  });
});
```

