export const chatGptConversationFixture = {
  conversation_id: 'chatgpt-conversation-1',
  title: 'Synthetic ChatGPT conversation',
  create_time: 1767225600,
  update_time: 1767225660,
  mapping: {
    root: { id: 'root', message: null },
    user: {
      id: 'message-user',
      parent: 'root',
      message: {
        id: 'message-user',
        author: { role: 'user' },
        create_time: 1767225601,
        content: { parts: ['Hello from a synthetic fixture'] },
      },
    },
    assistant: {
      id: 'message-assistant',
      parent: 'message-user',
      message: {
        id: 'message-assistant',
        author: { role: 'assistant' },
        create_time: 1767225602,
        content: { parts: ['Hello.'] },
      },
    },
  },
};

export const chatGptListFixture = [
  {
    id: 'chatgpt-conversation-1',
    title: 'Synthetic ChatGPT conversation',
    update_time: 1767225660,
  },
];
