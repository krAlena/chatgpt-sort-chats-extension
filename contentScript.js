let indexCurrentOl = 0;
const parentSelector = ".bg-token-sidebar-surface-primary";
const spinnerSelector = ".animate-spin";
const chatsGroupForSortSelector = "ol";
let scrollableList = null;
let isChatsObserverWorking = false;

// This function is called when the first ol element is found
const handleFirstOlElement = (observer) => {
  const targetChild = document.querySelectorAll(`${parentSelector} ${chatsGroupForSortSelector}`)[indexCurrentOl];
  if (targetChild) {
    indexCurrentOl += 1;
    sortChats(targetChild); // Your function to sort chats or do something with the targetChild
    handleChatsListScroll();
    isChatsObserverWorking = false;
    observer.disconnect(); // Disconnect the initial observer after finding the first ol element

    // Switch to the smaller area observer
    startSmallerObserver();
  } else {
    console.log('Target child not found');
  }
};

function handleChatsListScroll(){
  if (!scrollableList){
    scrollableList =  document.querySelector(`${parentSelector} .overflow-y-auto`);
    if (scrollableList){
      scrollableList.addEventListener("scroll", function () {
        let spinnerElem = document.querySelector(`${parentSelector} ${spinnerSelector}`)
          let isSpinnerVisible = (spinnerElem != null);
          if (isSpinnerVisible && !isChatsObserverWorking){
            // resort last chats group
            indexCurrentOl -= 1;
            startSmallerObserver();
          }
      });
    }
  }
}

// This function starts the first observer
const startGlobalObserver = () => {
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
  isChatsObserverWorking = true;
  observer.observe(parentContainer, { childList: true, subtree: true });
};

// This function starts a second observer to monitor the next ol element in the smaller area
const startSmallerObserver = () => {
  const smallerObserver = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
      if (mutation.type === 'childList') {
        const nextTargetChild = document.querySelectorAll(`${parentSelector} ${chatsGroupForSortSelector}`)[indexCurrentOl];
        if (nextTargetChild) {
          indexCurrentOl += 1;
          sortChats(nextTargetChild); // Your sorting function for the next targetChild
        } else {
          let spinnerElem = document.querySelector(`${parentSelector} ${spinnerSelector}`)
          let isSpinnerVisible = (spinnerElem != null);
          if (!isSpinnerVisible){
            isChatsObserverWorking = false;
            smallerObserver.disconnect();
          }
        }
      }
    }
  });

  // Observe the smaller parent container for next ol elements
  const smallerParentContainer = document.querySelector(parentSelector);
  if (smallerParentContainer) {
    isChatsObserverWorking = true;
    smallerObserver.observe(smallerParentContainer, { childList: true, subtree: true });
  }
};

// Start the first observer with the full area selector
startGlobalObserver();

function sortChats(chatListToSort) {
  // Get all sidebar items
  const items = Array.from(chatListToSort.children);

  // Sort items alphabetically
  items.sort((a, b) => a.textContent.trim().localeCompare(b.textContent.trim()));

  // Reattach sorted items
  chatListToSort.innerHTML = '';
  items.forEach(item => chatListToSort.appendChild(item));
}