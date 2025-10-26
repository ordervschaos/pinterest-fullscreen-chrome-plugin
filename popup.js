// Popup script for Pinterest Header Hide Extension
document.addEventListener('DOMContentLoaded', function() {
    // Get all toggle elements
    const hideHeaderToggle = document.getElementById('hideHeaderToggle');
    const hideMoreIdeasToggle = document.getElementById('hideMoreIdeasToggle');
    const hideVerticalNavToggle = document.getElementById('hideVerticalNavToggle');
    const hoverThresholdInput = document.getElementById('hoverThreshold');
    const bgColorInput = document.getElementById('bgColorInput');
    const resetBgColorBtn = document.getElementById('resetBgColor');
    const statusText = document.getElementById('statusText');

    // Load saved settings
    loadSettings();

    // Add event listeners
    hideHeaderToggle.addEventListener('click', function() {
        toggleSetting('hideHeader', hideHeaderToggle);
    });

    hideMoreIdeasToggle.addEventListener('click', function() {
        toggleSetting('hideMoreIdeas', hideMoreIdeasToggle);
    });

    hideVerticalNavToggle.addEventListener('click', function() {
        toggleSetting('hideVerticalNav', hideVerticalNavToggle);
    });

    hoverThresholdInput.addEventListener('input', function() {
        const value = parseInt(this.value);
        if (value >= 10 && value <= 200) {
            saveSetting('hoverThreshold', value);
            sendMessageToContentScript('updateHoverThreshold', value);
            showStatus('Hover threshold updated');
        }
    });

    bgColorInput.addEventListener('input', function() {
        saveSetting('bgColor', this.value);
        sendMessageToContentScript('updateBgColor', this.value);
        showStatus('Background color updated');
    });

    resetBgColorBtn.addEventListener('click', function() {
        bgColorInput.value = '#ffffff';
        saveSetting('bgColor', '');
        sendMessageToContentScript('resetBgColor');
        showStatus('Background color reset');
    });

    // Load settings from storage
    function loadSettings() {
        chrome.storage.sync.get([
            'hideHeader',
            'hideMoreIdeas', 
            'hideVerticalNav',
            'hoverThreshold',
            'bgColor'
        ], function(result) {
            // Set toggle states
            hideHeaderToggle.classList.toggle('active', result.hideHeader !== false);
            hideMoreIdeasToggle.classList.toggle('active', result.hideMoreIdeas !== false);
            hideVerticalNavToggle.classList.toggle('active', result.hideVerticalNav !== false);
            
            // Set threshold
            hoverThresholdInput.value = result.hoverThreshold || 80;
            
            // Set background color
            bgColorInput.value = result.bgColor || '#ffffff';
        });
    }

    // Toggle setting and save
    function toggleSetting(settingName, toggleElement) {
        const isActive = toggleElement.classList.contains('active');
        toggleElement.classList.toggle('active');
        
        saveSetting(settingName, !isActive);
        sendMessageToContentScript('toggleSetting', { setting: settingName, value: !isActive });
        
        const settingLabels = {
            'hideHeader': 'Header hiding',
            'hideMoreIdeas': 'More Ideas tabs',
            'hideVerticalNav': 'Vertical navigation'
        };
        
        showStatus(`${settingLabels[settingName]} ${!isActive ? 'enabled' : 'disabled'}`);
    }

    // Save setting to storage
    function saveSetting(key, value) {
        chrome.storage.sync.set({ [key]: value });
    }

    // Send message to content script
    function sendMessageToContentScript(action, data = null) {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs[0] && tabs[0].url.includes('pinterest.com')) {
                chrome.tabs.sendMessage(tabs[0].id, { action, data });
            }
        });
    }

    // Show status message
    function showStatus(message) {
        statusText.textContent = message;
        setTimeout(() => {
            statusText.textContent = 'Settings saved automatically';
        }, 2000);
    }
});
