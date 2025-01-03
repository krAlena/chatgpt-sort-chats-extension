var contentscript = function() {
  "use strict";
  function defineUnlistedScript(arg) {
    if (arg == null || typeof arg === "function") return { main: arg };
    return arg;
  }
  let indexCurrentOl = 0;
  const parentSelector = ".bg-token-sidebar-surface-primary";
  const spinnerSelector = ".animate-spin";
  const chatsGroupForSortSelector = "ol";
  let scrollableList = null;
  let isChatsObserverWorking = false;
  const definition = defineUnlistedScript(() => {
    const handleFirstOlElement = (observer) => {
      const targetChild = document.querySelectorAll(`${parentSelector} ${chatsGroupForSortSelector}`)[indexCurrentOl];
      if (targetChild) {
        indexCurrentOl += 1;
        sortChats(targetChild);
        handleChatsListScroll();
        isChatsObserverWorking = false;
        observer.disconnect();
        startSmallerObserver();
      } else {
        console.log("Target child not found");
      }
    };
    function handleChatsListScroll() {
      if (!scrollableList) {
        scrollableList = document.querySelector(`${parentSelector} .overflow-y-auto`);
        if (scrollableList) {
          scrollableList.addEventListener("scroll", function() {
            let spinnerElem = document.querySelector(`${parentSelector} ${spinnerSelector}`);
            let isSpinnerVisible = spinnerElem != null;
            if (isSpinnerVisible && !isChatsObserverWorking) {
              indexCurrentOl -= 1;
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
              const nextTargetChild = document.querySelectorAll(`${parentSelector} ${chatsGroupForSortSelector}`)[indexCurrentOl];
              if (nextTargetChild) {
                indexCurrentOl += 1;
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
    function sortChats(chatListToSort) {
      const items = Array.from(chatListToSort.children);
      items.sort((a, b) => a.textContent.trim().localeCompare(b.textContent.trim()));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudFNjcmlwdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3NhbmRib3gvZGVmaW5lLXVubGlzdGVkLXNjcmlwdC5tanMiLCIuLi8uLi9lbnRyeXBvaW50cy9jb250ZW50U2NyaXB0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBkZWZpbmVVbmxpc3RlZFNjcmlwdChhcmcpIHtcbiAgaWYgKGFyZyA9PSBudWxsIHx8IHR5cGVvZiBhcmcgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHsgbWFpbjogYXJnIH07XG4gIHJldHVybiBhcmc7XG59XG4iLCJsZXQgaW5kZXhDdXJyZW50T2wgPSAwO1xyXG5jb25zdCBwYXJlbnRTZWxlY3RvciA9IFwiLmJnLXRva2VuLXNpZGViYXItc3VyZmFjZS1wcmltYXJ5XCI7XHJcbmNvbnN0IHNwaW5uZXJTZWxlY3RvciA9IFwiLmFuaW1hdGUtc3BpblwiO1xyXG5jb25zdCBjaGF0c0dyb3VwRm9yU29ydFNlbGVjdG9yID0gXCJvbFwiO1xyXG5sZXQgc2Nyb2xsYWJsZUxpc3QgPSBudWxsO1xyXG5sZXQgaXNDaGF0c09ic2VydmVyV29ya2luZyA9IGZhbHNlO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lVW5saXN0ZWRTY3JpcHQoKCkgPT4ge1xyXG4vLyBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuIHRoZSBmaXJzdCBvbCBlbGVtZW50IGlzIGZvdW5kXHJcbmNvbnN0IGhhbmRsZUZpcnN0T2xFbGVtZW50ID0gKG9ic2VydmVyKSA9PiB7XHJcbiAgY29uc3QgdGFyZ2V0Q2hpbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAke3BhcmVudFNlbGVjdG9yfSAke2NoYXRzR3JvdXBGb3JTb3J0U2VsZWN0b3J9YClbaW5kZXhDdXJyZW50T2xdO1xyXG4gIGlmICh0YXJnZXRDaGlsZCkge1xyXG4gICAgaW5kZXhDdXJyZW50T2wgKz0gMTtcclxuICAgIHNvcnRDaGF0cyh0YXJnZXRDaGlsZCk7IC8vIFlvdXIgZnVuY3Rpb24gdG8gc29ydCBjaGF0cyBvciBkbyBzb21ldGhpbmcgd2l0aCB0aGUgdGFyZ2V0Q2hpbGRcclxuICAgIGhhbmRsZUNoYXRzTGlzdFNjcm9sbCgpO1xyXG4gICAgaXNDaGF0c09ic2VydmVyV29ya2luZyA9IGZhbHNlO1xyXG4gICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpOyAvLyBEaXNjb25uZWN0IHRoZSBpbml0aWFsIG9ic2VydmVyIGFmdGVyIGZpbmRpbmcgdGhlIGZpcnN0IG9sIGVsZW1lbnRcclxuXHJcbiAgICAvLyBTd2l0Y2ggdG8gdGhlIHNtYWxsZXIgYXJlYSBvYnNlcnZlclxyXG4gICAgc3RhcnRTbWFsbGVyT2JzZXJ2ZXIoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgY29uc29sZS5sb2coJ1RhcmdldCBjaGlsZCBub3QgZm91bmQnKTtcclxuICB9XHJcbn07XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVDaGF0c0xpc3RTY3JvbGwoKXtcclxuICBpZiAoIXNjcm9sbGFibGVMaXN0KXtcclxuICAgIHNjcm9sbGFibGVMaXN0ID0gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7cGFyZW50U2VsZWN0b3J9IC5vdmVyZmxvdy15LWF1dG9gKTtcclxuICAgIGlmIChzY3JvbGxhYmxlTGlzdCl7XHJcbiAgICAgIHNjcm9sbGFibGVMaXN0LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGxldCBzcGlubmVyRWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7cGFyZW50U2VsZWN0b3J9ICR7c3Bpbm5lclNlbGVjdG9yfWApXHJcbiAgICAgICAgbGV0IGlzU3Bpbm5lclZpc2libGUgPSAoc3Bpbm5lckVsZW0gIT0gbnVsbCk7XHJcbiAgICAgICAgaWYgKGlzU3Bpbm5lclZpc2libGUgJiYgIWlzQ2hhdHNPYnNlcnZlcldvcmtpbmcpe1xyXG4gICAgICAgICAgLy8gcmVzb3J0IGxhc3QgY2hhdHMgZ3JvdXBcclxuICAgICAgICAgIGluZGV4Q3VycmVudE9sIC09IDE7XHJcbiAgICAgICAgICBzdGFydFNtYWxsZXJPYnNlcnZlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vLyBUaGlzIGZ1bmN0aW9uIHN0YXJ0cyB0aGUgZmlyc3Qgb2JzZXJ2ZXJcclxuY29uc3Qgc3RhcnRHbG9iYWxPYnNlcnZlciA9ICgpID0+IHtcclxuICBpZiAodHlwZW9mIE11dGF0aW9uT2JzZXJ2ZXIgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAvLyBMb2FkIGEgcG9seWZpbGwgb3IgaGFuZGxlIHRoZSBsYWNrIG9mIHN1cHBvcnRcclxuICB9IGVsc2Uge1xyXG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKG11dGF0aW9ucyk7XHJcbiAgICAgIGZvciAobGV0IG11dGF0aW9uIG9mIG11dGF0aW9ucykge1xyXG4gICAgICAgIGlmIChtdXRhdGlvbi50eXBlID09PSAnY2hpbGRMaXN0Jykge1xyXG4gICAgICAgICAgaGFuZGxlRmlyc3RPbEVsZW1lbnQob2JzZXJ2ZXIpO1xyXG4gICAgICAgICAgYnJlYWs7IC8vIEV4aXQgdGhlIGxvb3Agb25jZSB0aGUgZmlyc3QgZWxlbWVudCBpcyBmb3VuZFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gT2JzZXJ2ZSB0aGUgcGFyZW50IGNvbnRhaW5lciBmb3IgY2hpbGQgYWRkaXRpb25zXHJcbiAgICBjb25zdCBwYXJlbnRDb250YWluZXIgPSBkb2N1bWVudC5ib2R5O1xyXG4gICAgaXNDaGF0c09ic2VydmVyV29ya2luZyA9IHRydWU7XHJcbiAgICBvYnNlcnZlci5vYnNlcnZlKHBhcmVudENvbnRhaW5lciwgeyBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gVGhpcyBmdW5jdGlvbiBzdGFydHMgYSBzZWNvbmQgb2JzZXJ2ZXIgdG8gbW9uaXRvciB0aGUgbmV4dCBvbCBlbGVtZW50IGluIHRoZSBzbWFsbGVyIGFyZWFcclxuY29uc3Qgc3RhcnRTbWFsbGVyT2JzZXJ2ZXIgPSAoKSA9PiB7XHJcbiAgaWYgKHR5cGVvZiBNdXRhdGlvbk9ic2VydmVyID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgLy8gTG9hZCBhIHBvbHlmaWxsIG9yIGhhbmRsZSB0aGUgbGFjayBvZiBzdXBwb3J0XHJcbiAgfSBlbHNlIHtcclxuICAgIGNvbnN0IHNtYWxsZXJPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcclxuICAgICAgZm9yIChsZXQgbXV0YXRpb24gb2YgbXV0YXRpb25zKSB7XHJcbiAgICAgICAgaWYgKG11dGF0aW9uLnR5cGUgPT09ICdjaGlsZExpc3QnKSB7XHJcbiAgICAgICAgICBjb25zdCBuZXh0VGFyZ2V0Q2hpbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAke3BhcmVudFNlbGVjdG9yfSAke2NoYXRzR3JvdXBGb3JTb3J0U2VsZWN0b3J9YClbaW5kZXhDdXJyZW50T2xdO1xyXG4gICAgICAgICAgaWYgKG5leHRUYXJnZXRDaGlsZCkge1xyXG4gICAgICAgICAgICBpbmRleEN1cnJlbnRPbCArPSAxO1xyXG4gICAgICAgICAgICBzb3J0Q2hhdHMobmV4dFRhcmdldENoaWxkKTsgLy8gWW91ciBzb3J0aW5nIGZ1bmN0aW9uIGZvciB0aGUgbmV4dCB0YXJnZXRDaGlsZFxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHNwaW5uZXJFbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgJHtwYXJlbnRTZWxlY3Rvcn0gJHtzcGlubmVyU2VsZWN0b3J9YClcclxuICAgICAgICAgICAgbGV0IGlzU3Bpbm5lclZpc2libGUgPSAoc3Bpbm5lckVsZW0gIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIGlmICghaXNTcGlubmVyVmlzaWJsZSl7XHJcbiAgICAgICAgICAgICAgaXNDaGF0c09ic2VydmVyV29ya2luZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgIHNtYWxsZXJPYnNlcnZlci5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIE9ic2VydmUgdGhlIHNtYWxsZXIgcGFyZW50IGNvbnRhaW5lciBmb3IgbmV4dCBvbCBlbGVtZW50c1xyXG4gICAgY29uc3Qgc21hbGxlclBhcmVudENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocGFyZW50U2VsZWN0b3IpO1xyXG4gICAgaWYgKHNtYWxsZXJQYXJlbnRDb250YWluZXIpIHtcclxuICAgICAgaXNDaGF0c09ic2VydmVyV29ya2luZyA9IHRydWU7XHJcbiAgICAgIHNtYWxsZXJPYnNlcnZlci5vYnNlcnZlKHNtYWxsZXJQYXJlbnRDb250YWluZXIsIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbi8vIFN0YXJ0IHRoZSBmaXJzdCBvYnNlcnZlciB3aXRoIHRoZSBmdWxsIGFyZWEgc2VsZWN0b3Jcclxuc3RhcnRHbG9iYWxPYnNlcnZlcigpO1xyXG5cclxuZnVuY3Rpb24gc29ydENoYXRzKGNoYXRMaXN0VG9Tb3J0KSB7XHJcbiAgLy8gR2V0IGFsbCBzaWRlYmFyIGl0ZW1zXHJcbiAgY29uc3QgaXRlbXMgPSBBcnJheS5mcm9tKGNoYXRMaXN0VG9Tb3J0LmNoaWxkcmVuKTtcclxuXHJcbiAgLy8gU29ydCBpdGVtcyBhbHBoYWJldGljYWxseVxyXG4gIGl0ZW1zLnNvcnQoKGEsIGIpID0+IGEudGV4dENvbnRlbnQudHJpbSgpLmxvY2FsZUNvbXBhcmUoYi50ZXh0Q29udGVudC50cmltKCkpKTtcclxuXHJcbiAgLy8gUmVhdHRhY2ggc29ydGVkIGl0ZW1zXHJcbiAgY2hhdExpc3RUb1NvcnQuaW5uZXJIVE1MID0gJyc7XHJcbiAgaXRlbXMuZm9yRWFjaChpdGVtID0+IGNoYXRMaXN0VG9Tb3J0LmFwcGVuZENoaWxkKGl0ZW0pKTtcclxufVxyXG59KSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFPLFdBQVMscUJBQXFCLEtBQUs7QUFDeEMsUUFBSSxPQUFPLFFBQVEsT0FBTyxRQUFRLFdBQVksUUFBTyxFQUFFLE1BQU0sSUFBSztBQUNsRSxXQUFPO0FBQUEsRUFDVDtBQ0hBLE1BQUksaUJBQWlCO0FBQ3JCLFFBQU0saUJBQWlCO0FBQ3ZCLFFBQU0sa0JBQWtCO0FBQ3hCLFFBQU0sNEJBQTRCO0FBQ2xDLE1BQUksaUJBQWlCO0FBQ3JCLE1BQUkseUJBQXlCO0FBRWQsUUFBQSxhQUFBLHFCQUFxQixNQUFNO0FBRTFDLFVBQU0sdUJBQXVCLENBQUMsYUFBYTtBQUN6QyxZQUFNLGNBQWMsU0FBUyxpQkFBaUIsR0FBRyxjQUFjLElBQUkseUJBQXlCLEVBQUUsRUFBRSxjQUFjO0FBQzlHLFVBQUksYUFBYTtBQUNmLDBCQUFrQjtBQUNsQixrQkFBVSxXQUFXO0FBQ3JCO0FBQ0EsaUNBQXlCO0FBQ3pCLGlCQUFTLFdBQVU7QUFHbkI7TUFDSixPQUFTO0FBQ0wsZ0JBQVEsSUFBSSx3QkFBd0I7QUFBQSxNQUNyQztBQUFBLElBQ0g7QUFFQSxhQUFTLHdCQUF1QjtBQUM5QixVQUFJLENBQUMsZ0JBQWU7QUFDbEIseUJBQWtCLFNBQVMsY0FBYyxHQUFHLGNBQWMsbUJBQW1CO0FBQzdFLFlBQUksZ0JBQWU7QUFDakIseUJBQWUsaUJBQWlCLFVBQVUsV0FBWTtBQUNwRCxnQkFBSSxjQUFjLFNBQVMsY0FBYyxHQUFHLGNBQWMsSUFBSSxlQUFlLEVBQUU7QUFDL0UsZ0JBQUksbUJBQW9CLGVBQWU7QUFDdkMsZ0JBQUksb0JBQW9CLENBQUMsd0JBQXVCO0FBRTlDLGdDQUFrQjtBQUNsQjtZQUNEO0FBQUEsVUFDVCxDQUFPO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNIO0FBR0EsVUFBTSxzQkFBc0IsTUFBTTtBQUNoQyxVQUFJLE9BQU8scUJBQXFCLFlBQWE7QUFBQSxXQUV0QztBQUNMLGNBQU0sV0FBVyxJQUFJLGlCQUFpQixDQUFDLGNBQWM7QUFDbkQsa0JBQVEsSUFBSSxTQUFTO0FBQ3JCLG1CQUFTLFlBQVksV0FBVztBQUM5QixnQkFBSSxTQUFTLFNBQVMsYUFBYTtBQUNqQyxtQ0FBcUIsUUFBUTtBQUM3QjtBQUFBLFlBQ0Q7QUFBQSxVQUNGO0FBQUEsUUFDUCxDQUFLO0FBR0QsY0FBTSxrQkFBa0IsU0FBUztBQUNqQyxpQ0FBeUI7QUFDekIsaUJBQVMsUUFBUSxpQkFBaUIsRUFBRSxXQUFXLE1BQU0sU0FBUyxLQUFJLENBQUU7QUFBQSxNQUNyRTtBQUFBLElBQ0g7QUFHQSxVQUFNLHVCQUF1QixNQUFNO0FBQ2pDLFVBQUksT0FBTyxxQkFBcUIsWUFBYTtBQUFBLFdBRXRDO0FBQ0wsY0FBTSxrQkFBa0IsSUFBSSxpQkFBaUIsQ0FBQyxjQUFjO0FBQzFELG1CQUFTLFlBQVksV0FBVztBQUM5QixnQkFBSSxTQUFTLFNBQVMsYUFBYTtBQUNqQyxvQkFBTSxrQkFBa0IsU0FBUyxpQkFBaUIsR0FBRyxjQUFjLElBQUkseUJBQXlCLEVBQUUsRUFBRSxjQUFjO0FBQ2xILGtCQUFJLGlCQUFpQjtBQUNuQixrQ0FBa0I7QUFDbEIsMEJBQVUsZUFBZTtBQUFBLGNBQ3JDLE9BQWlCO0FBQ0wsb0JBQUksY0FBYyxTQUFTLGNBQWMsR0FBRyxjQUFjLElBQUksZUFBZSxFQUFFO0FBQy9FLG9CQUFJLG1CQUFvQixlQUFlO0FBQ3ZDLG9CQUFJLENBQUMsa0JBQWlCO0FBQ3BCLDJDQUF5QjtBQUN6QixrQ0FBZ0IsV0FBVTtBQUFBLGdCQUMzQjtBQUFBLGNBQ0Y7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFFBQ1AsQ0FBSztBQUdELGNBQU0seUJBQXlCLFNBQVMsY0FBYyxjQUFjO0FBQ3BFLFlBQUksd0JBQXdCO0FBQzFCLG1DQUF5QjtBQUN6QiwwQkFBZ0IsUUFBUSx3QkFBd0IsRUFBRSxXQUFXLE1BQU0sU0FBUyxLQUFJLENBQUU7QUFBQSxRQUNuRjtBQUFBLE1BQ0Y7QUFBQSxJQUNIO0FBR0E7QUFFQSxhQUFTLFVBQVUsZ0JBQWdCO0FBRWpDLFlBQU0sUUFBUSxNQUFNLEtBQUssZUFBZSxRQUFRO0FBR2hELFlBQU0sS0FBSyxDQUFDLEdBQUcsTUFBTSxFQUFFLFlBQVksS0FBTSxFQUFDLGNBQWMsRUFBRSxZQUFZLEtBQUksQ0FBRSxDQUFDO0FBRzdFLHFCQUFlLFlBQVk7QUFDM0IsWUFBTSxRQUFRLFVBQVEsZUFBZSxZQUFZLElBQUksQ0FBQztBQUFBLElBQ3hEO0FBQUEsRUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswXX0=
