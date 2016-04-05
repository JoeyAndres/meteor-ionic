import { TemplateAttributeDirectiveType } from 'meteor/jandres:template-attribute-directive';

var GESTURE_DIRECTIVES = 'onHold onTap onDoubleTap onTouch onRelease onDragStart onDrag onDragEnd onDragUp onDragRight onDragDown onDragLeft onSwipe onSwipeUp onSwipeRight onSwipeDown onSwipeLeft'.split(' ');

GESTURE_DIRECTIVES.forEach(function(name) {
    gestureDirective(name);
});

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