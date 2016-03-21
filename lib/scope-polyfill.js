Template.onCreated(function() {
    this.postLinked = false;
    this.preLinked = false;

    let parentTemplate = this.parent(t => isDefined(t.$scope), true);
    let rootTemplate = !parentTemplate;
    this._scope_parentTemplate = parentTemplate;  // Cache to be used for onRendered and anywhere else.


    if (rootTemplate) {
        this.$scope = this.$scope = meteoric.Utils.$rootScope;
    } else {
        let parentScopeExist = _.isObject(parentTemplate) && _.isObject(parentTemplate.$scope);
        let $parent =  parentScopeExist ? parentTemplate.$scope : null;
        this.$scope = $parent.$new();
    }
    $(this).trigger('$scopeCreated');  // This is so other Template.onCreated can use this.

    let preLinkHandler = () => {
        $(this).trigger('$preLink');  // Trigger $preLink for this $scope.
        $(this).trigger('$$preLink');  // Once $preLink for this scope is called, call $preLink for the children.
        this.preLinked = true;
    };
    this._preLinkHandler = preLinkHandler;

    if (rootTemplate) {
        $(this).on('$rendered', preLinkHandler);
    } else {
        /*
         * If for some reason parent already have preLink called, then onRendered for this template,
         * $preLink will be called for this parent. Otherwise, we set up a listener for parent's $$preLink.
         */
        if (!parentTemplate.preLinked) {
            $(parentTemplate).on('$$preLink', preLinkHandler);
        } else {
            // will be called on onRendered.
        }
    }
});

Template.onRendered(function() {
    $(this).trigger('$postLink');
    this.postLinked = true;

    /*
     * If preLinked is already called in he parent, call preLink immediately.
     * This is the case when new elements are appended in which
     * this._scope_parentTemplate.preLinked is already set to true.
     */
    if (this._scope_parentTemplate && this._scope_parentTemplate.preLinked) {
        this._preLinkHandler();
    }

    // Assuming this will be called last, due to being added in startup. Template.onRendered will be added
    // during compile time.
    $(this).trigger('$rendered');

    /*
     * If the only one node (firstNode == lastNode), then attach a $scope to all of them.
     * We assume this is the case for meteoric's component.
     */
    let single_node = this.firstNode == this.lastNode;
    if (single_node) {
        $(this.firstNode).data('$scope', this.$scope);
    }
});

Template.onDestroyed(function() {
    this.$scope.$destroy();
});