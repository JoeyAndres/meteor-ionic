#### IonActionSheet
------
In meteor-ionic:
```javascript
IonActionSheet.show({
  titleText: 'ActionSheet Example',
  buttons: [
    { text: 'Share <i class="icon ion-share"></i>' },
    { text: 'Move <i class="icon ion-arrow-move"></i>' },
  ]
  // ...
});
```

In meteoric, we just changed `IonActionSheet` to `$ionicActionSheet` to align
more with the original ionic:
```javascript
$ionicActionSheet.show({
  titleText: 'ActionSheet Example',
  buttons: [
    { text: 'Share <i class="icon ion-share"></i>' },
    { text: 'Move <i class="icon ion-arrow-move"></i>' },
  ]
  // ...
});
```

#### IonBackdrop
------
In meteor-ionic:
```javascript
IonicBackdrop.retain();
```

In meteoric, we just changed `IonActionSheet` to `$ionicActionSheet` to align
more with the original ionic:
```javascript
$ionicBackdrop.retain();
```

#### ionBody
------
This is removed in meteoric.


#### ionIcon
------
This was removed due to not being in original and was causing performance
problem (unnecessary templates). Simply use _classes_, e.g.:
```html
<i class="icon ion-email"></i>
```

#### ionList
------
In meteor-ionic:
```handlebars
{{#ionList}}
    {{#each items}}
      {{#ionItem buttonRight=true avatar=true}}
        <img src="https://randomuser.me/api/portraits/thumb/men/27.jpg">
        <h2>John Smith</h2>
        <p>
          (555) 555-1212
        </p>
        <button class="button button-positive">{{> ionIcon icon="ios-telephone"}} </button>
      {{/ionItem}}
    {{/each}}
{{/ionList}}
```

In meteoric, you use it like original ionic:
```handlebars
{{#ionList}}
    {{#each items}}
        {{#ionItem class="item-avatar-left item-button-right"}}
            <img src="https://randomuser.me/api/portraits/thumb/men/27.jpg">
            <h2>John Smith {{{this}}}</h2>
            <p>(555) 555-1212</p>
            <button class="button button-assertive"><i class="icon ion-ios-telephone"></i></button>
        {{/ionItem}}
    {{/each}}
{{/ionList}}
```

In addition, you can have `ionOptionButton`/`ionDeleteButton`/`ionReorderButton`:
```handlebars
 {{#ionList onReorder=onReorder showDelete=deletable showReorder=sortable canSwipe=true}}
     {{#each items}}
         {{#ionItem class="item-avatar-left"}}
             <img src="https://randomuser.me/api/portraits/thumb/men/27.jpg">
             <h2>John Smith {{this}}</h2>
             <p>(555) 555-1212</p>

             {{#ionOptionButton class="button-info"}}
                 Share
             {{/ionOptionButton}}
             {{#ionOptionButton class="button-assertive"}}
                 Edit
             {{/ionOptionButton}}

             {{#ionDeleteButton class="ion-minus-circled"}}{{/ionDeleteButton}}
             {{#ionReorderButton class="ion-navicon"}}{{/ionReorderButton}}
         {{/ionItem}}
     {{/each}}
 {{/ionList}}
```

#### ionNavBar
------
In meteor-ionic, you declare `ionNavBar` in your template, in the same level as `ionNavView`:
```handlebars
{{> ionNavBar class="bar-positive"}}
{{#ionNavView}}
  {{> yield}}
{{/ionNavView}}
```

Then you use, `{{#contentFor}}` helper for buttons and titles in your templates:

```handlebars
{{#contentFor "headerButtonLeft"}}
  {{>ionNavBackButton path="index"}}
{{/contentFor}}
{{#contentFor "headerTitle"}}
  <h1 class="title">Modal</h1>
{{/contentFor}}
```

In meteoric, `ionNavBar` is more like the original ionic:

```handlebars
{{#ionNavBar class="bar-assertive"}}
    <!-- Note: Just like ionic, ionNavBackButton will only show if there is a back page available. -->
    {{#ionNavBackButton}}{{/ionNavBackButton}}
{{/ionNavBar}}
{{#ionNavView}}
    {{> yield}}
{{/ionNavView}}
```

Then throughout your app, there are multiple ways to set buttons and titles:

For buttons, you can use `ionHeaderBar` and `ionNavButtons`:

```handlebars
{{#ionView}}
    {{#ionHeaderBar class="bar-assertive"}}
        <div class="buttons">
            <button class="button">Left Button</button>
        </div>
        <h1 class="title">I'm the header.</h1>
        <div class="buttons">
            <button class="button">Right Button</button>
        </div>
    {{/ionHeaderBar}}
{{/ionView}}
```

```handlebars
{{#ionView}}
    {{#ionNavButtons side="left"}}
         <button class="button button-clear pull-left" ion-menu-toggle="left">
             <i class="icon ion-navicon"></i>
         </button>
    {{/ionNavButtons}}
    {{#ionNavButtons side="right"}}
         <button class="button button-clear pull-right" ion-menu-toggle="right">
             <i class="icon ion-navicon"></i>
         </button>
    {{/ionNavButtons}}
{{/ionView}}
```

For title, you can also use `ionHeaderBar` as well as `ionNavTitle` and `ionView`.

