import { exampleService } from "~/server/services/example";

export default async function HomePage() {
  const example = await exampleService.getExample();
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-lg">ID: {example[0].id}</div>
    </main>
  );
}
