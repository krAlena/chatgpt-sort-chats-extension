chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('bckg', request.action)
  if (request.action === "showWarning") {
    const url = request.url;
    // Open a warning popup
  //   chrome.tabs.create({
  //     url: chrome.runtime.getURL("popup.html") + "?url=" + encodeURIComponent(url)
  //   });
    chrome.action.openPopup();
  }
});

console.log('script runned!')
chrome.action.onClicked.addListener((tab) => {
  console.log('')
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['contentScript.js']
  });
});


// chrome.webRequest.onBeforeRequest.addListener(
//     function(details) {
//       const url = details.url;
  
//       Example: if URL is suspicious
//       if (url.includes("upwork.com") && !url.startsWith('chrome-extension://') && !url.includes('popup.html')) {
//         chrome.notifications.create({
//           type: 'basic',
//           iconUrl: 'icon.png',
//           title: 'Phishing Warning',
//           message: 'This site may be harmful. Proceed with caution.'
//         });
//       }
//     },
//     { urls: ["<all_urls>"] }
//   );

// chrome.webRequest.onBeforeRequest.addListener(
//     function(details) {
//         const url = details.url;
//         console.log("Navigating to:", url);
    
//         // Ignore extension's own pages or warning pages
//         if (url.includes('popup.html') || url.startsWith('chrome-extension://')) {
//             return { cancel: false }; // Let the warning page load without interference
//         }

//         // Example criteria: trigger a warning if URL contains "upwork.com"
//         if (url.includes('upwork.com')) {
//             chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL("popup.html") });
//             return { cancel: true }; // Cancel original request and redirect to warning page
//         }

//         // Allow normal navigation
//         return { cancel: false };
//     },
//     { urls: ["<all_urls>"] },
//     ["blocking"] // Use 'blocking' to prevent navigation before warning is shown
//   );
  

// chrome.webRequest.onBeforeRequest.addListener(
//     function(details) {
//       const url = details.url;
  
//       // Example logic: if the URL contains certain criteria, show a warning
//       if (url.includes('upwork.com')) {
//         // Here, we can show the popup before loading the page
//         chrome.tabs.create({ url: "popup.html" });
        
//         // Optionally, we could cancel the request to prevent the site from loading
//         return { cancel: true };
//       }
  
//       // Allow normal navigation if no issues
//       return { cancel: false };
//     },
//     { urls: ["<all_urls>"] }, // Filter on all URLs or specific patterns
//     ["blocking"] // 'blocking' allows us to cancel the request
// );


// console.log('1 in bckg')
// // background.js
// chrome.webNavigation.onCompleted.addListener((details) => {
//     console.log('2 in bckg')
//     const url = new URL(details.url);
//     let score = 0;
  
//     // Example rule: increase score if URL contains too many numbers
//     const digitCount = (url.hostname.match(/\d/g) || []).length;
//     if (digitCount > 3) {
//       score += 10; // Adjust scoring based on your system
//     }
  
//     // Check if URL length is suspiciously long
//     if (url.hostname.length > 25) {
//       score += 5;
//     }
  
//     // Check for specific phishing keywords
//     const suspiciousKeywords = ["login", "secure", "account", "verify"];
//     if (suspiciousKeywords.some(keyword => url.hostname.includes(keyword))) {
//       score += 15;
//     }
  
//     // Show a warning if the score is too high
//     // if (score > 20) {
//       chrome.tabs.create({ url: "popup.html" });
//     // }
//   });
  