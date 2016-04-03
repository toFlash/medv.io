/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _compile = __webpack_require__(22);
	
	var _compile2 = _interopRequireDefault(_compile);
	
	var _hljs = __webpack_require__(3);
	
	var _hljs2 = _interopRequireDefault(_hljs);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var input = document.querySelector('.source');
	var output = document.querySelector('.output');
	
	input.addEventListener('keyup', function (event) {
	  try {
	    var code = (0, _compile2.default)(input.value);
	    output.innerHTML = _hljs2.default.highlight('lisp', code).value;
	  } catch (e) {
	    output.innerHTML = e;
	  }
	});

/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var hljs = __webpack_require__(4);
	
	hljs.registerLanguage('php', __webpack_require__(5));
	hljs.registerLanguage('json', __webpack_require__(6));
	hljs.registerLanguage('yaml', __webpack_require__(7));
	hljs.registerLanguage('javascript', __webpack_require__(8));
	hljs.registerLanguage('coffeescript', __webpack_require__(9));
	hljs.registerLanguage('apache', __webpack_require__(10));
	hljs.registerLanguage('bash', __webpack_require__(11));
	hljs.registerLanguage('css', __webpack_require__(12));
	hljs.registerLanguage('xml', __webpack_require__(13));
	hljs.registerLanguage('sql', __webpack_require__(14));
	hljs.registerLanguage('lisp', __webpack_require__(15));
	
	hljs.configure({
	  languages: ['php', 'js', 'json', 'yaml', 'coffee', 'apache', 'bash', 'css', 'sql', 'xml', 'lisp']
	});
	
	module.exports = hljs;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	/*
	Syntax highlighting with language autodetection.
	https://highlightjs.org/
	*/
	
	(function (factory) {
	
	  // Find the global object for export to both the browser and web workers.
	  var globalObject = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) == 'object' && window || (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self;
	
	  // Setup highlight.js for different environments. First is Node.js or
	  // CommonJS.
	  if (true) {
	    factory(exports);
	  } else if (globalObject) {
	    // Export hljs globally even when using AMD for cases when this script
	    // is loaded with others that may still expect a global hljs.
	    globalObject.hljs = factory({});
	
	    // Finally register the global hljs with AMD.
	    if (typeof define === 'function' && define.amd) {
	      define([], function () {
	        return globalObject.hljs;
	      });
	    }
	  }
	})(function (hljs) {
	
	  /* Utility functions */
	
	  function escape(value) {
	    return value.replace(/&/gm, '&amp;').replace(/</gm, '&lt;').replace(/>/gm, '&gt;');
	  }
	
	  function tag(node) {
	    return node.nodeName.toLowerCase();
	  }
	
	  function testRe(re, lexeme) {
	    var match = re && re.exec(lexeme);
	    return match && match.index == 0;
	  }
	
	  function isNotHighlighted(language) {
	    return (/^(no-?highlight|plain|text)$/i.test(language)
	    );
	  }
	
	  function blockLanguage(block) {
	    var i,
	        match,
	        length,
	        classes = block.className + ' ';
	
	    classes += block.parentNode ? block.parentNode.className : '';
	
	    // language-* takes precedence over non-prefixed class names.
	    match = /\blang(?:uage)?-([\w-]+)\b/i.exec(classes);
	    if (match) {
	      return getLanguage(match[1]) ? match[1] : 'no-highlight';
	    }
	
	    classes = classes.split(/\s+/);
	    for (i = 0, length = classes.length; i < length; i++) {
	      if (getLanguage(classes[i]) || isNotHighlighted(classes[i])) {
	        return classes[i];
	      }
	    }
	  }
	
	  function inherit(parent, obj) {
	    var result = {},
	        key;
	    for (key in parent) {
	      result[key] = parent[key];
	    }if (obj) for (key in obj) {
	      result[key] = obj[key];
	    }return result;
	  }
	
	  /* Stream merging */
	
	  function nodeStream(node) {
	    var result = [];
	    (function _nodeStream(node, offset) {
	      for (var child = node.firstChild; child; child = child.nextSibling) {
	        if (child.nodeType == 3) offset += child.nodeValue.length;else if (child.nodeType == 1) {
	          result.push({
	            event: 'start',
	            offset: offset,
	            node: child
	          });
	          offset = _nodeStream(child, offset);
	          // Prevent void elements from having an end tag that would actually
	          // double them in the output. There are more void elements in HTML
	          // but we list only those realistically expected in code display.
	          if (!tag(child).match(/br|hr|img|input/)) {
	            result.push({
	              event: 'stop',
	              offset: offset,
	              node: child
	            });
	          }
	        }
	      }
	      return offset;
	    })(node, 0);
	    return result;
	  }
	
	  function mergeStreams(original, highlighted, value) {
	    var processed = 0;
	    var result = '';
	    var nodeStack = [];
	
	    function selectStream() {
	      if (!original.length || !highlighted.length) {
	        return original.length ? original : highlighted;
	      }
	      if (original[0].offset != highlighted[0].offset) {
	        return original[0].offset < highlighted[0].offset ? original : highlighted;
	      }
	
	      /*
	      To avoid starting the stream just before it should stop the order is
	      ensured that original always starts first and closes last:
	       if (event1 == 'start' && event2 == 'start')
	        return original;
	      if (event1 == 'start' && event2 == 'stop')
	        return highlighted;
	      if (event1 == 'stop' && event2 == 'start')
	        return original;
	      if (event1 == 'stop' && event2 == 'stop')
	        return highlighted;
	       ... which is collapsed to:
	      */
	      return highlighted[0].event == 'start' ? original : highlighted;
	    }
	
	    function open(node) {
	      function attr_str(a) {
	        return ' ' + a.nodeName + '="' + escape(a.value) + '"';
	      }
	      result += '<' + tag(node) + Array.prototype.map.call(node.attributes, attr_str).join('') + '>';
	    }
	
	    function close(node) {
	      result += '</' + tag(node) + '>';
	    }
	
	    function render(event) {
	      (event.event == 'start' ? open : close)(event.node);
	    }
	
	    while (original.length || highlighted.length) {
	      var stream = selectStream();
	      result += escape(value.substr(processed, stream[0].offset - processed));
	      processed = stream[0].offset;
	      if (stream == original) {
	        /*
	        On any opening or closing tag of the original markup we first close
	        the entire highlighted node stack, then render the original tag along
	        with all the following original tags at the same offset and then
	        reopen all the tags on the highlighted stack.
	        */
	        nodeStack.reverse().forEach(close);
	        do {
	          render(stream.splice(0, 1)[0]);
	          stream = selectStream();
	        } while (stream == original && stream.length && stream[0].offset == processed);
	        nodeStack.reverse().forEach(open);
	      } else {
	        if (stream[0].event == 'start') {
	          nodeStack.push(stream[0].node);
	        } else {
	          nodeStack.pop();
	        }
	        render(stream.splice(0, 1)[0]);
	      }
	    }
	    return result + escape(value.substr(processed));
	  }
	
	  /* Initialization */
	
	  function compileLanguage(language) {
	
	    function reStr(re) {
	      return re && re.source || re;
	    }
	
	    function langRe(value, global) {
	      return new RegExp(reStr(value), 'm' + (language.case_insensitive ? 'i' : '') + (global ? 'g' : ''));
	    }
	
	    function compileMode(mode, parent) {
	      if (mode.compiled) return;
	      mode.compiled = true;
	
	      mode.keywords = mode.keywords || mode.beginKeywords;
	      if (mode.keywords) {
	        var compiled_keywords = {};
	
	        var flatten = function flatten(className, str) {
	          if (language.case_insensitive) {
	            str = str.toLowerCase();
	          }
	          str.split(' ').forEach(function (kw) {
	            var pair = kw.split('|');
	            compiled_keywords[pair[0]] = [className, pair[1] ? Number(pair[1]) : 1];
	          });
	        };
	
	        if (typeof mode.keywords == 'string') {
	          // string
	          flatten('keyword', mode.keywords);
	        } else {
	          Object.keys(mode.keywords).forEach(function (className) {
	            flatten(className, mode.keywords[className]);
	          });
	        }
	        mode.keywords = compiled_keywords;
	      }
	      mode.lexemesRe = langRe(mode.lexemes || /\b\w+\b/, true);
	
	      if (parent) {
	        if (mode.beginKeywords) {
	          mode.begin = '\\b(' + mode.beginKeywords.split(' ').join('|') + ')\\b';
	        }
	        if (!mode.begin) mode.begin = /\B|\b/;
	        mode.beginRe = langRe(mode.begin);
	        if (!mode.end && !mode.endsWithParent) mode.end = /\B|\b/;
	        if (mode.end) mode.endRe = langRe(mode.end);
	        mode.terminator_end = reStr(mode.end) || '';
	        if (mode.endsWithParent && parent.terminator_end) mode.terminator_end += (mode.end ? '|' : '') + parent.terminator_end;
	      }
	      if (mode.illegal) mode.illegalRe = langRe(mode.illegal);
	      if (mode.relevance === undefined) mode.relevance = 1;
	      if (!mode.contains) {
	        mode.contains = [];
	      }
	      var expanded_contains = [];
	      mode.contains.forEach(function (c) {
	        if (c.variants) {
	          c.variants.forEach(function (v) {
	            expanded_contains.push(inherit(c, v));
	          });
	        } else {
	          expanded_contains.push(c == 'self' ? mode : c);
	        }
	      });
	      mode.contains = expanded_contains;
	      mode.contains.forEach(function (c) {
	        compileMode(c, mode);
	      });
	
	      if (mode.starts) {
	        compileMode(mode.starts, parent);
	      }
	
	      var terminators = mode.contains.map(function (c) {
	        return c.beginKeywords ? '\\.?(' + c.begin + ')\\.?' : c.begin;
	      }).concat([mode.terminator_end, mode.illegal]).map(reStr).filter(Boolean);
	      mode.terminators = terminators.length ? langRe(terminators.join('|'), true) : { exec: function exec() /*s*/{
	          return null;
	        } };
	    }
	
	    compileMode(language);
	  }
	
	  /*
	  Core highlighting function. Accepts a language name, or an alias, and a
	  string with the code to highlight. Returns an object with the following
	  properties:
	   - relevance (int)
	  - value (an HTML string with highlighting markup)
	   */
	  function highlight(name, value, ignore_illegals, continuation) {
	
	    function subMode(lexeme, mode) {
	      for (var i = 0; i < mode.contains.length; i++) {
	        if (testRe(mode.contains[i].beginRe, lexeme)) {
	          return mode.contains[i];
	        }
	      }
	    }
	
	    function endOfMode(mode, lexeme) {
	      if (testRe(mode.endRe, lexeme)) {
	        while (mode.endsParent && mode.parent) {
	          mode = mode.parent;
	        }
	        return mode;
	      }
	      if (mode.endsWithParent) {
	        return endOfMode(mode.parent, lexeme);
	      }
	    }
	
	    function isIllegal(lexeme, mode) {
	      return !ignore_illegals && testRe(mode.illegalRe, lexeme);
	    }
	
	    function keywordMatch(mode, match) {
	      var match_str = language.case_insensitive ? match[0].toLowerCase() : match[0];
	      return mode.keywords.hasOwnProperty(match_str) && mode.keywords[match_str];
	    }
	
	    function buildSpan(classname, insideSpan, leaveOpen, noPrefix) {
	      var classPrefix = noPrefix ? '' : options.classPrefix,
	          openSpan = '<span class="' + classPrefix,
	          closeSpan = leaveOpen ? '' : '</span>';
	
	      openSpan += classname + '">';
	
	      return openSpan + insideSpan + closeSpan;
	    }
	
	    function processKeywords() {
	      if (!top.keywords) return escape(mode_buffer);
	      var result = '';
	      var last_index = 0;
	      top.lexemesRe.lastIndex = 0;
	      var match = top.lexemesRe.exec(mode_buffer);
	      while (match) {
	        result += escape(mode_buffer.substr(last_index, match.index - last_index));
	        var keyword_match = keywordMatch(top, match);
	        if (keyword_match) {
	          relevance += keyword_match[1];
	          result += buildSpan(keyword_match[0], escape(match[0]));
	        } else {
	          result += escape(match[0]);
	        }
	        last_index = top.lexemesRe.lastIndex;
	        match = top.lexemesRe.exec(mode_buffer);
	      }
	      return result + escape(mode_buffer.substr(last_index));
	    }
	
	    function processSubLanguage() {
	      var explicit = typeof top.subLanguage == 'string';
	      if (explicit && !languages[top.subLanguage]) {
	        return escape(mode_buffer);
	      }
	
	      var result = explicit ? highlight(top.subLanguage, mode_buffer, true, continuations[top.subLanguage]) : highlightAuto(mode_buffer, top.subLanguage.length ? top.subLanguage : undefined);
	
	      // Counting embedded language score towards the host language may be disabled
	      // with zeroing the containing mode relevance. Usecase in point is Markdown that
	      // allows XML everywhere and makes every XML snippet to have a much larger Markdown
	      // score.
	      if (top.relevance > 0) {
	        relevance += result.relevance;
	      }
	      if (explicit) {
	        continuations[top.subLanguage] = result.top;
	      }
	      return buildSpan(result.language, result.value, false, true);
	    }
	
	    function processBuffer() {
	      result += top.subLanguage !== undefined ? processSubLanguage() : processKeywords();
	      mode_buffer = '';
	    }
	
	    function startNewMode(mode, lexeme) {
	      result += mode.className ? buildSpan(mode.className, '', true) : '';
	      top = Object.create(mode, { parent: { value: top } });
	    }
	
	    function processLexeme(buffer, lexeme) {
	
	      mode_buffer += buffer;
	
	      if (lexeme === undefined) {
	        processBuffer();
	        return 0;
	      }
	
	      var new_mode = subMode(lexeme, top);
	      if (new_mode) {
	        if (new_mode.skip) {
	          mode_buffer += lexeme;
	        } else {
	          if (new_mode.excludeBegin) {
	            mode_buffer += lexeme;
	          }
	          processBuffer();
	          if (!new_mode.returnBegin && !new_mode.excludeBegin) {
	            mode_buffer = lexeme;
	          }
	        }
	        startNewMode(new_mode, lexeme);
	        return new_mode.returnBegin ? 0 : lexeme.length;
	      }
	
	      var end_mode = endOfMode(top, lexeme);
	      if (end_mode) {
	        var origin = top;
	        if (origin.skip) {
	          mode_buffer += lexeme;
	        } else {
	          if (!(origin.returnEnd || origin.excludeEnd)) {
	            mode_buffer += lexeme;
	          }
	          processBuffer();
	          if (origin.excludeEnd) {
	            mode_buffer = lexeme;
	          }
	        }
	        do {
	          if (top.className) {
	            result += '</span>';
	          }
	          if (!top.skip) {
	            relevance += top.relevance;
	          }
	          top = top.parent;
	        } while (top != end_mode.parent);
	        if (end_mode.starts) {
	          startNewMode(end_mode.starts, '');
	        }
	        return origin.returnEnd ? 0 : lexeme.length;
	      }
	
	      if (isIllegal(lexeme, top)) throw new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.className || '<unnamed>') + '"');
	
	      /*
	      Parser should not reach this point as all types of lexemes should be caught
	      earlier, but if it does due to some bug make sure it advances at least one
	      character forward to prevent infinite looping.
	      */
	      mode_buffer += lexeme;
	      return lexeme.length || 1;
	    }
	
	    var language = getLanguage(name);
	    if (!language) {
	      throw new Error('Unknown language: "' + name + '"');
	    }
	
	    compileLanguage(language);
	    var top = continuation || language;
	    var continuations = {}; // keep continuations for sub-languages
	    var result = '',
	        current;
	    for (current = top; current != language; current = current.parent) {
	      if (current.className) {
	        result = buildSpan(current.className, '', true) + result;
	      }
	    }
	    var mode_buffer = '';
	    var relevance = 0;
	    try {
	      var match,
	          count,
	          index = 0;
	      while (true) {
	        top.terminators.lastIndex = index;
	        match = top.terminators.exec(value);
	        if (!match) break;
	        count = processLexeme(value.substr(index, match.index - index), match[0]);
	        index = match.index + count;
	      }
	      processLexeme(value.substr(index));
	      for (current = top; current.parent; current = current.parent) {
	        // close dangling modes
	        if (current.className) {
	          result += '</span>';
	        }
	      }
	      return {
	        relevance: relevance,
	        value: result,
	        language: name,
	        top: top
	      };
	    } catch (e) {
	      if (e.message.indexOf('Illegal') != -1) {
	        return {
	          relevance: 0,
	          value: escape(value)
	        };
	      } else {
	        throw e;
	      }
	    }
	  }
	
	  /*
	  Highlighting with language detection. Accepts a string with the code to
	  highlight. Returns an object with the following properties:
	   - language (detected language)
	  - relevance (int)
	  - value (an HTML string with highlighting markup)
	  - second_best (object with the same structure for second-best heuristically
	    detected language, may be absent)
	   */
	  function highlightAuto(text, languageSubset) {
	    languageSubset = languageSubset || options.languages || Object.keys(languages);
	    var result = {
	      relevance: 0,
	      value: escape(text)
	    };
	    var second_best = result;
	    languageSubset.forEach(function (name) {
	      if (!getLanguage(name)) {
	        return;
	      }
	      var current = highlight(name, text, false);
	      current.language = name;
	      if (current.relevance > second_best.relevance) {
	        second_best = current;
	      }
	      if (current.relevance > result.relevance) {
	        second_best = result;
	        result = current;
	      }
	    });
	    if (second_best.language) {
	      result.second_best = second_best;
	    }
	    return result;
	  }
	
	  /*
	  Post-processing of the highlighted markup:
	   - replace TABs with something more useful
	  - replace real line-breaks with '<br>' for non-pre containers
	   */
	  function fixMarkup(value) {
	    if (options.tabReplace) {
	      value = value.replace(/^((<[^>]+>|\t)+)/gm, function (match, p1 /*..., offset, s*/) {
	        return p1.replace(/\t/g, options.tabReplace);
	      });
	    }
	    if (options.useBR) {
	      value = value.replace(/\n/g, '<br>');
	    }
	    return value;
	  }
	
	  function buildClassName(prevClassName, currentLang, resultLang) {
	    var language = currentLang ? aliases[currentLang] : resultLang,
	        result = [prevClassName.trim()];
	
	    if (!prevClassName.match(/\bhljs\b/)) {
	      result.push('hljs');
	    }
	
	    if (prevClassName.indexOf(language) === -1) {
	      result.push(language);
	    }
	
	    return result.join(' ').trim();
	  }
	
	  /*
	  Applies highlighting to a DOM node containing code. Accepts a DOM node and
	  two optional parameters for fixMarkup.
	  */
	  function highlightBlock(block) {
	    var language = blockLanguage(block);
	    if (isNotHighlighted(language)) return;
	
	    var node;
	    if (options.useBR) {
	      node = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
	      node.innerHTML = block.innerHTML.replace(/\n/g, '').replace(/<br[ \/]*>/g, '\n');
	    } else {
	      node = block;
	    }
	    var text = node.textContent;
	    var result = language ? highlight(language, text, true) : highlightAuto(text);
	
	    var originalStream = nodeStream(node);
	    if (originalStream.length) {
	      var resultNode = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
	      resultNode.innerHTML = result.value;
	      result.value = mergeStreams(originalStream, nodeStream(resultNode), text);
	    }
	    result.value = fixMarkup(result.value);
	
	    block.innerHTML = result.value;
	    block.className = buildClassName(block.className, language, result.language);
	    block.result = {
	      language: result.language,
	      re: result.relevance
	    };
	    if (result.second_best) {
	      block.second_best = {
	        language: result.second_best.language,
	        re: result.second_best.relevance
	      };
	    }
	  }
	
	  var options = {
	    classPrefix: 'hljs-',
	    tabReplace: null,
	    useBR: false,
	    languages: undefined
	  };
	
	  /*
	  Updates highlight.js global options with values passed in the form of an object.
	  */
	  function configure(user_options) {
	    options = inherit(options, user_options);
	  }
	
	  /*
	  Applies highlighting to all <pre><code>..</code></pre> blocks on a page.
	  */
	  function initHighlighting() {
	    if (initHighlighting.called) return;
	    initHighlighting.called = true;
	
	    var blocks = document.querySelectorAll('pre code');
	    Array.prototype.forEach.call(blocks, highlightBlock);
	  }
	
	  /*
	  Attaches highlighting to the page load event.
	  */
	  function initHighlightingOnLoad() {
	    addEventListener('DOMContentLoaded', initHighlighting, false);
	    addEventListener('load', initHighlighting, false);
	  }
	
	  var languages = {};
	  var aliases = {};
	
	  function registerLanguage(name, language) {
	    var lang = languages[name] = language(hljs);
	    if (lang.aliases) {
	      lang.aliases.forEach(function (alias) {
	        aliases[alias] = name;
	      });
	    }
	  }
	
	  function listLanguages() {
	    return Object.keys(languages);
	  }
	
	  function getLanguage(name) {
	    name = (name || '').toLowerCase();
	    return languages[name] || languages[aliases[name]];
	  }
	
	  /* Interface definition */
	
	  hljs.highlight = highlight;
	  hljs.highlightAuto = highlightAuto;
	  hljs.fixMarkup = fixMarkup;
	  hljs.highlightBlock = highlightBlock;
	  hljs.configure = configure;
	  hljs.initHighlighting = initHighlighting;
	  hljs.initHighlightingOnLoad = initHighlightingOnLoad;
	  hljs.registerLanguage = registerLanguage;
	  hljs.listLanguages = listLanguages;
	  hljs.getLanguage = getLanguage;
	  hljs.inherit = inherit;
	
	  // Common regexps
	  hljs.IDENT_RE = '[a-zA-Z]\\w*';
	  hljs.UNDERSCORE_IDENT_RE = '[a-zA-Z_]\\w*';
	  hljs.NUMBER_RE = '\\b\\d+(\\.\\d+)?';
	  hljs.C_NUMBER_RE = '(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)'; // 0x..., 0..., decimal, float
	  hljs.BINARY_NUMBER_RE = '\\b(0b[01]+)'; // 0b...
	  hljs.RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';
	
	  // Common modes
	  hljs.BACKSLASH_ESCAPE = {
	    begin: '\\\\[\\s\\S]', relevance: 0
	  };
	  hljs.APOS_STRING_MODE = {
	    className: 'string',
	    begin: '\'', end: '\'',
	    illegal: '\\n',
	    contains: [hljs.BACKSLASH_ESCAPE]
	  };
	  hljs.QUOTE_STRING_MODE = {
	    className: 'string',
	    begin: '"', end: '"',
	    illegal: '\\n',
	    contains: [hljs.BACKSLASH_ESCAPE]
	  };
	  hljs.PHRASAL_WORDS_MODE = {
	    begin: /\b(a|an|the|are|I|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|like)\b/
	  };
	  hljs.COMMENT = function (begin, end, inherits) {
	    var mode = hljs.inherit({
	      className: 'comment',
	      begin: begin, end: end,
	      contains: []
	    }, inherits || {});
	    mode.contains.push(hljs.PHRASAL_WORDS_MODE);
	    mode.contains.push({
	      className: 'doctag',
	      begin: "(?:TODO|FIXME|NOTE|BUG|XXX):",
	      relevance: 0
	    });
	    return mode;
	  };
	  hljs.C_LINE_COMMENT_MODE = hljs.COMMENT('//', '$');
	  hljs.C_BLOCK_COMMENT_MODE = hljs.COMMENT('/\\*', '\\*/');
	  hljs.HASH_COMMENT_MODE = hljs.COMMENT('#', '$');
	  hljs.NUMBER_MODE = {
	    className: 'number',
	    begin: hljs.NUMBER_RE,
	    relevance: 0
	  };
	  hljs.C_NUMBER_MODE = {
	    className: 'number',
	    begin: hljs.C_NUMBER_RE,
	    relevance: 0
	  };
	  hljs.BINARY_NUMBER_MODE = {
	    className: 'number',
	    begin: hljs.BINARY_NUMBER_RE,
	    relevance: 0
	  };
	  hljs.CSS_NUMBER_MODE = {
	    className: 'number',
	    begin: hljs.NUMBER_RE + '(' + '%|em|ex|ch|rem' + '|vw|vh|vmin|vmax' + '|cm|mm|in|pt|pc|px' + '|deg|grad|rad|turn' + '|s|ms' + '|Hz|kHz' + '|dpi|dpcm|dppx' + ')?',
	    relevance: 0
	  };
	  hljs.REGEXP_MODE = {
	    className: 'regexp',
	    begin: /\//, end: /\/[gimuy]*/,
	    illegal: /\n/,
	    contains: [hljs.BACKSLASH_ESCAPE, {
	      begin: /\[/, end: /\]/,
	      relevance: 0,
	      contains: [hljs.BACKSLASH_ESCAPE]
	    }]
	  };
	  hljs.TITLE_MODE = {
	    className: 'title',
	    begin: hljs.IDENT_RE,
	    relevance: 0
	  };
	  hljs.UNDERSCORE_TITLE_MODE = {
	    className: 'title',
	    begin: hljs.UNDERSCORE_IDENT_RE,
	    relevance: 0
	  };
	  hljs.METHOD_GUARD = {
	    // excludes method names from keyword processing
	    begin: '\\.\\s*' + hljs.UNDERSCORE_IDENT_RE,
	    relevance: 0
	  };
	
	  return hljs;
	});

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (hljs) {
	  var VARIABLE = {
	    begin: '\\$+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*'
	  };
	  var PREPROCESSOR = {
	    className: 'meta', begin: /<\?(php)?|\?>/
	  };
	  var STRING = {
	    className: 'string',
	    contains: [hljs.BACKSLASH_ESCAPE, PREPROCESSOR],
	    variants: [{
	      begin: 'b"', end: '"'
	    }, {
	      begin: 'b\'', end: '\''
	    }, hljs.inherit(hljs.APOS_STRING_MODE, { illegal: null }), hljs.inherit(hljs.QUOTE_STRING_MODE, { illegal: null })]
	  };
	  var NUMBER = { variants: [hljs.BINARY_NUMBER_MODE, hljs.C_NUMBER_MODE] };
	  return {
	    aliases: ['php3', 'php4', 'php5', 'php6'],
	    case_insensitive: true,
	    keywords: 'and include_once list abstract global private echo interface as static endswitch ' + 'array null if endwhile or const for endforeach self var while isset public ' + 'protected exit foreach throw elseif include __FILE__ empty require_once do xor ' + 'return parent clone use __CLASS__ __LINE__ else break print eval new ' + 'catch __METHOD__ case exception default die require __FUNCTION__ ' + 'enddeclare final try switch continue endfor endif declare unset true false ' + 'trait goto instanceof insteadof __DIR__ __NAMESPACE__ ' + 'yield finally',
	    contains: [hljs.HASH_COMMENT_MODE, hljs.COMMENT('//', '$', { contains: [PREPROCESSOR] }), hljs.COMMENT('/\\*', '\\*/', {
	      contains: [{
	        className: 'doctag',
	        begin: '@[A-Za-z]+'
	      }]
	    }), hljs.COMMENT('__halt_compiler.+?;', false, {
	      endsWithParent: true,
	      keywords: '__halt_compiler',
	      lexemes: hljs.UNDERSCORE_IDENT_RE
	    }), {
	      className: 'string',
	      begin: /<<<['"]?\w+['"]?$/, end: /^\w+;?$/,
	      contains: [hljs.BACKSLASH_ESCAPE, {
	        className: 'subst',
	        variants: [{ begin: /\$\w+/ }, { begin: /\{\$/, end: /\}/ }]
	      }]
	    }, PREPROCESSOR, VARIABLE, {
	      // swallow composed identifiers to avoid parsing them as keywords
	      begin: /(::|->)+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/
	    }, {
	      className: 'function',
	      beginKeywords: 'function', end: /[;{]/, excludeEnd: true,
	      illegal: '\\$|\\[|%',
	      contains: [hljs.UNDERSCORE_TITLE_MODE, {
	        className: 'params',
	        begin: '\\(', end: '\\)',
	        contains: ['self', VARIABLE, hljs.C_BLOCK_COMMENT_MODE, STRING, NUMBER]
	      }]
	    }, {
	      className: 'class',
	      beginKeywords: 'class interface', end: '{', excludeEnd: true,
	      illegal: /[:\(\$"]/,
	      contains: [{ beginKeywords: 'extends implements' }, hljs.UNDERSCORE_TITLE_MODE]
	    }, {
	      beginKeywords: 'namespace', end: ';',
	      illegal: /[\.']/,
	      contains: [hljs.UNDERSCORE_TITLE_MODE]
	    }, {
	      beginKeywords: 'use', end: ';',
	      contains: [hljs.UNDERSCORE_TITLE_MODE]
	    }, {
	      begin: '=>' // No markup, just a relevance booster
	    }, STRING, NUMBER]
	  };
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (hljs) {
	  var LITERALS = { literal: 'true false null' };
	  var TYPES = [hljs.QUOTE_STRING_MODE, hljs.C_NUMBER_MODE];
	  var VALUE_CONTAINER = {
	    end: ',', endsWithParent: true, excludeEnd: true,
	    contains: TYPES,
	    keywords: LITERALS
	  };
	  var OBJECT = {
	    begin: '{', end: '}',
	    contains: [{
	      className: 'attr',
	      begin: /"/, end: /"/,
	      contains: [hljs.BACKSLASH_ESCAPE],
	      illegal: '\\n'
	    }, hljs.inherit(VALUE_CONTAINER, { begin: /:/ })],
	    illegal: '\\S'
	  };
	  var ARRAY = {
	    begin: '\\[', end: '\\]',
	    contains: [hljs.inherit(VALUE_CONTAINER)], // inherit is a workaround for a bug that makes shared modes with endsWithParent compile only the ending of one of the parents
	    illegal: '\\S'
	  };
	  TYPES.splice(TYPES.length, 0, OBJECT, ARRAY);
	  return {
	    contains: TYPES,
	    keywords: LITERALS,
	    illegal: '\\S'
	  };
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (hljs) {
	  var LITERALS = { literal: '{ } true false yes no Yes No True False null' };
	
	  var keyPrefix = '^[ \\-]*';
	  var keyName = '[a-zA-Z_][\\w\\-]*';
	  var KEY = {
	    className: 'attr',
	    variants: [{ begin: keyPrefix + keyName + ":" }, { begin: keyPrefix + '"' + keyName + '"' + ":" }, { begin: keyPrefix + "'" + keyName + "'" + ":" }]
	  };
	
	  var TEMPLATE_VARIABLES = {
	    className: 'template-variable',
	    variants: [{ begin: '\{\{', end: '\}\}' }, // jinja templates Ansible
	    { begin: '%\{', end: '\}' } // Ruby i18n
	    ]
	  };
	  var STRING = {
	    className: 'string',
	    relevance: 0,
	    variants: [{ begin: /'/, end: /'/ }, { begin: /"/, end: /"/ }],
	    contains: [hljs.BACKSLASH_ESCAPE, TEMPLATE_VARIABLES]
	  };
	
	  return {
	    case_insensitive: true,
	    aliases: ['yml', 'YAML', 'yaml'],
	    contains: [KEY, {
	      className: 'meta',
	      begin: '^---\s*$',
	      relevance: 10
	    }, { // multi line string
	      className: 'string',
	      begin: '[\\|>] *$',
	      returnEnd: true,
	      contains: STRING.contains,
	      // very simple termination: next hash key
	      end: KEY.variants[0].begin
	    }, { // Ruby/Rails erb
	      begin: '<%[%=-]?', end: '[%-]?%>',
	      subLanguage: 'ruby',
	      excludeBegin: true,
	      excludeEnd: true,
	      relevance: 0
	    }, { // data type
	      className: 'type',
	      begin: '!!' + hljs.UNDERSCORE_IDENT_RE
	    }, { // fragment id &ref
	      className: 'meta',
	      begin: '&' + hljs.UNDERSCORE_IDENT_RE + '$'
	    }, { // fragment reference *ref
	      className: 'meta',
	      begin: '\\*' + hljs.UNDERSCORE_IDENT_RE + '$'
	    }, { // array listing
	      className: 'bullet',
	      begin: '^ *-',
	      relevance: 0
	    }, STRING, hljs.HASH_COMMENT_MODE, hljs.C_NUMBER_MODE],
	    keywords: LITERALS
	  };
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (hljs) {
	  return {
	    aliases: ['js', 'jsx'],
	    keywords: {
	      keyword: 'in of if for while finally var new function do return void else break catch ' + 'instanceof with throw case default try this switch continue typeof delete ' + 'let yield const export super debugger as async await static ' +
	      // ECMAScript 6 modules import
	      'import from as',
	
	      literal: 'true false null undefined NaN Infinity',
	      built_in: 'eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent ' + 'encodeURI encodeURIComponent escape unescape Object Function Boolean Error ' + 'EvalError InternalError RangeError ReferenceError StopIteration SyntaxError ' + 'TypeError URIError Number Math Date String RegExp Array Float32Array ' + 'Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array ' + 'Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require ' + 'module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect ' + 'Promise'
	    },
	    contains: [{
	      className: 'meta',
	      relevance: 10,
	      begin: /^\s*['"]use (strict|asm)['"]/
	    }, {
	      className: 'meta',
	      begin: /^#!/, end: /$/
	    }, hljs.APOS_STRING_MODE, hljs.QUOTE_STRING_MODE, { // template string
	      className: 'string',
	      begin: '`', end: '`',
	      contains: [hljs.BACKSLASH_ESCAPE, {
	        className: 'subst',
	        begin: '\\$\\{', end: '\\}'
	      }]
	    }, hljs.C_LINE_COMMENT_MODE, hljs.C_BLOCK_COMMENT_MODE, {
	      className: 'number',
	      variants: [{ begin: '\\b(0[bB][01]+)' }, { begin: '\\b(0[oO][0-7]+)' }, { begin: hljs.C_NUMBER_RE }],
	      relevance: 0
	    }, { // "value" container
	      begin: '(' + hljs.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
	      keywords: 'return throw case',
	      contains: [hljs.C_LINE_COMMENT_MODE, hljs.C_BLOCK_COMMENT_MODE, hljs.REGEXP_MODE, { // E4X / JSX
	        begin: /</, end: /(\/\w+|\w+\/)>/,
	        subLanguage: 'xml',
	        contains: [{ begin: /<\w+\/>/, skip: true }, { begin: /<\w+/, end: /(\/\w+|\w+\/)>/, skip: true, contains: ['self'] }]
	      }],
	      relevance: 0
	    }, {
	      className: 'function',
	      beginKeywords: 'function', end: /\{/, excludeEnd: true,
	      contains: [hljs.inherit(hljs.TITLE_MODE, { begin: /[A-Za-z$_][0-9A-Za-z$_]*/ }), {
	        className: 'params',
	        begin: /\(/, end: /\)/,
	        excludeBegin: true,
	        excludeEnd: true,
	        contains: [hljs.C_LINE_COMMENT_MODE, hljs.C_BLOCK_COMMENT_MODE]
	      }],
	      illegal: /\[|%/
	    }, {
	      begin: /\$[(.]/ // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
	    }, hljs.METHOD_GUARD, { // ES6 class
	      className: 'class',
	      beginKeywords: 'class', end: /[{;=]/, excludeEnd: true,
	      illegal: /[:"\[\]]/,
	      contains: [{ beginKeywords: 'extends' }, hljs.UNDERSCORE_TITLE_MODE]
	    }, {
	      beginKeywords: 'constructor', end: /\{/, excludeEnd: true
	    }],
	    illegal: /#(?!!)/
	  };
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (hljs) {
	  var KEYWORDS = {
	    keyword:
	    // JS keywords
	    'in if for while finally new do return else break catch instanceof throw try this ' + 'switch continue typeof delete debugger super ' +
	    // Coffee keywords
	    'then unless until loop of by when and or is isnt not',
	    literal:
	    // JS literals
	    'true false null undefined ' +
	    // Coffee literals
	    'yes no on off',
	    built_in: 'npm require console print module global window document'
	  };
	  var JS_IDENT_RE = '[A-Za-z$_][0-9A-Za-z$_]*';
	  var SUBST = {
	    className: 'subst',
	    begin: /#\{/, end: /}/,
	    keywords: KEYWORDS
	  };
	  var EXPRESSIONS = [hljs.BINARY_NUMBER_MODE, hljs.inherit(hljs.C_NUMBER_MODE, { starts: { end: '(\\s*/)?', relevance: 0 } }), // a number tries to eat the following slash to prevent treating it as a regexp
	  {
	    className: 'string',
	    variants: [{
	      begin: /'''/, end: /'''/,
	      contains: [hljs.BACKSLASH_ESCAPE]
	    }, {
	      begin: /'/, end: /'/,
	      contains: [hljs.BACKSLASH_ESCAPE]
	    }, {
	      begin: /"""/, end: /"""/,
	      contains: [hljs.BACKSLASH_ESCAPE, SUBST]
	    }, {
	      begin: /"/, end: /"/,
	      contains: [hljs.BACKSLASH_ESCAPE, SUBST]
	    }]
	  }, {
	    className: 'regexp',
	    variants: [{
	      begin: '///', end: '///',
	      contains: [SUBST, hljs.HASH_COMMENT_MODE]
	    }, {
	      begin: '//[gim]*',
	      relevance: 0
	    }, {
	      // regex can't start with space to parse x / 2 / 3 as two divisions
	      // regex can't start with *, and it supports an "illegal" in the main mode
	      begin: /\/(?![ *])(\\\/|.)*?\/[gim]*(?=\W|$)/
	    }]
	  }, {
	    begin: '@' + JS_IDENT_RE // relevance booster
	  }, {
	    begin: '`', end: '`',
	    excludeBegin: true, excludeEnd: true,
	    subLanguage: 'javascript'
	  }];
	  SUBST.contains = EXPRESSIONS;
	
	  var TITLE = hljs.inherit(hljs.TITLE_MODE, { begin: JS_IDENT_RE });
	  var PARAMS_RE = '(\\(.*\\))?\\s*\\B[-=]>';
	  var PARAMS = {
	    className: 'params',
	    begin: '\\([^\\(]', returnBegin: true,
	    /* We need another contained nameless mode to not have every nested
	    pair of parens to be called "params" */
	    contains: [{
	      begin: /\(/, end: /\)/,
	      keywords: KEYWORDS,
	      contains: ['self'].concat(EXPRESSIONS)
	    }]
	  };
	
	  return {
	    aliases: ['coffee', 'cson', 'iced'],
	    keywords: KEYWORDS,
	    illegal: /\/\*/,
	    contains: EXPRESSIONS.concat([hljs.COMMENT('###', '###'), hljs.HASH_COMMENT_MODE, {
	      className: 'function',
	      begin: '^\\s*' + JS_IDENT_RE + '\\s*=\\s*' + PARAMS_RE, end: '[-=]>',
	      returnBegin: true,
	      contains: [TITLE, PARAMS]
	    }, {
	      // anonymous function start
	      begin: /[:\(,=]\s*/,
	      relevance: 0,
	      contains: [{
	        className: 'function',
	        begin: PARAMS_RE, end: '[-=]>',
	        returnBegin: true,
	        contains: [PARAMS]
	      }]
	    }, {
	      className: 'class',
	      beginKeywords: 'class',
	      end: '$',
	      illegal: /[:="\[\]]/,
	      contains: [{
	        beginKeywords: 'extends',
	        endsWithParent: true,
	        illegal: /[:="\[\]]/,
	        contains: [TITLE]
	      }, TITLE]
	    }, {
	      begin: JS_IDENT_RE + ':', end: ':',
	      returnBegin: true, returnEnd: true,
	      relevance: 0
	    }])
	  };
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (hljs) {
	  var NUMBER = { className: 'number', begin: '[\\$%]\\d+' };
	  return {
	    aliases: ['apacheconf'],
	    case_insensitive: true,
	    contains: [hljs.HASH_COMMENT_MODE, { className: 'section', begin: '</?', end: '>' }, {
	      className: 'attribute',
	      begin: /\w+/,
	      relevance: 0,
	      // keywords aren’t needed for highlighting per se, they only boost relevance
	      // for a very generally defined mode (starts with a word, ends with line-end
	      keywords: {
	        nomarkup: 'order deny allow setenv rewriterule rewriteengine rewritecond documentroot ' + 'sethandler errordocument loadmodule options header listen serverroot ' + 'servername'
	      },
	      starts: {
	        end: /$/,
	        relevance: 0,
	        keywords: {
	          literal: 'on off all'
	        },
	        contains: [{
	          className: 'meta',
	          begin: '\\s\\[', end: '\\]$'
	        }, {
	          className: 'variable',
	          begin: '[\\$%]\\{', end: '\\}',
	          contains: ['self', NUMBER]
	        }, NUMBER, hljs.QUOTE_STRING_MODE]
	      }
	    }],
	    illegal: /\S/
	  };
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (hljs) {
	  var VAR = {
	    className: 'variable',
	    variants: [{ begin: /\$[\w\d#@][\w\d_]*/ }, { begin: /\$\{(.*?)}/ }]
	  };
	  var QUOTE_STRING = {
	    className: 'string',
	    begin: /"/, end: /"/,
	    contains: [hljs.BACKSLASH_ESCAPE, VAR, {
	      className: 'variable',
	      begin: /\$\(/, end: /\)/,
	      contains: [hljs.BACKSLASH_ESCAPE]
	    }]
	  };
	  var APOS_STRING = {
	    className: 'string',
	    begin: /'/, end: /'/
	  };
	
	  return {
	    aliases: ['sh', 'zsh'],
	    lexemes: /-?[a-z\.]+/,
	    keywords: {
	      keyword: 'if then else elif fi for while in do done case esac function',
	      literal: 'true false',
	      built_in:
	      // Shell built-ins
	      // http://www.gnu.org/software/bash/manual/html_node/Shell-Builtin-Commands.html
	      'break cd continue eval exec exit export getopts hash pwd readonly return shift test times ' + 'trap umask unset ' +
	      // Bash built-ins
	      'alias bind builtin caller command declare echo enable help let local logout mapfile printf ' + 'read readarray source type typeset ulimit unalias ' +
	      // Shell modifiers
	      'set shopt ' +
	      // Zsh built-ins
	      'autoload bg bindkey bye cap chdir clone comparguments compcall compctl compdescribe compfiles ' + 'compgroups compquote comptags comptry compvalues dirs disable disown echotc echoti emulate ' + 'fc fg float functions getcap getln history integer jobs kill limit log noglob popd print ' + 'pushd pushln rehash sched setcap setopt stat suspend ttyctl unfunction unhash unlimit ' + 'unsetopt vared wait whence where which zcompile zformat zftp zle zmodload zparseopts zprof ' + 'zpty zregexparse zsocket zstyle ztcp',
	      _: '-ne -eq -lt -gt -f -d -e -s -l -a' // relevance booster
	    },
	    contains: [{
	      className: 'meta',
	      begin: /^#![^\n]+sh\s*$/,
	      relevance: 10
	    }, {
	      className: 'function',
	      begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
	      returnBegin: true,
	      contains: [hljs.inherit(hljs.TITLE_MODE, { begin: /\w[\w\d_]*/ })],
	      relevance: 0
	    }, hljs.HASH_COMMENT_MODE, QUOTE_STRING, APOS_STRING, VAR]
	  };
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (hljs) {
	  var IDENT_RE = '[a-zA-Z-][a-zA-Z0-9_-]*';
	  var RULE = {
	    begin: /[A-Z\_\.\-]+\s*:/, returnBegin: true, end: ';', endsWithParent: true,
	    contains: [{
	      className: 'attribute',
	      begin: /\S/, end: ':', excludeEnd: true,
	      starts: {
	        endsWithParent: true, excludeEnd: true,
	        contains: [{
	          begin: /[\w-]+\(/, returnBegin: true,
	          contains: [{
	            className: 'built_in',
	            begin: /[\w-]+/
	          }, {
	            begin: /\(/, end: /\)/,
	            contains: [hljs.APOS_STRING_MODE, hljs.QUOTE_STRING_MODE]
	          }]
	        }, hljs.CSS_NUMBER_MODE, hljs.QUOTE_STRING_MODE, hljs.APOS_STRING_MODE, hljs.C_BLOCK_COMMENT_MODE, {
	          className: 'number', begin: '#[0-9A-Fa-f]+'
	        }, {
	          className: 'meta', begin: '!important'
	        }]
	      }
	    }]
	  };
	
	  return {
	    case_insensitive: true,
	    illegal: /[=\/|'\$]/,
	    contains: [hljs.C_BLOCK_COMMENT_MODE, {
	      className: 'selector-id', begin: /#[A-Za-z0-9_-]+/
	    }, {
	      className: 'selector-class', begin: /\.[A-Za-z0-9_-]+/
	    }, {
	      className: 'selector-attr',
	      begin: /\[/, end: /\]/,
	      illegal: '$'
	    }, {
	      className: 'selector-pseudo',
	      begin: /:(:)?[a-zA-Z0-9\_\-\+\(\)"'.]+/
	    }, {
	      begin: '@(font-face|page)',
	      lexemes: '[a-z-]+',
	      keywords: 'font-face page'
	    }, {
	      begin: '@', end: '[{;]', // at_rule eating first "{" is a good thing
	      // because it doesn’t let it to be parsed as
	      // a rule set but instead drops parser into
	      // the default mode which is how it should be.
	      contains: [{
	        className: 'keyword',
	        begin: /\S+/
	      }, {
	        begin: /\s/, endsWithParent: true, excludeEnd: true,
	        relevance: 0,
	        contains: [hljs.APOS_STRING_MODE, hljs.QUOTE_STRING_MODE, hljs.CSS_NUMBER_MODE]
	      }]
	    }, {
	      className: 'selector-tag', begin: IDENT_RE,
	      relevance: 0
	    }, {
	      begin: '{', end: '}',
	      illegal: /\S/,
	      contains: [hljs.C_BLOCK_COMMENT_MODE, RULE]
	    }]
	  };
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (hljs) {
	  var XML_IDENT_RE = '[A-Za-z0-9\\._:-]+';
	  var TAG_INTERNALS = {
	    endsWithParent: true,
	    illegal: /</,
	    relevance: 0,
	    contains: [{
	      className: 'attr',
	      begin: XML_IDENT_RE,
	      relevance: 0
	    }, {
	      begin: '=',
	      relevance: 0,
	      contains: [{
	        className: 'string',
	        variants: [{ begin: /"/, end: /"/ }, { begin: /'/, end: /'/ }, { begin: /[^\s\/>]+/ }]
	      }]
	    }]
	  };
	  return {
	    aliases: ['html', 'xhtml', 'rss', 'atom', 'xsl', 'plist'],
	    case_insensitive: true,
	    contains: [{
	      className: 'meta',
	      begin: '<!DOCTYPE', end: '>',
	      relevance: 10,
	      contains: [{ begin: '\\[', end: '\\]' }]
	    }, hljs.COMMENT('<!--', '-->', {
	      relevance: 10
	    }), {
	      begin: '<\\!\\[CDATA\\[', end: '\\]\\]>',
	      relevance: 10
	    }, {
	      begin: /<\?(php)?/, end: /\?>/,
	      subLanguage: 'php',
	      contains: [{ begin: '/\\*', end: '\\*/', skip: true }]
	    }, {
	      className: 'tag',
	      /*
	      The lookahead pattern (?=...) ensures that 'begin' only matches
	      '<style' as a single word, followed by a whitespace or an
	      ending braket. The '$' is needed for the lexeme to be recognized
	      by hljs.subMode() that tests lexemes outside the stream.
	      */
	      begin: '<style(?=\\s|>|$)', end: '>',
	      keywords: { name: 'style' },
	      contains: [TAG_INTERNALS],
	      starts: {
	        end: '</style>', returnEnd: true,
	        subLanguage: ['css', 'xml']
	      }
	    }, {
	      className: 'tag',
	      // See the comment in the <style tag about the lookahead pattern
	      begin: '<script(?=\\s|>|$)', end: '>',
	      keywords: { name: 'script' },
	      contains: [TAG_INTERNALS],
	      starts: {
	        end: '\<\/script\>', returnEnd: true,
	        subLanguage: ['actionscript', 'javascript', 'handlebars', 'xml']
	      }
	    }, {
	      className: 'meta',
	      variants: [{ begin: /<\?xml/, end: /\?>/, relevance: 10 }, { begin: /<\?\w+/, end: /\?>/ }]
	    }, {
	      className: 'tag',
	      begin: '</?', end: '/?>',
	      contains: [{
	        className: 'name', begin: /[^\/><\s]+/, relevance: 0
	      }, TAG_INTERNALS]
	    }]
	  };
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (hljs) {
	  var COMMENT_MODE = hljs.COMMENT('--', '$');
	  return {
	    case_insensitive: true,
	    illegal: /[<>{}*]/,
	    contains: [{
	      beginKeywords: 'begin end start commit rollback savepoint lock alter create drop rename call ' + 'delete do handler insert load replace select truncate update set show pragma grant ' + 'merge describe use explain help declare prepare execute deallocate release ' + 'unlock purge reset change stop analyze cache flush optimize repair kill ' + 'install uninstall checksum restore check backup revoke',
	      end: /;/, endsWithParent: true,
	      keywords: {
	        keyword: 'abort abs absolute acc acce accep accept access accessed accessible account acos action activate add ' + 'addtime admin administer advanced advise aes_decrypt aes_encrypt after agent aggregate ali alia alias ' + 'allocate allow alter always analyze ancillary and any anydata anydataset anyschema anytype apply ' + 'archive archived archivelog are as asc ascii asin assembly assertion associate asynchronous at atan ' + 'atn2 attr attri attrib attribu attribut attribute attributes audit authenticated authentication authid ' + 'authors auto autoallocate autodblink autoextend automatic availability avg backup badfile basicfile ' + 'before begin beginning benchmark between bfile bfile_base big bigfile bin binary_double binary_float ' + 'binlog bit_and bit_count bit_length bit_or bit_xor bitmap blob_base block blocksize body both bound ' + 'buffer_cache buffer_pool build bulk by byte byteordermark bytes cache caching call calling cancel ' + 'capacity cascade cascaded case cast catalog category ceil ceiling chain change changed char_base ' + 'char_length character_length characters characterset charindex charset charsetform charsetid check ' + 'checksum checksum_agg child choose chr chunk class cleanup clear client clob clob_base clone close ' + 'cluster_id cluster_probability cluster_set clustering coalesce coercibility col collate collation ' + 'collect colu colum column column_value columns columns_updated comment commit compact compatibility ' + 'compiled complete composite_limit compound compress compute concat concat_ws concurrent confirm conn ' + 'connec connect connect_by_iscycle connect_by_isleaf connect_by_root connect_time connection ' + 'consider consistent constant constraint constraints constructor container content contents context ' + 'contributors controlfile conv convert convert_tz corr corr_k corr_s corresponding corruption cos cost ' + 'count count_big counted covar_pop covar_samp cpu_per_call cpu_per_session crc32 create creation ' + 'critical cross cube cume_dist curdate current current_date current_time current_timestamp current_user ' + 'cursor curtime customdatum cycle data database databases datafile datafiles datalength date_add ' + 'date_cache date_format date_sub dateadd datediff datefromparts datename datepart datetime2fromparts ' + 'day day_to_second dayname dayofmonth dayofweek dayofyear days db_role_change dbtimezone ddl deallocate ' + 'declare decode decompose decrement decrypt deduplicate def defa defau defaul default defaults ' + 'deferred defi defin define degrees delayed delegate delete delete_all delimited demand dense_rank ' + 'depth dequeue des_decrypt des_encrypt des_key_file desc descr descri describ describe descriptor ' + 'deterministic diagnostics difference dimension direct_load directory disable disable_all ' + 'disallow disassociate discardfile disconnect diskgroup distinct distinctrow distribute distributed div ' + 'do document domain dotnet double downgrade drop dumpfile duplicate duration each edition editionable ' + 'editions element ellipsis else elsif elt empty enable enable_all enclosed encode encoding encrypt ' + 'end end-exec endian enforced engine engines enqueue enterprise entityescaping eomonth error errors ' + 'escaped evalname evaluate event eventdata events except exception exceptions exchange exclude excluding ' + 'execu execut execute exempt exists exit exp expire explain export export_set extended extent external ' + 'external_1 external_2 externally extract failed failed_login_attempts failover failure far fast ' + 'feature_set feature_value fetch field fields file file_name_convert filesystem_like_logging final ' + 'finish first first_value fixed flash_cache flashback floor flush following follows for forall force ' + 'form forma format found found_rows freelist freelists freepools fresh from from_base64 from_days ' + 'ftp full function general generated get get_format get_lock getdate getutcdate global global_name ' + 'globally go goto grant grants greatest group group_concat group_id grouping grouping_id groups ' + 'gtid_subtract guarantee guard handler hash hashkeys having hea head headi headin heading heap help hex ' + 'hierarchy high high_priority hosts hour http id ident_current ident_incr ident_seed identified ' + 'identity idle_time if ifnull ignore iif ilike ilm immediate import in include including increment ' + 'index indexes indexing indextype indicator indices inet6_aton inet6_ntoa inet_aton inet_ntoa infile ' + 'initial initialized initially initrans inmemory inner innodb input insert install instance instantiable ' + 'instr interface interleaved intersect into invalidate invisible is is_free_lock is_ipv4 is_ipv4_compat ' + 'is_not is_not_null is_used_lock isdate isnull isolation iterate java join json json_exists ' + 'keep keep_duplicates key keys kill language large last last_day last_insert_id last_value lax lcase ' + 'lead leading least leaves left len lenght length less level levels library like like2 like4 likec limit ' + 'lines link list listagg little ln load load_file lob lobs local localtime localtimestamp locate ' + 'locator lock locked log log10 log2 logfile logfiles logging logical logical_reads_per_call ' + 'logoff logon logs long loop low low_priority lower lpad lrtrim ltrim main make_set makedate maketime ' + 'managed management manual map mapping mask master master_pos_wait match matched materialized max ' + 'maxextents maximize maxinstances maxlen maxlogfiles maxloghistory maxlogmembers maxsize maxtrans ' + 'md5 measures median medium member memcompress memory merge microsecond mid migration min minextents ' + 'minimum mining minus minute minvalue missing mod mode model modification modify module monitoring month ' + 'months mount move movement multiset mutex name name_const names nan national native natural nav nchar ' + 'nclob nested never new newline next nextval no no_write_to_binlog noarchivelog noaudit nobadfile ' + 'nocheck nocompress nocopy nocycle nodelay nodiscardfile noentityescaping noguarantee nokeep nologfile ' + 'nomapping nomaxvalue nominimize nominvalue nomonitoring none noneditionable nonschema noorder ' + 'nopr nopro noprom nopromp noprompt norely noresetlogs noreverse normal norowdependencies noschemacheck ' + 'noswitch not nothing notice notrim novalidate now nowait nth_value nullif nulls num numb numbe ' + 'nvarchar nvarchar2 object ocicoll ocidate ocidatetime ociduration ociinterval ociloblocator ocinumber ' + 'ociref ocirefcursor ocirowid ocistring ocitype oct octet_length of off offline offset oid oidindex old ' + 'on online only opaque open operations operator optimal optimize option optionally or oracle oracle_date ' + 'oradata ord ordaudio orddicom orddoc order ordimage ordinality ordvideo organization orlany orlvary ' + 'out outer outfile outline output over overflow overriding package pad parallel parallel_enable ' + 'parameters parent parse partial partition partitions pascal passing password password_grace_time ' + 'password_lock_time password_reuse_max password_reuse_time password_verify_function patch path patindex ' + 'pctincrease pctthreshold pctused pctversion percent percent_rank percentile_cont percentile_disc ' + 'performance period period_add period_diff permanent physical pi pipe pipelined pivot pluggable plugin ' + 'policy position post_transaction pow power pragma prebuilt precedes preceding precision prediction ' + 'prediction_cost prediction_details prediction_probability prediction_set prepare present preserve ' + 'prior priority private private_sga privileges procedural procedure procedure_analyze processlist ' + 'profiles project prompt protection public publishingservername purge quarter query quick quiesce quota ' + 'quotename radians raise rand range rank raw read reads readsize rebuild record records ' + 'recover recovery recursive recycle redo reduced ref reference referenced references referencing refresh ' + 'regexp_like register regr_avgx regr_avgy regr_count regr_intercept regr_r2 regr_slope regr_sxx regr_sxy ' + 'reject rekey relational relative relaylog release release_lock relies_on relocate rely rem remainder rename ' + 'repair repeat replace replicate replication required reset resetlogs resize resource respect restore ' + 'restricted result result_cache resumable resume retention return returning returns reuse reverse revoke ' + 'right rlike role roles rollback rolling rollup round row row_count rowdependencies rowid rownum rows ' + 'rtrim rules safe salt sample save savepoint sb1 sb2 sb4 scan schema schemacheck scn scope scroll ' + 'sdo_georaster sdo_topo_geometry search sec_to_time second section securefile security seed segment select ' + 'self sequence sequential serializable server servererror session session_user sessions_per_user set ' + 'sets settings sha sha1 sha2 share shared shared_pool short show shrink shutdown si_averagecolor ' + 'si_colorhistogram si_featurelist si_positionalcolor si_stillimage si_texture siblings sid sign sin ' + 'size size_t sizes skip slave sleep smalldatetimefromparts smallfile snapshot some soname sort soundex ' + 'source space sparse spfile split sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows ' + 'sql_small_result sql_variant_property sqlcode sqldata sqlerror sqlname sqlstate sqrt square standalone ' + 'standby start starting startup statement static statistics stats_binomial_test stats_crosstab ' + 'stats_ks_test stats_mode stats_mw_test stats_one_way_anova stats_t_test_ stats_t_test_indep ' + 'stats_t_test_one stats_t_test_paired stats_wsr_test status std stddev stddev_pop stddev_samp stdev ' + 'stop storage store stored str str_to_date straight_join strcmp strict string struct stuff style subdate ' + 'subpartition subpartitions substitutable substr substring subtime subtring_index subtype success sum ' + 'suspend switch switchoffset switchover sync synchronous synonym sys sys_xmlagg sysasm sysaux sysdate ' + 'sysdatetimeoffset sysdba sysoper system system_user sysutcdatetime table tables tablespace tan tdo ' + 'template temporary terminated tertiary_weights test than then thread through tier ties time time_format ' + 'time_zone timediff timefromparts timeout timestamp timestampadd timestampdiff timezone_abbr ' + 'timezone_minute timezone_region to to_base64 to_date to_days to_seconds todatetimeoffset trace tracking ' + 'transaction transactional translate translation treat trigger trigger_nestlevel triggers trim truncate ' + 'try_cast try_convert try_parse type ub1 ub2 ub4 ucase unarchived unbounded uncompress ' + 'under undo unhex unicode uniform uninstall union unique unix_timestamp unknown unlimited unlock unpivot ' + 'unrecoverable unsafe unsigned until untrusted unusable unused update updated upgrade upped upper upsert ' + 'url urowid usable usage use use_stored_outlines user user_data user_resources users using utc_date ' + 'utc_timestamp uuid uuid_short validate validate_password_strength validation valist value values var ' + 'var_samp varcharc vari varia variab variabl variable variables variance varp varraw varrawc varray ' + 'verify version versions view virtual visible void wait wallet warning warnings week weekday weekofyear ' + 'wellformed when whene whenev wheneve whenever where while whitespace with within without work wrapped ' + 'xdb xml xmlagg xmlattributes xmlcast xmlcolattval xmlelement xmlexists xmlforest xmlindex xmlnamespaces ' + 'xmlpi xmlquery xmlroot xmlschema xmlserialize xmltable xmltype xor year year_to_month years yearweek',
	        literal: 'true false null',
	        built_in: 'array bigint binary bit blob boolean char character date dec decimal float int int8 integer interval number ' + 'numeric real record serial serial8 smallint text varchar varying void'
	      },
	      contains: [{
	        className: 'string',
	        begin: '\'', end: '\'',
	        contains: [hljs.BACKSLASH_ESCAPE, { begin: '\'\'' }]
	      }, {
	        className: 'string',
	        begin: '"', end: '"',
	        contains: [hljs.BACKSLASH_ESCAPE, { begin: '""' }]
	      }, {
	        className: 'string',
	        begin: '`', end: '`',
	        contains: [hljs.BACKSLASH_ESCAPE]
	      }, hljs.C_NUMBER_MODE, hljs.C_BLOCK_COMMENT_MODE, COMMENT_MODE]
	    }, hljs.C_BLOCK_COMMENT_MODE, COMMENT_MODE]
	  };
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (hljs) {
	  var LISP_IDENT_RE = '[a-zA-Z_\\-\\+\\*\\/\\<\\=\\>\\&\\#][a-zA-Z0-9_\\-\\+\\*\\/\\<\\=\\>\\&\\#!]*';
	  var MEC_RE = '\\|[^]*?\\|';
	  var LISP_SIMPLE_NUMBER_RE = '(\\-|\\+)?\\d+(\\.\\d+|\\/\\d+)?((d|e|f|l|s|D|E|F|L|S)(\\+|\\-)?\\d+)?';
	  var SHEBANG = {
	    className: 'meta',
	    begin: '^#!', end: '$'
	  };
	  var LITERAL = {
	    className: 'literal',
	    begin: '\\b(t{1}|nil)\\b'
	  };
	  var NUMBER = {
	    className: 'number',
	    variants: [{ begin: LISP_SIMPLE_NUMBER_RE, relevance: 0 }, { begin: '#(b|B)[0-1]+(/[0-1]+)?' }, { begin: '#(o|O)[0-7]+(/[0-7]+)?' }, { begin: '#(x|X)[0-9a-fA-F]+(/[0-9a-fA-F]+)?' }, { begin: '#(c|C)\\(' + LISP_SIMPLE_NUMBER_RE + ' +' + LISP_SIMPLE_NUMBER_RE, end: '\\)' }]
	  };
	  var STRING = hljs.inherit(hljs.QUOTE_STRING_MODE, { illegal: null });
	  var COMMENT = hljs.COMMENT(';', '$', {
	    relevance: 0
	  });
	  var VARIABLE = {
	    begin: '\\*', end: '\\*'
	  };
	  var KEYWORD = {
	    className: 'symbol',
	    begin: '[:&]' + LISP_IDENT_RE
	  };
	  var IDENT = {
	    begin: LISP_IDENT_RE,
	    relevance: 0
	  };
	  var MEC = {
	    begin: MEC_RE
	  };
	  var QUOTED_LIST = {
	    begin: '\\(', end: '\\)',
	    contains: ['self', LITERAL, STRING, NUMBER, IDENT]
	  };
	  var QUOTED = {
	    contains: [NUMBER, STRING, VARIABLE, KEYWORD, QUOTED_LIST, IDENT],
	    variants: [{
	      begin: '[\'`]\\(', end: '\\)'
	    }, {
	      begin: '\\(quote ', end: '\\)',
	      keywords: { name: 'quote' }
	    }, {
	      begin: '\'' + MEC_RE
	    }]
	  };
	  var QUOTED_ATOM = {
	    variants: [{ begin: '\'' + LISP_IDENT_RE }, { begin: '#\'' + LISP_IDENT_RE + '(::' + LISP_IDENT_RE + ')*' }]
	  };
	  var LIST = {
	    begin: '\\(\\s*', end: '\\)'
	  };
	  var BODY = {
	    endsWithParent: true,
	    relevance: 0
	  };
	  LIST.contains = [{
	    className: 'name',
	    variants: [{ begin: LISP_IDENT_RE }, { begin: MEC_RE }]
	  }, BODY];
	  BODY.contains = [QUOTED, QUOTED_ATOM, LIST, LITERAL, NUMBER, STRING, COMMENT, VARIABLE, KEYWORD, MEC, IDENT];
	
	  return {
	    illegal: /\S/,
	    contains: [NUMBER, SHEBANG, LITERAL, STRING, COMMENT, QUOTED, QUOTED_ATOM, LIST, IDENT]
	  };
	};

/***/ },
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */
/***/ function(module, exports) {

	"use strict";
	
	// Generated by CoffeeScript 1.10.0
	(function () {
	  var compile;
	
	  compile = function compile(input) {
	    var atom, call, char, expr, _exprR, factor, i, is_atom, list, _listR, lookahead, match, next, puts, recover, stack, term, _termR, tokens;
	    tokens = [];
	    is_atom = /[a-z0-9]/i;
	    i = 0;
	    while (i < input.length) {
	      switch (char = input[i]) {
	        case "+":
	        case "-":
	        case "*":
	        case "/":
	        case "(":
	        case ")":
	        case ",":
	          tokens.push(char);
	          i++;
	          break;
	        case " ":
	          i++;
	          break;
	        default:
	          if (is_atom.test(char)) {
	            tokens.push(function () {
	              var value;
	              value = '';
	              while (char && is_atom.test(char)) {
	                value += char;
	                char = input[++i];
	              }
	              return value;
	            }());
	          } else {
	            throw "Unknown input char: " + char;
	          }
	      }
	    }
	    next = function next() {
	      return tokens.shift();
	    };
	    lookahead = next();
	    match = function match(terminal) {
	      if (lookahead === terminal) {
	        return lookahead = next();
	      } else {
	        throw "Syntax error: Unexpected token " + terminal;
	      }
	    };
	    recover = function recover(token) {
	      tokens.unshift(lookahead);
	      return lookahead = token;
	    };
	    expr = function expr() {
	      term();
	      return _exprR();
	    };
	    _exprR = function exprR() {
	      if (lookahead === "+") {
	        match("+");
	        term();
	        puts("+");
	        return _exprR();
	      } else if (lookahead === "-") {
	        match("-");
	        term();
	        puts("-");
	        return _exprR();
	      }
	    };
	    term = function term() {
	      factor();
	      return _termR();
	    };
	    _termR = function termR() {
	      if (lookahead === "*") {
	        match("*");
	        factor();
	        puts("*");
	        return _termR();
	      } else if (lookahead === "/") {
	        match("/");
	        factor();
	        puts("/");
	        return _termR();
	      }
	    };
	    factor = function factor() {
	      if (lookahead === "(") {
	        match("(");
	        expr();
	        return match(")");
	      } else {
	        if (!call()) {
	          return atom();
	        }
	      }
	    };
	    call = function call() {
	      var token;
	      token = lookahead;
	      match(lookahead);
	      if (lookahead === "(") {
	        puts(false, "mark");
	        match("(");
	        list();
	        match(")");
	        puts(token, "call");
	        return true;
	      } else {
	        recover(token);
	        return false;
	      }
	    };
	    list = function list() {
	      expr();
	      return _listR();
	    };
	    _listR = function listR() {
	      if (lookahead === ",") {
	        match(",");
	        expr();
	        return _listR();
	      }
	    };
	    atom = function atom() {
	      if (is_atom.test(lookahead)) {
	        return match(puts(lookahead, "atom"));
	      } else {
	        throw "Syntax error: Unexpected token " + lookahead;
	      }
	    };
	    stack = [];
	    puts = function puts(token, type) {
	      var arg, args, func, op, x, y;
	      if (type == null) {
	        type = "op";
	      }
	      if (type === "op") {
	        op = token;
	        y = stack.pop();
	        x = stack.pop();
	        stack.push("(" + op + " " + x + " " + y + ")");
	      } else if (type === "call") {
	        func = token;
	        args = [];
	        while (arg = stack.pop()) {
	          if (!arg) {
	            break;
	          }
	          args.unshift(arg);
	        }
	        stack.push("(" + func + " " + args.join(' ') + ")");
	      } else {
	        stack.push(token);
	      }
	      return token;
	    };
	    expr();
	    return stack[0];
	  };
	
	  module.exports = compile;
	}).call(undefined);

/***/ }
/******/ ]);
//# sourceMappingURL=ultra-tiny-compiler.js.map