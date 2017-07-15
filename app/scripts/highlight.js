import highlight from 'highlight.js/lib/highlight'

highlight.registerLanguage('php', require('highlight.js/lib/languages/php'))
highlight.registerLanguage('json', require('highlight.js/lib/languages/json'))
highlight.registerLanguage('yaml', require('highlight.js/lib/languages/yaml'))
highlight.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'))
highlight.registerLanguage('coffeescript', require('highlight.js/lib/languages/coffeescript'))
highlight.registerLanguage('apache', require('highlight.js/lib/languages/apache'))
highlight.registerLanguage('bash', require('highlight.js/lib/languages/bash'))
highlight.registerLanguage('css', require('highlight.js/lib/languages/css'))
highlight.registerLanguage('xml', require('highlight.js/lib/languages/xml'))
highlight.registerLanguage('sql', require('highlight.js/lib/languages/sql'))
highlight.registerLanguage('lisp', require('highlight.js/lib/languages/lisp'))

highlight.configure({
  languages: [
    'php',
    'js',
    'json',
    'yaml',
    'coffee',
    'apache',
    'bash',
    'css',
    'sql',
    'xml',
    'lisp'
  ]
})

export default function () {
  let blocks = document.querySelectorAll('pre[class="highlight"] code')
  for (let i = 0; i < blocks.length; i++) {
    highlight.highlightBlock(blocks[i])
  }
}
