# Morpheus Improvements

Lead-engineer notes for `src/ui/components/morpheus.tsx`.

## Accepted tradeoffs

- `collapsedContent` and `expandedContent` are rendered more than once. The hidden copies let Morpheus measure source and target width, height, border radius, and related visual state so callers get a nicer API without manually passing dimensions.
- Morpheus currently reaches into the first child to hide border/background/shadow on live layers and to infer visual shell styles. This is a deliberate risk for now because it keeps the public API small, but future readers should know it depends on the child DOM shape.

## Improvements to handle later

- Fix trigger semantics. `onOpen` is currently attached to wrapper `div` / `motion.div` layers, which makes opening too implicit and can be weak for keyboard accessibility. A future API should make the trigger explicit, or expose trigger props so callers own the interactive element.
- Split orchestration out of the component. `Morpheus` currently owns measurement, visual-style extraction, overlay rendering, geometry, transitions, and rendering. Future cleanup should move pure geometry and measurement helpers into focused modules/hooks.
