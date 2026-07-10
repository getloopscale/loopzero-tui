import { Box, Text, render } from "ink";

import {
  Banner,
  LoopZeroTUIProvider,
  VERSION,
  WelcomeBanner,
} from "../src/index.js";

// Banner demos (plan m9 WelcomeBanner + m27 <Banner>): the startup header every
// agent CLI mounts first. Piped (non-TTY) stdout is the EC-2 environment by
// construction — columns undefined → width fallback 60. M12: `animated` opts into
// the < 2 s reveal on an interactive terminal; piped runs stay on the static path.
//
// M27 <Banner> banner layout (piped, `pnpm example:banner | cat`):
//   ___          _
//  |_   _|_ _  ___| |__  ___
//    | | | ' \/ -_) '_ \/ _ \
//    |_| |_||_\___|_.__/\___/
//  ╭────────────────────────────╮
//  │ model loopzero-demo-1           │
//  │ cwd   ~/projects/app        │
//  ╰────────────────────────────╯
const LOOPZERO_ART = [
  "  ___          _",
  " |_   _|_ _  ___| |__  ___",
  "   | | | ' \\/ -_) '_ \\/ _ \\",
  "   |_| |_||_\\___|_.__/\\___/",
].join("\n");

function Demo() {
  return (
    <LoopZeroTUIProvider>
      <Box flexDirection="column" gap={1}>
        <WelcomeBanner
          name="LoopZero TUI"
          version={VERSION}
          animated
          tagline="AI-agent primitives for the terminal"
          hints={[
            "/help for commands",
            "esc to cancel a running turn",
            "docs: github.com/getloopscale/loopzero-tui",
          ]}
        >
          <Text dimColor>cwd: ~/projects/demo</Text>
        </WelcomeBanner>
        {/* M27: the <Banner> banner layout — ASCII-art logo + framed status box.
            Generate `art` from text with `renderFigletArt` (optional figlet peer);
            here we pass a ready art string. */}
        <Banner
          name="LoopZero TUI"
          version={VERSION}
          art={LOOPZERO_ART}
          layout="banner"
          status={[
            { label: "model", value: "loopzero-demo-1" },
            { label: "cwd", value: "~/projects/app" },
          ]}
        />
      </Box>
    </LoopZeroTUIProvider>
  );
}

const instance = render(<Demo />);
// House shape (plan EC-5): every smoke-tested example unmounts explicitly.
// M12: on an interactive terminal the reveal needs its 0.96 s script —
// piped smoke runs keep the fast 50 ms exit (static path by gate).
const exitDelayMs = process.stdout.isTTY ? 1500 : 50;
setTimeout(() => {
  instance.unmount();
}, exitDelayMs);
