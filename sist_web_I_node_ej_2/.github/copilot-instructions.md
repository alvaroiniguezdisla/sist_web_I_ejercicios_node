# Copilot / AI agent instructions for this repository

Short, focused guidance to help AI agents be productive in this small Node.js exercise project.

1) Big picture
- This repository is a tiny Node.js exercise. The main program is `index.js` and it builds and prints a JSON object describing movies/schedules.
- There are no external dependencies and `package.json` has only a placeholder `test` script. Project type is CommonJS (`"type": "commonjs"`).

2) Primary files to read/edit
- `index.js` — main program. Example content: it constructs a `cine` object and prints JSON using `JSON.stringify(cine, null, 2)`.
- `package.json` — minimal metadata; use it to add scripts if needed.

3) How to run / dev workflow (explicit)
- Run the program: `node index.js` (from the repository root).
- There is no build step, bundler, or test framework configured.

4) Project-specific conventions and patterns
- Uses CommonJS module type. New files should default to CommonJS unless you add `type: module` and update code accordingly.
- Console output is the primary I/O. Avoid introducing complex frameworks — keep changes minimal and consistent with the exercise nature.

5) Typical small edits an agent might perform (concrete examples)
- Add a new movie object to the `cine.peliculas` array in `index.js` keeping the same shape: { titulo, director, actores, salas }.
- Change output formatting: modify `JSON.stringify(cine, null, 2)` spacing if requested.
- Add a `start` script in `package.json`:
  "scripts": { "start": "node index.js" }

6) What not to do
- Don’t add heavy dependencies or introduce build tools (webpack, babel, etc.) without explicit request.
- Don’t convert the project to ES modules unless the user asks; that changes `package.json` and file semantics.

7) Integration points / external dependencies
- None detected. There are no network calls, databases, or external services referenced in the current files.

8) Quick checklist before making a pull request
- Run `node index.js` locally to verify output.
- Keep changes limited and explain behavior in the PR description (what changed and why).

If anything here is unclear or you want the file to include additional guidance (e.g., preferred commit message style, tests to add, or examples of desired movie entries), tell me and I will update this file.
