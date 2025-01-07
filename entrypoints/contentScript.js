let indexCurrentChatsGroup = 0;
const parentSelector = ".bg-token-sidebar-surface-primary";
const spinnerSelector = ".animate-spin";
const chatsGroupSelector = "ol";
const chatsGroupHeaderSelector = ".sticky.bg-token-sidebar-surface-primary.top-0";
let scrollableList = null;
let isChatsObserverWorking = false;

export default defineUnlistedScript(() => {
// This function is called when the first ol element is found
const handleFirstOlElement = (observer) => {
  const targetChild = document.querySelectorAll(`${parentSelector} ${chatsGroupSelector}`)[indexCurrentChatsGroup];
  if (targetChild) {
    tryToAddSortIcon(indexCurrentChatsGroup);
    indexCurrentChatsGroup += 1;
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

function tryToAddSortIcon(indexGroup){
  let targetHeader = document.querySelectorAll(`${parentSelector} ${chatsGroupHeaderSelector}`)[indexGroup];
  if (targetHeader) {
    let isExistSortIcon = targetHeader.querySelector(".sort-icon");
    if (!isExistSortIcon){
      const img = document.createElement("img");
      img.src = chrome.runtime.getURL("icon/16.png");
      img.alt = "Sort";
      img.className = "sort-icon";
      img.addEventListener('click', () => {
        toggleGroupSortDirection(indexGroup);
      });

      targetHeader.appendChild(img);
    }
  }
}

function toggleGroupSortDirection(indexGroup){
  const groupForSort = document.querySelectorAll(`${parentSelector} ${chatsGroupSelector}`)[indexGroup];
  if (groupForSort) {
    let sortIcon = document.querySelectorAll(`${parentSelector} ${chatsGroupHeaderSelector} .sort-icon`)[indexGroup];
    if (sortIcon) {
      let newSortDirection = sortIcon.src.includes("desc") ? "asc" : "desc";
      let sortIconPath = (newSortDirection === "asc") ? "icon/16.png" : "icon/16_desc.png";

      sortIcon.src = chrome.runtime.getURL(sortIconPath);
      sortChats(groupForSort, newSortDirection);
    }
  }
}

function handleChatsListScroll(){
  if (!scrollableList){
    scrollableList =  document.querySelector(`${parentSelector} .overflow-y-auto`);
    if (scrollableList){
      scrollableList.addEventListener("scroll", function () {
        let spinnerElem = document.querySelector(`${parentSelector} ${spinnerSelector}`)
        let isSpinnerVisible = (spinnerElem != null);
        if (isSpinnerVisible && !isChatsObserverWorking){
          // resort last chats group
          indexCurrentChatsGroup -= 1;
          startSmallerObserver();
        }
      });
    }
  }
}

// This function starts the first observer
const startGlobalObserver = () => {
  if (typeof MutationObserver === 'undefined') {
    // Load a polyfill or handle the lack of support
  } else {
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
  }
};

// This function starts a second observer to monitor the next ol element in the smaller area
const startSmallerObserver = () => {
  if (typeof MutationObserver === 'undefined') {
    // Load a polyfill or handle the lack of support
  } else {
    const smallerObserver = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        if (mutation.type === 'childList') {
          const nextTargetChild = document.querySelectorAll(`${parentSelector} ${chatsGroupSelector}`)[indexCurrentChatsGroup];
          if (nextTargetChild) {
            tryToAddSortIcon(indexCurrentChatsGroup);
            indexCurrentChatsGroup += 1;
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
  }
};

// Start the first observer with the full area selector
startGlobalObserver();

function sortChats(chatListToSort, direction = 'asc') {
  // Get all sidebar items
  const items = Array.from(chatListToSort.children);

  // Sort items alphabetically
  if (direction === 'asc') {
    items.sort((a, b) => a.textContent.trim().localeCompare(b.textContent.trim()));
  }
  else if (direction === 'desc') {
    items.sort((a, b) => b.textContent.trim().localeCompare(a.textContent.trim()));
  }

  // Reattach sorted items
  chatListToSort.innerHTML = '';
  items.forEach(item => chatListToSort.appendChild(item));
}
})