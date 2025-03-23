/**
 * DataCSS Effects - JavaScript Utilities
 * Handles staggered animations, scroll reveals, and page transitions
 */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initStaggeredAnimations();
  initScrollReveal();
});

/**
 * Initialize staggered animations for elements with data-stagger attribute
 */
function initStaggeredAnimations() {
  const staggerContainers = document.querySelectorAll('[data-stagger]');
  
  staggerContainers.forEach(container => {
    const children = Array.from(container.children).filter(child => child.hasAttribute('data-animate'));
    const totalItems = children.length;
    
    // Set total items count for reverse stagger
    container.style.setProperty('--total-items', totalItems);
    
    // Set the item index as CSS variable for animation delay calculation
    children.forEach((child, index) => {
      child.style.setProperty('--item-index', index);
      
      // For random stagger, set a random delay between 0 and 1
      if (container.getAttribute('data-stagger') === 'random') {
        const randomDelay = Math.random();
        child.style.setProperty('--random-delay', randomDelay.toFixed(2));
      }
      
      // Make sure animations are visible after delay
      // This helps ensure animations start properly
      const itemDelay = parseFloat(window.getComputedStyle(child).getPropertyValue('animation-delay')) || 0;
      setTimeout(() => {
        child.style.opacity = '';
      }, itemDelay * 1000 + 50);
    });
  });
}

/**
 * Initialize scroll reveal animations for elements with data-scroll attribute
 */
function initScrollReveal() {
  const scrollElements = document.querySelectorAll('[data-scroll]');
  
  if (scrollElements.length === 0) return;
  
  // Check element visibility on initial load
  checkElementsVisibility(scrollElements);
  
  // Check element visibility on scroll with throttling for performance
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    if (scrollTimeout) return;
    
    scrollTimeout = setTimeout(() => {
      checkElementsVisibility(scrollElements);
      scrollTimeout = null;
    }, 50); // Increase frequency for smoother detection
  });
  
  // Also check on window resize
  window.addEventListener('resize', function() {
    checkElementsVisibility(scrollElements);
  });
}

/**
 * Check if elements are visible in the viewport and apply 'visible' class
 */
function checkElementsVisibility(elements) {
  const windowHeight = window.innerHeight;
  const triggerPosition = windowHeight * 0.85; // Higher trigger point (85% down screen)
  
  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementBottom = element.getBoundingClientRect().bottom;
    
    // Element is visible if its top is below trigger point or if it's already partially visible
    if (elementTop < triggerPosition || (elementTop < windowHeight && elementBottom > 0)) {
      if (!element.classList.contains('visible')) {
        element.classList.add('visible');
        
        // Get scroll type and apply appropriate transform
        const scrollType = element.getAttribute('data-scroll');
        if (scrollType) {
          // Reset any inline transforms to use CSS classes
          element.style.transform = '';
          element.style.opacity = '';
        }
        
        // Dispatch custom event that can be listened for
        element.dispatchEvent(new CustomEvent('reveal', { 
          bubbles: true,
          detail: { element }
        }));
      }
    } else if (element.hasAttribute('data-scroll-repeat')) {
      // If the element has data-scroll-repeat, remove visible class when out of view
      element.classList.remove('visible');
      
      // Reset transform based on scroll type when out of view
      const scrollType = element.getAttribute('data-scroll');
      if (scrollType) {
        // Set appropriate transform based on scroll type
        switch(scrollType) {
          case 'reveal-up':
            element.style.transform = 'translateY(40px)';
            break;
          case 'reveal-left':
            element.style.transform = 'translateX(-40px)';
            break;
          case 'reveal-right':
            element.style.transform = 'translateX(40px)';
            break;
          case 'reveal-scale':
            element.style.transform = 'scale(0.9)';
            break;
          case 'reveal-rotate':
            element.style.transform = 'rotate(-5deg) translateY(30px)';
            break;
          default: // 'reveal'
            element.style.transform = 'translateY(20px)';
        }
        element.style.opacity = '0';
      }
    }
  });
}

/**
 * Apply View Transition API for smooth transitions
 * @param {string} type - Transition type: 'fade', 'zoom', 'flip', etc.
 * @param {Function} updateCallback - Function to update the DOM during transition
 * @param {Object} options - Additional options like customSelector
 * @returns {Promise} A promise that resolves when the transition is complete
 */
