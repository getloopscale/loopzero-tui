---
"@getloopscale/loopzero-tui": minor
---

`createThemeController` holds any `LoopZeroThemeProp` (built-in name, `{ base, override }` or a plain override), not only a built-in name. Type change: `ThemeController.get()` now returns `LoopZeroThemeProp` instead of `LoopZeroBuiltinThemeName`, and `set()` / `initial` take `LoopZeroThemeProp`; narrow the result if you need a name. Only names are persisted (#294).
