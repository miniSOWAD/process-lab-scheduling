# ProcessLab — Class 7, slides 15–19

A responsive, self-contained interactive learning website written in TypeScript, React 19 and Next.js 15 (App Router). No API keys, database or backend service are required. The original lecture slide images are bundled in `public/`.

## Run locally

Install Node.js 20.9 or later (Node 22 recommended) and npm. Open a terminal in this folder:

```bash
npm install
npm run dev
```

Open http://localhost:3000. On Windows you can use PowerShell or Command Prompt. If the port is occupied, Next typically offers another port. A network connection is required on the first dependency install; after that the learning experience does not need an external service. The dependency ranges allow supported patch updates; no lockfile was generated because npm registry access was unavailable during packaging.

## Build / verify

```bash
npm run typecheck
npm test
npm run build
npm start
```

`npm test` compiles the pure TypeScript simulation models and runs Node's built-in test runner. It does not launch actual OS processes. Five model tests are provided.

## Modules

- Slide 15: static BusyBox ELF loading, magic bytes, PT_INTERP, PT_LOAD, .bss, stack, RIP/RSP, segment inspection, animated stepper.
- Slide 16: runnable tasks, per-CPU run queues, block/tick/wake controls, scheduling classes/policies, conceptual EEVDF eligibility lab.
- Slide 17: exact 40-entry nice-weight table, live two/three-task CPU-share calculator, measurement comparison, observation-window calculations.
- Slide 18: five core concepts, process lifecycle and normal/zombie/orphan simulation.
- Slide 19: all three original Homework 7 questions, complete worked answers, actual conceptual fork tree, shell execution stepper and nice 0 vs nice 3 calculator.

Each lesson includes reading material, the supplied source slide and references. Completion and light/dark preference are stored locally in the browser. Direct links use `#slide-15` through `#slide-19`.

## Source structure

- `app/page.tsx`: navigation, slide explanations, homework and quizzes.
- `app/layout.tsx`: metadata and document layout.
- `app/globals.css`: responsive UI, dark/light design tokens, chart and simulator styling.
- `components/labs.tsx`: reusable React interactive teaching components.
- `lib/models.ts`: pure, testable TypeScript models.
- `tests/models.test.cjs`: model unit tests.
- `public/slide-15.png` … `slide-19.png`: original slides from the user-supplied PDF.

## Accuracy and limitations

Primary source is `class_07.pdf` (slides 15–19, CSE 4105, Md Mahbub E Noor, University of Barishal). Expanded explanations are instructional context. ELF addresses and trace messages are synthetic; no embedded lecture video was replayed. The scheduler event model demonstrates state transitions with simplified rotation/preemption; it is NOT the actual Linux EEVDF implementation. The separate EEVDF simulator models selection from provided eligibility and deadlines. CPU shares assume continuous contention on one CPU in the same fair-scheduling context. All simulations run in the browser and do not spawn real OS processes.

No deployment was requested; this archive is project source. The development environment could not download npm packages, therefore a full Next.js build / live browser test was not performed here. The pure model tests and TS/TSX syntax checks can be run independently; run the build after installing dependencies to verify the full application on your machine.


## Visual theme and animations

The refreshed interface uses the requested palette:
- Porcelain / white-grey: `#D0D3DA`
- Graphite: `#24272C`
- Signal red: `#E8322A`

The default presentation is the light Porcelain + Graphite theme. Use the theme control in the top bar to switch to the Graphite presentation; both modes retain the same three-color identity.

### Animated learning labs
- **Slide 15 — ELF loader:** use Auto play or Next step to watch the executable move through file identification, ELF handling, mapping, stack setup and CPU entry. Memory segments and stack rows animate as they appear.
- **Slide 16 — CPU scheduling:** use Auto animate to watch tasks move among running, ready and waiting states. The EEVDF lab has an animated eligibility scan.
- **Slide 17 — Nice and CPU weights:** use Play CPU time to watch each process accumulate its proportional share over an accelerated observation window.
- **Slide 18 — Process lifecycle:** use Auto play in the Stepper to follow normal exit/reaping or orphan reparenting.
- **Slide 19 — Homework:** animate the fork loop round by round; the shell lab also supports Auto play for fork, exec, run/wait, exit and reap.

Animations are instructional models, not live kernel traces. CSS motion respects the browser's `prefers-reduced-motion` setting.
