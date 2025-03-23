# DataCSS Effects Library

A lightweight, easy-to-use animation and effects library using data attributes. Part of the DataCSS framework.

## Features

- Simple data attribute API
- Enhanced fade and attention animations
- Advanced staggered animations with multiple patterns
- Scroll-triggered reveals with various effects
- Smooth page transitions
- Powerful text effects
- No dependencies, performance optimized

## Installation

Include the CSS and JS files in your HTML:

```html
<link rel="stylesheet" href="css/effects.css">
<script src="css/effects.js"></script>
```

## Quick Start

### Basic Animations

Add the `data-animate` attribute to any element:

```html
<div data-animate="fade-in">This fades in</div>
<h2 data-animate="fade-up">This fades up</h2>
<p data-animate="bounce">This bounces</p>
```

#### Fade Animations:
- `fade-in`
- `fade-up`, `fade-down`, `fade-left`, `fade-right`
- `fade-up-big` - Larger distance fade up
- `fade-scale` - Fade in with scaling
- `fade-scale-up` - Combined scale and upward movement
- `fade-blur` - Blur effect while fading in

#### Attention Animations:
- `pulse`
- `bounce`
- `shake`
- `flip`
- `float`
- `jello` - Distortion effect
- `swing` - Pendulum-like motion
- `heartbeat` - Pulsing like a heartbeat
- `wobble` - Side-to-side wobbling
- `tada` - Shake with scaling

### Staggered Animations

Create animations that trigger one after the other:

```html
<ul data-stagger="medium">
  <li data-animate="fade-in">First item</li>
  <li data-animate="fade-in">Second item</li>
  <li data-animate="fade-in">Third item</li>
</ul>
```

Available stagger types:
- `fast` - 0.1s between items
- `medium` - 0.2s between items
- `slow` - 0.3s between items
- `cascade` - Items get progressively longer animations
- `reverse` - Last items animate first
- `random` - Random delays for each item

JavaScript API for advanced control:

```javascript
// Animate multiple elements with staggered timing
const elements = document.querySelectorAll('.my-items');
DataCSSEffects.animateGroup(elements, 'fade-up', {
  startDelay: 0.2,     // Wait before starting
  staggerDelay: 0.15,  // Delay between items
  duration: 0.8        // Duration for each animation
});
```

### Scroll Reveal

Elements that animate when they enter the viewport:

```html
<div data-scroll="reveal">Fades in when scrolled into view</div>
<div data-scroll="reveal-up">Fades up when scrolled into view</div>
<div data-scroll="reveal-left">Slides in from left</div>
<div data-scroll="reveal-right">Slides in from right</div>
<div data-scroll="reveal-scale">Scales into view</div>
<div data-scroll="reveal-rotate">Rotates into position</div>
```

Add `data-scroll-repeat` to make the animation repeat each time the element enters the viewport:

```html
<div data-scroll="reveal-up" data-scroll-repeat>
  This animates every time it comes into view
</div>
```

### Text Effects

Special effects for text elements:

```html
<h2 data-text-effect="gradient">Gradient Text</h2>
<p data-text-effect="typing">Typing Effect</p>
<h3 data-text-effect="shine">Shine Effect</h3>
<h3 data-text-effect="blur-in">Blur In</h3>
<h3 data-text-effect="split">Split Characters</h3>
<h3 data-text-effect="glow">Glowing Text</h3>
```

JavaScript API for text effects:

```javascript
// Apply text effect to an element
DataCSSEffects.textEffect(document.querySelector('h1'), 'gradient');
```

### Page Transitions

Use the JavaScript API to trigger page transitions:

```javascript
// Before navigating to a new page
DataCSSEffects.pageTransition('fade', function() {
  // This callback runs after transition completes
  window.location.href = 'new-page.html';
});
```

Available transition types:
- Basic: `fade`, `slide`, `zoom`, `flip`
- Enhanced: `slide-up`, `slide-down`, `cube`, `fold`

### Animation API

Apply animations programmatically:

```javascript
// Get element
const element = document.querySelector('#myElement');

// Apply animation
DataCSSEffects.animate(element, 'bounce', {
  delay: 0.5,         // Optional delay in seconds
  duration: 1.2,      // Optional duration in seconds
  timing: 'ease-out', // Optional timing function
  onComplete: function(el) { 
    // Callback when animation finishes
    console.log('Animation complete!');
  }
});
```

## Utility Classes

### Timing Utilities

Add these classes to adjust timing:

```html
<!-- Delay classes -->
<div data-animate="fade-in" class="delay-300">Delayed by 0.3s</div>

<!-- Duration classes -->
<div data-animate="fade-in" class="duration-500">Takes 0.5s</div>

<!-- Timing function classes -->
<div data-animate="bounce" class="spring">Uses spring easing</div>
```

Available delay classes: `delay-100` through `delay-1000` (in 100ms steps)  
Available duration classes: `duration-100` through `duration-1000` (in 100ms steps)  
Available timing classes: `ease`, `ease-in`, `ease-out`, `ease-in-out`, `linear`, `elastic`, `spring`

## CSS Variables for Customization

You can customize animations by setting CSS variables:

```css
:root {
  --animation-duration: 0.8s;
  --animation-timing: ease-out;
  --reveal-duration: 0.5s;
  --reveal-timing: ease;
  --transition-duration: 0.7s;
  --transition-timing: cubic-bezier(0.16, 1, 0.3, 1);
}
```

## Browser Support

Works in all modern browsers. For older browsers, you may need polyfills for:
- CSS Custom Properties (variables)
- CSS Animations

## Performance Tips

- Use `will-change` property sparingly (already applied to appropriate effects)
- Prefer opacity and transform animations (all DataCSS effects use these)
- For very large pages, consider using IntersectionObserver manually
- Add `data-scroll-repeat="false"` to prevent animations from repeating

## License

MIT License 