function viewTransition(type, updateCallback, options = {}) {
  // Check if View Transitions API is supported
  if (document.startViewTransition) {
    // Apply view transition name to custom elements if specified
    if (options.customSelector) {
      const elements = document.querySelectorAll(options.customSelector);
      elements.forEach(el => {
        el.style.viewTransitionName = type || 'root';
      });
    }
    
    // Start the view transition
    const transition = document.startViewTransition(() => {
      // Execute the update callback to modify the DOM
      if (typeof updateCallback === 'function') {
        updateCallback();
      }
    });
    
    // Clean up after transition
    transition.finished.then(() => {
      // Remove view transition names if they were set
      if (options.customSelector) {
        const elements = document.querySelectorAll(options.customSelector);
        elements.forEach(el => {
          el.style.viewTransitionName = '';
        });
      }
      
      // Call the onComplete callback if it exists
      if (options.onComplete && typeof options.onComplete === 'function') {
        options.onComplete();
      }
    }).catch(error => {
      console.error('View transition failed:', error);
      // Call the onError callback if it exists
      if (options.onError && typeof options.onError === 'function') {
        options.onError(error);
      }
    });
    
    return transition.finished;
  } else {
    // Fallback for browsers that don't support View Transitions API
    return pageTransition(type, updateCallback, options);
  }
}

/**
 * Legacy page transition - use as fallback for browsers without View Transitions API
 * @param {string} type - The transition type: 'fade', 'zoom', 'flip', etc.
 * @param {Function} callback - Function to execute after transition completes
 * @param {Object} options - Additional options
 * @returns {Promise} A promise that resolves when the transition is complete
 */
function pageTransition(type, callback, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      const body = document.body;
      const duration = getComputedStyle(document.documentElement)
        .getPropertyValue('--transition-duration')
        .trim() || '0.5s';
      
      // Convert duration to milliseconds for setTimeout
      const durationMs = parseFloat(duration) * 1000 || 500;
      
      // Apply transition effect
      body.setAttribute('data-page-transition', type || 'fade');
      
      // Execute callback to update content after initial phase
      setTimeout(() => {
        if (typeof callback === 'function') {
          callback();
        }
        
        // Start the second phase after a short delay
        setTimeout(() => {
          // Clean up
          body.removeAttribute('data-page-transition');
          
          // Call onComplete if it exists
          if (options.onComplete && typeof options.onComplete === 'function') {
            options.onComplete();
          }
          
          resolve();
        }, durationMs / 2);
      }, durationMs / 2);
    } catch (error) {
      console.error('Legacy transition failed:', error);
      if (options.onError && typeof options.onError === 'function') {
        options.onError(error);
      }
      reject(error);
    }
  });
}

/**
 * Apply animation to an element programmatically
 * @param {HTMLElement} element - The element to animate
 * @param {string} animationType - Animation type from data-animate options
 * @param {object} options - Optional settings like delay and duration
 */
function animate(element, animationType, options = {}) {
  if (!element) return;
  
  // Clear any existing animations
  element.removeAttribute('data-animate');
  
  // Force reflow
  void element.offsetWidth;
  
  // Set animation type
  element.setAttribute('data-animate', animationType);
  
  // Apply optional delay
  if (options.delay) {
    element.style.setProperty('--animation-delay', options.delay + 's');
    element.style.animationDelay = options.delay + 's';
  }
  
  // Apply optional duration
  if (options.duration) {
    element.style.setProperty('--animation-duration', options.duration + 's');
    element.style.animationDuration = options.duration + 's';
  }
  
  // Apply optional timing function
  if (options.timing) {
    element.style.setProperty('--animation-timing', options.timing);
    element.style.animationTimingFunction = options.timing;
  }
  
  // Optional callback when animation ends
  if (options.onComplete && typeof options.onComplete === 'function') {
    const onAnimationEnd = () => {
      options.onComplete(element);
      element.removeEventListener('animationend', onAnimationEnd);
    };
    
    element.addEventListener('animationend', onAnimationEnd);
  }
}

/**
 * Animate multiple elements with staggered timing
 * @param {NodeList|Array} elements - Collection of elements to animate
 * @param {string} animationType - Animation type from data-animate options
 * @param {object} options - Optional settings for timing and staggering
 */
function animateGroup(elements, animationType, options = {}) {
  if (!elements || elements.length === 0) return;
  
  const delay = options.startDelay || 0;
  const staggerDelay = options.staggerDelay || 0.1;
  
  Array.from(elements).forEach((element, index) => {
    const elementDelay = delay + (index * staggerDelay);
    
    animate(element, animationType, {
      ...options,
      delay: elementDelay
    });
  });
}

/**
 * Helper function to get proper initial transform based on scroll type
 * @param {string} type - The scroll animation type
 * @returns {string} The appropriate CSS transform value
 */
function getInitialTransform(type) {
  switch(type) {
    case 'reveal-up': return 'translateY(40px)';
    case 'reveal-left': return 'translateX(-40px)';
    case 'reveal-right': return 'translateX(40px)';
    case 'reveal-scale': return 'scale(0.9)';
    case 'reveal-rotate': return 'rotate(-5deg) translateY(30px)';
    default: return 'translateY(20px)'; // default for 'reveal'
  }
}

