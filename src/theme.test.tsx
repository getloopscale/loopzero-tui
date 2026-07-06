import { Text } from "ink";
import { beforeEach, describe, expect, it } from "vitest";

import { renderFrame } from "../tests/helpers.js";
import { LoopZeroTUIProvider, defaultTheme, useLoopZeroTheme } from "./theme.js";
import type { LoopZeroTheme } from "./theme.js";

let captured: LoopZeroTheme | undefined;

// Reset via function call — keeps TS from narrowing `captured` to `undefined`
// inside each test body (assignment-based narrowing would type it `never`).
function resetCaptured() {
  captured = undefined;
}

function Probe() {
  captured = useLoopZeroTheme();
  return <Text>{captured.role.user.glyph}</Text>;
}

describe("theme stub (T1.1)", () => {
  beforeEach(() => {
    resetCaptured();
  });

  it("use_loopzero_theme_returns_default_tokens_without_provider", async () => {
    const frame = await renderFrame(<Probe />);
    // Ink trims trailing whitespace per line — assert the visible glyph char.
    expect(frame).toContain(defaultTheme.role.user.glyph.trim());
    expect(captured).toEqual(defaultTheme);
  });

  it("provider_passes_custom_theme_to_consumers", async () => {
    await renderFrame(
      <LoopZeroTUIProvider theme={{ role: { assistant: { glyph: "◆ " } } }}>
        <Probe />
      </LoopZeroTUIProvider>,
    );
    expect(captured?.role.assistant.glyph).toBe("◆ ");
  });

  it("partial_override_preserves_untouched_token_groups", async () => {
    await renderFrame(
      <LoopZeroTUIProvider theme={{ role: { user: { glyph: "$ " } } }}>
        <Probe />
      </LoopZeroTUIProvider>,
    );
    expect(captured?.role.user.glyph).toBe("$ ");
    // Leaf-level merge proof: overriding one leaf preserves the sibling leaves.
    expect(captured?.role.user.prefix).toBe(defaultTheme.role.user.prefix);
    expect(captured?.status.error).toBe(defaultTheme.status.error);
    expect(captured?.role.assistant).toEqual(defaultTheme.role.assistant);
  });

  it("provider_without_theme_prop_yields_default_tokens", async () => {
    await renderFrame(
      <LoopZeroTUIProvider>
        <Probe />
      </LoopZeroTUIProvider>,
    );
    expect(captured).toEqual(defaultTheme);
  });

  it("provider_with_explicit_undefined_theme_yields_default_tokens", async () => {
    await renderFrame(
      <LoopZeroTUIProvider theme={undefined}>
        <Probe />
      </LoopZeroTUIProvider>,
    );
    expect(captured).toEqual(defaultTheme);
  });

  it("nested_provider_resets_to_default_plus_own_override", async () => {
    // Pins the documented M0 nesting semantics: inner provider does NOT
    // compose with the outer one (review F-dom-3; composition lands at M6).
    await renderFrame(
      <LoopZeroTUIProvider theme={{ role: { user: { glyph: "$ " } } }}>
        <LoopZeroTUIProvider theme={{ role: { assistant: { glyph: "◆ " } } }}>
          <Probe />
        </LoopZeroTUIProvider>
      </LoopZeroTUIProvider>,
    );
    expect(captured?.role.assistant.glyph).toBe("◆ ");
    // Outer override is discarded — user resets to the default glyph.
    expect(captured?.role.user.glyph).toBe(defaultTheme.role.user.glyph);
  });

  it("default_theme_exposes_system_tokens", () => {
    expect(defaultTheme.role.system.glyph).toBe("· ");
    expect(defaultTheme.role.system.prefix).toBe("gray");
  });

  it("system_tokens_overridable_via_provider", async () => {
    resetCaptured();
    await renderFrame(
      <LoopZeroTUIProvider theme={{ role: { system: { glyph: "§ " } } }}>
        <Probe />
      </LoopZeroTUIProvider>,
    );
    expect(captured?.role.system.glyph).toBe("§ ");
    // Leaf preservation for the new group too.
    expect(captured?.role.system.prefix).toBe(defaultTheme.role.system.prefix);
  });

  it("empty_theme_override_yields_default_tokens", async () => {
    await renderFrame(
      <LoopZeroTUIProvider theme={{}}>
        <Probe />
      </LoopZeroTUIProvider>,
    );
    expect(captured).toEqual(defaultTheme);
  });
});
