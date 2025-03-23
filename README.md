# Data Attribute CSS Library

A lightweight CSS library that uses data attributes to control themes and styles. This approach allows for easy and flexible theming without any JavaScript dependencies.

## Features

- **Multiple Color Themes**: Choose from Light, Dark, Night Owl, or Terminal color schemes
- **Distinct Style Variants**: Apply Flat, Material, Skeumorph, or Futura visual styles
- **Enhanced Animations**: Enjoy subtle, style-specific animations and hover effects
- **Component Library**: Basic UI components like buttons, cards, and form elements
- **Responsive Design**: Works across different screen sizes
- **Data-Attribute Driven**: Switch themes and styles with simple HTML attributes
- **No Dependencies**: Pure CSS solution with optional JavaScript integration
- **Small Footprint**: Minimal file size for fast loading
- **Persistent Preferences**: Optional JavaScript to remember user choices

## Usage

1. Include the CSS file in your HTML document:
```html
<link rel="stylesheet" href="css/main.css">
```

2. Set theme and style data attributes on the body tag:
```html
<body data-theme="light" data-style="flat">
  <!-- Your content here -->
</body>
```

3. Customize the theme and style by changing the data attributes:
```html
<!-- For a dark theme with material design -->
<body data-theme="dark" data-style="material">
  <!-- Your content here -->
</body>
```

## Available Themes

- **Light Theme**: A clean, modern light theme with subtle shadows and crisp contrasts
- **Dark Theme**: A deep, easy-on-the-eyes dark theme with vibrant accent colors
- **Night Owl Theme**: A rich blue-based theme optimized for night time coding
- **Terminal Theme**: A nostalgic, high-contrast theme inspired by classic terminal interfaces with glowing green text

## Available Styles

- **Flat Style**: Clean, minimal interfaces with subtle shadows and smooth transitions
- **Material Style**: Card-based design with more pronounced shadows and bounce animations
- **Skeumorph Style**: Realistic interfaces with detailed textures, gradients, and 3D effects
- **Futura Style**: Bold, geometric design with sharp edges, strong contrasts, and grid-based layouts

## Animation Effects

- Style-specific hover animations for buttons, cards, and links
- Entrance animations when content loads
- Material style features ripple effects on interaction
- Terminal theme includes blinking cursors and scanline effects
- Each style has unique transitions tuned to match its visual language

## Components

The library includes basic styled components:

- **Buttons**: Regular, accent, success, warning, and error styles
- **Cards**: Container elements with appropriate shadows and hover effects
- **Form Elements**: Styled inputs, textareas, and select dropdowns
- **Typography**: Headings, paragraphs, links with appropriate styling

## JavaScript Integration (Optional)

To allow users to dynamically change themes and styles, you can use JavaScript:

```javascript
// Change theme
function setTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('preferred-theme', theme); // For persistence
}

// Change style
function setStyle(style) {
  document.body.setAttribute('data-style', style);
  localStorage.setItem('preferred-style', style); // For persistence
}

// Load saved preferences on page load
document.addEventListener('DOMContentLoaded', function() {
  const savedTheme = localStorage.getItem('preferred-theme') || 'light';
  const savedStyle = localStorage.getItem('preferred-style') || 'flat';
  
  setTheme(savedTheme);
  setStyle(savedStyle);
});
```

## CSS Variables

The library exposes numerous CSS variables that you can customize:

### Theme Variables
- Color schemes: backgrounds, text colors, accents, status colors
- Gradients and shadows
- Focus state highlights
- Code block colors

### Style Variables
- Typography: font families, weights, letter spacing
- Shape properties: border radius, border styles
- Animation timings and easing functions
- Shadows and 3D effects
- Hover and focus effects
- Background patterns and textures

## Extending the Library

You can extend the library by:

1. Creating new themes in `themes.css`
2. Adding new styles in `styles.css`
3. Creating new components in `main.css`
4. Combining themes and styles for unique visual identities

## Browser Support

Works in all modern browsers that support CSS custom properties (IE11 not supported).
