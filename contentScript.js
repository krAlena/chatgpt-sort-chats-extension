let indexCurrentOl = 0;
const parentSelector = ".bg-token-sidebar-surface-primary";

// This function is called when the first ol element is found
const handleFirstOlElement = (observer) => {
  const targetChild = document.querySelectorAll(`${parentSelector} ol`)[indexCurrentOl];
  if (targetChild) {
    indexCurrentOl += 1;
    sortChats(targetChild); // Your function to sort chats or do something with the targetChild
    console.log('Target child element found:', targetChild.textContent);
    observer.disconnect(); // Disconnect the initial observer after finding the first ol element

    // Switch to the smaller area observer
    switchToNextObserver();
  } else {
    console.log('Target child not found');
  }
};

// This function starts the first observer
const startFirstObserver = () => {
  const observer = new MutationObserver((mutations) => {
    console.log(mutations);
    for (let mutation of mutations) {
      if (mutation.type === 'childList') {
        handleFirstOlElement(observer);
        break; // Exit the loop once the first element is found
      }
    }
  });

  // Observe the parent container for child additions
  const parentContainer = document.body;
  observer.observe(parentContainer, { childList: true, subtree: true });
};

// This function starts a second observer to monitor the next ol element in the smaller area
const switchToNextObserver = () => {
  const secondObserver = new MutationObserver((mutations) => {
    console.log(mutations);
    for (let mutation of mutations) {
      if (mutation.type === 'childList') {
        const nextTargetChild = document.querySelectorAll('.bg-token-sidebar-surface-primary ol')[indexCurrentOl];
        if (nextTargetChild) {
          indexCurrentOl += 1;
          sortChats(nextTargetChild); // Your sorting function for the next targetChild
          console.log('Next ol element found:', nextTargetChild.textContent);

        } else {
          console.log('No next target child found.');
          let spinnerElem = document.querySelector(`${parentSelector} .animate-spin`)
          let isSpinnerVisible = (spinnerElem != null);
          if (!isSpinnerVisible){
            secondObserver.disconnect();
          }
        }
      }
    }
  });

  // Observe the smaller parent container for next ol elements
  const smallerParentContainer = document.querySelector(parentSelector);
  if (smallerParentContainer) {
    secondObserver.observe(smallerParentContainer, { childList: true, subtree: true });
  }
};

// Start the first observer with the full area selector
startFirstObserver();

function sortChats(chatListToSort) {
  // Get all sidebar items
  const items = Array.from(chatListToSort.children);

  // Sort items alphabetically
  items.sort((a, b) => a.textContent.trim().localeCompare(b.textContent.trim()));

  // Reattach sorted items
  chatListToSort.innerHTML = '';
  items.forEach(item => chatListToSort.appendChild(item));
}