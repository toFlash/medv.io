import hljs from 'highlight.js';

export function highlightCodeBlocks() {
  hljs.configure({
    languages: ['php', 'js', 'coffee', 'apache', 'bash', 'css', 'html', 'lisp']
  });

  let blocks = document.querySelectorAll('pre[class="highlight"] code');
  for (let i = 0; i < blocks.length; i++) {
    hljs.highlightBlock(blocks[i]);
  }
}
