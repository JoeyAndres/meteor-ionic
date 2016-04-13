/**
 * @ngdoc directive
 * @name ionItem
 * @parent meteoric.directive:ionList
 * @module meteoric
 * @restrict E
 *
 * @description
 * Creates a list-item that can easily be swiped,
 * deleted, reordered, edited, and more.
 *
 * See {@link meteoric.directive:ionList} for a complete example & explanation.
 *
 * Can be assigned any item class name. See the
 * [list CSS documentation](/docs/components/#list).
 *
 * @usage
 *
 * ```handlebars
 * {{#ionList}}
 *   {{#ionItem}}Hello!{{/ionItem}}
 *   {{#ionItem href="#/detail"}}
 *     Link to detail page
 *   {{/ionItem}}
 * {{/ionList}}
 * ```
 */

function url() {
    if (this.data.href) {
        return this.data.href;
    }

    if ( this.data.path || this.data.url || this.data.route ) {

        var path = _.find([this.data.path,this.data.url,this.data.route],function(path){return path !=undefined});

        if ( this.data.query || this.data.hash || this.data ){

            var hash = {};
            hash.route = path;
            hash.query = this.data.query;
            hash.hash = this.data.hash;
            hash.data = this.data;
            var options = new Spacebars.kw(hash);

            // Devs may pass 'route=x' instead of 'path=' or 'url='
            // Should doing that throw an error? Not sure but we decided to
            // parse it as if the dev passed it as 'path='
            if (this.url){
                return Blaze._globalHelpers.urlFor(options)
            } else if( this.data.path || this.data.route ) {
                return Blaze._globalHelpers.pathFor(options)
            }

        } else {
            return Router.routes[path].path(Template.parentData(1));
        }
    }
};

Template.ionItem.onCreated(function() {
    this.new_scope = true;
    
    this.itemComplex = new ReactiveVar(false);
    this.isAnchor = new ReactiveVar(false);

    this.onReorder = new ReactiveVar(noop);
    this.onClick = new ReactiveVar(noop);

    this.href = new ReactiveVar(undefined);
    this.path = new ReactiveVar(undefined);
    this.url = new ReactiveVar(undefined);
    this.route = new ReactiveVar(undefined);

    this.autorun(() => {
        let td = Template.currentData();
        if (!td) return;

        this.href.set(td.href);
        this.path.set(td.path);
        this.url.set(td.url);
        this.route.set(td.route);

        this.onReorder.set(isDefined(td.onReorder) ? td.onReorder : noop);
        this.onClick.set(isDefined(td.onClick) ? td.onClick : noop);
    });
});

Template.ionItem.onRendered(function() {
    let $scope = this.$scope,
        $element = jqLite(this.firstNode),
        $attrs = {
            href: this.href.get(),
            path: this.path.get(),
            url: this.url.get(),
            route: this.route.get()
        };

    this.autorun(() => {
        $scope.$onReorder = this.onReorder.get();
    });

    let itemCtrl = { $scope, $element };
    $scope.$itemCtrl = itemCtrl;

    // meteoric: moved from $postLink
    $scope.$href = () => {
        return url.call(this);
    };

    var isAnchor = isDefined($attrs.href) ||
        isDefined($attrs.path) ||
        isDefined($attrs.url) ||
        isDefined($attrs.route);
    this.isAnchor.set(isAnchor);
    var isComplexItem = isAnchor ||
        //Lame way of testing, but we have to know at compile what to do with the element
        /ion-(delete|option|reorder)-button/i.test($element.html());
    this.itemComplex.set(isComplexItem);

    if (isComplexItem) {
        $element.addClass('item item-complex')
    } else {
        $element.addClass('item');
    }

    $(this).on('$postLink', () => {
        $scope.$target = function() {
            return $attrs.target;
        };

        var content = $element[0].querySelector('.item-content');
        if (content) {
            $scope.$on('$collectionRepeatLeave', function() {
                if (content && content.$$ionicOptionsOpen) {
                    content.style[ionic.CSS.TRANSFORM] = '';
                    content.style[ionic.CSS.TRANSITION] = 'none';
                    ionic.requestAnimationFrame(function() {
                        content.style[ionic.CSS.TRANSITION] = '';
                    });
                    content.$$ionicOptionsOpen = false;
                }
            });
        }
    });
});

Template.ionItem.helpers({
    itemComplex() {
        return Template.instance().itemComplex.get();
    },
    
    isAnchor() {
        return Template.instance().isAnchor.get();
    },

    href() {
        return url.call(Template.instance());
    }
});