[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# tediousservi-utils

`tediousservi-utils` is a lightweight Node.js automation utility designed for high-frequency screen coordinate and DOM element autoclicking. It provides precise interval scheduling, customizable micro-jitter algorithms to simulate human input, and low-latency hotkey hooks for seamless macro management.

## Features

- **Humanized Click Simulation:** Configurable click intervals with Gaussian noise variance to prevent fixed-pattern detection in automated workflows.
- **Multi-Point Sequencing:** Define and cycle through ordered lists of X/Y screen coordinates with independent pause durations per step.
- **Global Emergency Brakes:** Native hotkey listeners (default `Ctrl+Alt+S`) to instantly halt active execution loops from anywhere in the OS.
- **DOM & Desktop Support:** Works out-of-the-box in both Node.js desktop automation scripts and browser-based Tampermonkey environments.

## Installation

Install the package via npm:

```bash
npm install tediousservi-utils
```

If you are using yarn:

```bash
yarn add tediousservi-utils
```

## Quick Start

```javascript
const { ClickerLoop } = require('tediousservi-utils');

const autoClicker = new ClickerLoop({
  target: { x: 960, y: 540 },
  interval: 50, // base speed in ms
  jitter: 12,   // +/- random offset in ms
  maxClicks: 200
});

// Handle lifecycle events
autoClicker.on('click', (count) => {
  console.log(`Executed click #${count}`);
});

autoClicker.on('stop', () => {
  console.log('Clicker safely terminated.');
});

// Start the clicker
autoClicker.start();
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.