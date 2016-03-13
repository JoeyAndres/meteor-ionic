Template.onCreated(function() {
    this.postLinked = false;
    this.preLinked = false;

    let parentTemplate = this.parent(t => isDefined(t.$scope), true);
    this._scope_parentTemplate = parentTemplate;
    let isParentObj = _.isObject(parentTemplate) && _.isObject(parentTemplate.$scope);
    let parentObj =  isParentObj ? parentTemplate.$scope : { };

    this.$scope = meteoric.Utils.to$scope({});
    if (!parentTemplate) this.$scope = this.$scope = meteoric.Utils.$rootScope;
    Object.setPrototypeOf(this.$scope, parentObj);
    this.$scope.$parent = parentObj;
    this.onScopeCreated && this.onScopeCreated();
    $(this).trigger('$scopeCreated');

    let preLinkHandler = () => {
        $(this).trigger('$preLink');
        $(this).trigger('$$preLink');
        this.preLinked = true;
    };
    this._preLinkHandler = preLinkHandler;

    if (!parentTemplate) {
        $(this).on('$rendered', preLinkHandler);
    } else {
        if (!parentTemplate.preLinked) {
            $(parentTemplate).on('$$preLink', preLinkHandler);
        } else {
            // will be called on onRendered.
        }
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
    this.postLinked = true;

    if (this._scope_parentTemplate && this._scope_parentTemplate.preLinked) {
        this._preLinkHandler();
    }

    // Assuming this will be called last, due to being added in startup.
    $(this).trigger('$rendered');
});

Template.onDestroyed(function() {
    Object.setPrototypeOf(this.$scope, null);
    this.$scope.trigger('$destroy');
});