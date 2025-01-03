import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  manifest: {
    name: "Sort chatgpt chats",
    description: "Browser extension script that sorts ChatGPT chats in the left panel alphabetically for easier navigation and better organization.",
    version: "1.0",
    permissions: ["scripting", "activeTab"],
    host_permissions: ["https://chatgpt.com/*"],
    content_scripts: [
      {
        matches: ["https://chatgpt.com/*"],
        js: ["contentScript.js"],
        run_at: "document_end",
        css: ["styles.css"]
      }
    ],
    icons: {
      16: "icon/16.png",
      32: "icon/32.png",
      48: "icon/48.png",
      128: "icon/128.png"
    },
    action: {
      default_title: "Sort chatgpt chats",
      default_icon: {
        16: "icon/16.png",
        32: "icon/32.png",
        48: "icon/48.png",
        128: "icon/128.png"
      }
    }
  }
});