/**
 * Reset a staggered animation container with new stagger type
 * @param {string|HTMLElement} containerSelector - The stagger container or its selector
 * @param {string} speed - Stagger speed: 'fast', 'medium', 'slow', 'cascade', 'reverse', 'random'
 */
function resetStaggerDemo(containerSelector, speed) {
  const container = typeof containerSelector === 'string' 
    ? document.querySelector(containerSelector) 
    : containerSelector;
  
  if (!container) return;
  
  // Change the stagger speed
  container.setAttribute('data-stagger', speed);
  
  // Reset all items - hide them
  const items = container.querySelectorAll('[data-animate]');
  items.forEach(item => {
    item.style.opacity = '0';
    
    // Remove and readd the data-animate attribute to restart animation
    const animationType = item.getAttribute('data-animate');
    item.removeAttribute('data-animate');
    
    // Force reflow
    void item.offsetWidth;
    
    // Re-apply animation
    item.setAttribute('data-animate', animationType);
    
    // Mark as visible after a tiny delay to ensure proper sequencing
    setTimeout(() => {
      item.classList.add('visible');
    }, 10);
  });
  
  // Re-initialize staggered animations
  initStaggeredAnimations();
}

/**
 * Reset and refresh scroll reveal animations
 * Useful for when new content is added or after user interactions
 * @param {Object} options - Options for the refresh
 */
