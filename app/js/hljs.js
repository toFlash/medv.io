var hljs = require('./highlight.js/highlight');

hljs.registerLanguage('php', require('./highlight.js/languages/php'));
hljs.registerLanguage('json', require('./highlight.js/languages/json'));
hljs.registerLanguage('yaml', require('./highlight.js/languages/yaml'));
hljs.registerLanguage('javascript', require('./highlight.js/languages/javascript'));
hljs.registerLanguage('coffeescript', require('./highlight.js/languages/coffeescript'));
hljs.registerLanguage('apache', require('./highlight.js/languages/apache'));
hljs.registerLanguage('bash', require('./highlight.js/languages/bash'));
hljs.registerLanguage('css', require('./highlight.js/languages/css'));
hljs.registerLanguage('xml', require('./highlight.js/languages/xml'));
hljs.registerLanguage('sql', require('./highlight.js/languages/sql'));
hljs.registerLanguage('lisp', require('./highlight.js/languages/lisp'));

hljs.configure({
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
});

module.exports = hljs;
