# tediousservi-utils

`tediousservi-utils` is a lightweight, high-performance Node.js utility library designed to simulate automated mouse events and repetitive UI interactions. It provides a robust programmatic interface for developers needing to bridge script-based automation with system-level cursor control.

## Features

*   **Precision Timing:** Supports microsecond-interval clicking, allowing for high-frequency automation without blocking the Node.js event loop.
*   **Coordinate-based Mapping:** Easily target specific screen regions using absolute or relative X/Y coordinates.
*   **Anti-Detection Patterns:** Includes built-in jitter and randomized delay modifiers to simulate organic human interaction patterns.
*   **Cross-Platform Compatibility:** Leverages native system bindings to ensure consistent performance across Windows, macOS, and Linux.

## Installation

Ensure you have [Node.js](https://nodejs.org/) installed, then run the following command in your terminal:

```bash
npm install tediousservi-utils
```

If you are using native bindings for the first time, ensure your environment has the necessary build tools (e.g., `windows-build-tools` or `xcode-select`).

## Usage

```javascript
const { AutoClicker } = require('tediousservi-utils');

// Initialize with a 50ms interval between clicks
const clicker = new AutoClicker({ interval: 50 });

// Start clicking at current mouse position
clicker.start();

// Stop after 5 seconds
setTimeout(() => {
    clicker.stop();
    console.log('Automation task completed.');
}, 5000);
```

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Distributed under the MIT License. See `LICENSE` for more information.