function refreshScrollReveal(options = {}) {
  const scrollItems = document.querySelectorAll('[data-scroll]');
  const scrollToTop = options.scrollToTop || true;
  const targetSection = options.targetSection || null;
  
  // Hide all scroll items
  scrollItems.forEach(item => {
    item.classList.remove('visible');
    // Reset transforms as well
    const scrollType = item.getAttribute('data-scroll');
    item.style.transform = getInitialTransform(scrollType);
    item.style.opacity = '0';
  });
  
  // Scroll to the top of the section if requested
  if (scrollToTop && targetSection) {
    const scrollSection = typeof targetSection === 'string'
      ? document.querySelector(targetSection)
      : targetSection;
      
    if (scrollSection) {
      scrollSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  // Force recalculation
  void document.body.offsetWidth;
  
  // Delay the reinitializing to allow scroll to complete
  setTimeout(() => {
    // Reinitialize scroll reveal
    initScrollReveal();
    
    // Manually trigger a scroll event to check visibility
    window.dispatchEvent(new Event('scroll'));
  }, 500);
}

/**
 * Generate new content for transition demos
 * @param {string} type - The transition type
 * @returns {string} HTML content to show after transition
 */
function generateTransitionContent(type) {
  const colors = ['#f9ca24', '#f0932b', '#eb4d4b', '#6ab04c', '#686de0'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  return `
    <h3>New Content!</h3>
    <p style="color: ${randomColor}">This content was transitioned using the "${type}" effect</p>
    <p class="text-secondary">Powered by the View Transitions API</p>
  `;
}

/**
 * Demonstrates a view transition without page navigation
 * @param {string} type - The transition type
 * @param {HTMLElement|string} container - The container element or selector
 * @param {string} content - Optional content to show after transition
 */
function simulateViewTransition(type, container, content) {
  const demoContainer = typeof container === 'string'
    ? document.querySelector(container)
    : container || document.getElementById('transition-demo');
    
  const newContent = content || generateTransitionContent(type);
  
  // Check if View Transitions API is supported
  if (document.startViewTransition) {
    try {
      // Set styling for smooth transitions
      demoContainer.style.viewTransitionName = type || 'root';
      
      // Start the view transition
      const transition = document.startViewTransition(async () => {
        return new Promise(resolve => {
          // Apply content after a small delay for smoother transitions
          setTimeout(() => {
            demoContainer.innerHTML = newContent;
            resolve();
          }, 10);
        });
      });
      
      // Clean up after transition
      transition.finished.then(() => {
        // Remove view transition name after completion
        demoContainer.style.viewTransitionName = '';
      }).catch(error => {
        console.error('View transition failed:', error);
        demoContainer.style.viewTransitionName = '';
        // Fall back to standard transition if View Transitions API fails
        simulateOldTransition(type, demoContainer, newContent);
      });
    } catch (error) {
      console.error('Error setting up view transition:', error);
      simulateOldTransition(type, demoContainer, newContent);
    }
  } else {
    // Fall back to standard CSS transitions
    simulateOldTransition(type, demoContainer, newContent);
  }
}

/**
 * Simulate a legacy page transition (fallback for browsers without View Transitions API)
 * @param {string} type - The transition type
 * @param {HTMLElement|string} container - The container element or selector
 * @param {string} content - Optional content to show after transition
 */
function simulateOldTransition(type, container, content) {
  const demoContainer = typeof container === 'string'
    ? document.querySelector(container)
    : container || document.getElementById('transition-demo');
    
  const newContent = content || generateTransitionContent('legacy');
  
  // Store the original content for a smoother transition
  const oldContent = demoContainer.innerHTML;
  
  // Create wrapper elements for transition effect
  const oldContentWrapper = document.createElement('div');
  const newContentWrapper = document.createElement('div');
  
  // Style the wrappers
  oldContentWrapper.style.position = 'absolute';
  oldContentWrapper.style.top = '0';
  oldContentWrapper.style.left = '0';
  oldContentWrapper.style.width = '100%';
  oldContentWrapper.style.height = '100%';
  
  newContentWrapper.style.position = 'relative';
  newContentWrapper.style.opacity = '0';
  
  // Add appropriate exit animations based on transition type
  switch(type) {
    case 'zoom':
      oldContentWrapper.style.transition = 'transform 0.4s ease-in-out, opacity 0.4s ease-in-out';
      oldContentWrapper.style.transform = 'scale(1)';
      oldContentWrapper.style.opacity = '1';
      setTimeout(() => { 
        oldContentWrapper.style.transform = 'scale(1.5)';
        oldContentWrapper.style.opacity = '0';
      }, 10);
      break;
    case 'flip':
      demoContainer.style.perspective = '1300px';
      oldContentWrapper.style.transition = 'transform 0.4s ease-in-out, opacity 0.4s ease-in-out';
      oldContentWrapper.style.transformOrigin = 'center center';
      oldContentWrapper.style.transform = 'rotateY(0)';
      oldContentWrapper.style.opacity = '1';
      setTimeout(() => { 
        oldContentWrapper.style.transform = 'rotateY(90deg)';
        oldContentWrapper.style.opacity = '0';
      }, 10);
      break;
    case 'rotate':
      oldContentWrapper.style.transition = 'transform 0.4s ease-in-out, opacity 0.4s ease-in-out';
      oldContentWrapper.style.transformOrigin = 'center center';
      oldContentWrapper.style.transform = 'rotate(0) scale(1)';
      oldContentWrapper.style.opacity = '1';
      setTimeout(() => { 
        oldContentWrapper.style.transform = 'rotate(45deg) scale(0.5)';
        oldContentWrapper.style.opacity = '0';
      }, 10);
      break;
    case 'crossfade':
      oldContentWrapper.style.transition = 'transform 0.4s ease-in-out, opacity 0.4s ease-in-out, filter 0.4s ease-in-out';
      oldContentWrapper.style.transform = 'scale(1)';
      oldContentWrapper.style.opacity = '1';
      oldContentWrapper.style.filter = 'blur(0)';
      setTimeout(() => { 
        oldContentWrapper.style.transform = 'scale(0.9)';
        oldContentWrapper.style.opacity = '0';
        oldContentWrapper.style.filter = 'blur(5px)';
      }, 10);
      break;
    default: // fade
      oldContentWrapper.style.transition = 'opacity 0.4s ease-in-out';
      oldContentWrapper.style.opacity = '1';
      setTimeout(() => { 
        oldContentWrapper.style.opacity = '0';
      }, 10);
  }
  
  // Set the content
  oldContentWrapper.innerHTML = oldContent;
  newContentWrapper.innerHTML = newContent;
  
  // Clear the container and add both wrappers
  demoContainer.innerHTML = '';
  demoContainer.appendChild(oldContentWrapper);
  demoContainer.appendChild(newContentWrapper);
  
  // Apply entrance animation after old content is gone
  setTimeout(() => {
    // Remove old content
    if (oldContentWrapper.parentNode) {
      demoContainer.removeChild(oldContentWrapper);
    }
    
    // Show new content with animation
    newContentWrapper.style.position = '';
    newContentWrapper.style.opacity = '';
    demoContainer.setAttribute('data-page-transition', type || 'fade');
    
    // Clean up after animation completes
    const duration = parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue('--transition-duration') || '0.5s') * 1000;
      
    setTimeout(() => {
      // Set the final state (remove wrappers and set plain HTML)
      demoContainer.innerHTML = newContent;
      demoContainer.removeAttribute('data-page-transition');
    }, duration);
    
  }, 400); // Time to let the exit animation complete
}

/**
 * Check if View Transitions API is supported
 * @returns {boolean} True if supported, false otherwise
 */
function isViewTransitionSupported() {
  return 'startViewTransition' in document;
}

// Make functions available globally
window.DataCSSEffects = {
  animate,
  animateGroup,
  pageTransition,
  viewTransition,
  isViewTransitionSupported,
  initStaggeredAnimations,
  initScrollReveal,
  resetStaggerDemo,
  refreshScrollReveal,
  getInitialTransform,
  simulateViewTransition,
  simulateOldTransition,
  generateTransitionContent
}; 