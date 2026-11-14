# tediousservi-utils

A robust Node.js utility suite designed for high-performance automation and cross-platform mouse simulation. This project provides a reliable bridge between JavaScript execution environments and system-level input events.

## Features

*   **Precision Interval Control:** Execute clicks with millisecond accuracy using non-blocking event loops.
*   **Dynamic Coordinate Mapping:** Easily target specific UI elements via screen-relative or absolute coordinate injection.
*   **Jitter Compensation:** Built-in randomization algorithms to mimic natural human behavior and evade basic heuristic detection.
*   **Event Queue Management:** Batch processing support to prevent input overflow during high-frequency automation tasks.

## Installation

Ensure you have [Node.js](https://nodejs.org/) installed (v16.0.0+ recommended). Install the package via npm:

```bash
npm install tediousservi-utils
# Or via yarn
yarn add tediousservi-utils
```

*Note: Depending on your OS, native build tools may be required to compile the underlying input drivers (e.g., `build-essential` on Linux).*

## Usage

Initialize the automation controller and define your click sequence:

```javascript
const { AutoClicker } = require('tediousservi-utils');

const bot = new AutoClicker({
    delay: 500,        // 500ms between clicks
    jitter: 50         // Adds +/- 50ms variance
});

// Start clicking at current mouse position
bot.start();

// Stop after 10 seconds
setTimeout(() => {
    bot.stop();
    console.log('Automation task completed.');
}, 10000);
```

## License

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Disclaimer: This tool is intended for testing and educational purposes only. Ensure you comply with the Terms of Service of any application you interact with using this software.*