Template.onCreated(function() {
    let parentTemplate = this.parent(1, true);
    let isParentObj = _.isObject(parentTemplate) && _.isObject(parentTemplate.$scope);
    let parentObj =  isParentObj ? parentTemplate.$scope : {};
    this.$scope = meteoric.Utils.to$scope({});
    Object.setPrototypeOf(this.$scope, parentObj);
    $(this).trigger('$scopeCreated');
    this.rendered = false;
    this.onScopeCreated && this.onScopeCreated();

    if (!parentTemplate) {
        meteoric.Utils.rootScope = this.scope;
    } else {
        let preLinkHandler = () => $(this).trigger('$preLink');

        let preLinkHandler_1 = () => {
            $(parentTemplate).off('$rendered', preLinkHandler);
            $(this).on('$rendered', preLinkHandler);
        };
        let preLinkHandler_2 = () => {
            $(this).off('$rendered', preLinkHandler);
            $(parentTemplate).on('$rendered', preLinkHandler);
        };

        $(parentTemplate).on('$rendered', preLinkHandler_1);
        $(this).on('$rendered', preLinkHandler_2);
    }

    //$(this).on('$preLink', () => console.log('$preLink', this.view.name));
    //$(this).on('$postLink', () => console.log('$postLink', this.view.name));
});

Template.onRendered(function() {
    meteoric._directives.menuClose(this.$('[menu-close]'), this.$scope);
    meteoric._directives.menuToggle(this.$('[menu-toggle]'), this.$scope);

    if (this.data) {
        let td = this.data;

        if (td.exposeAsideWhen) {
            meteoric._directives.exposeAsideWhen(null, this.$scope, {
                exposeAsideWhen: td.exposeAsideWhen
            });
        }
    }

    $(this).trigger('$postLink');

    // Assuming this will be called last, due to being added in startup.
    this.rendered = true;
    $(this).trigger('$rendered');
});

Template.onDestroyed(function() {
    Object.setPrototypeOf(this.$scope, null);
    this.$scope.trigger('$destroy');
});