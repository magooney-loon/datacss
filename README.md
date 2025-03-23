# DataCSS

Lightweight CSS library using data attributes for theming.

## Features

- Multiple themes: Light, Dark, Night Owl, Terminal, Claude, Synthwave
- Style variants: Flat, Material, Skeumorph, Futura, Neomorphic, Glitch
- Theme-specific animations and hover effects
- Basic UI components (buttons, cards, forms)
- Data-attribute driven with no dependencies
- Optional JS for user preferences

## Usage

```html
<link rel="stylesheet" href="css/main.css">

<body data-theme="light" data-style="flat">
  <!-- Your content here -->
</body>
```

### Change Theme/Style

```javascript
// Set theme and persist preference
function setTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('preferred-theme', theme);
}

// Set style and persist preference
function setStyle(style) {
  document.body.setAttribute('data-style', style);
  localStorage.setItem('preferred-style', style);
}

// Load saved preferences
document.addEventListener('DOMContentLoaded', function() {
  const savedTheme = localStorage.getItem('preferred-theme') || 'light';
  const savedStyle = localStorage.getItem('preferred-style') || 'flat';
  
  setTheme(savedTheme);
  setStyle(savedStyle);
});
```

## Themes & Styles

### Themes
- **Light**: Clean, modern light theme
- **Dark**: Deep dark theme with vibrant accents
- **Night Owl**: Rich blue-based theme
- **Terminal**: High-contrast with glowing green text
- **Claude**: Purple accents with soft contrasts
- **Synthwave**: Retro-futuristic neon aesthetics

### Styles
- **Flat**: Clean minimal interfaces
- **Material**: Card-based with pronounced shadows
- **Skeumorph**: Realistic with textures and 3D effects
- **Futura**: Bold geometric design
- **Neomorphic**: Soft shadows and subtle depth
- **Glitch**: Digital distortion effects

## Browser Support

All modern browsers supporting CSS custom properties (IE11 not supported).
