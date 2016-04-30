/**
 * @module meteoric
 */

import { TemplateAttributeDirectiveType } from 'meteor/meteoric124:template-attribute-directive';

var GESTURE_DIRECTIVES = 'onHold onTap onDoubleTap onTouch onRelease onDragStart onDrag onDragEnd onDragUp onDragRight onDragDown onDragLeft onSwipe onSwipeUp onSwipeRight onSwipeDown onSwipeLeft'.split(' ');

GESTURE_DIRECTIVES.forEach(function(name) {
    gestureDirective(name);
});

/**
 * @ngdoc directive
 * @name onHold
 * @module meteoric
 * @restrict A
 *
 * @description
 * Touch stays at the same location for 500ms. Similar to long touch events available for AngularJS and jQuery.
 *
 * @usage
 *
 * Suppose you have a template with:
 *
 * ```javascript
 * Template.foo.onCreated(function() {
 *   this.bar = function() {
 *     console.log('callback');
 *   }
 * });
 * ```
 *
 * ```handlebars
 * {{#foo}}
 *   <button on-hold="bar" class="button">Test</button>
 * {{/foo}}
 * ```
 */


/**
 * @ngdoc directive
 * @name onTap
 * @module meteoric
 * @restrict A
 *
 * @description
 * Quick touch at a location. If the duration of the touch goes
 * longer than 250ms it is no longer a tap gesture.
 *
 * @usage
 * Suppose you have a template with:
 *
 * ```javascript
 * Template.foo.onCreated(function() {
 *   this.bar = function() {
 *     console.log('callback');
 *   }
 * });
 * ```
 *
 * ```handlebars
 * {{#foo}}
 *   <button on-tap="bar" class="button">Test</button>
 * {{/foo}}
 * ```
 */


/**
 * @ngdoc directive
 * @name onDoubleTap
 * @module meteoric
 * @restrict A
 *
 * @description
 * Double tap touch at a location.
 *
 * @usage
 * Suppose you have a template with:
 *
 * ```javascript
 * Template.foo.onCreated(function() {
 *   this.bar = function() {
 *     console.log('callback');
 *   }
 * });
 * ```
 *
 * ```handlebars
 * {{#foo}}
 *   <button on-double-tap="bar" class="button">Test</button>
 * {{/foo}}
 * ```
 */


/**
 * @ngdoc directive
 * @name onTouch
 * @module meteoric
 * @restrict A
 *
 * @description
 * Called immediately when the user first begins a touch. This
 * gesture does not wait for a touchend/mouseup.
 *
 * @usage
 * Suppose you have a template with:
 *
 * ```javascript
 * Template.foo.onCreated(function() {
 *   this.bar = function() {
 *     console.log('callback');
 *   }
 * });
 * ```
 *
 * ```handlebars
 * {{#foo}}
 *   <button on-touch="bar" class="button">Test</button>
 * {{/foo}}
 * ```
 */


/**
 * @ngdoc directive
 * @name onRelease
 * @module meteoric
 * @restrict A
 *
 * @description
 * Called when the user ends a touch.
 *
 * @usage
 * Suppose you have a template with:
 *
 * ```javascript
 * Template.foo.onCreated(function() {
 *   this.bar = function() {
 *     console.log('callback');
 *   }
 * });
 * ```
 *
 * ```handlebars
 * {{#foo}}
 *   <button on-release="bar" class="button">Test</button>
 * {{/foo}}
 * ```
 */

/**
 * @ngdoc directive
 * @name onDragStart
 * @module meteoric
 * @restrict A
 *
 * @description
 * Called when a drag gesture has started.
 *
 * @usage
 * Suppose you have a template with:
 *
 * ```javascript
 * Template.foo.onCreated(function() {
 *   this.bar = function() {
 *     console.log('callback');
 *   }
 * });
 * ```
 *
 * ```handlebars
 * {{#foo}}
 *   <button on-drag-start="bar" class="button">Test</button>
 * {{/foo}}
 * ```
 */


/**
 * @ngdoc directive
 * @name onDrag
 * @module meteoric
 * @restrict A
 *
 * @description
 * Move with one touch around on the page. Blocking the scrolling when
 * moving left and right is a good practice. When all the drag events are
 * blocking you disable scrolling on that area.
 *
 * @usage
 * Suppose you have a template with:
 *
 * ```javascript
 * Template.foo.onCreated(function() {
 *   this.bar = function() {
 *     console.log('callback');
 *   }
 * });
 * ```
 *
 * ```handlebars
 * {{#foo}}
 *   <button on-drag="bar" class="button">Test</button>
 * {{/foo}}
 * ```
 */

/**
 * @ngdoc directive
 * @name onDragEnd
 * @module meteoric
 * @restrict A
 *
 * @description
 * Called when a drag gesture has ended.
 *
 * @usage
 * Suppose you have a template with:
 *
 * ```javascript
 * Template.foo.onCreated(function() {
 *   this.bar = function() {
 *     console.log('callback');
 *   }
 * });
 * ```
 *
 * ```handlebars
 * {{#foo}}
 *   <button on-drag-end="bar" class="button">Test</button>
 * {{/foo}}
 * ```
 */

/**
 * @ngdoc directive
 * @name onDragUp
 * @module meteoric
 * @restrict A
 *
 * @description
 * Called when the element is dragged up.
 *
 * @usage
 * Suppose you have a template with:
 *
 * ```javascript
 * Template.foo.onCreated(function() {
 *   this.bar = function() {
 *     console.log('callback');
 *   }
 * });
 * ```
 *
 * ```handlebars
 * {{#foo}}
 *   <button on-drag-up="bar" class="button">Test</button>
 * {{/foo}}
 * ```
 */


