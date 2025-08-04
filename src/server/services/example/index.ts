import { db } from "~/server/db";

// This is an example of a domain-layer service

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
