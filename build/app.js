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
	
	var _fastclick = __webpack_require__(1);
	
	var _fastclick2 = _interopRequireDefault(_fastclick);
	
	var _code = __webpack_require__(2);
	
	var _search = __webpack_require__(16);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_fastclick2.default.attach(document.body);
	(0, _code.highlightCodeBlocks)();
	(0, _search.search)();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;;(function () {
		'use strict';
	
		/**
		 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
		 *
		 * @codingstandard ftlabs-jsv2
		 * @copyright The Financial Times Limited [All Rights Reserved]
		 * @license MIT License (see LICENSE.txt)
		 */
	
		/*jslint browser:true, node:true*/
		/*global define, Event, Node*/
	
	
		/**
		 * Instantiate fast-clicking listeners on the specified layer.
		 *
		 * @constructor
		 * @param {Element} layer The layer to listen on
		 * @param {Object} [options={}] The options to override the defaults
		 */
		function FastClick(layer, options) {
			var oldOnClick;
	
			options = options || {};
	
			/**
			 * Whether a click is currently being tracked.
			 *
			 * @type boolean
			 */
			this.trackingClick = false;
	
	
			/**
			 * Timestamp for when click tracking started.
			 *
			 * @type number
			 */
			this.trackingClickStart = 0;
	
	
			/**
			 * The element being tracked for a click.
			 *
			 * @type EventTarget
			 */
			this.targetElement = null;
	
	
			/**
			 * X-coordinate of touch start event.
			 *
			 * @type number
			 */
			this.touchStartX = 0;
	
	
			/**
			 * Y-coordinate of touch start event.
			 *
			 * @type number
			 */
			this.touchStartY = 0;
	
	
			/**
			 * ID of the last touch, retrieved from Touch.identifier.
			 *
			 * @type number
			 */
			this.lastTouchIdentifier = 0;
	
	
			/**
			 * Touchmove boundary, beyond which a click will be cancelled.
			 *
			 * @type number
			 */
			this.touchBoundary = options.touchBoundary || 10;
	
	
			/**
			 * The FastClick layer.
			 *
			 * @type Element
			 */
			this.layer = layer;
	
			/**
			 * The minimum time between tap(touchstart and touchend) events
			 *
			 * @type number
			 */
			this.tapDelay = options.tapDelay || 200;
	
			/**
			 * The maximum time for a tap
			 *
			 * @type number
			 */
			this.tapTimeout = options.tapTimeout || 700;
	
			if (FastClick.notNeeded(layer)) {
				return;
			}
	
			// Some old versions of Android don't have Function.prototype.bind
			function bind(method, context) {
				return function() { return method.apply(context, arguments); };
			}
	
	
			var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
			var context = this;
			for (var i = 0, l = methods.length; i < l; i++) {
				context[methods[i]] = bind(context[methods[i]], context);
			}
	
			// Set up event handlers as required
			if (deviceIsAndroid) {
				layer.addEventListener('mouseover', this.onMouse, true);
				layer.addEventListener('mousedown', this.onMouse, true);
				layer.addEventListener('mouseup', this.onMouse, true);
			}
	
			layer.addEventListener('click', this.onClick, true);
			layer.addEventListener('touchstart', this.onTouchStart, false);
			layer.addEventListener('touchmove', this.onTouchMove, false);
			layer.addEventListener('touchend', this.onTouchEnd, false);
			layer.addEventListener('touchcancel', this.onTouchCancel, false);
	
			// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
			// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
			// layer when they are cancelled.
			if (!Event.prototype.stopImmediatePropagation) {
				layer.removeEventListener = function(type, callback, capture) {
					var rmv = Node.prototype.removeEventListener;
					if (type === 'click') {
						rmv.call(layer, type, callback.hijacked || callback, capture);
					} else {
						rmv.call(layer, type, callback, capture);
					}
				};
	
				layer.addEventListener = function(type, callback, capture) {
					var adv = Node.prototype.addEventListener;
					if (type === 'click') {
						adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
							if (!event.propagationStopped) {
								callback(event);
							}
						}), capture);
					} else {
						adv.call(layer, type, callback, capture);
					}
				};
			}
	
			// If a handler is already declared in the element's onclick attribute, it will be fired before
			// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
			// adding it as listener.
			if (typeof layer.onclick === 'function') {
	
				// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
				// - the old one won't work if passed to addEventListener directly.
				oldOnClick = layer.onclick;
				layer.addEventListener('click', function(event) {
					oldOnClick(event);
				}, false);
				layer.onclick = null;
			}
		}
	
		/**
		* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
		*
		* @type boolean
		*/
		var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;
	
		/**
		 * Android requires exceptions.
		 *
		 * @type boolean
		 */
		var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;
	
	
		/**
		 * iOS requires exceptions.
		 *
		 * @type boolean
		 */
		var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;
	
	
		/**
		 * iOS 4 requires an exception for select elements.
		 *
		 * @type boolean
		 */
		var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);
	
	
		/**
		 * iOS 6.0-7.* requires the target element to be manually derived
		 *
		 * @type boolean
		 */
		var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);
	
		/**
		 * BlackBerry requires exceptions.
		 *
		 * @type boolean
		 */
		var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;
	
		/**
		 * Determine whether a given element requires a native click.
		 *
		 * @param {EventTarget|Element} target Target DOM element
		 * @returns {boolean} Returns true if the element needs a native click
		 */
		FastClick.prototype.needsClick = function(target) {
			switch (target.nodeName.toLowerCase()) {
	
			// Don't send a synthetic click to disabled inputs (issue #62)
			case 'button':
			case 'select':
			case 'textarea':
				if (target.disabled) {
					return true;
				}
	
				break;
			case 'input':
	
				// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
				if ((deviceIsIOS && target.type === 'file') || target.disabled) {
					return true;
				}
	
				break;
			case 'label':
			case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
			case 'video':
				return true;
			}
	
			return (/\bneedsclick\b/).test(target.className);
		};
	
	
		/**
		 * Determine whether a given element requires a call to focus to simulate click into element.
		 *
		 * @param {EventTarget|Element} target Target DOM element
		 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
		 */
		FastClick.prototype.needsFocus = function(target) {
			switch (target.nodeName.toLowerCase()) {
			case 'textarea':
				return true;
			case 'select':
				return !deviceIsAndroid;
			case 'input':
				switch (target.type) {
				case 'button':
				case 'checkbox':
				case 'file':
				case 'image':
				case 'radio':
				case 'submit':
					return false;
				}
	
				// No point in attempting to focus disabled inputs
				return !target.disabled && !target.readOnly;
			default:
				return (/\bneedsfocus\b/).test(target.className);
			}
		};
	
	
		/**
		 * Send a click event to the specified element.
		 *
		 * @param {EventTarget|Element} targetElement
		 * @param {Event} event
		 */
		FastClick.prototype.sendClick = function(targetElement, event) {
			var clickEvent, touch;
	
			// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
			if (document.activeElement && document.activeElement !== targetElement) {
				document.activeElement.blur();
			}
	
			touch = event.changedTouches[0];
	
			// Synthesise a click event, with an extra attribute so it can be tracked
			clickEvent = document.createEvent('MouseEvents');
			clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
			clickEvent.forwardedTouchEvent = true;
			targetElement.dispatchEvent(clickEvent);
		};
	
		FastClick.prototype.determineEventType = function(targetElement) {
	
			//Issue #159: Android Chrome Select Box does not open with a synthetic click event
			if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
				return 'mousedown';
			}
	
			return 'click';
		};
	
	
		/**
		 * @param {EventTarget|Element} targetElement
		 */
		FastClick.prototype.focus = function(targetElement) {
			var length;
	
			// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
			if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
				length = targetElement.value.length;
				targetElement.setSelectionRange(length, length);
			} else {
				targetElement.focus();
			}
		};
	
	
		/**
		 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
		 *
		 * @param {EventTarget|Element} targetElement
		 */
		FastClick.prototype.updateScrollParent = function(targetElement) {
			var scrollParent, parentElement;
	
			scrollParent = targetElement.fastClickScrollParent;
	
			// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
			// target element was moved to another parent.
			if (!scrollParent || !scrollParent.contains(targetElement)) {
				parentElement = targetElement;
				do {
					if (parentElement.scrollHeight > parentElement.offsetHeight) {
						scrollParent = parentElement;
						targetElement.fastClickScrollParent = parentElement;
						break;
					}
	
					parentElement = parentElement.parentElement;
				} while (parentElement);
			}
	
			// Always update the scroll top tracker if possible.
			if (scrollParent) {
				scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
			}
		};
	
	
		/**
		 * @param {EventTarget} targetElement
		 * @returns {Element|EventTarget}
		 */
		FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
	
			// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
			if (eventTarget.nodeType === Node.TEXT_NODE) {
				return eventTarget.parentNode;
			}
	
			return eventTarget;
		};
	
	
		/**
		 * On touch start, record the position and scroll offset.
		 *
		 * @param {Event} event
		 * @returns {boolean}
		 */
		FastClick.prototype.onTouchStart = function(event) {
			var targetElement, touch, selection;
	
			// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
			if (event.targetTouches.length > 1) {
				return true;
			}
	
			targetElement = this.getTargetElementFromEventTarget(event.target);
			touch = event.targetTouches[0];
	
			if (deviceIsIOS) {
	
				// Only trusted events will deselect text on iOS (issue #49)
				selection = window.getSelection();
				if (selection.rangeCount && !selection.isCollapsed) {
					return true;
				}
	
				if (!deviceIsIOS4) {
	
					// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
					// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
					// with the same identifier as the touch event that previously triggered the click that triggered the alert.
					// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
					// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
					// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
					// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
					// random integers, it's safe to to continue if the identifier is 0 here.
					if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
						event.preventDefault();
						return false;
					}
	
					this.lastTouchIdentifier = touch.identifier;
	
					// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
					// 1) the user does a fling scroll on the scrollable layer
					// 2) the user stops the fling scroll with another tap
					// then the event.target of the last 'touchend' event will be the element that was under the user's finger
					// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
					// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
					this.updateScrollParent(targetElement);
				}
			}
	
			this.trackingClick = true;
			this.trackingClickStart = event.timeStamp;
			this.targetElement = targetElement;
	
			this.touchStartX = touch.pageX;
			this.touchStartY = touch.pageY;
	
			// Prevent phantom clicks on fast double-tap (issue #36)
			if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
				event.preventDefault();
			}
	
			return true;
		};
	
	
		/**
		 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
		 *
		 * @param {Event} event
		 * @returns {boolean}
		 */
		FastClick.prototype.touchHasMoved = function(event) {
			var touch = event.changedTouches[0], boundary = this.touchBoundary;
	
			if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
				return true;
			}
	
			return false;
		};
	
	
		/**
		 * Update the last position.
		 *
		 * @param {Event} event
		 * @returns {boolean}
		 */
		FastClick.prototype.onTouchMove = function(event) {
			if (!this.trackingClick) {
				return true;
			}
	
			// If the touch has moved, cancel the click tracking
			if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
				this.trackingClick = false;
				this.targetElement = null;
			}
	
			return true;
		};
	
	
		/**
		 * Attempt to find the labelled control for the given label element.
		 *
		 * @param {EventTarget|HTMLLabelElement} labelElement
		 * @returns {Element|null}
		 */
		FastClick.prototype.findControl = function(labelElement) {
	
			// Fast path for newer browsers supporting the HTML5 control attribute
			if (labelElement.control !== undefined) {
				return labelElement.control;
			}
	
			// All browsers under test that support touch events also support the HTML5 htmlFor attribute
			if (labelElement.htmlFor) {
				return document.getElementById(labelElement.htmlFor);
			}
	
			// If no for attribute exists, attempt to retrieve the first labellable descendant element
			// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
			return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
		};
	
	
		/**
		 * On touch end, determine whether to send a click event at once.
		 *
		 * @param {Event} event
		 * @returns {boolean}
		 */
		FastClick.prototype.onTouchEnd = function(event) {
			var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;
	
			if (!this.trackingClick) {
				return true;
			}
	
			// Prevent phantom clicks on fast double-tap (issue #36)
			if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
				this.cancelNextClick = true;
				return true;
			}
	
			if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
				return true;
			}
	
			// Reset to prevent wrong click cancel on input (issue #156).
			this.cancelNextClick = false;
	
			this.lastClickTime = event.timeStamp;
	
			trackingClickStart = this.trackingClickStart;
			this.trackingClick = false;
			this.trackingClickStart = 0;
	
			// On some iOS devices, the targetElement supplied with the event is invalid if the layer
			// is performing a transition or scroll, and has to be re-detected manually. Note that
			// for this to function correctly, it must be called *after* the event target is checked!
			// See issue #57; also filed as rdar://13048589 .
			if (deviceIsIOSWithBadTarget) {
				touch = event.changedTouches[0];
	
				// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
				targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
				targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
			}
	
			targetTagName = targetElement.tagName.toLowerCase();
			if (targetTagName === 'label') {
				forElement = this.findControl(targetElement);
				if (forElement) {
					this.focus(targetElement);
					if (deviceIsAndroid) {
						return false;
					}
	
					targetElement = forElement;
				}
			} else if (this.needsFocus(targetElement)) {
	
				// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
				// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
				if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
					this.targetElement = null;
					return false;
				}
	
				this.focus(targetElement);
				this.sendClick(targetElement, event);
	
				// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
				// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
				if (!deviceIsIOS || targetTagName !== 'select') {
					this.targetElement = null;
					event.preventDefault();
				}
	
				return false;
			}
	
			if (deviceIsIOS && !deviceIsIOS4) {
	
				// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
				// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
				scrollParent = targetElement.fastClickScrollParent;
				if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
					return true;
				}
			}
	
			// Prevent the actual click from going though - unless the target node is marked as requiring
			// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
			if (!this.needsClick(targetElement)) {
				event.preventDefault();
				this.sendClick(targetElement, event);
			}
	
			return false;
		};
	
	
		/**
		 * On touch cancel, stop tracking the click.
		 *
		 * @returns {void}
		 */
		FastClick.prototype.onTouchCancel = function() {
			this.trackingClick = false;
			this.targetElement = null;
		};
	
	
		/**
		 * Determine mouse events which should be permitted.
		 *
		 * @param {Event} event
		 * @returns {boolean}
		 */
		FastClick.prototype.onMouse = function(event) {
	
			// If a target element was never set (because a touch event was never fired) allow the event
			if (!this.targetElement) {
				return true;
			}
	
			if (event.forwardedTouchEvent) {
				return true;
			}
	
			// Programmatically generated events targeting a specific element should be permitted
			if (!event.cancelable) {
				return true;
			}
	
			// Derive and check the target element to see whether the mouse event needs to be permitted;
			// unless explicitly enabled, prevent non-touch click events from triggering actions,
			// to prevent ghost/doubleclicks.
			if (!this.needsClick(this.targetElement) || this.cancelNextClick) {
	
				// Prevent any user-added listeners declared on FastClick element from being fired.
				if (event.stopImmediatePropagation) {
					event.stopImmediatePropagation();
				} else {
	
					// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
					event.propagationStopped = true;
				}
	
				// Cancel the event
				event.stopPropagation();
				event.preventDefault();
	
				return false;
			}
	
			// If the mouse event is permitted, return true for the action to go through.
			return true;
		};
	
	
		/**
		 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
		 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
		 * an actual click which should be permitted.
		 *
		 * @param {Event} event
		 * @returns {boolean}
		 */
		FastClick.prototype.onClick = function(event) {
			var permitted;
	
			// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
			if (this.trackingClick) {
				this.targetElement = null;
				this.trackingClick = false;
				return true;
			}
	
			// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
			if (event.target.type === 'submit' && event.detail === 0) {
				return true;
			}
	
			permitted = this.onMouse(event);
	
			// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
			if (!permitted) {
				this.targetElement = null;
			}
	
			// If clicks are permitted, return true for the action to go through.
			return permitted;
		};
	
	
		/**
		 * Remove all FastClick's event listeners.
		 *
		 * @returns {void}
		 */
		FastClick.prototype.destroy = function() {
			var layer = this.layer;
	
			if (deviceIsAndroid) {
				layer.removeEventListener('mouseover', this.onMouse, true);
				layer.removeEventListener('mousedown', this.onMouse, true);
				layer.removeEventListener('mouseup', this.onMouse, true);
			}
	
			layer.removeEventListener('click', this.onClick, true);
			layer.removeEventListener('touchstart', this.onTouchStart, false);
			layer.removeEventListener('touchmove', this.onTouchMove, false);
			layer.removeEventListener('touchend', this.onTouchEnd, false);
			layer.removeEventListener('touchcancel', this.onTouchCancel, false);
		};
	
	
		/**
		 * Check whether FastClick is needed.
		 *
		 * @param {Element} layer The layer to listen on
		 */
		FastClick.notNeeded = function(layer) {
			var metaViewport;
			var chromeVersion;
			var blackberryVersion;
			var firefoxVersion;
	
			// Devices that don't support touch don't need FastClick
			if (typeof window.ontouchstart === 'undefined') {
				return true;
			}
	
			// Chrome version - zero for other browsers
			chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];
	
			if (chromeVersion) {
	
				if (deviceIsAndroid) {
					metaViewport = document.querySelector('meta[name=viewport]');
	
					if (metaViewport) {
						// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
						if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
							return true;
						}
						// Chrome 32 and above with width=device-width or less don't need FastClick
						if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
							return true;
						}
					}
	
				// Chrome desktop doesn't need FastClick (issue #15)
				} else {
					return true;
				}
			}
	
			if (deviceIsBlackBerry10) {
				blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);
	
				// BlackBerry 10.3+ does not require Fastclick library.
				// https://github.com/ftlabs/fastclick/issues/251
				if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
					metaViewport = document.querySelector('meta[name=viewport]');
	
					if (metaViewport) {
						// user-scalable=no eliminates click delay.
						if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
							return true;
						}
						// width=device-width (or less than device-width) eliminates click delay.
						if (document.documentElement.scrollWidth <= window.outerWidth) {
							return true;
						}
					}
				}
			}
	
			// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
			if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
				return true;
			}
	
			// Firefox version - zero for other browsers
			firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];
	
			if (firefoxVersion >= 27) {
				// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896
	
				metaViewport = document.querySelector('meta[name=viewport]');
				if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
					return true;
				}
			}
	
			// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
			// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
			if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
				return true;
			}
	
			return false;
		};
	
	
		/**
		 * Factory method for creating a FastClick object
		 *
		 * @param {Element} layer The layer to listen on
		 * @param {Object} [options={}] The options to override the defaults
		 */
		FastClick.attach = function(layer, options) {
			return new FastClick(layer, options);
		};
	
	
		if (true) {
	
			// AMD. Register as an anonymous module.
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return FastClick;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof module !== 'undefined' && module.exports) {
			module.exports = FastClick.attach;
			module.exports.FastClick = FastClick;
		} else {
			window.FastClick = FastClick;
		}
	}());


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.highlightCodeBlocks = highlightCodeBlocks;
	
	var _hljs = __webpack_require__(3);
	
	var _hljs2 = _interopRequireDefault(_hljs);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function highlightCodeBlocks() {
	  var blocks = document.querySelectorAll('pre[class="highlight"] code');
	  for (var i = 0; i < blocks.length; i++) {
	    _hljs2.default.highlightBlock(blocks[i]);
	  }
	}