```handlebars
{{#ionView}}
     {{#ionNavTitle}}Hello{{/ionNavTitle}}
{{/ionView}}
```

```handlebars
{{#ionView viewTitle="exampleTitle"}}
  <!-- ... -->
{{/ionView}}
```

Notice how all of them must be under `ionView`. This was a requirement in ionic, and weird things tend to happen
otherwise.

#### ionRadio
------
Not much have changed except that we introduced the concept of `model` much like the original `ngModal`. The `model`
must be of type `ReactiveVar`. For example:

```javascript
Template.radio.onCreated(function() {
    this.radioModel = new ReactiveVar(null);
});

Template.radio.helpers({
    radioModel() {
        return Template.instance().radioModel;  // Note: We return the ReactiveVar itself, not the value within.
    },

    radioModel_value() {
        return Template.instance().radioModel.get();
    }
});
```

```handlebars
<template name="radio">
    {{#ionView title="Radio"}}
        {{#ionContent}}
            <div class="padding">
                <form name="radio_button_form" id="radio-button-form">
                    {{#ionRadio name="test_radio" checked=true value="test value 1" model=radioModel }}
                        Test Content 1
                    {{/ionRadio}}
                    {{#ionRadio name="test_radio" value="test value 2" model=radioModel }}
                        Test Content 2
                    {{/ionRadio}}
                    {{#ionRadio name="test_radio" value="test value 3" model=radioModel }}
                        Test Content 3
                    {{/ionRadio}}

                    <div class="item item-icon-left">
                        <i class="ion-android-alert icon"></i> Model Value: <b id="model-value">{{radioModel_value}}</b>
                    </div>
                </form>
            </div>
        {{/ionContent}}
    {{/ionView}}
</template>
```

#### IonPopup
------
In meteor-ionic:
```javascript
IonPopup.show({
  title: 'A Popup',
  template: 'Here\'s a quick popup.',
  buttons: [{
    text: 'Close me',
    type: 'button-positive',
    onTap: function() {
      IonPopup.close();
    }
  }]
});
```

In meteoric, we just changed `IonPopup` to `$ionicPopup` to align
more with the original ionic:

```javascript
$ionicPopup.show({
  title: 'A Popup',
  template: 'Here\'s a quick popup.',
  buttons: [{
    text: 'Close me',
    type: 'button-assertive',
    onTap: function() {
      $ionicPopup.close();
    }
  }]
});
```

#### ionSideMenu/ionSideMenuContent/ionSideMenuContainer/ionSideMenus
------
In meteoric, `ionSideMenuContainer` is removed to be more in favour of the original
ionic.

```handlebars
{{#ionSideMenus}}
    {{#ionSideMenu}}
        <!-- left side bar content. -->
    {{/ionSideMenu}}

    {{#ionSideMenuContent}}
        <!-- side menu content. -->
    {{/ionSideMenuContent}}

    {{#ionSideMenu side="right"}}
        <!-- right side bar content. -->
    {{/ionSideMenu}}

{{/ionSideMenus}}
```

#### ionSlide/ionSlideBox
------
In meteoric, we just have `ionSlides`:
```handlebars
{{#ionSlides style="height: 100%"}}
    {{#ionSlidePage}}
        <div style="background-color: blue; height: 100%;" class="box blue text-center">
            <h1 style="color: white">BLUE</h1>
        </div>
    {{/ionSlidePage}}
    {{#ionSlidePage}}
        <div style="background-color: yellow; height: 100%;" class="box yellow text-center">
            <h1 style="color: white">YELLOW</h1>
        </div>
    {{/ionSlidePage}}
    {{#ionSlidePage}}
        <div style="background-color: pink; height: 100%;" class="box pink text-center">
            <h1 style="color: white">PINK</h1>
        </div>
    {{/ionSlidePage}}
{{/ionSlides}}
```

#### ionSubfooterBar
------
In meteoric:
```handlebars
{{#ionFooterBar alignTitle="left" class="bar-positive bar-subfooter"}}
  <h1 class="title">Title!</h1>
{{/ionFooterBar}}
```

#### ionSubheaderBar
------
In meteoric:
```handlebars
{{#ionHeaderBar alignTitle="left" class="bar-positive bar-subheader"}}
  <h1 class="title">Title!</h1>
{{/ionHeaderBar}}
```

#### ionTab/ionTabs
------
Tabs in meteoric was something I don't even want to start thinking about.
You have to create extra templates here and there. It's too much. In
meteoric, it is beautifully simple.

`href` will be route appended to your current path. e.g. If the snippet
below belongs to a path `/example/tabs`, click "Home" makes the path to
`/example/tabs/home`.

```handlebars
{{#ionTabs class="tabs-positive tabs-icon-top"}}
     {{#ionTab title="Home" iconOn="ion-ios-filing" iconOff="ion-ios-filing-outline" href="/tabs/home"}}
         <!-- contents go here -->
     {{/ionTab}}

     {{#ionTab title="About" iconOn="ion-ios-clock" iconOff="ion-ios-clock-outline" href="/tabs/about" }}
         <!-- contents go here -->
     {{/ionTab}}

     {{#ionTab title="Settings" iconOn="ion-ios-gear" iconOff="ion-ios-gear-outline" href="/tabs/settings"}}
         <!-- contents go here -->
     {{/ionTab}}
{{/ionTabs}}
```