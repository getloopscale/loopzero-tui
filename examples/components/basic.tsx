import { Box, render } from "ink";

import { ChatMessage, LoopZeroTUIProvider } from "../../src/index.js";

// Smallest real consumer of @getloopscale/loopzero-tui (plan T3.2) — the TTFATT seed:
// a provider + one user/assistant exchange, rendered by the real Ink renderer.
render(
  <LoopZeroTUIProvider>
    <Box flexDirection="column">
      <ChatMessage role="user">What is @getloopscale/loopzero-tui?</ChatMessage>
      <ChatMessage role="assistant">
        Ink primitives for AI-agent surfaces — chat, tool-calls, timelines,
        diffs and metrics.
      </ChatMessage>
    </Box>
  </LoopZeroTUIProvider>,
);
