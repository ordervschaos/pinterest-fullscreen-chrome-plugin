// Pinterest Fullscreen Extension
(function() {
    'use strict';
    
    let headerElement = null;
    let moreIdeasElement = null;
    let verticalNavElement = null;
    let scrollableOneBarElement = null;
    let skipToContentElement = null;
    let isMouseInTopArea = false;
    let isMouseInLeftArea = false;
    let hoverTimeout = null;
    let lastMouseY = null;
    let lastMouseX = null;
    
    // Settings
    let settings = {
        hideHeader: true,
        hideMoreIdeas: true,
        hideVerticalNav: true,
        hideScrollableOneBar: true,
        hideSkipToContent: true,
        hoverThreshold: 80,
        leftSideThreshold: 80,
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
    
    // Function to hide the header
    function hideHeader() {
        if (headerElement && settings.hideHeader) {
            // Use setProperty with important to override CSS !important rule
            headerElement.style.setProperty('transform', 'translateY(-100%)', 'important');
            headerElement.style.setProperty('transition', 'transform 0.3s ease-in-out', 'important');
        }
    }
    
    // Function to show the header
    function showHeader() {
        if (headerElement && settings.hideHeader) {
            // Use setProperty with important to override CSS !important rule
            headerElement.style.setProperty('transform', 'translateY(0)', 'important');
            headerElement.style.setProperty('transition', 'transform 0.3s ease-in-out', 'important');
        } else if (!headerElement) {
            // Try to find header again if it wasn't found
            headerElement = findHeader();
            if (headerElement && settings.hideHeader) {
                headerElement.style.setProperty('transform', 'translateY(0)', 'important');
                headerElement.style.setProperty('transition', 'transform 0.3s ease-in-out', 'important');
            }
        }
    }
    
    // Function to show top area elements (header, more ideas, scrollable bar, skip to content)
    function showTopElements() {
        // Ensure header element is found
        if (!headerElement) {
            headerElement = findHeader();
        }
        showHeader();
        showMoreIdeas();
        showScrollableOneBar();
        showSkipToContent();
    }
    
    // Function to hide top area elements
    function hideTopElements() {
        hideHeader();
        hideMoreIdeas();
        hideScrollableOneBar();
        hideSkipToContent();
    }
    
    // Function to show sidebar (vertical nav)
    function showSidebar() {
        showVerticalNav();
    }
    
    // Function to hide sidebar
    function hideSidebar() {
        hideVerticalNav();
    }
    
    // Function to check mouse position and update top area visibility
    function updateTopAreaVisibility(mouseY) {
        const threshold = settings.hoverThreshold;
        const isInTopArea = mouseY <= threshold;
        
        if (isInTopArea) {
            // Mouse is in top area - show top elements
            if (!isMouseInTopArea) {
                isMouseInTopArea = true;
                showTopElements();
            }
        } else {
            // Mouse is not in top area - hide top elements
            if (isMouseInTopArea) {
                isMouseInTopArea = false;
                hideTopElements();
            }
        }
    }
    
    // Function to check mouse position and update sidebar visibility
    function updateSidebarVisibility(mouseX) {
        const threshold = settings.leftSideThreshold;
        const isInLeftArea = mouseX <= threshold;
        
        if (isInLeftArea) {
            // Mouse is in left area - show sidebar
            if (!isMouseInLeftArea) {
                isMouseInLeftArea = true;
                showSidebar();
            }
        } else {
            // Mouse is not in left area - hide sidebar
            if (isMouseInLeftArea) {
                isMouseInLeftArea = false;
                hideSidebar();
            }
        }
    }
    
    // Function to handle mouse movement
    function handleMouseMove(event) {
        const mouseY = event.clientY;
        const mouseX = event.clientX;
        lastMouseY = mouseY;
        lastMouseX = mouseX;
        
        // Clear any existing timeout
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
        }
        
        // Update visibility based on mouse position (both X and Y)
        updateTopAreaVisibility(mouseY);
        updateSidebarVisibility(mouseX);
    }
    
    // Function to load settings from storage
    function loadSettings() {
        chrome.storage.sync.get([
            'hideHeader',
            'hideMoreIdeas', 
            'hideVerticalNav',
            'hideScrollableOneBar',
            'hideSkipToContent',
            'hoverThreshold',
            'leftSideThreshold',
            'bgColor'
        ], function(result) {
            settings.hideHeader = result.hideHeader !== false;
            settings.hideMoreIdeas = result.hideMoreIdeas !== false;
            settings.hideVerticalNav = result.hideVerticalNav !== false;
            settings.hideScrollableOneBar = result.hideScrollableOneBar !== false;
            settings.hideSkipToContent = result.hideSkipToContent !== false;
            settings.hoverThreshold = result.hoverThreshold || 80;
            settings.leftSideThreshold = result.leftSideThreshold || 80;
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
            showTopElements();
        } else {
            hideTopElements();
        }
        
        if (isMouseInLeftArea) {
            showSidebar();
        } else {
            hideSidebar();
        }
        
        // Apply background color
        updateBackgroundColor(settings.bgColor);
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
                    hideTopElements();
                }
                if (isMouseInLeftArea) {
                    isMouseInLeftArea = false;
                    hideSidebar();
                }
            });
            
            // Track mouse position on mouseenter to catch cases where mouse is already in top/left area
            document.addEventListener('mouseenter', function(event) {
                if (event.clientY !== undefined) {
                    lastMouseY = event.clientY;
                    updateTopAreaVisibility(event.clientY);
                }
                if (event.clientX !== undefined) {
                    lastMouseX = event.clientX;
                    updateSidebarVisibility(event.clientX);
                }
            });
            
            // Initialize: hide all elements by default
            // The first mousemove event will update visibility based on actual mouse position
            isMouseInTopArea = false;
            isMouseInLeftArea = false;
            hideTopElements();
            hideSidebar();
            
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
                // Re-check visibility if we have a last known mouse position
                if (lastMouseY !== null) {
                    updateTopAreaVisibility(lastMouseY);
                }
                break;
            case 'updateLeftSideThreshold':
                settings.leftSideThreshold = request.data;
                // Re-check sidebar visibility if we have a last known mouse position
                if (lastMouseX !== null) {
                    updateSidebarVisibility(lastMouseX);
                }
                break;
            case 'updateBgColor':
                settings.bgColor = request.data;
                updateBackgroundColor(request.data);
                break;
            case 'resetBgColor':
                settings.bgColor = '';
                updateBackgroundColor('');
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
                showTopElements();
            } else {
                hideTopElements();
            }
            
            if (isMouseInLeftArea) {
                showSidebar();
            } else {
                hideSidebar();
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
