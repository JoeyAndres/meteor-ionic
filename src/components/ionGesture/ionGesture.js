/**
 * @module meteoric
 */

import { TemplateAttributeDirectiveType } from 'meteor/jandres:template-attribute-directive';

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
 * ```html
 * <button on-hold="onHold()" class="button">Test</button>
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
 * ```html
 * <button on-tap="onTap()" class="button">Test</button>
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
 * ```html
 * <button on-double-tap="onDoubleTap()" class="button">Test</button>
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
 * ```html
 * <button on-touch="onTouch()" class="button">Test</button>
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
 * ```html
 * <button on-release="onRelease()" class="button">Test</button>
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
 * ```html
 * <button on-drag-start="onDragStart()" class="button">Test</button>
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
 * ```html
 * <button on-drag="onDrag()" class="button">Test</button>
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
 * ```html
 * <button on-drag-end="onDragEnd()" class="button">Test</button>
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
 * ```html
 * <button on-drag-up="onDragUp()" class="button">Test</button>
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
 * ```html
 * <button on-drag-right="onDragRight()" class="button">Test</button>
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
 * ```html
 * <button on-drag-down="onDragDown()" class="button">Test</button>
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
 * ```html
 * <button on-drag-left="onDragLeft()" class="button">Test</button>
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
 * ```html
 * <button on-swipe="onSwipe()" class="button">Test</button>
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
 * ```html
 * <button on-swipe-up="onSwipeUp()" class="button">Test</button>
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
 * ```html
 * <button on-swipe-right="onSwipeRight()" class="button">Test</button>
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
 * ```html
 * <button on-swipe-down="onSwipeDown()" class="button">Test</button>
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
 * ```html
 * <button on-swipe-left="onSwipeLeft()" class="button">Test</button>
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