(function injectGlobalFooter() {
  // 1. Prevent duplicate injections on the same page
  if (document.getElementById('jocatools-global-footer')) return;

  // 2. Create the footer container
  const footer = document.createElement('footer');
  footer.id = 'jocatools-global-footer';

  // 3. Define the styles and HTML
  footer.innerHTML = `
    <style>
      #jocatools-global-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 40px; 
        background: black;
        border-top: 1px solid var(--line);
        font-family: var(--sans);
        font-size: 11.5px;
        color: var(--text-2);
        flex-shrink: 0;
        z-index: 50;
        position: relative;
      }
      .jcf-left a {
        color: var(--text-1);
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: color 0.15s ease;
        font-weight: 500;
      }
      .jcf-left a:hover {
        color: var(--accent);
      }
      .jcf-left svg {
        width: 18px;
        height: 18px;
        color: #FF5E5B; 
      }
      .jcf-right {
        text-align: right;
        line-height: 1.55;
      }
      .jcf-highlight {
        color: var(--text-0);
        font-weight: 600;
      }

      /* Close Button Styles */
      .jcf-close {
        position: absolute;
        top: 3px;
        right: 12px;
        background: transparent;
        border: none;
        color: var(--text-2);
        font-size: 20px;
        cursor: pointer;
        line-height: 1;
        padding: 4px;
        border-radius: 4px;
        transition: color 0.15s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .jcf-close:hover {
        color: var(--text-0);
      }
      
      @media (max-width: 700px) {
        #jocatools-global-footer {
          flex-direction: column;
          gap: 0px;
          text-align: center;
          padding: 24px 16px 16px 16px;
        }
        .jcf-right { 
          text-align: center; 
        }
      }

      @media print {
        #jocatools-global-footer { display: none !important; }
      }
    </style>

    <div class="jcf-left">
      <a href="https://ko-fi.com/YOUR_USERNAME" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.143V12.42s2.617-.23 3.491-1.28c.875-1.049 1.95-3.355 1.558-4.945zm-7.66 4.638c-.023 1.05-.889 1.942-2.316 2.05-3.518.026-10.748.04-10.748.04s-1.18-.04-1.28-1.503c-.05-1.127-.04-6.417-.04-6.417s.02-1.05 1.34-1.05h10.985c.874 0 1.25.9 1.25 1.704v5.176zm3.504-2.887c-.456.634-1.298.924-2.31.97v-4.14c1.196.02 2.115.176 2.573.744.457.568.647 1.35.193 2.116z"/></svg>
        Please consider supporting me on Ko-fi
      </a>
    </div>

    <div class="jcf-right">
      No accounts. No subscriptions. No paywalls. No ads. No data tracking.<br>
      <span class="jcf-highlight">Just tools that work.</span>
    </div>

    <button class="jcf-close" id="jcf-close-btn" aria-label="Hide footer" title="Hide footer">&times;</button>
  `;

  // 4. Inject into the DOM
  const appContainer = document.getElementById('app');
  if (appContainer) {
    appContainer.appendChild(footer);
  } else {
    document.body.appendChild(footer);
  }

  // 5. Add the close button functionality (Temporary removal)
  document.getElementById('jcf-close-btn').addEventListener('click', () => {
    footer.remove();
  });
})();