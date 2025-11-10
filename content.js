// Pinterest Fullscreen Extension
(function() {
    'use strict';
    
    let headerElement = null;
    let moreIdeasElement = null;
    let verticalNavElement = null;
    let scrollableOneBarElement = null;
    let skipToContentElement = null;
    let isMouseInTopArea = false;
    let hoverTimeout = null;
    
    // Settings
    let settings = {
        hideHeader: true,
        hideMoreIdeas: true,
        hideVerticalNav: true,
        hideScrollableOneBar: true,
        hideSkipToContent: true,
        liquidGlassTheme: false,
        hoverThreshold: 80,
        bgColor: ''
    };
    
    // Function to find the Pinterest header
    function findHeader() {
        // Use the permanent ID selector first, then fallback to others
        const selectors = [
            '#HeaderContent',
            '[data-test-id="header"]',
            '.QLY._he.p6V.zI7'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                return element;
            }
        }
        
        return null;
    }
    
    // Function to find the more-ideas-tabs element
    function findMoreIdeas() {
        const moreIdeasSelectors = [
            '[data-root-margin="more-ideas-tabs"]',
            '[data-test-id="more-ideas-tabs"]',
            '[class*="more-ideas"]',
            '[class*="MoreIdeas"]'
        ];
        
        let element = null;
        for (const selector of moreIdeasSelectors) {
            element = document.querySelector(selector);
            if (element) break;
        }
        
        return element;
    }
    
    // Function to show the more-ideas-tabs element
    function showMoreIdeas() {
        if (moreIdeasElement && settings.hideMoreIdeas) {
            moreIdeasElement.style.display = '';
            const parent = moreIdeasElement.parentElement;
            if (parent) {
                parent.style.display = '';
            }
        }
    }
    
    // Function to hide the more-ideas-tabs element
    function hideMoreIdeas() {
        if (moreIdeasElement && settings.hideMoreIdeas) {
            // Only hide if not already hidden to prevent loops
            const computedStyle = window.getComputedStyle(moreIdeasElement);
            if (computedStyle.display !== 'none') {
                moreIdeasElement.style.display = 'none';
                const parent = moreIdeasElement.parentElement;
                if (parent) {
                    const parentComputed = window.getComputedStyle(parent);
                    if (parentComputed.display !== 'none') {
                        parent.style.display = 'none';
                    }
                }
            }
        }
    }
    
    // Function to find the vertical nav element
    function findVerticalNav() {
        const verticalNavSelectors = [
            '#VerticalNavContent',
            '[data-test-id="vertical-nav"]',
            '[class*="vertical-nav"]',
            '[class*="VerticalNav"]'
        ];
        
        let element = null;
        for (const selector of verticalNavSelectors) {
            element = document.querySelector(selector);
            if (element) break;
        }
        
        return element;
    }
    
    // Function to show the vertical nav element
    function showVerticalNav() {
        if (verticalNavElement && settings.hideVerticalNav) {
            // Use setProperty with important to override CSS
            verticalNavElement.style.setProperty('display', 'block', 'important');
            // Also ensure parent is visible
            const parent = verticalNavElement.parentElement;
            if (parent) {
                const parentComputed = window.getComputedStyle(parent);
                if (parentComputed.display === 'none') {
                    parent.style.setProperty('display', 'block', 'important');
                }
            }
        }
    }
    
    // Function to hide the vertical nav element
    function hideVerticalNav() {
        if (verticalNavElement && settings.hideVerticalNav) {
            // Only hide if not already hidden to prevent loops
            const computedStyle = window.getComputedStyle(verticalNavElement);
            if (computedStyle.display !== 'none') {
                // Use setProperty with important to override any inline styles
                verticalNavElement.style.setProperty('display', 'none', 'important');
            }
        }
    }
    
    // Function to find the scrollable-one-bar element
    function findScrollableOneBar() {
        const scrollableOneBarSelectors = [
            '[data-test-id="scrollable-one-bar-root"]',
            '[class*="scrollable-one-bar"]'
        ];
        
        let element = null;
        for (const selector of scrollableOneBarSelectors) {
            element = document.querySelector(selector);
            if (element) break;
        }
        
        return element;
    }
    
    // Function to show the scrollable-one-bar element
    function showScrollableOneBar() {
        if (scrollableOneBarElement && settings.hideScrollableOneBar) {
            scrollableOneBarElement.style.display = '';
        }
    }
    
    // Function to hide the scrollable-one-bar element
    function hideScrollableOneBar() {
        if (scrollableOneBarElement && settings.hideScrollableOneBar) {
            scrollableOneBarElement.style.display = 'none';
        }
    }
    
    // Function to find the skip to content element
    function findSkipToContent() {
        const skipToContentSelectors = [
            '[data-test-id="hiddenSkipToContentContainer"]',
            '[class*="skipToContent"]'
        ];
        
        let element = null;
        for (const selector of skipToContentSelectors) {
            element = document.querySelector(selector);
            if (element) break;
        }
        
        return element;
    }
    
    // Function to show the skip to content element
    function showSkipToContent() {
        if (skipToContentElement && settings.hideSkipToContent) {
            skipToContentElement.style.display = '';
        }
    }
    
    // Function to hide the skip to content element
    function hideSkipToContent() {
        if (skipToContentElement && settings.hideSkipToContent) {
            skipToContentElement.style.display = 'none';
        }
    }
    
    // Function to update background color
    function updateBackgroundColor(color) {
        const appContent = document.querySelector('.appContent');
        if (appContent) {
            if (color) {
                appContent.style.backgroundColor = color;
            } else {
                appContent.style.backgroundColor = '';
            }
        }
    }
    
    // Function to apply liquid glass theme
    function applyLiquidGlassTheme() {
        if (settings.liquidGlassTheme) {
            document.body.classList.add('liquid-glass-theme');
            console.log('Pinterest Fullscreen: Liquid glass theme enabled');
        } else {
            document.body.classList.remove('liquid-glass-theme');
            console.log('Pinterest Fullscreen: Liquid glass theme disabled');
        }
    }
    
    // Function to hide the header
    function hideHeader() {
        if (headerElement && settings.hideHeader) {
            headerElement.style.transform = 'translateY(-100%)';
            headerElement.style.transition = 'transform 0.3s ease-in-out';
        }
    }
    
    // Function to show the header
    function showHeader() {
        if (headerElement && settings.hideHeader) {
            headerElement.style.transform = 'translateY(0)';
            headerElement.style.transition = 'transform 0.3s ease-in-out';
        }
    }
    
    // Function to show all elements (when mouse is in top area)
    function showAllElements() {
        showHeader();
        showMoreIdeas();
        showVerticalNav();
        showScrollableOneBar();
        showSkipToContent();
    }
    
    // Function to hide all elements (when mouse is not in top area)
    function hideAllElements() {
        hideHeader();
        hideMoreIdeas();
        hideVerticalNav();
        hideScrollableOneBar();
        hideSkipToContent();
    }
    
    // Function to handle mouse movement
    function handleMouseMove(event) {
        const mouseY = event.clientY;
        const threshold = settings.hoverThreshold;
        const isInTopArea = mouseY <= threshold;
        
        // Clear any existing timeout
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
        }
        
        if (isInTopArea) {
            // Mouse is in top area - show all elements
            if (!isMouseInTopArea) {
                isMouseInTopArea = true;
                showAllElements();
            }
        } else {
            // Mouse is not in top area - hide all elements
            if (isMouseInTopArea) {
                isMouseInTopArea = false;
                hideAllElements();
            }
        }
    }
    
    // Function to load settings from storage
    function loadSettings() {
        chrome.storage.sync.get([
            'hideHeader',
            'hideMoreIdeas', 
            'hideVerticalNav',
            'hideScrollableOneBar',
            'hideSkipToContent',
            'liquidGlassTheme',
            'hoverThreshold',
            'bgColor'
        ], function(result) {
            settings.hideHeader = result.hideHeader !== false;
            settings.hideMoreIdeas = result.hideMoreIdeas !== false;
            settings.hideVerticalNav = result.hideVerticalNav !== false;
            settings.hideScrollableOneBar = result.hideScrollableOneBar !== false;
            settings.hideSkipToContent = result.hideSkipToContent !== false;
            settings.liquidGlassTheme = result.liquidGlassTheme === true;
            settings.hoverThreshold = result.hoverThreshold || 80;
            settings.bgColor = result.bgColor || '';
            
            // Apply settings
            applySettings();
        });
    }
    
    // Function to find all elements
    function findAllElements() {
        headerElement = findHeader();
        moreIdeasElement = findMoreIdeas();
        verticalNavElement = findVerticalNav();
        scrollableOneBarElement = findScrollableOneBar();
        skipToContentElement = findSkipToContent();
    }
    
    // Function to apply current settings
    function applySettings() {
        // Find all elements first
        findAllElements();
        
        // Add CSS class to enable hiding
        if (settings.hideHeader || settings.hideMoreIdeas || settings.hideVerticalNav || 
            settings.hideScrollableOneBar || settings.hideSkipToContent) {
            document.body.classList.add('pinterest-header-hidden');
        } else {
            document.body.classList.remove('pinterest-header-hidden');
        }
        
        // Apply initial state based on mouse position
        if (isMouseInTopArea) {
            showAllElements();
        } else {
            hideAllElements();
        }
        
        // Apply background color
        updateBackgroundColor(settings.bgColor);
        
        // Apply liquid glass theme
        applyLiquidGlassTheme();
    }
    
    // Function to initialize the extension
    function init() {
        // Wait for the page to load completely
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        // Load settings first
        loadSettings();
        
        // Find all elements
        findAllElements();
        
        if (headerElement || moreIdeasElement || verticalNavElement || 
            scrollableOneBarElement || skipToContentElement) {
            console.log('Pinterest Fullscreen: Elements found and initialized');
            
            // Add mouse move listener to the document
            document.addEventListener('mousemove', handleMouseMove);
            
            // Also handle mouse leave events - hide all elements when mouse leaves window
            document.addEventListener('mouseleave', () => {
                if (isMouseInTopArea) {
                    isMouseInTopArea = false;
                    hideAllElements();
                }
            });
            
            // Initialize: hide all elements by default (mouse not in top area)
            isMouseInTopArea = false;
            hideAllElements();
            
        } else {
            console.log('Pinterest Fullscreen: Elements not found, retrying...');
            // Retry after a short delay if elements not found
            setTimeout(init, 1000);
        }
        
        // Apply all settings
        applySettings();
    }
    
    // Start the extension
    init();
    
    // Handle messages from popup
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        switch(request.action) {
            case 'toggleSetting':
                settings[request.data.setting] = request.data.value;
                applySettings();
                break;
            case 'updateHoverThreshold':
                settings.hoverThreshold = request.data;
                break;
            case 'updateBgColor':
                settings.bgColor = request.data;
                updateBackgroundColor(request.data);
                break;
            case 'resetBgColor':
                settings.bgColor = '';
                updateBackgroundColor('');
                break;
            case 'toggleLiquidGlassTheme':
                settings.liquidGlassTheme = request.data.value;
                applyLiquidGlassTheme();
                break;
        }
    });
    
    // Handle page navigation (for SPA behavior)
    let lastUrl = location.href;
    let mutationTimeout = null;
    let isProcessingMutations = false;
    
    new MutationObserver(() => {
        // Debounce mutation handling to prevent loops
        if (mutationTimeout) {
            clearTimeout(mutationTimeout);
        }
        
        mutationTimeout = setTimeout(() => {
            // Prevent recursive calls
            if (isProcessingMutations) {
                return;
            }
            
            isProcessingMutations = true;
            
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                // Reinitialize when navigating to a new page
                setTimeout(init, 500);
                isProcessingMutations = false;
                return;
            }
            
            // Only check for new elements, don't force hide/show if already in correct state
            findAllElements();
            
            // Only update visibility if elements exist and state has changed
            // Don't repeatedly hide elements that are already hidden
            if (isMouseInTopArea) {
                showAllElements();
            } else {
                // Only hide if elements are actually visible
                hideAllElements();
            }
            
            isProcessingMutations = false;
        }, 500); // Debounce by 500ms to prevent rapid-fire calls
    }).observe(document.body || document.documentElement, { 
        subtree: true, 
        childList: true,
        attributes: false, // Don't observe attributes to reduce overhead
        characterData: false
    });
    
})();
