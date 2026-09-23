import { PRODUCT_NAME } from '../../config';
import './style.css';

document.querySelector('#app')!.innerHTML = `
  <h1>${PRODUCT_NAME}</h1>
  <p>Your chat data stays on this device.</p>
  <p>Open a supported chatbot service to check its backup status.</p>
`;
