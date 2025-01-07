var contentscript = function() {
  "use strict";
  function defineUnlistedScript(arg) {
    if (arg == null || typeof arg === "function") return { main: arg };
    return arg;
  }
  let indexCurrentChatsGroup = 0;
  const parentSelector = ".bg-token-sidebar-surface-primary";
  const spinnerSelector = ".animate-spin";
  const chatsGroupSelector = "ol";
  const chatsGroupHeaderSelector = ".sticky.bg-token-sidebar-surface-primary.top-0";
  let scrollableList = null;
  let isChatsObserverWorking = false;
  const definition = defineUnlistedScript(() => {
    const handleFirstOlElement = (observer) => {
      const targetChild = document.querySelectorAll(`${parentSelector} ${chatsGroupSelector}`)[indexCurrentChatsGroup];
      if (targetChild) {
        tryToAddSortIcon(indexCurrentChatsGroup);
        indexCurrentChatsGroup += 1;
        sortChats(targetChild);
        handleChatsListScroll();
        isChatsObserverWorking = false;
        observer.disconnect();
        startSmallerObserver();
      } else {
        console.log("Target child not found");
      }
    };
    function tryToAddSortIcon(indexGroup) {
      let targetHeader = document.querySelectorAll(`${parentSelector} ${chatsGroupHeaderSelector}`)[indexGroup];
      if (targetHeader) {
        let isExistSortIcon = targetHeader.querySelector(".sort-icon");
        if (!isExistSortIcon) {
          const img = document.createElement("img");
          img.src = chrome.runtime.getURL("icon/16.png");
          img.alt = "Sort";
          img.className = "sort-icon";
          img.addEventListener("click", () => {
            toggleGroupSortDirection(indexGroup);
          });
          targetHeader.appendChild(img);
        }
      }
    }
    function toggleGroupSortDirection(indexGroup) {
      const groupForSort = document.querySelectorAll(`${parentSelector} ${chatsGroupSelector}`)[indexGroup];
      if (groupForSort) {
        let sortIcon = document.querySelectorAll(`${parentSelector} ${chatsGroupHeaderSelector} .sort-icon`)[indexGroup];
        if (sortIcon) {
          let newSortDirection = sortIcon.src.includes("desc") ? "asc" : "desc";
          let sortIconPath = newSortDirection === "asc" ? "icon/16.png" : "icon/16_desc.png";
          sortIcon.src = chrome.runtime.getURL(sortIconPath);
          sortChats(groupForSort, newSortDirection);
        }
      }
    }
    function handleChatsListScroll() {
      if (!scrollableList) {
        scrollableList = document.querySelector(`${parentSelector} .overflow-y-auto`);
        if (scrollableList) {
          scrollableList.addEventListener("scroll", function() {
            let spinnerElem = document.querySelector(`${parentSelector} ${spinnerSelector}`);
            let isSpinnerVisible = spinnerElem != null;
            if (isSpinnerVisible && !isChatsObserverWorking) {
              indexCurrentChatsGroup -= 1;
              startSmallerObserver();
            }
          });
        }
      }
    }
    const startGlobalObserver = () => {
      if (typeof MutationObserver === "undefined") ;
      else {
        const observer = new MutationObserver((mutations) => {
          console.log(mutations);
          for (let mutation of mutations) {
            if (mutation.type === "childList") {
              handleFirstOlElement(observer);
              break;
            }
          }
        });
        const parentContainer = document.body;
        isChatsObserverWorking = true;
        observer.observe(parentContainer, { childList: true, subtree: true });
      }
    };
    const startSmallerObserver = () => {
      if (typeof MutationObserver === "undefined") ;
      else {
        const smallerObserver = new MutationObserver((mutations) => {
          for (let mutation of mutations) {
            if (mutation.type === "childList") {
              const nextTargetChild = document.querySelectorAll(`${parentSelector} ${chatsGroupSelector}`)[indexCurrentChatsGroup];
              if (nextTargetChild) {
                tryToAddSortIcon(indexCurrentChatsGroup);
                indexCurrentChatsGroup += 1;
                sortChats(nextTargetChild);
              } else {
                let spinnerElem = document.querySelector(`${parentSelector} ${spinnerSelector}`);
                let isSpinnerVisible = spinnerElem != null;
                if (!isSpinnerVisible) {
                  isChatsObserverWorking = false;
                  smallerObserver.disconnect();
                }
              }
            }
          }
        });
        const smallerParentContainer = document.querySelector(parentSelector);
        if (smallerParentContainer) {
          isChatsObserverWorking = true;
          smallerObserver.observe(smallerParentContainer, { childList: true, subtree: true });
        }
      }
    };
    startGlobalObserver();
    function sortChats(chatListToSort, direction = "asc") {
      const items = Array.from(chatListToSort.children);
      if (direction === "asc") {
        items.sort((a, b) => a.textContent.trim().localeCompare(b.textContent.trim()));
      } else if (direction === "desc") {
        items.sort((a, b) => b.textContent.trim().localeCompare(a.textContent.trim()));
      }
      chatListToSort.innerHTML = "";
      items.forEach((item) => chatListToSort.appendChild(item));
    }
  });
  function initPlugins() {
  }
  function print(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  const logger = {
    debug: (...args) => print(console.debug, ...args),
    log: (...args) => print(console.log, ...args),
    warn: (...args) => print(console.warn, ...args),
    error: (...args) => print(console.error, ...args)
  };
  const result = (async () => {
    try {
      initPlugins();
      return await definition.main();
    } catch (err) {
      logger.error(
        `The unlisted script "${"contentScript"}" crashed on startup!`,
        err
      );
      throw err;
    }
  })();
  return result;
}();
contentscript;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudFNjcmlwdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3NhbmRib3gvZGVmaW5lLXVubGlzdGVkLXNjcmlwdC5tanMiLCIuLi8uLi9lbnRyeXBvaW50cy9jb250ZW50U2NyaXB0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBkZWZpbmVVbmxpc3RlZFNjcmlwdChhcmcpIHtcbiAgaWYgKGFyZyA9PSBudWxsIHx8IHR5cGVvZiBhcmcgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHsgbWFpbjogYXJnIH07XG4gIHJldHVybiBhcmc7XG59XG4iLCJsZXQgaW5kZXhDdXJyZW50Q2hhdHNHcm91cCA9IDA7XHJcbmNvbnN0IHBhcmVudFNlbGVjdG9yID0gXCIuYmctdG9rZW4tc2lkZWJhci1zdXJmYWNlLXByaW1hcnlcIjtcclxuY29uc3Qgc3Bpbm5lclNlbGVjdG9yID0gXCIuYW5pbWF0ZS1zcGluXCI7XHJcbmNvbnN0IGNoYXRzR3JvdXBTZWxlY3RvciA9IFwib2xcIjtcclxuY29uc3QgY2hhdHNHcm91cEhlYWRlclNlbGVjdG9yID0gXCIuc3RpY2t5LmJnLXRva2VuLXNpZGViYXItc3VyZmFjZS1wcmltYXJ5LnRvcC0wXCI7XHJcbmxldCBzY3JvbGxhYmxlTGlzdCA9IG51bGw7XHJcbmxldCBpc0NoYXRzT2JzZXJ2ZXJXb3JraW5nID0gZmFsc2U7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVVbmxpc3RlZFNjcmlwdCgoKSA9PiB7XHJcbi8vIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW4gdGhlIGZpcnN0IG9sIGVsZW1lbnQgaXMgZm91bmRcclxuY29uc3QgaGFuZGxlRmlyc3RPbEVsZW1lbnQgPSAob2JzZXJ2ZXIpID0+IHtcclxuICBjb25zdCB0YXJnZXRDaGlsZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCR7cGFyZW50U2VsZWN0b3J9ICR7Y2hhdHNHcm91cFNlbGVjdG9yfWApW2luZGV4Q3VycmVudENoYXRzR3JvdXBdO1xyXG4gIGlmICh0YXJnZXRDaGlsZCkge1xyXG4gICAgdHJ5VG9BZGRTb3J0SWNvbihpbmRleEN1cnJlbnRDaGF0c0dyb3VwKTtcclxuICAgIGluZGV4Q3VycmVudENoYXRzR3JvdXAgKz0gMTtcclxuICAgIHNvcnRDaGF0cyh0YXJnZXRDaGlsZCk7IC8vIFlvdXIgZnVuY3Rpb24gdG8gc29ydCBjaGF0cyBvciBkbyBzb21ldGhpbmcgd2l0aCB0aGUgdGFyZ2V0Q2hpbGRcclxuICAgIGhhbmRsZUNoYXRzTGlzdFNjcm9sbCgpO1xyXG4gICAgaXNDaGF0c09ic2VydmVyV29ya2luZyA9IGZhbHNlO1xyXG4gICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpOyAvLyBEaXNjb25uZWN0IHRoZSBpbml0aWFsIG9ic2VydmVyIGFmdGVyIGZpbmRpbmcgdGhlIGZpcnN0IG9sIGVsZW1lbnRcclxuXHJcbiAgICAvLyBTd2l0Y2ggdG8gdGhlIHNtYWxsZXIgYXJlYSBvYnNlcnZlclxyXG4gICAgc3RhcnRTbWFsbGVyT2JzZXJ2ZXIoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgY29uc29sZS5sb2coJ1RhcmdldCBjaGlsZCBub3QgZm91bmQnKTtcclxuICB9XHJcbn07XHJcblxyXG5mdW5jdGlvbiB0cnlUb0FkZFNvcnRJY29uKGluZGV4R3JvdXApe1xyXG4gIGxldCB0YXJnZXRIZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAke3BhcmVudFNlbGVjdG9yfSAke2NoYXRzR3JvdXBIZWFkZXJTZWxlY3Rvcn1gKVtpbmRleEdyb3VwXTtcclxuICBpZiAodGFyZ2V0SGVhZGVyKSB7XHJcbiAgICBsZXQgaXNFeGlzdFNvcnRJY29uID0gdGFyZ2V0SGVhZGVyLnF1ZXJ5U2VsZWN0b3IoXCIuc29ydC1pY29uXCIpO1xyXG4gICAgaWYgKCFpc0V4aXN0U29ydEljb24pe1xyXG4gICAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICBpbWcuc3JjID0gY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKFwiaWNvbi8xNi5wbmdcIik7XHJcbiAgICAgIGltZy5hbHQgPSBcIlNvcnRcIjtcclxuICAgICAgaW1nLmNsYXNzTmFtZSA9IFwic29ydC1pY29uXCI7XHJcbiAgICAgIGltZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICB0b2dnbGVHcm91cFNvcnREaXJlY3Rpb24oaW5kZXhHcm91cCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGFyZ2V0SGVhZGVyLmFwcGVuZENoaWxkKGltZyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB0b2dnbGVHcm91cFNvcnREaXJlY3Rpb24oaW5kZXhHcm91cCl7XHJcbiAgY29uc3QgZ3JvdXBGb3JTb3J0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgJHtwYXJlbnRTZWxlY3Rvcn0gJHtjaGF0c0dyb3VwU2VsZWN0b3J9YClbaW5kZXhHcm91cF07XHJcbiAgaWYgKGdyb3VwRm9yU29ydCkge1xyXG4gICAgbGV0IHNvcnRJY29uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgJHtwYXJlbnRTZWxlY3Rvcn0gJHtjaGF0c0dyb3VwSGVhZGVyU2VsZWN0b3J9IC5zb3J0LWljb25gKVtpbmRleEdyb3VwXTtcclxuICAgIGlmIChzb3J0SWNvbikge1xyXG4gICAgICBsZXQgbmV3U29ydERpcmVjdGlvbiA9IHNvcnRJY29uLnNyYy5pbmNsdWRlcyhcImRlc2NcIikgPyBcImFzY1wiIDogXCJkZXNjXCI7XHJcbiAgICAgIGxldCBzb3J0SWNvblBhdGggPSAobmV3U29ydERpcmVjdGlvbiA9PT0gXCJhc2NcIikgPyBcImljb24vMTYucG5nXCIgOiBcImljb24vMTZfZGVzYy5wbmdcIjtcclxuXHJcbiAgICAgIHNvcnRJY29uLnNyYyA9IGNocm9tZS5ydW50aW1lLmdldFVSTChzb3J0SWNvblBhdGgpO1xyXG4gICAgICBzb3J0Q2hhdHMoZ3JvdXBGb3JTb3J0LCBuZXdTb3J0RGlyZWN0aW9uKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUNoYXRzTGlzdFNjcm9sbCgpe1xyXG4gIGlmICghc2Nyb2xsYWJsZUxpc3Qpe1xyXG4gICAgc2Nyb2xsYWJsZUxpc3QgPSAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgJHtwYXJlbnRTZWxlY3Rvcn0gLm92ZXJmbG93LXktYXV0b2ApO1xyXG4gICAgaWYgKHNjcm9sbGFibGVMaXN0KXtcclxuICAgICAgc2Nyb2xsYWJsZUxpc3QuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbGV0IHNwaW5uZXJFbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgJHtwYXJlbnRTZWxlY3Rvcn0gJHtzcGlubmVyU2VsZWN0b3J9YClcclxuICAgICAgICBsZXQgaXNTcGlubmVyVmlzaWJsZSA9IChzcGlubmVyRWxlbSAhPSBudWxsKTtcclxuICAgICAgICBpZiAoaXNTcGlubmVyVmlzaWJsZSAmJiAhaXNDaGF0c09ic2VydmVyV29ya2luZyl7XHJcbiAgICAgICAgICAvLyByZXNvcnQgbGFzdCBjaGF0cyBncm91cFxyXG4gICAgICAgICAgaW5kZXhDdXJyZW50Q2hhdHNHcm91cCAtPSAxO1xyXG4gICAgICAgICAgc3RhcnRTbWFsbGVyT2JzZXJ2ZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLy8gVGhpcyBmdW5jdGlvbiBzdGFydHMgdGhlIGZpcnN0IG9ic2VydmVyXHJcbmNvbnN0IHN0YXJ0R2xvYmFsT2JzZXJ2ZXIgPSAoKSA9PiB7XHJcbiAgaWYgKHR5cGVvZiBNdXRhdGlvbk9ic2VydmVyID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgLy8gTG9hZCBhIHBvbHlmaWxsIG9yIGhhbmRsZSB0aGUgbGFjayBvZiBzdXBwb3J0XHJcbiAgfSBlbHNlIHtcclxuICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhtdXRhdGlvbnMpO1xyXG4gICAgICBmb3IgKGxldCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMpIHtcclxuICAgICAgICBpZiAobXV0YXRpb24udHlwZSA9PT0gJ2NoaWxkTGlzdCcpIHtcclxuICAgICAgICAgIGhhbmRsZUZpcnN0T2xFbGVtZW50KG9ic2VydmVyKTtcclxuICAgICAgICAgIGJyZWFrOyAvLyBFeGl0IHRoZSBsb29wIG9uY2UgdGhlIGZpcnN0IGVsZW1lbnQgaXMgZm91bmRcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIE9ic2VydmUgdGhlIHBhcmVudCBjb250YWluZXIgZm9yIGNoaWxkIGFkZGl0aW9uc1xyXG4gICAgY29uc3QgcGFyZW50Q29udGFpbmVyID0gZG9jdW1lbnQuYm9keTtcclxuICAgIGlzQ2hhdHNPYnNlcnZlcldvcmtpbmcgPSB0cnVlO1xyXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShwYXJlbnRDb250YWluZXIsIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIFRoaXMgZnVuY3Rpb24gc3RhcnRzIGEgc2Vjb25kIG9ic2VydmVyIHRvIG1vbml0b3IgdGhlIG5leHQgb2wgZWxlbWVudCBpbiB0aGUgc21hbGxlciBhcmVhXHJcbmNvbnN0IHN0YXJ0U21hbGxlck9ic2VydmVyID0gKCkgPT4ge1xyXG4gIGlmICh0eXBlb2YgTXV0YXRpb25PYnNlcnZlciA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIC8vIExvYWQgYSBwb2x5ZmlsbCBvciBoYW5kbGUgdGhlIGxhY2sgb2Ygc3VwcG9ydFxyXG4gIH0gZWxzZSB7XHJcbiAgICBjb25zdCBzbWFsbGVyT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XHJcbiAgICAgIGZvciAobGV0IG11dGF0aW9uIG9mIG11dGF0aW9ucykge1xyXG4gICAgICAgIGlmIChtdXRhdGlvbi50eXBlID09PSAnY2hpbGRMaXN0Jykge1xyXG4gICAgICAgICAgY29uc3QgbmV4dFRhcmdldENoaWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgJHtwYXJlbnRTZWxlY3Rvcn0gJHtjaGF0c0dyb3VwU2VsZWN0b3J9YClbaW5kZXhDdXJyZW50Q2hhdHNHcm91cF07XHJcbiAgICAgICAgICBpZiAobmV4dFRhcmdldENoaWxkKSB7XHJcbiAgICAgICAgICAgIHRyeVRvQWRkU29ydEljb24oaW5kZXhDdXJyZW50Q2hhdHNHcm91cCk7XHJcbiAgICAgICAgICAgIGluZGV4Q3VycmVudENoYXRzR3JvdXAgKz0gMTtcclxuICAgICAgICAgICAgc29ydENoYXRzKG5leHRUYXJnZXRDaGlsZCk7IC8vIFlvdXIgc29ydGluZyBmdW5jdGlvbiBmb3IgdGhlIG5leHQgdGFyZ2V0Q2hpbGRcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBzcGlubmVyRWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7cGFyZW50U2VsZWN0b3J9ICR7c3Bpbm5lclNlbGVjdG9yfWApXHJcbiAgICAgICAgICAgIGxldCBpc1NwaW5uZXJWaXNpYmxlID0gKHNwaW5uZXJFbGVtICE9IG51bGwpO1xyXG4gICAgICAgICAgICBpZiAoIWlzU3Bpbm5lclZpc2libGUpe1xyXG4gICAgICAgICAgICAgIGlzQ2hhdHNPYnNlcnZlcldvcmtpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICBzbWFsbGVyT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBPYnNlcnZlIHRoZSBzbWFsbGVyIHBhcmVudCBjb250YWluZXIgZm9yIG5leHQgb2wgZWxlbWVudHNcclxuICAgIGNvbnN0IHNtYWxsZXJQYXJlbnRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHBhcmVudFNlbGVjdG9yKTtcclxuICAgIGlmIChzbWFsbGVyUGFyZW50Q29udGFpbmVyKSB7XHJcbiAgICAgIGlzQ2hhdHNPYnNlcnZlcldvcmtpbmcgPSB0cnVlO1xyXG4gICAgICBzbWFsbGVyT2JzZXJ2ZXIub2JzZXJ2ZShzbWFsbGVyUGFyZW50Q29udGFpbmVyLCB7IGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9KTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG4vLyBTdGFydCB0aGUgZmlyc3Qgb2JzZXJ2ZXIgd2l0aCB0aGUgZnVsbCBhcmVhIHNlbGVjdG9yXHJcbnN0YXJ0R2xvYmFsT2JzZXJ2ZXIoKTtcclxuXHJcbmZ1bmN0aW9uIHNvcnRDaGF0cyhjaGF0TGlzdFRvU29ydCwgZGlyZWN0aW9uID0gJ2FzYycpIHtcclxuICAvLyBHZXQgYWxsIHNpZGViYXIgaXRlbXNcclxuICBjb25zdCBpdGVtcyA9IEFycmF5LmZyb20oY2hhdExpc3RUb1NvcnQuY2hpbGRyZW4pO1xyXG5cclxuICAvLyBTb3J0IGl0ZW1zIGFscGhhYmV0aWNhbGx5XHJcbiAgaWYgKGRpcmVjdGlvbiA9PT0gJ2FzYycpIHtcclxuICAgIGl0ZW1zLnNvcnQoKGEsIGIpID0+IGEudGV4dENvbnRlbnQudHJpbSgpLmxvY2FsZUNvbXBhcmUoYi50ZXh0Q29udGVudC50cmltKCkpKTtcclxuICB9XHJcbiAgZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnZGVzYycpIHtcclxuICAgIGl0ZW1zLnNvcnQoKGEsIGIpID0+IGIudGV4dENvbnRlbnQudHJpbSgpLmxvY2FsZUNvbXBhcmUoYS50ZXh0Q29udGVudC50cmltKCkpKTtcclxuICB9XHJcblxyXG4gIC8vIFJlYXR0YWNoIHNvcnRlZCBpdGVtc1xyXG4gIGNoYXRMaXN0VG9Tb3J0LmlubmVySFRNTCA9ICcnO1xyXG4gIGl0ZW1zLmZvckVhY2goaXRlbSA9PiBjaGF0TGlzdFRvU29ydC5hcHBlbmRDaGlsZChpdGVtKSk7XHJcbn1cclxufSkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBTyxXQUFTLHFCQUFxQixLQUFLO0FBQ3hDLFFBQUksT0FBTyxRQUFRLE9BQU8sUUFBUSxXQUFZLFFBQU8sRUFBRSxNQUFNLElBQUs7QUFDbEUsV0FBTztBQUFBLEVBQ1Q7QUNIQSxNQUFJLHlCQUF5QjtBQUM3QixRQUFNLGlCQUFpQjtBQUN2QixRQUFNLGtCQUFrQjtBQUN4QixRQUFNLHFCQUFxQjtBQUMzQixRQUFNLDJCQUEyQjtBQUNqQyxNQUFJLGlCQUFpQjtBQUNyQixNQUFJLHlCQUF5QjtBQUVkLFFBQUEsYUFBQSxxQkFBcUIsTUFBTTtBQUUxQyxVQUFNLHVCQUF1QixDQUFDLGFBQWE7QUFDekMsWUFBTSxjQUFjLFNBQVMsaUJBQWlCLEdBQUcsY0FBYyxJQUFJLGtCQUFrQixFQUFFLEVBQUUsc0JBQXNCO0FBQy9HLFVBQUksYUFBYTtBQUNmLHlCQUFpQixzQkFBc0I7QUFDdkMsa0NBQTBCO0FBQzFCLGtCQUFVLFdBQVc7QUFDckI7QUFDQSxpQ0FBeUI7QUFDekIsaUJBQVMsV0FBVTtBQUduQjtNQUNKLE9BQVM7QUFDTCxnQkFBUSxJQUFJLHdCQUF3QjtBQUFBLE1BQ3JDO0FBQUEsSUFDSDtBQUVBLGFBQVMsaUJBQWlCLFlBQVc7QUFDbkMsVUFBSSxlQUFlLFNBQVMsaUJBQWlCLEdBQUcsY0FBYyxJQUFJLHdCQUF3QixFQUFFLEVBQUUsVUFBVTtBQUN4RyxVQUFJLGNBQWM7QUFDaEIsWUFBSSxrQkFBa0IsYUFBYSxjQUFjLFlBQVk7QUFDN0QsWUFBSSxDQUFDLGlCQUFnQjtBQUNuQixnQkFBTSxNQUFNLFNBQVMsY0FBYyxLQUFLO0FBQ3hDLGNBQUksTUFBTSxPQUFPLFFBQVEsT0FBTyxhQUFhO0FBQzdDLGNBQUksTUFBTTtBQUNWLGNBQUksWUFBWTtBQUNoQixjQUFJLGlCQUFpQixTQUFTLE1BQU07QUFDbEMscUNBQXlCLFVBQVU7QUFBQSxVQUMzQyxDQUFPO0FBRUQsdUJBQWEsWUFBWSxHQUFHO0FBQUEsUUFDN0I7QUFBQSxNQUNGO0FBQUEsSUFDSDtBQUVBLGFBQVMseUJBQXlCLFlBQVc7QUFDM0MsWUFBTSxlQUFlLFNBQVMsaUJBQWlCLEdBQUcsY0FBYyxJQUFJLGtCQUFrQixFQUFFLEVBQUUsVUFBVTtBQUNwRyxVQUFJLGNBQWM7QUFDaEIsWUFBSSxXQUFXLFNBQVMsaUJBQWlCLEdBQUcsY0FBYyxJQUFJLHdCQUF3QixhQUFhLEVBQUUsVUFBVTtBQUMvRyxZQUFJLFVBQVU7QUFDWixjQUFJLG1CQUFtQixTQUFTLElBQUksU0FBUyxNQUFNLElBQUksUUFBUTtBQUMvRCxjQUFJLGVBQWdCLHFCQUFxQixRQUFTLGdCQUFnQjtBQUVsRSxtQkFBUyxNQUFNLE9BQU8sUUFBUSxPQUFPLFlBQVk7QUFDakQsb0JBQVUsY0FBYyxnQkFBZ0I7QUFBQSxRQUN6QztBQUFBLE1BQ0Y7QUFBQSxJQUNIO0FBRUEsYUFBUyx3QkFBdUI7QUFDOUIsVUFBSSxDQUFDLGdCQUFlO0FBQ2xCLHlCQUFrQixTQUFTLGNBQWMsR0FBRyxjQUFjLG1CQUFtQjtBQUM3RSxZQUFJLGdCQUFlO0FBQ2pCLHlCQUFlLGlCQUFpQixVQUFVLFdBQVk7QUFDcEQsZ0JBQUksY0FBYyxTQUFTLGNBQWMsR0FBRyxjQUFjLElBQUksZUFBZSxFQUFFO0FBQy9FLGdCQUFJLG1CQUFvQixlQUFlO0FBQ3ZDLGdCQUFJLG9CQUFvQixDQUFDLHdCQUF1QjtBQUU5Qyx3Q0FBMEI7QUFDMUI7WUFDRDtBQUFBLFVBQ1QsQ0FBTztBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDSDtBQUdBLFVBQU0sc0JBQXNCLE1BQU07QUFDaEMsVUFBSSxPQUFPLHFCQUFxQixZQUFhO0FBQUEsV0FFdEM7QUFDTCxjQUFNLFdBQVcsSUFBSSxpQkFBaUIsQ0FBQyxjQUFjO0FBQ25ELGtCQUFRLElBQUksU0FBUztBQUNyQixtQkFBUyxZQUFZLFdBQVc7QUFDOUIsZ0JBQUksU0FBUyxTQUFTLGFBQWE7QUFDakMsbUNBQXFCLFFBQVE7QUFDN0I7QUFBQSxZQUNEO0FBQUEsVUFDRjtBQUFBLFFBQ1AsQ0FBSztBQUdELGNBQU0sa0JBQWtCLFNBQVM7QUFDakMsaUNBQXlCO0FBQ3pCLGlCQUFTLFFBQVEsaUJBQWlCLEVBQUUsV0FBVyxNQUFNLFNBQVMsS0FBSSxDQUFFO0FBQUEsTUFDckU7QUFBQSxJQUNIO0FBR0EsVUFBTSx1QkFBdUIsTUFBTTtBQUNqQyxVQUFJLE9BQU8scUJBQXFCLFlBQWE7QUFBQSxXQUV0QztBQUNMLGNBQU0sa0JBQWtCLElBQUksaUJBQWlCLENBQUMsY0FBYztBQUMxRCxtQkFBUyxZQUFZLFdBQVc7QUFDOUIsZ0JBQUksU0FBUyxTQUFTLGFBQWE7QUFDakMsb0JBQU0sa0JBQWtCLFNBQVMsaUJBQWlCLEdBQUcsY0FBYyxJQUFJLGtCQUFrQixFQUFFLEVBQUUsc0JBQXNCO0FBQ25ILGtCQUFJLGlCQUFpQjtBQUNuQixpQ0FBaUIsc0JBQXNCO0FBQ3ZDLDBDQUEwQjtBQUMxQiwwQkFBVSxlQUFlO0FBQUEsY0FDckMsT0FBaUI7QUFDTCxvQkFBSSxjQUFjLFNBQVMsY0FBYyxHQUFHLGNBQWMsSUFBSSxlQUFlLEVBQUU7QUFDL0Usb0JBQUksbUJBQW9CLGVBQWU7QUFDdkMsb0JBQUksQ0FBQyxrQkFBaUI7QUFDcEIsMkNBQXlCO0FBQ3pCLGtDQUFnQixXQUFVO0FBQUEsZ0JBQzNCO0FBQUEsY0FDRjtBQUFBLFlBQ0Y7QUFBQSxVQUNGO0FBQUEsUUFDUCxDQUFLO0FBR0QsY0FBTSx5QkFBeUIsU0FBUyxjQUFjLGNBQWM7QUFDcEUsWUFBSSx3QkFBd0I7QUFDMUIsbUNBQXlCO0FBQ3pCLDBCQUFnQixRQUFRLHdCQUF3QixFQUFFLFdBQVcsTUFBTSxTQUFTLEtBQUksQ0FBRTtBQUFBLFFBQ25GO0FBQUEsTUFDRjtBQUFBLElBQ0g7QUFHQTtBQUVBLGFBQVMsVUFBVSxnQkFBZ0IsWUFBWSxPQUFPO0FBRXBELFlBQU0sUUFBUSxNQUFNLEtBQUssZUFBZSxRQUFRO0FBR2hELFVBQUksY0FBYyxPQUFPO0FBQ3ZCLGNBQU0sS0FBSyxDQUFDLEdBQUcsTUFBTSxFQUFFLFlBQVksS0FBTSxFQUFDLGNBQWMsRUFBRSxZQUFZLEtBQUksQ0FBRSxDQUFDO0FBQUEsTUFDOUUsV0FDUSxjQUFjLFFBQVE7QUFDN0IsY0FBTSxLQUFLLENBQUMsR0FBRyxNQUFNLEVBQUUsWUFBWSxLQUFNLEVBQUMsY0FBYyxFQUFFLFlBQVksS0FBSSxDQUFFLENBQUM7QUFBQSxNQUM5RTtBQUdELHFCQUFlLFlBQVk7QUFDM0IsWUFBTSxRQUFRLFVBQVEsZUFBZSxZQUFZLElBQUksQ0FBQztBQUFBLElBQ3hEO0FBQUEsRUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswXX0=
