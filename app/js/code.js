import hljs from 'highlight.js';

export function highlightCodeBlocks() {
  let blocks = document.querySelectorAll('pre[class="highlight"] code');

  for (let i = 0; i < blocks.length; i++) {
    hljs.highlightBlock(blocks[i]);
  }
}
