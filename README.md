# Pinterest Fullscreen

Transform Pinterest into a distraction-free, fullscreen viewing experience. Maximize your screen real estate and immerse yourself in beautiful content without the clutter.

## Why Pinterest Fullscreen?

Pinterest is a visual discovery platform, but the default interface can be distracting with headers, navigation bars, and other UI elements taking up valuable screen space. **Pinterest Fullscreen** gives you:

- **🎯 Distraction-Free Browsing** - Hide all navigation elements and focus purely on the content
- **📺 Maximum Screen Real Estate** - Use every pixel of your screen for viewing pins
- **✨ Immersive Experience** - Enjoy Pinterest like a fullscreen gallery
- **🎨 Customizable** - Toggle elements on/off and customize your viewing experience
- **⚡ Smart Header Access** - Header appears when you hover near the top, disappears when you don't need it

## Features

### Fullscreen View
- Automatically hides the Pinterest header, navigation bars, and distracting UI elements
- Header appears smoothly when you hover near the top of the page (customizable threshold)
- Clean, minimal interface that puts content first

### Customizable Controls
- Toggle header visibility on/off
- Hide "More Ideas" tabs
- Hide vertical navigation sidebar
- Adjust hover threshold for header appearance
- Custom background colors
- Optional liquid glass theme for a modern aesthetic

### Smart Behavior
- Works seamlessly with Pinterest's single-page application (SPA) navigation
- Automatically reinitializes when navigating between pages
- Smooth transitions for a polished user experience

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension folder
5. Visit Pinterest.com and enjoy your fullscreen experience!

## How to Use

1. **Install the extension** (see Installation above)
2. **Visit Pinterest.com** - The extension activates automatically
3. **Customize your experience** - Click the extension icon to access settings:
   - Toggle header hiding on/off
   - Adjust hover threshold (how close to top before header appears)
   - Hide additional UI elements
   - Customize background colors
   - Enable liquid glass theme

## Technical Details

The extension uses content scripts to:
- Identify and hide Pinterest UI elements using multiple selector strategies
- Monitor mouse movements to show/hide the header intelligently
- Handle Pinterest's dynamic page navigation
- Apply custom styling and themes

## Files

- `manifest.json` - Extension configuration
- `content.js` - Main script that handles fullscreen mode and UI element management
- `popup.html` / `popup.js` - Settings interface for customization
- `styles.css` - CSS styles for smooth transitions and themes
- `README.md` - This file

## Browser Compatibility

This extension is designed for Chrome and other Chromium-based browsers (Edge, Brave, etc.) that support Manifest V3.
