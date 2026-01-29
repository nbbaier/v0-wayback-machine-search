# Agent Guidelines

## Commands

- **Build:** `pnpm build`
- **Dev:** `pnpm dev`
- **Lint:** `pnpm lint` (uses Biome)
- **Fix Lint:** `pnpm lint:fix`
- **Type Check:** `pnpm check`
- **Test:** No test runner configured currently.

## Code Style

- **Formatting:** Follow Biome configuration (Tabs for indentation, Double quotes).
- **Imports:** Use `import type` for type-only imports. Use `@/` alias for project root imports.
- **Naming:** PascalCase for React components, camelCase for functions/variables.
- **Components:** Use functional components. Define props using TypeScript interfaces or types.
- **Styling:** Tailwind CSS. Use `cn()` utility for conditional class merging.
- **UI Library:** Use Radix UI primitives and `class-variance-authority` for component variants.
- **Language:** TypeScript. Ensure strict type safety. Avoid `any`.
- **Directory Structure:** Place UI components in `components/ui`, utility functions in `lib/utils`.
