# sysadminsuite.com

sysadminsuite.com is a compact collection of practical IT tools for everyday use in system administration, infrastructure work, and technical operations. The project brings together small but useful helpers in one simple overview so common tasks can be solved quickly without switching between multiple websites or manual calculations.

The project is intentionally lightweight: it is built with plain HTML, CSS, and JavaScript only, without frameworks, build steps, or external dependencies. That keeps it fast to load, easy to run locally, and straightforward to extend.

## Overview

The goal is to combine the little utilities that appear again and again in real-world technical work into one place. Instead of relying on scattered online tools or memorized formulas, users can access a focused set of helpers in a clean browser-based interface.

The current project includes tools such as:

- number and base conversions
- time and work-time calculations
- encoding and decoding helpers
- a searchable overview of available utilities with collapsible categories, favorites (reorderable) and a light/dark mode; these settings are saved only in your browser

Everything is designed to work directly in the browser and to be easy to host on a simple static website.

The MAC Vendor Lookup loads vendor data from the public [sysadminsuite-data repository](https://github.com/TimonW-Dev/sysadminsuite-data).
It requests only the shard matching the first two hex characters; the full MAC address stays in your browser.

## Why this project exists

A lot of day-to-day technical work involves small, repetitive tasks: converting values, calculating durations, checking formats, or transforming data. These tasks are usually quick, but they are often spread across different tools, websites, or manual methods. sysadminsuite.com aims to bring these everyday helpers together in a single, low-friction experience.

The project focuses on the following principles:

- speed: simple tools that work instantly
- clarity: no unnecessary setup or complex UI
- accessibility: usable directly in the browser
- independence: no framework or heavy infrastructure required
- maintainability: easy to understand and extend

This makes it valuable for sysadmins, developers, students, and anyone who regularly works with technical values and quick conversions.

## Project structure

- [index.html](index.html): main overview page with all available tools
- [tool.html](tool.html): shared page for individual tool views
- [tools/](tools/): tool implementations and related logic
- [assets/](assets/): shared styles and frontend scripts
- [pages/](pages/): legal and informational pages
- [docs/](docs/): project documentation and guidance

Each tool is kept as a small, self-contained module and is registered in the central configuration so the overview stays consistent and easy to maintain.

## Run locally

This is a static frontend, so it can be opened directly in a browser. For local development, the VS Code Live Server extension is a convenient option, for example, for further development:

- open the project in VS Code
- start Live Server
- visit http://127.0.0.1:5500/

If you do not use Live Server, opening [index.html](index.html) in a browser is also enough for basic use.

## Contributing

Contributions are welcome. Please review [CONTRIBUTING.md](CONTRIBUTING.md) and the project documentation in [docs/](docs/) before submitting changes.

The site is provided without warranty. For legal information, see [pages/terms.html](pages/terms.html).

## Note

This project is intentionally simple and practical rather than overly engineered. It is meant to be a useful, lightweight toolkit for everyday technical work: easy to use, easy to understand, and easy to extend.
