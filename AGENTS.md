# Repository Guidelines

## Project Structure & Module Organization

This is a personal portfolio built with Next.js App Router, React, TypeScript, and Tailwind CSS. Routes and API handlers live in `app/`, including `app/api/contact/route.ts` and `app/api/lastfm/route.ts`. Reusable UI components live in `components/`, custom hooks in `hooks/`, shared helpers in `lib/` and `utils/`, and static portfolio content in `data/`. Translation files are stored in `locales/en/translation.json` and `locales/pt/translation.json`; update both when adding user-facing text. Static assets, including resume PDFs, live in `public/`. Tests are under `__tests__/`.

## Build, Test, and Development Commands

- `npm run dev`: start the local Next.js development server.
- `npm run build`: create a production build.
- `npm run start`: run the production server after building.
- `npm run lint`: run ESLint across the repository.
- `npm run test`: run the Vitest suite once.
- `npm run test:watch`: run Vitest in watch mode.
- `npm run test:coverage`: run tests with coverage output.

Use `npm install` to install dependencies; this repository uses npm and includes `package-lock.json`.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Component filenames use PascalCase, such as `ProjectCard.tsx`; hooks use a `use` prefix, such as `useTheme.ts`; utility and data filenames use camelCase. Prefer the `@/` path alias for local imports. Keep styling in Tailwind classes and global styles in `app/globals.css`; avoid inline styles unless required for dynamic values. ESLint extends Next.js core web vitals and warns on raw `<img>` usage.

## Testing Guidelines

Tests use Vitest with `jsdom`, React Testing Library, and shared setup in `__tests__/setup.ts`. Name tests by behavior or unit, for example `validation.test.ts` or `api/contact.test.ts`. Add or update tests when changing validation, API routes, hooks, or interactive UI behavior. Run `npm run test` before opening a pull request, and use `npm run test:coverage` for broader changes.

## Commit & Pull Request Guidelines

Git history follows Conventional Commits, for example `feat: refresh liquid glass visuals` and `fix: stabilize refresh render on landing page`. Use short, imperative messages with types such as `feat`, `fix`, `chore`, `docs`, `refactor`, or `style`. Pull requests should include a clear description, linked issue when applicable, test results, and screenshots or recordings for visual UI changes.

## Security & Configuration Tips

Keep secrets in `.env.local`; do not commit environment files. Expected variables include `RESEND_API_KEY`, `LAST_FM_API_KEY`, and `LAST_FM_USER`. Validate contact-form and API changes carefully because they touch email delivery and external service calls.