/***/ },
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.search = search;
	
	var _monkberry = __webpack_require__(17);
	
	var _monkberry2 = _interopRequireDefault(_monkberry);
	
	var _results = __webpack_require__(18);
	
	var _results2 = _interopRequireDefault(_results);
	
	var _lunr = __webpack_require__(19);
	
	var _lunr2 = _interopRequireDefault(_lunr);
	
	__webpack_require__(20);
	
	__webpack_require__(21);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var MAX_RESULTS = 20;
	
	function search() {
	  // DOM Refs
	  var button = document.querySelector('[href="#search"]');
	  var root = document.querySelector('.js-search');
	  var form = root.querySelector('.form');
	  var input = form.querySelector('input[type="search"]');
	
	  // View
	  _monkberry2.default.mount(_results2.default);
	  var view = _monkberry2.default.render('results');
	  view.appendTo(form);
	
	  // State
	  var state = {
	    active: false,
	    indexed: false,
	    reference: [],
	    results: [],
	    foundedResults: 0,
	    selectedResult: 0,
	    lastSearchQuery: ''
	  };
	
	  // Index
	  var index = (0, _lunr2.default)(function () {
	    this.field('title', { boost: 10 });
	    this.field('content');
	  });
	
	  // Using the russian language extension.
	  _lunr2.default.ru.call(index);
	
	  button.addEventListener('click', function (event) {
	    event.preventDefault();
	    if (state.active) {
	      hide();
	    } else {
	      show();
	    }
	  });
	
	  root.addEventListener('click', function () {
	    hide();
	  });
	
	  input.addEventListener('keyup', debounce(function (event) {
	    var query = input.value;
	
	    if (state.lastSearchQuery == query) {
	      return;
	    }
	
	    if (query < 2) {
	      state.results = [];
	      state.foundedResults = 0;
	      state.selectedResult = 0;
	    } else {
	      state.results = [];
	      var i = undefined,
	          refs = index.search(state.lastSearchQuery = query);
	      for (i = 0; i < refs.length && i < MAX_RESULTS; i++) {
	        state.results.push(state.reference[refs[i].ref]);
	      }
	      state.foundedResults = i;
	      state.selectedResult = 0;
	    }
	
	    view.update(state);
	  }));
	
	  setInterval(function () {
	    if (input.value.length < 2) {
	      state.results = [];
	      state.foundedResults = 0;
	      state.selectedResult = 0;
	      view.update(state);
	    }
	  }, 500);
	
	  form.addEventListener('click', function (event) {
	    return event.stopPropagation();
	  });
	
	  document.addEventListener('keydown', function (event) {
	    switch (event.which) {
	      case 38:
	        // up
	        if (state.selectedResult > 0) {
	          state.selectedResult -= 1;
	          view.update({ selectedResult: state.selectedResult });
	        }
	        break;
	
	      case 40:
	        // down
	        if (state.selectedResult < state.foundedResults) {
	          state.selectedResult += 1;
	          view.update({ selectedResult: state.selectedResult });
	        }
	        break;
	
	      case 9:
	        // tab
	        state.selectedResult = 0;
	        view.update({ selectedResult: state.selectedResult });
	        return;
	
	      case 13:
	        // enter
	        var link = form.querySelector('a:nth-child(' + state.selectedResult + ')');
	        if (link) {
	          window.location.href = link.getAttribute('href');
	        } else {
	          return; // no link selected, but maybe active with tab.
	        }
	        break;
	
	      case 27:
	        // esc
	        hide();
	        break;
	
	      default:
	        return; // exit this handler for other keys
	    }
	
	    event.stopImmediatePropagation();
	    event.preventDefault();
	  });
	
	  // -------- |\
	  // Function ||
	  // -------- |/
	
	  function show() {
	    button.classList.add('active');
	    root.classList.add('active');
	    document.body.style.overflow = 'hidden';
	    state.active = true;
	    focus();
	
	    if (!state.indexed) {
	      populateIndex();
	    }
	  }
	
	  function hide() {
	    button.classList.remove('active');
	    root.classList.remove('active');
	    document.body.style.overflow = 'auto';
	    state.active = false;
	  }
	
	  function focus() {
	    input.focus();
	  }
	
	  function populateIndex() {
	    state.indexed = true;
	    var script = document.createElement('script');
	    script.setAttribute('src', '/index.js');
	    document.body.appendChild(script);
	  }
	
	  window.indexCallback = function indexCallback(data) {
	    state.reference = data;
	    state.reference.forEach(function (obj) {
	      index.add(obj);
	    });
	  };
	
	  function debounce(fn) {
	    var timeout = undefined;
	    return function () {
	      var args = Array.prototype.slice.call(arguments),
	          ctx = this;
	
	      clearTimeout(timeout);
	      timeout = setTimeout(function () {
	        fn.apply(ctx, args);
	      }, 100);
	    };
	  }
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	(function (document) {
	  /**
	   * Monkberry.
	   * @class
	   */
	  function Monkberry() {
	    this.pool = new Pool();
	    this.templates = {};
	    this.filters = {};
	    this.wrappers = {};
	  }
	
	  Monkberry.prototype.foreach = function (parent, node, map, template, data, array, options) {
	    var i, j, len, keys, transform, arrayLength, childrenSize = map.length;
	
	    if (Array.isArray(array)) {
	      transform = transformArray;
	      arrayLength = array.length;
	    } else {
	      transform = transformObject;
	      keys = Object.keys(array);
	      arrayLength = keys.length;
	    }
	
	    len = childrenSize - arrayLength;
	    for (i in map.items) {
	      if (len-- > 0) {
	        map.items[i].remove();
	      } else {
	        break;
	      }
	    }
	
	    j = 0;
	    for (i in map.items) {
	      map.items[i].update(transform(data, array, keys, j, options));
	      j++;
	    }
	
	    for (j = childrenSize, len = arrayLength; j < len; j++) {
	      // Render new view.
	      var view = this._render(template);
	
	      // Set view hierarchy.
	      view.parent = parent;
	      parent.nested.push(view);
	
	      // Add nodes DOM.
	      if (node.nodeType == 8) {
	        view.insertBefore(node);
	      } else {
	        view.appendTo(node);
	      }
	
	      // Set view data (note what it must be after adding nodes to DOM).
	      view.update(transform(data, array, keys, j, options));
	
	      // Remember to remove from children map on view remove.
	      i = map.push(view);
	      view.onRemove = (function (i) {
	        return function () {
	          map.remove(i);
	        };
	      })(i);
	    }
	  };
	
	  Monkberry.prototype.insert = function (parent, node, child/*.ref*/, template, data, test) {
	    if (child.ref) {
	      if (test) {
	        child.ref.update(data);
	      } else {
	        child.ref.remove();
	      }
	    } else if (test) {
	      // Render new view.
	      var view = this._render(template);
	
	      // Set view hierarchy.
	      view.parent = parent;
	      parent.nested.push(view);
	
	      // Add nodes DOM.
	      if (node.nodeType == 8) {
	        view.insertBefore(node);
	      } else {
	        view.appendTo(node);
	      }
	
	      // Set view data (note what it must be after adding nodes to DOM).
	      view.update(data);
	
	      // Remember to remove child ref on remove of view.
	      child.ref = view;
	      view.onRemove = function () {
	        child.ref = null;
	      };
	    }
	
	    return test;
	  };
	
	  /**
	   * Render template to view.
	   * @param {string} name - Template name.
	   * @param {Object} values - Data to update view.
	   * @param {boolean} noCache - Do not take views from pool.
	   * @return {Monkberry.View}
	   */
	  Monkberry.prototype.render = function (name, values, noCache) {
	    return this._render(name, values, noCache);
	  };
	
	  /**
	   * This method is used only for private rendering of views.
	   * @private
	   */
	  Monkberry.prototype._render = function (name, values, noCache) {
	    noCache = noCache || false;
	
	    if (this.templates[name]) {
	      var view;
	
	      if (noCache) {
	        view = this.templates[name]();
	        view.name = name;
	        view.pool = this.pool;
	      } else {
	        view = this.pool.pull(name);
	        if (!view) {
	          view = this.templates[name]();
	          view.name = name;
	          view.pool = this.pool;
	        }
	      }
	
	      if (values !== undefined) {
	        view.update(values);
	      }
	
	      if (view.onRender) {
	        view.onRender();
	      }
	
	      if (this.wrappers[name] && !view.wrapped[name]) {
	        view = this.wrappers[name](view);
	        view.wrapped[name] = true;
	      }
	
	      return view;
	    } else {
	      throw new Error('Template with name "' + name + '" does not found.');
	    }
	  };
	
	  /**
	   * Prerepder view for future usage.
	   * @param {string} name - Template name.
	   * @param {number} times - Times of prerender.
	   */
	  Monkberry.prototype.prerender = function (name, times) {
	    while (times--) {
	      this.pool.push(name, this.render(name, undefined, true));
	    }
	  };
	
	  /**
	   * Mount template into monkberry.
	   * @param {Object} templates
	   */
	  Monkberry.prototype.mount = function (templates) {
	    var _this = this;
	
	    // Some of templates mounts as factory which returns list of templates.
	    if (typeof templates === 'function') {
	      templates = templates(this, document);
	    }
	
	    Object.keys(templates).forEach(function (name) {
	      _this.templates[name] = templates[name];
	    });
	  };
	
	  Monkberry.prototype.view = function () {
	    return new Monkberry.View;
	  };
	
	  Monkberry.prototype.map = function () {
	    return new Map;
	  };
	
	  /**
	   * Main class for view.
	   * @class
	   */
	  Monkberry.View = function View() {
	    this.name = ''; // Name of template.
	    this.parent = null; // Parent view.
	    this.nested = []; // Nested views.
	    this.nodes = []; // Root DOM nodes.
	    this.wrapped = {}; // List of already applied wrappers.
	    this.onRender = null; // Function to call on render.
	    this.onRemove = null; // Function to call on remove.
	  };
	
	  /**
	   * Updates view. You can specify only part of data what is needs to be updated.
	   * @param {Object} data
	   */
	  Monkberry.View.prototype.update = function (data) {
	    var _this = this;
	
	    // Collect keys.
	    var keys = typeof data === 'object' ? Object.keys(data) : [];
	
	    // Clear cache to prevent double updating.
	    if (_this.__cache__) {
	      keys.forEach(function (key) {
	        if (key in _this.__cache__) {
	          delete _this.__cache__[key];
	        }
	      });
	    }
	
	    // Update view.
	    if (_this.__update__) {
	      keys.forEach(function (key) {
	        if (_this.__update__.hasOwnProperty(key)) {
	          _this.__update__[key](data, data[key]);
	        }
	      });
	    }
	  };
	
	  /**
	   * @param {Element} toNode
	   */
	  Monkberry.View.prototype.appendTo = function (toNode) {
	    for (var i = 0, len = this.nodes.length; i < len; i++) {
	      toNode.appendChild(this.nodes[i]);
	    }
	  };
	
	  /**
	   * @param {Element} toNode
	   */
	  Monkberry.View.prototype.insertBefore = function (toNode) {
	    if (toNode.parentNode) {
	      for (var i = 0, len = this.nodes.length; i < len; i++) {
	        toNode.parentNode.insertBefore(this.nodes[i], toNode);
	      }
	    } else {
	      throw new Error(
	        "Can not insert child view into parent node. " +
	        "You need append your view first and then update."
	      );
	    }
	  };
	
	  /**
	   * Return rendered node, or DocumentFragment of rendered nodes if more then one root node in template.
	   * @returns {Element|DocumentFragment}
	   */
	  Monkberry.View.prototype.createDocument = function () {
	    if (this.nodes.length == 1) {
	      return this.nodes[0];
	    } else {
	      var fragment = document.createDocumentFragment();
	      for (var i = 0, len = this.nodes.length; i < len; i++) {
	        fragment.appendChild(this.nodes[i]);
	      }
	      return fragment;
	    }
	  };
	
	  /**
	   * @deprecated since version 3.1.0. Use createDocument() instead.
	   * @returns {Element|DocumentFragment}
	   */
	  Monkberry.View.prototype.dom = function () {
	    return this.createDocument();
	  };
	
	  /**
	   * Remove view from DOM.
	   * @param {boolean} force - If true, do not put this view into pool.
	   */
	  Monkberry.View.prototype.remove = function (force) {
	    force = force || false;
	    // Remove appended nodes.
	    var i = this.nodes.length;
	    while (i--) {
	      this.nodes[i].parentNode.removeChild(this.nodes[i]);
	    }
	    // Remove self from parent's children map or child ref.
	    if (this.onRemove) {
	      this.onRemove();
	    }
	    // Remove all nested views.
	    i = this.nested.length;
	    while (i--) {
	      this.nested[i].remove(force);
	    }
	    // Remove this view from parent's nested views.
	    if (this.parent) {
	      i = this.parent.nested.indexOf(this);
	      this.parent.nested.splice(i, 1);
	    }
	    // Store view in pool for reuse in future.
	    if (!force) {
	      this.pool.push(this.name, this);
	    }
	  };
	
	  /**
	   * @param {string} id
	   * @returns {Element}
	   * @deprecated Use querySelector instead of.
	   */
	  Monkberry.View.prototype.getElementById = function (id) {
	    for (var i = 0; i < this.nodes.length; i++) {
	      var node = this.nodes[i];
	
	      do {
	        if (node.id == id) {
	          return node;
	        }
	
	        // Iterate over children.
	        node = node.firstChild || node.nextSibling || function () {
	            while ((node = node.parentNode) && !node.nextSibling);
	            return node ? node.nextSibling : null;
	          }();
	      } while (node);
	
	    }
	    return null;
	  };
	
	  /**
	   * @param {string} query
	   * @returns {Element}
	   */
	  Monkberry.View.prototype.querySelector = function (query) {
	    for (var i = 0; i < this.nodes.length; i++) {
	      if (this.nodes[i].matches && this.nodes[i].matches(query)) {
	        return this.nodes[i];
	      }
	
	      if (this.nodes[i].nodeType === 8) {
	        throw 'Can not use querySelector with non-element nodes on first level.';
	      }
	
	      if (this.nodes[i].querySelector) {
	        var element = this.nodes[i].querySelector(query);
	        if (element) {
	          return element;
	        }
	      }
	    }
	    return null;
	  };
	
	  /**
	   * Pool stores pre rendered views for faster template
	   * rendering and removed views for reuseing DOM nodes.
	   */
	  function Pool() {
	    this.store = {};
	  }
	
	  Pool.prototype.push = function (name, view) {
	    if (!this.store[name]) {
	      this.store[name] = [];
	    }
	    this.store[name].push(view);
	  };
	
	  Pool.prototype.pull = function (name) {
	    if (this.store[name]) {
	      return this.store[name].pop();
	    } else {
	      return void 0;
	    }
	  };
	
	  /**
	   * Simple Map implementation with length property.
	   */
	  function Map() {
	    this.items = Object.create(null);
	    this.length = 0;
	    this.next = 0;
	  }
	
	  Map.prototype.push = function (element) {
	    this.items[this.next] = element;
	    this.length += 1;
	    this.next += 1;
	    return this.next - 1;
	  };
	
	  Map.prototype.remove = function (i) {
	    if (i in this.items) {
	      delete this.items[i];
	      this.length -= 1;
	    } else {
	      throw new Error('You are trying to delete not existing element "' + i + '" form map.');
	    }
	  };
	
	  Map.prototype.forEach = function (callback) {
	    for (var i in this.items) {
	      callback(this.items[i]);
	    }
	  };
	
	  //
	  // Helper function for working with foreach loops data.
	  // Will transform data for "key, value of array" constructions.
	  //
	
	  function transformArray(data, array, keys, i, options) {
	    if (options) {
	      var t = data;
	      t[options.value] = array[i];
	
	      if (options.key) {
	        t[options.key] = i;
	      }
	
	      return t;
	    } else {
	      return array[i];
	    }
	  }
	
	  function transformObject(data, array, keys, i, options) {
	    if (options) {
	      var t = data;
	      t[options.value] = array[keys[i]];
	
	      if (options.key) {
	        t[options.key] = keys[i];
	      }
	
	      return t;
	    } else {
	      return array[keys[i]];
	    }
	  }
	
	  if (true) {
	    module.exports = new Monkberry();
	  } else {
	    window.monkberry = new Monkberry();
	  }
	})(window.document);


/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = function (monkberry, document) {
	var __filters = monkberry.filters;
	return {
	"results": function () {
	  // Create elements
	  var div0 = document.createElement('div');
	  var children0 = monkberry.map();
	
	  // Construct dom
	  div0.setAttribute("class", "results");
	
	  // Create view
	  var view = monkberry.view();
	
	  // Update functions
	  view.__update__ = {
	    results: function (__data__, results) {
	      monkberry.foreach(view, div0, children0, 'results.for0', __data__, results, {"key":"i","value":"result"});
	    },
	    selectedResult: function (__data__, selectedResult) {
	      children0.forEach(function (view) {
	        if (view.__update__.hasOwnProperty('selectedResult')) view.__update__.selectedResult(__data__, selectedResult);
	      });
	    }
	  };
	
	  // Set root nodes
	  view.nodes = [div0];
	  return view;
	},
	"results.for0": function () {
	  // Create elements
	  var a0 = document.createElement('a');
	  var div1 = document.createElement('div');
	  var text2 = document.createTextNode('');
	  var div3 = document.createElement('div');
	  var text4 = document.createTextNode('');
	
	  // Construct dom
	  div1.appendChild(text2);
	  div1.setAttribute("class", "title");
	  div3.appendChild(text4);
	  div3.setAttribute("class", "content");
	  a0.appendChild(div1);
	  a0.appendChild(div3);
	  a0.setAttribute("class", "result ");
	
	  // Create view
	  var view = monkberry.view();
	
	  // Complex update functions
	  var __cache__ = view.__cache__ = {};
	  var λ = {
	    i_selectedResult: function (__data__, i, selectedResult) {
	      a0.setAttribute("class", ("result ") + ((((selectedResult) - (1)) == (i)) ? 'active' : ''));
	    }
	  };
	
	  // Update functions
	  view.__update__ = {
	    result: function (__data__, result) {
	      text2.textContent = result.title;
	      text4.textContent = result.content.slice(0, 150);
	      a0.setAttribute("href", result.url);
	    },
	    i: function (__data__, i) {
	      __cache__.i = i;
	      if (__cache__.i !== undefined && __cache__.selectedResult !== undefined) {
	        λ.i_selectedResult(__data__, __cache__.i, __cache__.selectedResult);
	      }
	    },
	    selectedResult: function (__data__, selectedResult) {
	      __cache__.selectedResult = selectedResult;
	      if (__cache__.i !== undefined && __cache__.selectedResult !== undefined) {
	        λ.i_selectedResult(__data__, __cache__.i, __cache__.selectedResult);
	      }
	    }
	  };

	  // Set root nodes
	  view.nodes = [a0];
	  return view;
	}};
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	/**
	 * lunr - http://lunrjs.com - A bit like Solr, but much smaller and not as bright - 0.4.1
	 * Copyright (C) 2013 Oliver Nightingale
	 * MIT Licensed
	 * @license
	 */
	
	/**
	 * Convenience function for instantiating a new lunr index and configuring it
	 * with the default pipeline functions and the passed config function.
	 *
	 * When using this convenience function a new index will be created with the
	 * following functions already in the pipeline:
	 *
	 * lunr.StopWordFilter - filters out any stop words before they enter the
	 * index
	 *
	 * lunr.stemmer - stems the tokens before entering the index.
	 *
	 * Example:
	 *
	 *     var idx = lunr(function () {
	 *       this.field('title', 10)
	 *       this.field('tags', 100)
	 *       this.field('body')
	 *       
	 *       this.ref('cid')
	 *       
	 *       this.pipeline.add(function () {
	 *         // some custom pipeline function
	 *       })
	 *       
	 *     })
	 *
	 * @param {Function} config A function that will be called with the new instance
	 * of the lunr.Index as both its context and first parameter. It can be used to
	 * customize the instance of new lunr.Index.
	 * @namespace
	 * @module
	 * @returns {lunr.Index}
	 *
	 */
	var lunr = function lunr(config) {
	  var idx = new lunr.Index();
	
	  idx.pipeline.add(lunr.stopWordFilter, lunr.stemmer);
	
	  if (config) config.call(idx, idx);
	
	  return idx;
	};
	
	lunr.version = "0.4.1";
	
	if (true) {
	  module.exports = lunr;
	}
	/*!
	 * lunr.utils
	 * Copyright (C) 2013 Oliver Nightingale
	 */
	
	/**
	 * A namespace containing utils for the rest of the lunr library
	 */
	lunr.utils = {};
	
	/**
	 * Print a warning message to the console.
	 *
	 * @param {String} message The message to be printed.
	 * @memberOf Utils
	 */
	lunr.utils.warn = function (global) {
	  return function (message) {
	    if (console && console.warn) {
	      // No warn.
	      //console.warn(message)
	    }
	  };
	}(undefined);
	
	/**
	 * Returns a zero filled array of the length specified.
	 *
	 * @param {Number} length The number of zeros required.
	 * @returns {Array}
	 * @memberOf Utils
	 */
	lunr.utils.zeroFillArray = function () {
	  var zeros = [0];
	
	  return function (length) {
	    while (zeros.length < length) {
	      zeros = zeros.concat(zeros);
	    }
	
	    return zeros.slice(0, length);
	  };
	}();
	/*!
	 * lunr.EventEmitter
	 * Copyright (C) 2013 Oliver Nightingale
	 */
	
	/**
	 * lunr.EventEmitter is an event emitter for lunr. It manages adding and removing event handlers and triggering events and their handlers.
	 *
	 * @constructor
	 */
	lunr.EventEmitter = function () {
	  this.events = {};
	};
	
	/**
	 * Binds a handler function to a specific event(s).
	 *
	 * Can bind a single function to many different events in one call.
	 *
	 * @param {String} [eventName] The name(s) of events to bind this function to.
	 * @param {Function} handler The function to call when an event is fired.
	 * @memberOf EventEmitter
	 */
	lunr.EventEmitter.prototype.addListener = function () {
	  var args = Array.prototype.slice.call(arguments),
	      fn = args.pop(),
	      names = args;
	
	  if (typeof fn !== "function") throw new TypeError("last argument must be a function");
	
	  names.forEach(function (name) {
	    if (!this.hasHandler(name)) this.events[name] = [];
	    this.events[name].push(fn);
	  }, this);
	};
	
	/**
	 * Removes a handler function from a specific event.
	 *
	 * @param {String} eventName The name of the event to remove this function from.
	 * @param {Function} handler The function to remove from an event.
	 * @memberOf EventEmitter
	 */
	lunr.EventEmitter.prototype.removeListener = function (name, fn) {
	  if (!this.hasHandler(name)) return;
	
	  var fnIndex = this.events[name].indexOf(fn);
	  this.events[name].splice(fnIndex, 1);
	
	  if (!this.events[name].length) delete this.events[name];
	};
	
	/**
	 * Calls all functions bound to the given event.
	 *
	 * Additional data can be passed to the event handler as arguments to `emit`
	 * after the event name.
	 *
	 * @param {String} eventName The name of the event to emit.
	 * @memberOf EventEmitter
	 */
	lunr.EventEmitter.prototype.emit = function (name) {
	  if (!this.hasHandler(name)) return;
	
	  var args = Array.prototype.slice.call(arguments, 1);
	
	  this.events[name].forEach(function (fn) {
	    fn.apply(undefined, args);
	  });
	};
	
	/**
	 * Checks whether a handler has ever been stored against an event.
	 *
	 * @param {String} eventName The name of the event to check.
	 * @private
	 * @memberOf EventEmitter
	 */
	lunr.EventEmitter.prototype.hasHandler = function (name) {
	  return name in this.events;
	};
	
	/*!
	 * lunr.tokenizer
	 * Copyright (C) 2013 Oliver Nightingale
	 */
	
	/**
	 * A function for splitting a string into tokens ready to be inserted into
	 * the search index.
	 *
	 * @module
	 * @param {String} str The string to convert into tokens
	 * @returns {Array}
	 */
	lunr.tokenizer = function (str) {
	  if (!str) return [];
	  if (Array.isArray(str)) return str.map(function (t) {
	    return t.toLowerCase();
	  });
	
	  var str = str.replace(/^\s+/, '');
	
	  for (var i = str.length - 1; i >= 0; i--) {
	    if (/\S/.test(str.charAt(i))) {
	      str = str.substring(0, i + 1);
	      break;
	    }
	  }
	
	  return str.split(/\s+/).map(function (token) {
	    return token.replace(/^\W+/, '').replace(/\W+$/, '').toLowerCase();
	  });
	};
	/*!
	 * lunr.Pipeline
	 * Copyright (C) 2013 Oliver Nightingale
	 */
	
	/**
	 * lunr.Pipelines maintain an ordered list of functions to be applied to all
	 * tokens in documents entering the search index and queries being ran against
	 * the index.
	 *
	 * An instance of lunr.Index created with the lunr shortcut will contain a
	 * pipeline with a stop word filter and an English language stemmer. Extra
	 * functions can be added before or after either of these functions or these
	 * default functions can be removed.
	 *
	 * When run the pipeline will call each function in turn, passing a token, the
	 * index of that token in the original list of all tokens and finally a list of
	 * all the original tokens.
	 *
	 * The output of functions in the pipeline will be passed to the next function
	 * in the pipeline. To exclude a token from entering the index the function
	 * should return undefined, the rest of the pipeline will not be called with
	 * this token.
	 *
	 * For serialisation of pipelines to work, all functions used in an instance of
	 * a pipeline should be registered with lunr.Pipeline. Registered functions can
	 * then be loaded. If trying to load a serialised pipeline that uses functions
	 * that are not registered an error will be thrown.
	 *
	 * If not planning on serialising the pipeline then registering pipeline functions
	 * is not necessary.
	 *
	 * @constructor
	 */
	lunr.Pipeline = function () {
	  this._stack = [];
	};
	
	lunr.Pipeline.registeredFunctions = {};
	
	/**
	 * Register a function with the pipeline.
	 *
	 * Functions that are used in the pipeline should be registered if the pipeline
	 * needs to be serialised, or a serialised pipeline needs to be loaded.
	 *
	 * Registering a function does not add it to a pipeline, functions must still be
	 * added to instances of the pipeline for them to be used when running a pipeline.
	 *
	 * @param {Function} fn The function to check for.
	 * @param {String} label The label to register this function with
	 * @memberOf Pipeline
	 */
	lunr.Pipeline.registerFunction = function (fn, label) {
	  if (label in this.registeredFunctions) {
	    lunr.utils.warn('Overwriting existing registered function: ' + label);
	  }
	
	  fn.label = label;
	  lunr.Pipeline.registeredFunctions[fn.label] = fn;
	};
	
	/**
	 * Warns if the function is not registered as a Pipeline function.
	 *
	 * @param {Function} fn The function to check for.
	 * @private
	 * @memberOf Pipeline
	 */
	lunr.Pipeline.warnIfFunctionNotRegistered = function (fn) {
	  var isRegistered = fn.label && fn.label in this.registeredFunctions;
	
	  if (!isRegistered) {
	    lunr.utils.warn('Function is not registered with pipeline. This may cause problems when serialising the index.\n', fn);
	  }
	};
	
	/**
	 * Loads a previously serialised pipeline.
	 *
	 * All functions to be loaded must already be registered with lunr.Pipeline.
	 * If any function from the serialised data has not been registered then an
	 * error will be thrown.
	 *
	 * @param {Object} serialised The serialised pipeline to load.
	 * @returns {lunr.Pipeline}
	 * @memberOf Pipeline
	 */
	lunr.Pipeline.load = function (serialised) {
	  var pipeline = new lunr.Pipeline();
	
	  serialised.forEach(function (fnName) {
	    var fn = lunr.Pipeline.registeredFunctions[fnName];
	
	    if (fn) {
	      pipeline.add(fn);
	    } else {
	      throw new Error('Cannot load un-registered function: ' + fnName);
	    }
	  });
	
	  return pipeline;
	};
	
	/**
	 * Adds new functions to the end of the pipeline.
	 *
	 * Logs a warning if the function has not been registered.
	 *
	 * @param {Function} functions Any number of functions to add to the pipeline.
	 * @memberOf Pipeline
	 */
	lunr.Pipeline.prototype.add = function () {
	  var fns = Array.prototype.slice.call(arguments);
	
	  fns.forEach(function (fn) {
	    lunr.Pipeline.warnIfFunctionNotRegistered(fn);
	    this._stack.push(fn);
	  }, this);
	};
	
	/**
	 * Adds a single function after a function that already exists in the
	 * pipeline.
	 *
	 * Logs a warning if the function has not been registered.
	 *
	 * @param {Function} existingFn A function that already exists in the pipeline.
	 * @param {Function} newFn The new function to add to the pipeline.
	 * @memberOf Pipeline
	 */
	lunr.Pipeline.prototype.after = function (existingFn, newFn) {
	  lunr.Pipeline.warnIfFunctionNotRegistered(newFn);
	
	  var pos = this._stack.indexOf(existingFn) + 1;
	  this._stack.splice(pos, 0, newFn);
	};
	
	/**
	 * Adds a single function before a function that already exists in the
	 * pipeline.
	 *
	 * Logs a warning if the function has not been registered.
	 *
	 * @param {Function} existingFn A function that already exists in the pipeline.
	 * @param {Function} newFn The new function to add to the pipeline.
	 * @memberOf Pipeline
	 */
	lunr.Pipeline.prototype.before = function (existingFn, newFn) {
	  lunr.Pipeline.warnIfFunctionNotRegistered(newFn);
	
	  var pos = this._stack.indexOf(existingFn);
	  this._stack.splice(pos, 0, newFn);
	};
	
	/**
	 * Removes a function from the pipeline.
	 *
	 * @param {Function} fn The function to remove from the pipeline.
	 * @memberOf Pipeline
	 */
	lunr.Pipeline.prototype.remove = function (fn) {
	  var pos = this._stack.indexOf(fn);
	  this._stack.splice(pos, 1);
	};
	
	/**
	 * Runs the current list of functions that make up the pipeline against the
	 * passed tokens.
	 *
	 * @param {Array} tokens The tokens to run through the pipeline.
	 * @returns {Array}
	 * @memberOf Pipeline
	 */
	lunr.Pipeline.prototype.run = function (tokens) {
	  var out = [],
	      tokenLength = tokens.length,
	      stackLength = this._stack.length;
	
	  for (var i = 0; i < tokenLength; i++) {
	    var token = tokens[i];
	
	    for (var j = 0; j < stackLength; j++) {
	      token = this._stack[j](token, i, tokens);
	      if (token === void 0) break;
	    };
	
	    if (token !== void 0) out.push(token);
	  };
	
	  return out;
	};
	
	/**
	 * Returns a representation of the pipeline ready for serialisation.
	 *
	 * Logs a warning if the function has not been registered.
	 *
	 * @returns {Array}
	 * @memberOf Pipeline
	 */
	lunr.Pipeline.prototype.toJSON = function () {
	  return this._stack.map(function (fn) {
	    lunr.Pipeline.warnIfFunctionNotRegistered(fn);
	
	    return fn.label;
	  });
	};
	/*!
	 * lunr.Vector
	 * Copyright (C) 2013 Oliver Nightingale
	 */
	
	/**
	 * lunr.Vectors wrap arrays and add vector related operations for the array
	 * elements.
	 *
	 * @constructor
	 * @param {Array} elements Elements that make up the vector.
	 */
	lunr.Vector = function (elements) {
	  this.elements = elements;
	};
	
	/**
	 * Calculates the magnitude of this vector.
	 *
	 * @returns {Number}
	 * @memberOf Vector
	 */
	lunr.Vector.prototype.magnitude = function () {
	  if (this._magnitude) return this._magnitude;
	
	  var sumOfSquares = 0,
	      elems = this.elements,
	      len = elems.length,
	      el;
	
	  for (var i = 0; i < len; i++) {
	    el = elems[i];
	    sumOfSquares += el * el;
	  };
	
	  return this._magnitude = Math.sqrt(sumOfSquares);
	};
	
	/**
	 * Calculates the dot product of this vector and another vector.
	 *
	 * @param {lunr.Vector} otherVector The vector to compute the dot product with.
	 * @returns {Number}
	 * @memberOf Vector
	 */
	lunr.Vector.prototype.dot = function (otherVector) {
	  var elem1 = this.elements,
	      elem2 = otherVector.elements,
	      length = elem1.length,
	      dotProduct = 0;
	
	  for (var i = 0; i < length; i++) {
	    dotProduct += elem1[i] * elem2[i];
	  };
	
	  return dotProduct;
	};
	
	/**
	 * Calculates the cosine similarity between this vector and another
	 * vector.
	 *
	 * @param {lunr.Vector} otherVector The other vector to calculate the
	 * similarity with.
	 * @returns {Number}
	 * @memberOf Vector
	 */
	lunr.Vector.prototype.similarity = function (otherVector) {
	  return this.dot(otherVector) / (this.magnitude() * otherVector.magnitude());
	};
	
	/**
	 * Converts this vector back into an array.
	 *
	 * @returns {Array}
	 * @memberOf Vector
	 */
	lunr.Vector.prototype.toArray = function () {
	  return this.elements;
	};
	/*!
	 * lunr.SortedSet
	 * Copyright (C) 2013 Oliver Nightingale
	 */
	
	/**
	 * lunr.SortedSets are used to maintain an array of uniq values in a sorted
	 * order.
	 *
	 * @constructor
	 */
	lunr.SortedSet = function () {
	  this.length = 0;
	  this.elements = [];
	};
	
	/**
	 * Loads a previously serialised sorted set.
	 *
	 * @param {Array} serialisedData The serialised set to load.
	 * @returns {lunr.SortedSet}
	 * @memberOf SortedSet
	 */
	lunr.SortedSet.load = function (serialisedData) {
	  var set = new this();
	
	  set.elements = serialisedData;
	  set.length = serialisedData.length;
	
	  return set;
	};
	
	/**
	 * Inserts new items into the set in the correct position to maintain the
	 * order.
	 *
	 * @param {Object} The objects to add to this set.
	 * @memberOf SortedSet
	 */
	lunr.SortedSet.prototype.add = function () {
	  Array.prototype.slice.call(arguments).forEach(function (element) {
	    if (~this.indexOf(element)) return;
	    this.elements.splice(this.locationFor(element), 0, element);
	  }, this);
	
	  this.length = this.elements.length;
	};
	
	/**
	 * Converts this sorted set into an array.
	 *
	 * @returns {Array}
	 * @memberOf SortedSet
	 */
	lunr.SortedSet.prototype.toArray = function () {
	  return this.elements.slice();
	};
	
	/**
	 * Creates a new array with the results of calling a provided function on every
	 * element in this sorted set.
	 *
	 * Delegates to Array.prototype.map and has the same signature.
	 *
	 * @param {Function} fn The function that is called on each element of the
	 * set.
	 * @param {Object} ctx An optional object that can be used as the context
	 * for the function fn.
	 * @returns {Array}
	 * @memberOf SortedSet
	 */
	lunr.SortedSet.prototype.map = function (fn, ctx) {
	  return this.elements.map(fn, ctx);
	};
	
	/**
	 * Executes a provided function once per sorted set element.
	 *
	 * Delegates to Array.prototype.forEach and has the same signature.
	 *
	 * @param {Function} fn The function that is called on each element of the
	 * set.
	 * @param {Object} ctx An optional object that can be used as the context
	 * @memberOf SortedSet
	 * for the function fn.
	 */
	lunr.SortedSet.prototype.forEach = function (fn, ctx) {
	  return this.elements.forEach(fn, ctx);
	};
	
	/**
	 * Returns the index at which a given element can be found in the
	 * sorted set, or -1 if it is not present.
	 *
	 * @param {Object} elem The object to locate in the sorted set.
	 * @param {Number} start An optional index at which to start searching from
	 * within the set.
	 * @param {Number} end An optional index at which to stop search from within
	 * the set.
	 * @returns {Number}
	 * @memberOf SortedSet
	 */
	lunr.SortedSet.prototype.indexOf = function (elem, start, end) {
	  var start = start || 0,
	      end = end || this.elements.length,
	      sectionLength = end - start,
	      pivot = start + Math.floor(sectionLength / 2),
	      pivotElem = this.elements[pivot];
	
	  if (sectionLength <= 1) {
	    if (pivotElem === elem) {
	      return pivot;
	    } else {
	      return -1;
	    }
	  }
	
	  if (pivotElem < elem) return this.indexOf(elem, pivot, end);
	  if (pivotElem > elem) return this.indexOf(elem, start, pivot);
	  if (pivotElem === elem) return pivot;
	};
	
	/**
	 * Returns the position within the sorted set that an element should be
	 * inserted at to maintain the current order of the set.
	 *
	 * This function assumes that the element to search for does not already exist
	 * in the sorted set.
	 *
	 * @param {Object} elem The elem to find the position for in the set
	 * @param {Number} start An optional index at which to start searching from
	 * within the set.
	 * @param {Number} end An optional index at which to stop search from within
	 * the set.
	 * @returns {Number}
	 * @memberOf SortedSet
	 */
	lunr.SortedSet.prototype.locationFor = function (elem, start, end) {
	  var start = start || 0,
	      end = end || this.elements.length,
	      sectionLength = end - start,
	      pivot = start + Math.floor(sectionLength / 2),
	      pivotElem = this.elements[pivot];
	
	  if (sectionLength <= 1) {
	    if (pivotElem > elem) return pivot;
	    if (pivotElem < elem) return pivot + 1;
	  }
	
	  if (pivotElem < elem) return this.locationFor(elem, pivot, end);
	  if (pivotElem > elem) return this.locationFor(elem, start, pivot);
	};
	
	/**
	 * Creates a new lunr.SortedSet that contains the elements in the intersection
	 * of this set and the passed set.
	 *
	 * @param {lunr.SortedSet} otherSet The set to intersect with this set.
	 * @returns {lunr.SortedSet}
	 * @memberOf SortedSet
	 */
	lunr.SortedSet.prototype.intersect = function (otherSet) {
	  var intersectSet = new lunr.SortedSet(),
	      i = 0,
	      j = 0,
	      a_len = this.length,
	      b_len = otherSet.length,
	      a = this.elements,
	      b = otherSet.elements;
	
	  while (true) {
	    if (i > a_len - 1 || j > b_len - 1) break;
	
	    if (a[i] === b[j]) {
	      intersectSet.add(a[i]);
	      i++, j++;
	      continue;
	    }
	
	    if (a[i] < b[j]) {
	      i++;
	      continue;
	    }
	
	    if (a[i] > b[j]) {
	      j++;
	      continue;
	    }
	  };
	
	  return intersectSet;
	};
	
	/**
	 * Makes a copy of this set
	 *
	 * @returns {lunr.SortedSet}
	 * @memberOf SortedSet
	 */
	lunr.SortedSet.prototype.clone = function () {
	  var clone = new lunr.SortedSet();
	
	  clone.elements = this.toArray();
	  clone.length = clone.elements.length;
	
	  return clone;
	};
	
	/**
	 * Creates a new lunr.SortedSet that contains the elements in the union
	 * of this set and the passed set.
	 *
	 * @param {lunr.SortedSet} otherSet The set to union with this set.
	 * @returns {lunr.SortedSet}
	 * @memberOf SortedSet
	 */
	lunr.SortedSet.prototype.union = function (otherSet) {
	  var longSet, shortSet, unionSet;
	
	  if (this.length >= otherSet.length) {
	    longSet = this, shortSet = otherSet;
	  } else {
	    longSet = otherSet, shortSet = this;
	  }
	
	  unionSet = longSet.clone();
	
	  unionSet.add.apply(unionSet, shortSet.toArray());
	
	  return unionSet;
	};
	
	/**
	 * Returns a representation of the sorted set ready for serialisation.
	 *
	 * @returns {Array}
	 * @memberOf SortedSet
	 */
	lunr.SortedSet.prototype.toJSON = function () {
	  return this.toArray();
	};
	/*!
	 * lunr.Index
	 * Copyright (C) 2013 Oliver Nightingale
	 */
	
	/**
	 * lunr.Index is object that manages a search index.  It contains the indexes
	 * and stores all the tokens and document lookups.  It also provides the main
	 * user facing API for the library.
	 *
	 * @constructor
	 */
	lunr.Index = function () {
	  this._fields = [];
	  this._ref = 'id';
	  this.pipeline = new lunr.Pipeline();
	  this.documentStore = new lunr.Store();
	  this.tokenStore = new lunr.TokenStore();
	  this.corpusTokens = new lunr.SortedSet();
	  this.eventEmitter = new lunr.EventEmitter();
	
	  this._idfCache = {};
	
	  this.on('add', 'remove', 'update', function () {
	    this._idfCache = {};
	  }.bind(this));
	};
	
	/**
	 * Bind a handler to events being emitted by the index.
	 *
	 * The handler can be bound to many events at the same time.
	 *
	 * @param {String} [eventName] The name(s) of events to bind the function to.
	 * @param {Function} handler The serialised set to load.
	 * @memberOf Index
	 */
	lunr.Index.prototype.on = function () {
	  var args = Array.prototype.slice.call(arguments);
	  return this.eventEmitter.addListener.apply(this.eventEmitter, args);
	};
	
	/**
	 * Removes a handler from an event being emitted by the index.
	 *
	 * @param {String} eventName The name of events to remove the function from.
	 * @param {Function} handler The serialised set to load.
	 * @memberOf Index
	 */
	lunr.Index.prototype.off = function (name, fn) {
	  return this.eventEmitter.removeListener(name, fn);
	};
	
	/**
	 * Loads a previously serialised index.
	 *
	 * Issues a warning if the index being imported was serialised
	 * by a different version of lunr.
	 *
	 * @param {Object} serialisedData The serialised set to load.
	 * @returns {lunr.Index}
	 * @memberOf Index
	 */
	lunr.Index.load = function (serialisedData) {
	  if (serialisedData.version !== lunr.version) {
	    lunr.utils.warn('version mismatch: current ' + lunr.version + ' importing ' + serialisedData.version);
	  }
	
	  var idx = new this();
	
	  idx._fields = serialisedData.fields;
	  idx._ref = serialisedData.ref;
	
	  idx.documentStore = lunr.Store.load(serialisedData.documentStore);
	  idx.tokenStore = lunr.TokenStore.load(serialisedData.tokenStore);
	  idx.corpusTokens = lunr.SortedSet.load(serialisedData.corpusTokens);
	  idx.pipeline = lunr.Pipeline.load(serialisedData.pipeline);
	
	  return idx;
	};
	
	/**
	 * Adds a field to the list of fields that will be searchable within documents
	 * in the index.
	 *
	 * An optional boost param can be passed to affect how much tokens in this field
	 * rank in search results, by default the boost value is 1.
	 *
	 * Fields should be added before any documents are added to the index, fields
	 * that are added after documents are added to the index will only apply to new
	 * documents added to the index.
	 *
	 * @param {String} fieldName The name of the field within the document that
	 * should be indexed
	 * @param {Number} boost An optional boost that can be applied to terms in this
	 * field.
	 * @returns {lunr.Index}
	 * @memberOf Index
	 */
	lunr.Index.prototype.field = function (fieldName, opts) {
	  var opts = opts || {},
	      field = { name: fieldName, boost: opts.boost || 1 };
	
	  this._fields.push(field);
	  return this;
	};
	
	/**
	 * Sets the property used to uniquely identify documents added to the index,
	 * by default this property is 'id'.
	 *
	 * This should only be changed before adding documents to the index, changing
	 * the ref property without resetting the index can lead to unexpected results.
	 *
	 * @param {String} refName The property to use to uniquely identify the
	 * documents in the index.
	 * @param {Boolean} emitEvent Whether to emit add events, defaults to true
	 * @returns {lunr.Index}
	 * @memberOf Index
	 */
	lunr.Index.prototype.ref = function (refName) {
	  this._ref = refName;
	  return this;
	};
	
	/**
	 * Add a document to the index.
	 *
	 * This is the way new documents enter the index, this function will run the
	 * fields from the document through the index's pipeline and then add it to
	 * the index, it will then show up in search results.
	 *
	 * An 'add' event is emitted with the document that has been added and the index
	 * the document has been added to. This event can be silenced by passing false
	 * as the second argument to add.
	 *
	 * @param {Object} doc The document to add to the index.
	 * @param {Boolean} emitEvent Whether or not to emit events, default true.
	 * @memberOf Index
	 */
	lunr.Index.prototype.add = function (doc, emitEvent) {
	  var docTokens = {},
	      allDocumentTokens = new lunr.SortedSet(),
	      docRef = doc[this._ref],
	      emitEvent = emitEvent === undefined ? true : emitEvent;
	
	  this._fields.forEach(function (field) {
	    var fieldTokens = this.pipeline.run(lunr.tokenizer(doc[field.name]));
	
	    docTokens[field.name] = fieldTokens;
	    lunr.SortedSet.prototype.add.apply(allDocumentTokens, fieldTokens);
	  }, this);
	
	  this.documentStore.set(docRef, allDocumentTokens);
	  lunr.SortedSet.prototype.add.apply(this.corpusTokens, allDocumentTokens.toArray());
	
	  for (var i = 0; i < allDocumentTokens.length; i++) {
	    var token = allDocumentTokens.elements[i];
	    var tf = this._fields.reduce(function (memo, field) {
	      var fieldLength = docTokens[field.name].length;
	
	      if (!fieldLength) return memo;
	
	      var tokenCount = docTokens[field.name].filter(function (t) {
	        return t === token;
	      }).length;
	
	      return memo + tokenCount / fieldLength * field.boost;
	    }, 0);
	
	    this.tokenStore.add(token, { ref: docRef, tf: tf });
	  };
	
	  if (emitEvent) this.eventEmitter.emit('add', doc, this);
	};
	
	/**
	 * Removes a document from the index.
	 *
	 * To make sure documents no longer show up in search results they can be
	 * removed from the index using this method.
	 *
	 * The document passed only needs to have the same ref property value as the
	 * document that was added to the index, they could be completely different
	 * objects.
	 *
	 * A 'remove' event is emitted with the document that has been removed and the index
	 * the document has been removed from. This event can be silenced by passing false
	 * as the second argument to remove.
	 *
	 * @param {Object} doc The document to remove from the index.
	 * @param {Boolean} emitEvent Whether to emit remove events, defaults to true
	 * @memberOf Index
	 */
	lunr.Index.prototype.remove = function (doc, emitEvent) {
	  var docRef = doc[this._ref],
	      emitEvent = emitEvent === undefined ? true : emitEvent;
	
	  if (!this.documentStore.has(docRef)) return;
	
	  var docTokens = this.documentStore.get(docRef);
	
	  this.documentStore.remove(docRef);
	
	  docTokens.forEach(function (token) {
	    this.tokenStore.remove(token, docRef);
	  }, this);
	
	  if (emitEvent) this.eventEmitter.emit('remove', doc, this);
	};
	
	/**
	 * Updates a document in the index.
	 *
	 * When a document contained within the index gets updated, fields changed,
	 * added or removed, to make sure it correctly matched against search queries,
	 * it should be updated in the index.
	 *
	 * This method is just a wrapper around `remove` and `add`
	 *
	 * An 'update' event is emitted with the document that has been updated and the index.
	 * This event can be silenced by passing false as the second argument to update. Only
	 * an update event will be fired, the 'add' and 'remove' events of the underlying calls
	 * are silenced.
	 *
	 * @param {Object} doc The document to update in the index.
	 * @param {Boolean} emitEvent Whether to emit update events, defaults to true
	 * @see Index.prototype.remove
	 * @see Index.prototype.add
	 * @memberOf Index
	 */
	lunr.Index.prototype.update = function (doc, emitEvent) {
	  var emitEvent = emitEvent === undefined ? true : emitEvent;
	
	  this.remove(doc, false);
	  this.add(doc, false);
	
	  if (emitEvent) this.eventEmitter.emit('update', doc, this);
	};
	
	/**
	 * Calculates the inverse document frequency for a token within the index.
	 *
	 * @param {String} token The token to calculate the idf of.
	 * @see Index.prototype.idf
	 * @private
	 * @memberOf Index
	 */
	lunr.Index.prototype.idf = function (term) {
	  if (this._idfCache[term]) return this._idfCache[term];
	
	  var documentFrequency = this.tokenStore.count(term),
	      idf = 1;
	
	  if (documentFrequency > 0) {
	    idf = 1 + Math.log(this.tokenStore.length / documentFrequency);
	  }
	
	  return this._idfCache[term] = idf;
	};
	
	/**
	 * Searches the index using the passed query.
	 *
	 * Queries should be a string, multiple words are allowed and will lead to an
	 * AND based query, e.g. `idx.search('foo bar')` will run a search for
	 * documents containing both 'foo' and 'bar'.
	 *
	 * All query tokens are passed through the same pipeline that document tokens
	 * are passed through, so any language processing involved will be run on every
	 * query term.
	 *
	 * Each query term is expanded, so that the term 'he' might be expanded to
	 * 'hello' and 'help' if those terms were already included in the index.
	 *
	 * Matching documents are returned as an array of objects, each object contains
	 * the matching document ref, as set for this index, and the similarity score
	 * for this document against the query.
	 *
	 * @param {String} query The query to search the index with.
	 * @returns {Object}
	 * @see Index.prototype.idf
	 * @see Index.prototype.documentVector
	 * @memberOf Index
	 */
	lunr.Index.prototype.search = function (query) {
	  var queryTokens = this.pipeline.run(lunr.tokenizer(query)),
	      queryArr = lunr.utils.zeroFillArray(this.corpusTokens.length),
	      documentSets = [],
	      fieldBoosts = this._fields.reduce(function (memo, f) {
	    return memo + f.boost;
	  }, 0);
	
	  var hasSomeToken = queryTokens.some(function (token) {
	    return this.tokenStore.has(token);
	  }, this);
	
	  if (!hasSomeToken) return [];
	
	  queryTokens.forEach(function (token, i, tokens) {
	    var tf = 1 / tokens.length * this._fields.length * fieldBoosts,
	        self = this;
	
	    var set = this.tokenStore.expand(token).reduce(function (memo, key) {
	      var pos = self.corpusTokens.indexOf(key),
	          idf = self.idf(key),
	          similarityBoost = 1,
	          set = new lunr.SortedSet();
	
	      // if the expanded key is not an exact match to the token then
	      // penalise the score for this key by how different the key is
	      // to the token.
	      if (key !== token) {
	        var diff = Math.max(3, key.length - token.length);
	        similarityBoost = 1 / Math.log(diff);
	      }
	
	      // calculate the query tf-idf score for this token
	      // applying an similarityBoost to ensure exact matches
	      // these rank higher than expanded terms
	      if (pos > -1) queryArr[pos] = tf * idf * similarityBoost;
	
	      // add all the documents that have this key into a set
	      Object.keys(self.tokenStore.get(key)).forEach(function (ref) {
	        set.add(ref);
	      });
	
	      return memo.union(set);
	    }, new lunr.SortedSet());
	
	    documentSets.push(set);
	  }, this);
	
	  var documentSet = documentSets.reduce(function (memo, set) {
	    return memo.intersect(set);
	  });
	
	  var queryVector = new lunr.Vector(queryArr);
	
	  return documentSet.map(function (ref) {
	    return { ref: ref, score: queryVector.similarity(this.documentVector(ref)) };
	  }, this).sort(function (a, b) {
	    return b.score - a.score;
	  });
	};
	
	/**
	 * Generates a vector containing all the tokens in the document matching the
	 * passed documentRef.
	 *
	 * The vector contains the tf-idf score for each token contained in the
	 * document with the passed documentRef.  The vector will contain an element
	 * for every token in the indexes corpus, if the document does not contain that
	 * token the element will be 0.
	 *
	 * @param {Object} documentRef The ref to find the document with.
	 * @returns {lunr.Vector}
	 * @private
	 * @memberOf Index
	 */
	lunr.Index.prototype.documentVector = function (documentRef) {
	  var documentTokens = this.documentStore.get(documentRef),
	      documentTokensLength = documentTokens.length,
	      documentArr = lunr.utils.zeroFillArray(this.corpusTokens.length);
	
	  for (var i = 0; i < documentTokensLength; i++) {
	    var token = documentTokens.elements[i],
	        tf = this.tokenStore.get(token)[documentRef].tf,
	        idf = this.idf(token);
	
	    documentArr[this.corpusTokens.indexOf(token)] = tf * idf;
	  };
	
	  return new lunr.Vector(documentArr);
	};
	
	/**
	 * Returns a representation of the index ready for serialisation.
	 *
	 * @returns {Object}
	 * @memberOf Index
	 */
	lunr.Index.prototype.toJSON = function () {
	  return {
	    version: lunr.version,
	    fields: this._fields,
	    ref: this._ref,
	    documentStore: this.documentStore.toJSON(),
	    tokenStore: this.tokenStore.toJSON(),
	    corpusTokens: this.corpusTokens.toJSON(),
	    pipeline: this.pipeline.toJSON()
	  };
	};
	/*!
	 * lunr.Store
	 * Copyright (C) 2013 Oliver Nightingale
	 */
	
	/**
	 * lunr.Store is a simple key-value store used for storing sets of tokens for
	 * documents stored in index.
	 *
	 * @constructor
	 * @module
	 */
	lunr.Store = function () {
	  this.store = {};
	  this.length = 0;
	};
	
	/**
	 * Loads a previously serialised store
	 *
	 * @param {Object} serialisedData The serialised store to load.
	 * @returns {lunr.Store}
	 * @memberOf Store
	 */
	lunr.Store.load = function (serialisedData) {
	  var store = new this();
	
	  store.length = serialisedData.length;
	  store.store = Object.keys(serialisedData.store).reduce(function (memo, key) {
	    memo[key] = lunr.SortedSet.load(serialisedData.store[key]);
	    return memo;
	  }, {});
	
	  return store;
	};
	
	/**
	 * Stores the given tokens in the store against the given id.
	 *
	 * @param {Object} id The key used to store the tokens against.
	 * @param {Object} tokens The tokens to store against the key.
	 * @memberOf Store
	 */
	lunr.Store.prototype.set = function (id, tokens) {
	  this.store[id] = tokens;
	  this.length = Object.keys(this.store).length;
	};
	
	/**
	 * Retrieves the tokens from the store for a given key.
	 *
	 * @param {Object} id The key to lookup and retrieve from the store.
	 * @returns {Object}
	 * @memberOf Store
	 */
	lunr.Store.prototype.get = function (id) {
	  return this.store[id];
	};
	
	/**
	 * Checks whether the store contains a key.
	 *
	 * @param {Object} id The id to look up in the store.
	 * @returns {Boolean}
	 * @memberOf Store
	 */
	lunr.Store.prototype.has = function (id) {
	  return id in this.store;
	};
	
	/**
	 * Removes the value for a key in the store.
	 *
	 * @param {Object} id The id to remove from the store.
	 * @memberOf Store
	 */
	lunr.Store.prototype.remove = function (id) {
	  if (!this.has(id)) return;
	
	  delete this.store[id];
	  this.length--;
	};
	
	/**
	 * Returns a representation of the store ready for serialisation.
	 *
	 * @returns {Object}
	 * @memberOf Store
	 */
	lunr.Store.prototype.toJSON = function () {
	  return {
	    store: this.store,
	    length: this.length
	  };
	};
	
	/*!
	 * lunr.stemmer
	 * Copyright (C) 2013 Oliver Nightingale
	 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
	 */
	
	/**
	 * lunr.stemmer is an english language stemmer, this is a JavaScript
	 * implementation of the PorterStemmer taken from http://tartaurs.org/~martin
	 *
	 * @module
	 * @param {String} str The string to stem
	 * @returns {String}
	 * @see lunr.Pipeline
	 */
	lunr.stemmer = function () {
	  var step2list = {
	    "ational": "ate",
	    "tional": "tion",
	    "enci": "ence",
	    "anci": "ance",
	    "izer": "ize",
	    "bli": "ble",
	    "alli": "al",
	    "entli": "ent",
	    "eli": "e",
	    "ousli": "ous",
	    "ization": "ize",
	    "ation": "ate",
	    "ator": "ate",
	    "alism": "al",
	    "iveness": "ive",
	    "fulness": "ful",
	    "ousness": "ous",
	    "aliti": "al",
	    "iviti": "ive",
	    "biliti": "ble",
	    "logi": "log"
	  },
	      step3list = {
	    "icate": "ic",
	    "ative": "",
	    "alize": "al",
	    "iciti": "ic",
	    "ical": "ic",
	    "ful": "",
	    "ness": ""
	  },
	      c = "[^aeiou]",
	      // consonant
	  v = "[aeiouy]",
	      // vowel
	  C = c + "[^aeiouy]*",
	      // consonant sequence
	  V = v + "[aeiou]*",
	      // vowel sequence
	
	  mgr0 = "^(" + C + ")?" + V + C,
	      // [C]VC... is m>0
	  meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$",
	      // [C]VC[V] is m=1
	  mgr1 = "^(" + C + ")?" + V + C + V + C,
	      // [C]VCVC... is m>1
	  s_v = "^(" + C + ")?" + v; // vowel in stem
	
	  return function (w) {
	    var stem, suffix, firstch, re, re2, re3, re4;
	
	    if (w.length < 3) {
	      return w;
	    }
	
	    firstch = w.substr(0, 1);
	    if (firstch == "y") {
	      w = firstch.toUpperCase() + w.substr(1);
	    }
	
	    // Step 1a
	    re = /^(.+?)(ss|i)es$/;
	    re2 = /^(.+?)([^s])s$/;
	
	    if (re.test(w)) {
	      w = w.replace(re, "$1$2");
	    } else if (re2.test(w)) {
	      w = w.replace(re2, "$1$2");
	    }
	
	    // Step 1b
	    re = /^(.+?)eed$/;
	    re2 = /^(.+?)(ed|ing)$/;
	    if (re.test(w)) {
	      var fp = re.exec(w);
	      re = new RegExp(mgr0);
	      if (re.test(fp[1])) {
	        re = /.$/;
	        w = w.replace(re, "");
	      }
	    } else if (re2.test(w)) {
	      var fp = re2.exec(w);
	      stem = fp[1];
	      re2 = new RegExp(s_v);
	      if (re2.test(stem)) {
	        w = stem;
	        re2 = /(at|bl|iz)$/;
	        re3 = new RegExp("([^aeiouylsz])\\1$");
	        re4 = new RegExp("^" + C + v + "[^aeiouwxy]$");
	        if (re2.test(w)) {
	          w = w + "e";
	        } else if (re3.test(w)) {
	          re = /.$/;w = w.replace(re, "");
	        } else if (re4.test(w)) {
	          w = w + "e";
	        }
	      }
	    }
	
	    // Step 1c
	    re = /^(.+?)y$/;
	    if (re.test(w)) {
	      var fp = re.exec(w);
	      stem = fp[1];
	      re = new RegExp(s_v);
	      if (re.test(stem)) {
	        w = stem + "i";
	      }
	    }
	
	    // Step 2
	    re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
	    if (re.test(w)) {
	      var fp = re.exec(w);
	      stem = fp[1];
	      suffix = fp[2];
	      re = new RegExp(mgr0);
	      if (re.test(stem)) {
	        w = stem + step2list[suffix];
	      }
	    }
	
	    // Step 3
	    re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
	    if (re.test(w)) {
	      var fp = re.exec(w);
	      stem = fp[1];
	      suffix = fp[2];
	      re = new RegExp(mgr0);
	      if (re.test(stem)) {
	        w = stem + step3list[suffix];
	      }
	    }
	
	    // Step 4
	    re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
	    re2 = /^(.+?)(s|t)(ion)$/;
	    if (re.test(w)) {
	      var fp = re.exec(w);
	      stem = fp[1];
	      re = new RegExp(mgr1);
	      if (re.test(stem)) {
	        w = stem;
	      }
	    } else if (re2.test(w)) {
	      var fp = re2.exec(w);
	      stem = fp[1] + fp[2];
	      re2 = new RegExp(mgr1);
	      if (re2.test(stem)) {
	        w = stem;
	      }
	    }
	
	    // Step 5
	    re = /^(.+?)e$/;
	    if (re.test(w)) {
	      var fp = re.exec(w);
	      stem = fp[1];
	      re = new RegExp(mgr1);
	      re2 = new RegExp(meq1);
	      re3 = new RegExp("^" + C + v + "[^aeiouwxy]$");
	      if (re.test(stem) || re2.test(stem) && !re3.test(stem)) {
	        w = stem;
	      }
	    }
	
	    re = /ll$/;
	    re2 = new RegExp(mgr1);
	    if (re.test(w) && re2.test(w)) {
	      re = /.$/;
	      w = w.replace(re, "");
	    }
	
	    // and turn initial Y back to y
	
	    if (firstch == "y") {
	      w = firstch.toLowerCase() + w.substr(1);
	    }
	
	    return w;
	  };
	}();
	
	lunr.Pipeline.registerFunction(lunr.stemmer, 'stemmer');
	/*!
	 * lunr.stopWordFilter
	 * Copyright (C) 2013 Oliver Nightingale
	 */
	
	/**
	 * lunr.stopWordFilter is an English language stop word list filter, any words
	 * contained in the list will not be passed through the filter.
	 *
	 * This is intended to be used in the Pipeline. If the token does not pass the
	 * filter then undefined will be returned.
	 *
	 * @module
	 * @param {String} token The token to pass through the filter
	 * @returns {String}
	 * @see lunr.Pipeline
	 */
	lunr.stopWordFilter = function (token) {
	  if (lunr.stopWordFilter.stopWords.indexOf(token) === -1) return token;
	};
	
	lunr.stopWordFilter.stopWords = new lunr.SortedSet();
	lunr.stopWordFilter.stopWords.length = 119;
	lunr.stopWordFilter.stopWords.elements = ["", "a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your"];
	
	lunr.Pipeline.registerFunction(lunr.stopWordFilter, 'stopWordFilter');
	/*!
	 * lunr.stemmer
	 * Copyright (C) 2013 Oliver Nightingale
	 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
	 */
	
	/**
	 * lunr.TokenStore is used for efficient storing and lookup of the reverse
	 * index of token to document ref.
	 *
	 * @constructor
	 */
	lunr.TokenStore = function () {
	  this.root = { docs: {} };
	  this.length = 0;
	};
	
	/**
	 * Loads a previously serialised token store
	 *
	 * @param {Object} serialisedData The serialised token store to load.
	 * @returns {lunr.TokenStore}
	 * @memberOf TokenStore
	 */
	lunr.TokenStore.load = function (serialisedData) {
	  var store = new this();
	
	  store.root = serialisedData.root;
	  store.length = serialisedData.length;
	
	  return store;
	};
	
	/**
	 * Adds a new token doc pair to the store.
	 *
	 * By default this function starts at the root of the current store, however
	 * it can start at any node of any token store if required.
	 *
	 * @param {String} token The token to store the doc under
	 * @param {Object} doc The doc to store against the token
	 * @param {Object} root An optional node at which to start looking for the
	 * correct place to enter the doc, by default the root of this lunr.TokenStore
	 * is used.
	 * @memberOf TokenStore
	 */
	lunr.TokenStore.prototype.add = function (token, doc, root) {
	  var root = root || this.root,
	      key = token[0],
	      rest = token.slice(1);
	
	  if (!(key in root)) root[key] = { docs: {} };
	
	  if (rest.length === 0) {
	    root[key].docs[doc.ref] = doc;
	    this.length += 1;
	    return;
	  } else {
	    return this.add(rest, doc, root[key]);
	  }
	};
	
	/**
	 * Checks whether this key is contained within this lunr.TokenStore.
	 *
	 * By default this function starts at the root of the current store, however
	 * it can start at any node of any token store if required.
	 *
	 * @param {String} token The token to check for
	 * @param {Object} root An optional node at which to start
	 * @memberOf TokenStore
	 */
	lunr.TokenStore.prototype.has = function (token) {
	  if (!token) return false;
	
	  var node = this.root;
	
	  for (var i = 0; i < token.length; i++) {
	    if (!node[token[i]]) return false;
	
	    node = node[token[i]];
	  }
	
	  return true;
	};
	
	/**
	 * Retrieve a node from the token store for a given token.
	 *
	 * By default this function starts at the root of the current store, however
	 * it can start at any node of any token store if required.
	 *
	 * @param {String} token The token to get the node for.
	 * @param {Object} root An optional node at which to start.
	 * @returns {Object}
	 * @see TokenStore.prototype.get
	 * @memberOf TokenStore
	 */
	lunr.TokenStore.prototype.getNode = function (token) {
	  if (!token) return {};
	
	  var node = this.root;
	
	  for (var i = 0; i < token.length; i++) {
	    if (!node[token[i]]) return {};
	
	    node = node[token[i]];
	  }
	
	  return node;
	};
	
	/**
	 * Retrieve the documents for a node for the given token.
	 *
	 * By default this function starts at the root of the current store, however
	 * it can start at any node of any token store if required.
	 *
	 * @param {String} token The token to get the documents for.
	 * @param {Object} root An optional node at which to start.
	 * @returns {Object}
	 * @memberOf TokenStore
	 */
	lunr.TokenStore.prototype.get = function (token, root) {
	  return this.getNode(token, root).docs || {};
	};
	
	lunr.TokenStore.prototype.count = function (token, root) {
	  return Object.keys(this.get(token, root)).length;
	};
	
	/**
	 * Remove the document identified by ref from the token in the store.
	 *
	 * By default this function starts at the root of the current store, however
	 * it can start at any node of any token store if required.
	 *
	 * @param {String} token The token to get the documents for.
	 * @param {String} ref The ref of the document to remove from this token.
	 * @param {Object} root An optional node at which to start.
	 * @returns {Object}
	 * @memberOf TokenStore
	 */
	lunr.TokenStore.prototype.remove = function (token, ref) {
	  if (!token) return;
	  var node = this.root;
	
	  for (var i = 0; i < token.length; i++) {
	    if (!(token[i] in node)) return;
	    node = node[token[i]];
	  }
	
	  delete node.docs[ref];
	};
	
	/**
	 * Find all the possible suffixes of the passed token using tokens
	 * currently in the store.
	 *
	 * @param {String} token The token to expand.
	 * @returns {Array}
	 * @memberOf TokenStore
	 */
	lunr.TokenStore.prototype.expand = function (token, memo) {
	  var root = this.getNode(token),
	      docs = root.docs || {},
	      memo = memo || [];
	
	  if (Object.keys(docs).length) memo.push(token);
	
	  Object.keys(root).forEach(function (key) {
	    if (key === 'docs') return;
	
	    memo.concat(this.expand(token + key, memo));
	  }, this);
	
	  return memo;
	};
	
	/**
	 * Returns a representation of the token store ready for serialisation.
	 *
	 * @returns {Object}
	 * @memberOf TokenStore
	 */
	lunr.TokenStore.prototype.toJSON = function () {
	  return {
	    root: this.root,
	    length: this.length
	  };
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _index = __webpack_require__(19);
	
	var _index2 = _interopRequireDefault(_index);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// monkey patching the existing tokenizr
	// this will be fixed in an upcoming release of lunr
	_index2.default.tokenizer = function (str) {
	  if (!str) return [];
	  if (Array.isArray(str)) return str.map(function (t) {
	    return t.toLowerCase();
	  });
	  var str = str.replace(/^\s+/, '');
	  for (var i = str.length - 1; i >= 0; i--) {
	    if (/\S/.test(str.charAt(i))) {
	      str = str.substring(0, i + 1);
	      break;
	    }
	  }
	  return str.split(/\s+/).map(function (token) {
	    return token.toLowerCase();
	  });
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _index = __webpack_require__(19);
	
	var _index2 = _interopRequireDefault(_index);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_index2.default.ru = function () {
	  this.pipeline = new _index2.default.Pipeline();
	  this.pipeline.add(_index2.default.ru.stopWordFilter, _index2.default.ru.stemmer);
	};
	_index2.default.ru.stopWordFilter = function (token) {
	  if (_index2.default.ru.stopWordFilter.stopWords.indexOf(token) === -1) return token;
	};
	
	_index2.default.ru.stopWordFilter.stopWords = new _index2.default.SortedSet();
	_index2.default.ru.stopWordFilter.stopWords.length = 421;
	_index2.default.ru.stopWordFilter.stopWords.elements = ['а', 'е', 'и', 'ж', 'м', 'о', 'на', 'не', 'ни', 'об', 'но', 'он', 'мне', 'мои', 'мож', 'она', 'они', 'оно', 'мной', 'много', 'многочисленное', 'многочисленная', 'многочисленные', 'многочисленный', 'мною', 'мой', 'мог', 'могут', 'можно', 'может', 'можхо', 'мор', 'моя', 'моё', 'мочь', 'над', 'нее', 'оба', 'нам', 'нем', 'нами', 'ними', 'мимо', 'немного', 'одной', 'одного', 'менее', 'однажды', 'однако', 'меня', 'нему', 'меньше', 'ней', 'наверху', 'него', 'ниже', 'мало', 'надо', 'один', 'одиннадцать', 'одиннадцатый', 'назад', 'наиболее', 'недавно', 'миллионов', 'недалеко', 'между', 'низко', 'меля', 'нельзя', 'нибудь', 'непрерывно', 'наконец', 'никогда', 'никуда', 'нас', 'наш', 'нет', 'нею', 'неё', 'них', 'мира', 'наша', 'наше', 'наши', 'ничего', 'начала', 'нередко', 'несколько', 'обычно', 'опять', 'около', 'мы', 'ну', 'нх', 'от', 'отовсюду', 'особенно', 'нужно', 'очень', 'отсюда', 'в', 'во', 'вон', 'вниз', 'внизу', 'вокруг', 'вот', 'восемнадцать', 'восемнадцатый', 'восемь', 'восьмой', 'вверх', 'вам', 'вами', 'важное', 'важная', 'важные', 'важный', 'вдали', 'везде', 'ведь', 'вас', 'ваш', 'ваша', 'ваше', 'ваши', 'впрочем', 'весь', 'вдруг', 'вы', 'все', 'второй', 'всем', 'всеми', 'времени', 'время', 'всему', 'всего', 'всегда', 'всех', 'всею', 'всю', 'вся', 'всё', 'всюду', 'г', 'год', 'говорил', 'говорит', 'года', 'году', 'где', 'да', 'ее', 'за', 'из', 'ли', 'же', 'им', 'до', 'по', 'ими', 'под', 'иногда', 'довольно', 'именно', 'долго', 'позже', 'более', 'должно', 'пожалуйста', 'значит', 'иметь', 'больше', 'пока', 'ему', 'имя', 'пор', 'пора', 'потом', 'потому', 'после', 'почему', 'почти', 'посреди', 'ей', 'два', 'две', 'двенадцать', 'двенадцатый', 'двадцать', 'двадцатый', 'двух', 'его', 'дел', 'или', 'без', 'день', 'занят', 'занята', 'занято', 'заняты', 'действительно', 'давно', 'девятнадцать', 'девятнадцатый', 'девять', 'девятый', 'даже', 'алло', 'жизнь', 'далеко', 'близко', 'здесь', 'дальше', 'для', 'лет', 'зато', 'даром', 'первый', 'перед', 'затем', 'зачем', 'лишь', 'десять', 'десятый', 'ею', 'её', 'их', 'бы', 'еще', 'при', 'был', 'про', 'процентов', 'против', 'просто', 'бывает', 'бывь', 'если', 'люди', 'была', 'были', 'было', 'будем', 'будет', 'будете', 'будешь', 'прекрасно', 'буду', 'будь', 'будто', 'будут', 'ещё', 'пятнадцать', 'пятнадцатый', 'друго', 'другое', 'другой', 'другие', 'другая', 'других', 'есть', 'пять', 'быть', 'лучше', 'пятый', 'к', 'ком', 'конечно', 'кому', 'кого', 'когда', 'которой', 'которого', 'которая', 'которые', 'который', 'которых', 'кем', 'каждое', 'каждая', 'каждые', 'каждый', 'кажется', 'как', 'какой', 'какая', 'кто', 'кроме', 'куда', 'кругом', 'с', 'т', 'у', 'я', 'та', 'те', 'уж', 'со', 'то', 'том', 'снова', 'тому', 'совсем', 'того', 'тогда', 'тоже', 'собой', 'тобой', 'собою', 'тобою', 'сначала', 'только', 'уметь', 'тот', 'тою', 'хорошо', 'хотеть', 'хочешь', 'хоть', 'хотя', 'свое', 'свои', 'твой', 'своей', 'своего', 'своих', 'свою', 'твоя', 'твоё', 'раз', 'уже', 'сам', 'там', 'тем', 'чем', 'сама', 'сами', 'теми', 'само', 'рано', 'самом', 'самому', 'самой', 'самого', 'семнадцать', 'семнадцатый', 'самим', 'самими', 'самих', 'саму', 'семь', 'чему', 'раньше', 'сейчас', 'чего', 'сегодня', 'себе', 'тебе', 'сеаой', 'человек', 'разве', 'теперь', 'себя', 'тебя', 'седьмой', 'спасибо', 'слишком', 'так', 'такое', 'такой', 'такие', 'также', 'такая', 'сих', 'тех', 'чаще', 'четвертый', 'через', 'часто', 'шестой', 'шестнадцать', 'шестнадцатый', 'шесть', 'четыре', 'четырнадцать', 'четырнадцатый', 'сколько', 'сказал', 'сказала', 'сказать', 'ту', 'ты', 'три', 'эта', 'эти', 'что', 'это', 'чтоб', 'этом', 'этому', 'этой', 'этого', 'чтобы', 'этот', 'стал', 'туда', 'этим', 'этими', 'рядом', 'тринадцать', 'тринадцатый', 'этих', 'третий', 'тут', 'эту', 'суть', 'чуть', 'тысяч'];
	/*
	Copyright (c) 2012, Polyakov Vladimir, Chris Umbel
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
	*/
	
	_index2.default.ru.stemmer = function () {
	  function attemptReplacePatterns(token, patterns) {
	    var replacement = null;
	    var i = 0,
	        isReplaced = false;
	    while (i < patterns.length && !isReplaced) {
	      if (patterns[i][0].test(token)) {
	        replacement = token.replace(patterns[i][0], patterns[i][1]);
	        isReplaced = true;
	      }
	      i++;
	    }
	    return replacement;
	  };
	
	  function perfectiveGerund(token) {
	    var result = attemptReplacePatterns(token, [[/[ая]в(ши|шись)$/g, ''], [/(ив|ивши|ившись|ывши|ывшись|ыв)$/g, '']]);
	    return result;
	  };
	
	  function adjectival(token) {
	    var result = adjective(token);
	    if (result != null) {
	      var pariticipleResult = participle(result);
	      result = pariticipleResult ? pariticipleResult : result;
	    }
	    return result;
	  };
	
	  function adjective(token) {
	    var result = attemptReplacePatterns(token, [[/(ее|ие|ые|ое|ими|ыми|ей|ий|ый|ой|ем|им|ым|ом|его|ого|ему|ому|их|ых|ую|юю|ая|яя|ою|ею)$/g, '']]);
	    return result;
	  };
	
	  function participle(token) {
	    var result = attemptReplacePatterns(token, [[/([ая])(ем|нн|вш|ющ|щ)$/g, '$1'], [/(ивш|ывш|ующ)$/g, '']]);
	    return result;
	  };
	
	  function reflexive(token) {
	    var result = attemptReplacePatterns(token, [[/(ся|сь)$/g, '']]);
	    return result;
	  };
	
	  function verb(token) {
	    var result = attemptReplacePatterns(token, [[/([ая])(ла|на|ете|йте|ли|й|л|ем|н|ло|но|ет|ют|ны|ть|ешь|нно)$/g, '$1'], [/(ила|ыла|ена|ейте|уйте|ите|или|ыли|ей|уй|ил|ыл|им|ым|ен|ило|ыло|ено|ят|ует|ит|ыт|ены|ить|ыть|ишь|ую|ю)$/g, '']]);
	    return result;
	  };
	
	  function noun(token) {
	    var result = attemptReplacePatterns(token, [[/(а|ев|ов|ие|ье|е|иями|ями|ами|еи|ии|и|ией|ей|ой|ий|й|иям|ям|ием|ем|ам|ом|о|у|ах|иях|ях|ы|ь|ию|ью|ю|ия|ья|я)$/g, '']]);
	    return result;
	  };
	
	  function superlative(token) {
	    var result = attemptReplacePatterns(token, [[/(ейш|ейше)$/g, '']]);
	    return result;
	  };
	
	  function derivational(token) {
	    var result = attemptReplacePatterns(token, [[/(ост|ость)$/g, '']]);
	    return result;
	  };
	
	  return function (token) {
	    token = token.replace(/ё/g, 'е');
	    var volwesRegexp = /^(.*?[аеиоюяуыиэ])(.*)$/g;
	    var RV = volwesRegexp.exec(token);
	    if (!RV || RV.length < 3) {
	      return token;
	    }
	    var head = RV[1];
	    RV = RV[2];
	    volwesRegexp.lastIndex = 0;
	    var R2 = volwesRegexp.exec(RV);
	    var result = perfectiveGerund(RV);
	    if (result === null) {
	      var resultReflexive = reflexive(RV) || RV;
	      result = adjectival(resultReflexive);
	      if (result === null) {
	        result = verb(resultReflexive);
	        if (result === null) {
	          result = noun(resultReflexive);
	          if (result === null) {
	            result = resultReflexive;
	          }
	        }
	      }
	    }
	    result = result.replace(/и$/g, '');
	    var derivationalResult = result;
	    if (R2 && R2[2]) {
	      derivationalResult = derivational(R2[2]);
	      if (derivationalResult != null) {
	        derivationalResult = derivational(result);
	      } else {
	        derivationalResult = result;
	      }
	    }
	
	    var superlativeResult = superlative(derivationalResult) || derivationalResult;
	
	    superlativeResult = superlativeResult.replace(/(н)н/g, '$1');
	    superlativeResult = superlativeResult.replace(/ь$/g, '');
	    return head + superlativeResult;
	  };
	}();
	
	_index2.default.Pipeline.registerFunction(_index2.default.ru.stemmer, 'stemmer-ru');

/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map