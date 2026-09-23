import { PRODUCT_NAME } from '../../config';
import './style.css';

document.querySelector('#app')!.innerHTML = `
  <h1>${PRODUCT_NAME}</h1>
  <p>Your chat data stays on this device.</p>
  <button id="check-chatgpt">Check ChatGPT</button>
  <p id="status">Open ChatGPT, then check its accessible conversations.</p>
`;

const status = document.querySelector<HTMLParagraphElement>('#status');
document
  .querySelector<HTMLButtonElement>('#check-chatgpt')
  ?.addEventListener('click', async () => {
    if (!status) return;
    status.textContent = 'Checking ChatGPT...';
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const activeTab = tab;
    if (
      !activeTab?.id ||
      (!activeTab.url?.includes('chatgpt.com') &&
        !activeTab.url?.includes('chat.openai.com'))
    ) {
      status.textContent = 'Open ChatGPT in the active tab first.';
      return;
    }
    try {
      const response = await chrome.tabs.sendMessage<
        { type: 'chatgpt.list' },
        { items: unknown[]; error?: string }
      >(activeTab.id, { type: 'chatgpt.list' });
      status.textContent = response.error
        ? `ChatGPT error: ${response.error}`
        : `${response.items.length} conversations are accessible.`;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown browser error';
      status.textContent = `ChatGPT bridge error: ${message}`;
    }
  });
