 // Enhanced theme and style switching with persisted preferences
 function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    
    // Update active state for theme buttons
    document.querySelectorAll('.theme-picker button').forEach(btn => {
      btn.classList.remove('active');
    });
    document.getElementById(`${theme}-theme-btn`).classList.add('active');
    
    // Update code example and active theme display
    document.getElementById('code-theme').textContent = theme;
    document.getElementById('active-theme-display').textContent = theme;
    
    // Save preference
    localStorage.setItem('preferred-theme', theme);
  }
  
  function setStyle(style) {
    document.body.setAttribute('data-style', style);
    
    // Update active state for style buttons
    document.querySelectorAll('.style-picker button').forEach(btn => {
      btn.classList.remove('active');
    });
    document.getElementById(`${style}-style-btn`).classList.add('active');
    
    // Update code example and active style display
    document.getElementById('code-style').textContent = style;
    document.getElementById('active-style-display').textContent = style;
    
    // Save preference
    localStorage.setItem('preferred-style', style);
    
    // Special handling for glitch style - add data-text attributes for the glitch effect
    if (style === 'glitch') {
      document.querySelectorAll('.card, button, a').forEach(el => {
        // For text elements, use their text content
        if (el.textContent.trim() !== '') {
          el.setAttribute('data-text', el.textContent);
        }
        // For elements with children but no direct text, use their inner HTML
        else if (el.innerHTML.trim() !== '') {
          el.setAttribute('data-text', el.innerHTML);
        }
      });
    } else {
      // Remove data-text attributes when not using glitch style
      document.querySelectorAll('[data-text]').forEach(el => {
        el.removeAttribute('data-text');
      });
    }
  }
  
  // Tab switching functionality
  function switchTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.remove('active');
    });
    
    // Show the selected tab content
    document.getElementById(`${tabId}-tab`).classList.add('active');
    
    // Update active button state
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');
  }
  
  // Functions for the effects demo page
  function animateBasicDemo(type) {
    const demoBox = document.getElementById('animation-demo-box');
    DataCSSEffects.animate(demoBox, type, {
      duration: 1,
      timing: 'ease-out'
    });
  }
  
  function animateAttentionDemo(type) {
    const demoBox = document.getElementById('attention-demo-box');
    DataCSSEffects.animate(demoBox, type, {
      duration: 1,
      timing: 'ease-out'
    });
  }
  
  function animateWithDuration(type, duration) {
    const demoBox = document.getElementById('attention-demo-box');
    DataCSSEffects.animate(demoBox, type, {
      duration: duration / 1000 // Convert ms to seconds
    });
  }
  
  function animateWithTiming(type, timing) {
    const demoBox = document.getElementById('attention-demo-box');
    DataCSSEffects.animate(demoBox, type, {
      timing: timing
    });
  }
  
  function resetStaggerDemo(speed) {
    DataCSSEffects.resetStaggerDemo('#stagger-container', speed);
  }
  
  function refreshScrollReveal() {
    DataCSSEffects.refreshScrollReveal({
      scrollToTop: false,
      targetSection: '#scroll-reveal'
    });
  }
  
  function simulateViewTransition(type) {
    DataCSSEffects.simulateViewTransition(type, '#transition-demo');
  }
  
  function simulateOldTransition() {
    DataCSSEffects.simulateOldTransition('fade', '#transition-demo');
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize with saved preferences or defaults
    const savedTheme = localStorage.getItem('preferred-theme') || 'light';
    const savedStyle = localStorage.getItem('preferred-style') || 'flat';
    
    setTheme(savedTheme);
    setStyle(savedStyle);
    
    // Setup tab switching
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        switchTab(tabId);
      });
    });
    
    // Set up animation demos
    setTimeout(() => {
      const staggerItems = document.querySelectorAll('.stagger-item');
      staggerItems.forEach(item => {
        item.classList.add('visible');
      });
    }, 500);
    
    // Initialize scroll reveal
    setTimeout(() => {
      if ('IntersectionObserver' in window) {
        const scrollObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            } else if (entry.target.hasAttribute('data-scroll-repeat')) {
              entry.target.classList.remove('visible');
            }
          });
        }, {
          root: null,
          rootMargin: '0px',
          threshold: 0.1
        });
        
        const scrollItems = document.querySelectorAll('.scroll-item');
        scrollItems.forEach(item => {
          scrollObserver.observe(item);
        });
      }
    }, 300);
  });