/**
 * @ngdoc directive
 * @name onDragRight
 * @module meteoric
 * @restrict A
 *
 * @description
 * Called when the element is dragged to the right.
 *
 * @usage
 * Suppose you have a template with:
 *
 * ```javascript
 * Template.foo.onCreated(function() {
 *   this.bar = function() {
 *     console.log('callback');
 *   }
 * });
 * ```
 *
 * ```handlebars
 * {{#foo}}
 *   <button on-drag-right="bar" class="button">Test</button>
 * {{/foo}}
 * ```
 */


/**
 * @ngdoc directive
 * @name onDragDown
 * @module meteoric
 * @restrict A
 *
 * @description
 * Called when the element is dragged down.
 *
 * @usage
 * Suppose you have a template with:
 *
 * ```javascript
 * Template.foo.onCreated(function() {
 *   this.bar = function() {
 *     console.log('callback');
 *   }
 * });
 * ```
 *
 * ```handlebars
 * {{#foo}}
 *   <button on-drag-down="bar" class="button">Test</button>
 * {{/foo}}
 * ```
 */


/**
 * @ngdoc directive
 * @name onDragLeft
 * @module meteoric
 * @restrict A
 *
 * @description
 * Called when the element is dragged to the left.
 *
 * @usage
 * Suppose you have a template with:
 *
 * ```javascript
 * Template.foo.onCreated(function() {
 *   this.bar = function() {
 *     console.log('callback');
 *   }
 * });
 * ```
 *
 * ```handlebars
 * {{#foo}}
 *   <button on-drag-left="bar" class="button">Test</button>
 * {{/foo}}
 * ```
 */


/**
 * @ngdoc directive
 * @name onSwipe
 * @module meteoric
 * @restrict A
 *
 * @description
 * Called when a moving touch has a high velocity in any direction.
 *
 * @usage
 * Suppose you have a template with:
 *
 * ```javascript
 * Template.foo.onCreated(function() {
 *   this.bar = function() {
 *     console.log('callback');
 *   }
 * });
 * ```
 *
 * ```handlebars
 * {{#foo}}
 *   <button on-swipe="bar" class="button">Test</button>
 * {{/foo}}
 * ```
 */


/**
 * @ngdoc directive
 * @name onSwipeUp
 * @module meteoric
 * @restrict A
 *
 * @description
 * Called when a moving touch has a high velocity moving up.
 *
 * @usage
 * Suppose you have a template with:
 *
 * ```javascript
 * Template.foo.onCreated(function() {
 *   this.bar = function() {
 *     console.log('callback');
 *   }
 * });
 * ```
 *
 * ```handlebars
 * {{#foo}}
 *   <button on-swipe-up-end="bar" class="button">Test</button>
 * {{/foo}}
 * ```
 */


/**
 * @ngdoc directive
 * @name onSwipeRight
 * @module meteoric
 * @restrict A
 *
 * @description
 * Called when a moving touch has a high velocity moving to the right.
 *
 * @usage
 * Suppose you have a template with:
 *
 * ```javascript
 * Template.foo.onCreated(function() {
 *   this.bar = function() {
 *     console.log('callback');
 *   }
 * });
 * ```
 *
 * ```handlebars
 * {{#foo}}
 *   <button on-swipe-right-end="bar" class="button">Test</button>
 * {{/foo}}
 * ```
 */


/**
 * @ngdoc directive
 * @name onSwipeDown
 * @module meteoric
 * @restrict A
 *
 * @description
 * Called when a moving touch has a high velocity moving down.
 *
 * @usage
 * Suppose you have a template with:
 *
 * ```javascript
 * Template.foo.onCreated(function() {
 *   this.bar = function() {
 *     console.log('callback');
 *   }
 * });
 * ```
 *
 * ```handlebars
 * {{#foo}}
 *   <button on-swipe-down="bar" class="button">Test</button>
 * {{/foo}}
 * ```
 */


/**
 * @ngdoc directive
 * @name onSwipeLeft
 * @module meteoric
 * @restrict A
 *
 * @description
 * Called when a moving touch has a high velocity moving to the left.
 *
 * @usage
 * Suppose you have a template with:
 *
 * ```javascript
 * Template.foo.onCreated(function() {
 *   this.bar = function() {
 *     console.log('callback');
 *   }
 * });
 * ```
 * 
 * ```handlebars
 * {{#foo}}
 *   <button on-swipe-left="bar" class="button">Test</button>
 * {{/foo}}
 * ```
 */

function gestureDirective(directiveName) {
    new TemplateAttributeDirectiveType(directiveName, {
        $postLink(scope, element, attr) {
            var eventType = directiveName.substr(2).toLowerCase();

            //meteoric:
            // todo: Have a way to be able to pass blaze helper to here.
            let fn = this.templateInstance[attr[directiveName]];
            if (!_.isFunction(fn)) {
                throw new Meteor.Error(`Given callback "${directiveName}" is not in templateInstance in which ${directiveName} attribute directive is declared.`);
            }

            var listener = function(ev) {
                (function () {
                    fn(scope, {
                        $event: ev
                    });
                }).apply(scope);
            };

            var gesture = $ionicGesture.on(eventType, listener, element);

            scope.$on('$destroy', function() {
                $ionicGesture.off(gesture, eventType, listener);
            });
        }
    });
}