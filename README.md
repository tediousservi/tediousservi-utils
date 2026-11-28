# tediousservi-utils

A robust, low-latency autoclicker utility built with JavaScript for automation-heavy workflows. Designed for performance, it leverages low-level event simulation to handle repetitive UI tasks with high precision.

### Features

*   **Jitter-Free Automation:** Implements a stable interval loop to ensure consistent click frequency without drift.
*   **Targeted Coordinates:** Supports pixel-perfect screen mapping to interact with specific UI elements regardless of resolution.
*   **Customizable Intervals:** Easily define delay periods between clicks to prevent trigger detection and manage resource consumption.
*   **Headless Capability:** Operates efficiently in non-GUI environments, making it ideal for integration into larger Node.js testing suites.

### Installation

Ensure you have [Node.js](https://nodejs.org/) installed. Initialize the package in your project directory:

```bash
npm install tediousservi-utils
```

For global utility access, install via npm globally:

```bash
npm install -g tediousservi-utils
```

### Usage

Import the utility into your project to start automating click sequences. The following example demonstrates a basic 50ms click interval targeted at screen coordinates (500, 500).

```javascript
const { AutoClicker } = require('tediousservi-utils');

const bot = new AutoClicker({
  interval: 50,
  coordinates: { x: 500, y: 500 }
});

// Start the clicker
bot.start();

// Stop after 10 seconds
setTimeout(() => bot.stop(), 10000);
```

### License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.