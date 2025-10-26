# Pinterest Header Hide Extension

A Chrome extension that hides the Pinterest header by default and shows it only when you move your mouse to the top section of the page.

## Features

- Automatically hides the Pinterest header when the page loads
- Shows the header when you hover near the top of the page (within 50px)
- Smooth transitions for a better user experience
- Works with Pinterest's single-page application (SPA) navigation
- Automatically reinitializes when navigating between Pinterest pages

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension folder
5. The extension will now be active on Pinterest.com

## How it Works

The extension:
1. Finds the Pinterest header element using multiple selectors
2. Initially hides it by moving it off-screen with CSS transforms
3. Listens for mouse movements and shows the header when you're near the top
4. Hides the header again after a 500ms delay when you move away
5. Handles Pinterest's SPA navigation to reinitialize on page changes

## Files

- `manifest.json` - Extension configuration
- `content.js` - Main script that handles header hiding/showing
- `styles.css` - CSS styles for smooth transitions
- `README.md` - This file

## Browser Compatibility

This extension is designed for Chrome and other Chromium-based browsers (Edge, Brave, etc.) that support Manifest V3.
