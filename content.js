// Pinterest Header Hide Extension
(function() {
    'use strict';
    
    let headerElement = null;
    let moreIdeasElement = null;
    let verticalNavElement = null;
    let isHeaderVisible = false;
    let hoverTimeout = null;
    
    // Settings
    let settings = {
        hideHeader: true,
        hideMoreIdeas: true,
        hideVerticalNav: true,
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
    
    // Function to find and hide the more-ideas-tabs element
    function findAndHideMoreIdeas() {
        const moreIdeasSelector = '[data-root-margin="more-ideas-tabs"]';
        const element = document.querySelector(moreIdeasSelector);
        
        if (element) {
            if (settings.hideMoreIdeas) {
                // Hide the element itself
                element.style.display = 'none';
                
                // Hide its immediate parent
                const parent = element.parentElement;
                if (parent) {
                    parent.style.display = 'none';
                }
                
                console.log('Pinterest Header Hide: More ideas tabs hidden');
            } else {
                // Show the element
                element.style.display = '';
                const parent = element.parentElement;
                if (parent) {
                    parent.style.display = '';
                }
            }
            return element;
        }
        
        return null;
    }
    
    // Function to find and hide the vertical nav element
    function findAndHideVerticalNav() {
        const verticalNavSelector = '#VerticalNavContent';
        const element = document.querySelector(verticalNavSelector);
        
        if (element) {
            if (settings.hideVerticalNav) {
                // Hide the element itself
                element.style.display = 'none';
                console.log('Pinterest Header Hide: Vertical nav hidden');
            } else {
                // Show the element
                element.style.display = '';
                console.log('Pinterest Header Hide: Vertical nav shown');
            }
            return element;
        }
        
        return null;
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
        if (headerElement) {
            headerElement.style.transform = 'translateY(-100%)';
            headerElement.style.transition = 'transform 0.3s ease-in-out';
            isHeaderVisible = false;
        }
    }
    
    // Function to show the header
    function showHeader() {
        if (headerElement) {
            headerElement.style.transform = 'translateY(0)';
            headerElement.style.transition = 'transform 0.3s ease-in-out';
            isHeaderVisible = true;
        }
    }
    
    // Function to handle mouse movement
    function handleMouseMove(event) {
        if (!settings.hideHeader) return;
        
        const mouseY = event.clientY;
        const threshold = settings.hoverThreshold;
        
        if (mouseY <= threshold) {
            if (!isHeaderVisible) {
                showHeader();
            }
            // Clear any existing timeout
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
            }
        } else {
            // Hide header immediately when mouse moves away
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
            }
            if (isHeaderVisible) {
                hideHeader();
            }
        }
    }
    
    // Function to load settings from storage
    function loadSettings() {
        chrome.storage.sync.get([
            'hideHeader',
            'hideMoreIdeas', 
            'hideVerticalNav',
            'hoverThreshold',
            'bgColor'
        ], function(result) {
            settings.hideHeader = result.hideHeader !== false;
            settings.hideMoreIdeas = result.hideMoreIdeas !== false;
            settings.hideVerticalNav = result.hideVerticalNav !== false;
            settings.hoverThreshold = result.hoverThreshold || 80;
            settings.bgColor = result.bgColor || '';
            
            // Apply settings
            applySettings();
        });
    }
    
    // Function to apply current settings
    function applySettings() {
        // Apply header settings
        if (headerElement) {
            if (settings.hideHeader) {
                hideHeader();
                // Add CSS class to enable hiding
                document.body.classList.add('pinterest-header-hidden');
            } else {
                showHeader();
                // Remove CSS class to disable hiding
                document.body.classList.remove('pinterest-header-hidden');
            }
        }
        
        // Apply more ideas settings
        moreIdeasElement = findAndHideMoreIdeas();
        
        // Apply vertical nav settings
        verticalNavElement = findAndHideVerticalNav();
        
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
        
        // Find the header element
        headerElement = findHeader();
        
        if (headerElement) {
            console.log('Pinterest Header Hide: Header found and initialized');
            
            // Add mouse move listener to the document
            document.addEventListener('mousemove', handleMouseMove);
            
            // Also handle mouse leave events
            document.addEventListener('mouseleave', () => {
                if (isHeaderVisible && settings.hideHeader) {
                    hideHeader();
                }
            });
            
        } else {
            console.log('Pinterest Header Hide: Header not found, retrying...');
            // Retry after a short delay if header not found
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
        }
    });
    
    // Handle page navigation (for SPA behavior)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            // Reinitialize when navigating to a new page
            setTimeout(init, 500);
        }
        
        // Also check for new more-ideas-tabs elements that might appear
        if (!moreIdeasElement) {
            moreIdeasElement = findAndHideMoreIdeas();
        }
        
        // Also check for new vertical nav elements that might appear
        if (!verticalNavElement) {
            verticalNavElement = findAndHideVerticalNav();
        }
    }).observe(document, { subtree: true, childList: true });
    
})();
