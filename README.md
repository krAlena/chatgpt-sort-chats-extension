# ChatGPT dialogs sorter

**Chats' sorter**  is a cross-browser extension that automatically sorts chat messages alphabetically. It uses an injected script to trigger sorting when the start page loads or the chat list is scrolled.
The extension operates without a visual popup. The extension is developed using [WXT](https://github.com/wxt-dev/wxt). This project supports both **Manifest V2** and **Manifest V3**, enabling compatibility across multiple browsers, including Chrome and Firefox.

## Features

- Cross-browser support.
- Dual Manifest compatibility:
  - **Manifest V2** (for Firefox).
  - **Manifest V3** (for Chrome and Chromium-based browsers).

## Technologies Used

- **WXT**: Simplifies the extension development workflow.
- **JavaScript/TypeScript**: Core scripting language.
- **WebExtensions API**: For consistent browser extension development.

## How to Use

### Development
1. Clone the repository:
git clone [https://github.com/krAlena/chatgpt-sort-chats-extension](https://github.com/krAlena/chatgpt-sort-chats-extension)
cd web-notes-ext
2. Run in development mode:
wxt
(will open the chrome browser automaticly)

### Manual extension installation
The output files will be located in the ".output" directory.

1. **Chrome/Edge**:
- Navigate to chrome://extensions/ or edge://extensions/.
- Enable Developer mode.
- Click Load unpacked and select the folder (.output/chrome-mv3).
2. **Firefox**:
- Open about:debugging#/runtime/this-firefox.
- Click Load Temporary Add-on and select the manifest.json file from .output/firefox-mv2.