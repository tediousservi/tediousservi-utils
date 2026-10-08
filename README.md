# tediousservi-utils

`tediousservi-utils` is a lightweight, high-performance Node.js utility library designed to automate mouse input events across cross-platform environments. It provides a robust abstraction layer for developers building custom automation tools, macros, or stress-testing software.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

### Features
*   **Dynamic Interval Control:** Precise millisecond-based click pacing with support for random jitter to mimic human interaction.
*   **Coordinate-Based Targeting:** Built-in hooks to capture screen coordinates and execute clicks at specific absolute or relative offsets.
*   **Background Execution:** Utilizes low-level OS event bridging to allow for click automation without hijacking the entire thread.
*   **Multi-Button Support:** Native toggle capabilities for left, right, and middle mouse button emulation.

### Installation

Requires [Node.js](https://nodejs.org/) installed. Initialize your project and install the package via npm:

```bash
npm install tediousservi-utils
```

If you are on Linux, ensure your system has `libx11-dev` and `libxtst-dev` dependencies installed for event hooking.

### Usage

The following example demonstrates how to initialize the autoclicker and trigger a sequence of clicks at a target location.

```javascript
const { AutoClicker } = require('tediousservi-utils');

const clicker = new AutoClicker({
  interval: 500, // clicks every 500ms
  jitter: 50     // adds ±50ms variance for human-like behavior
});

// Start clicking at X: 500, Y: 300
clicker.start(500, 300);

// Stop the process after 10 seconds
setTimeout(() => {
  clicker.stop();
  console.log("Automation sequence completed.");
}, 10000);
```

### Safety Note
This utility is intended for automation, testing, and accessibility purposes. Please ensure you are in compliance with the Terms of Service of any target application before deploying automated scripts.

### License
Distributed under the MIT License. See `LICENSE` for more information.