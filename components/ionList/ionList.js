Template.ionList.onCreated(function() {
    this.showDelete = new ReactiveVar(false);
    this.showReorder = new ReactiveVar(false);
    this.canSwipe = new ReactiveVar(false);

    this.onReorder = noop;

    this.autorun(() => {
        let td = Template.currentData();
        if (!td) return;

        this.showDelete.set(isDefined(td.showDelete) ? td.showDelete : false);
        this.showReorder.set(isDefined(td.showReorder) ? td.showReorder : false);
        this.canSwipe.set(isDefined(td.canSwipe) ? td.canSwipe : false);
        this.onReorder = isDefined(td.onReorder) ? td.onReorder : noop;
    });
});

Template.ionList.onRendered(function() {
    var $scope = this.$scope,
        $element = jqLite(this.firstNode),
        $attrs = {};

    $scope.$listController = new $ionicList($scope, $attrs);

    $(this).on('$postLink', () => {
        var listCtrl = $scope.$listController;
        var scrollCtrl = $scope.$scrollController;

        // Wait for child elements to render...
        $timeout(init.bind(this));

        let t = this;

        function init() {
            var listView = listCtrl.listView = new ionic.views.ListView({
                el: $element[0],
                listEl: $element.children()[0],
                scrollEl: scrollCtrl && scrollCtrl.element,
                scrollView: scrollCtrl && scrollCtrl.scrollView,
                onReorder: function(el, oldIndex, newIndex) {
                    var itemScope = jqLite(el).scope();
                    if (itemScope && itemScope.$onReorder) {
                        // Make sure onReorder is called in apply cycle,
                        // but also make sure it has no conflicts by doing
                        // $evalAsync
                        $timeout(function() {
                            itemScope.$onReorder(oldIndex, newIndex);

                            // meteoric:
                            t.onReorder(el, oldIndex, newIndex);
                        });
                    }
                },
                canSwipe: function() {
                    return listCtrl.canSwipeItems();
                }
            });

            $scope.$on('$destroy', function() {
                if (listView) {
                    listView.deregister && listView.deregister();
                    listView = null;
                }
            });

            this.autorun(() => listCtrl.canSwipeItems(this.canSwipe.get()));
            this.autorun(() => listCtrl.showDelete(this.showDelete.get()));
            this.autorun(() => listCtrl.showReorder(this.showReorder.get()));

            let wasShowDelete = this.showDelete.get();
            this.autorun(() => {
                //Only use isShown=false if it was already shown
                let isShown = this.showDelete.get();
                if (!isShown && !wasShowDelete) {
                    return;
                }
                if (isShown) listCtrl.closeOptionButtons();
                listCtrl.canSwipeItems(!isShown);
                $element.children().toggleClass('list-left-editing', isShown);
                $element.toggleClass('disable-pointer-events', isShown);

                var deleteButton = $($element[0].getElementsByClassName('item-delete'));
                setButtonShown(deleteButton, listCtrl.showDelete);
                wasShowDelete = isShown;
            });

            let wasShowReorder = this.showReorder.get();
            this.autorun(() => {
                //Only use isShown=false if it was already shown
                let isShown = this.showReorder.get();
                if (!isShown && !wasShowReorder) {
                    return;
                }
                if (isShown) listCtrl.closeOptionButtons();
                listCtrl.canSwipeItems(!isShown);

                $element.children().toggleClass('list-right-editing', isShown);
                $element.toggleClass('disable-pointer-events', isShown);

                var reorderButton = $($element[0].getElementsByClassName('item-reorder'));
                setButtonShown(reorderButton, listCtrl.showReorder);
                wasShowReorder = isShown;
            });

            function setButtonShown(el, shown) {
                shown() && el.addClass('visible') || el.removeClass('active');
                ionic.requestAnimationFrame(function() {
                    shown() && el.addClass('active') || el.removeClass('visible');
                });
            }
        }

    });
});