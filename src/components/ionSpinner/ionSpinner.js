/**
 * @ngdoc directive
 * @name ionSpinner
 * @module meteoric
 * @demo /spinner
 * @restrict E
 *
 * @description
 * The `ionSpinner` directive provides a variety of animated spinners.
 * Spinners enables you to give your users feedback that the app is
 * processing/thinking/waiting/chillin' out, or whatever you'd like it to indicate.
 * By default, the {@link meteoric.directive:ionRefresher} feature uses this spinner, rather
 * than rotating font icons (previously included in [ionicons](http://ionicons.com/)).
 * While font icons are great for simple or stationary graphics, they're not suited to
 * provide great animations, which is why Ionic uses SVG instead.
 *
 * Ionic offers ten spinners out of the box, and by default, it will use the appropriate spinner
 * for the platform on which it's running. Under the hood, the `ionSpinner` directive dynamically
 * builds the required SVG element, which allows Ionic to provide all ten of the animated SVGs
 * within 3KB.
 *
 * Each spinner uses SVG with SMIL animations, however, the Android spinner also uses JavaScript
 * so it also works on Android 4.0-4.3. Additionally, each spinner can be styled with CSS,
 * and scaled to any size.
 *
 *
 * @usage
 * The following code would use the default spinner for the platform it's running from. If it's neither
 * iOS or Android, it'll default to use `ios`.
 *
 * ```html
 * <ion-spinner></ion-spinner>
 * ```
 *
 * By setting the `icon` attribute, you can specify which spinner to use, no matter what
 * the platform is.
 *
 * ```html
 * <ion-spinner icon="spiral"></ion-spinner>
 * ```
 *
 * ## Spinner Colors
 * Like with most of Ionic's other components, spinners can also be styled using
 * Ionic's standard color naming convention. For example:
 *
 * ```html
 * <ion-spinner class="spinner-energized"></ion-spinner>
 * ```
 *
 *
 * ## Styling SVG with CSS
 * One cool thing about SVG is its ability to be styled with CSS! Some of the properties
 * have different names, for example, SVG uses the term `stroke` instead of `border`, and
 * `fill` instead of `background-color`.
 *
 * ```css
 * .spinner svg {
 *   width: 28px;
 *   height: 28px;
 *   stroke: #444;
 *   fill: #444;
 * }
 * ```
 *
 */

Template.ionSpinner.onCreated(function() {
  this.icon = new ReactiveVar(null);

  this.autorun(() => {
    if (!Template.currentData()) return;  // If no data-context, don't do a thing.
    this.icon.set(!!Template.currentData().icon ? Template.currentData().icon : null);
  });
});

Template.ionSpinner.onRendered(function() {
  let $element = this.$(this.firstNode);

  $(this).on('$postLink', () => {
    this.icon.set((new meteoric.controller.ionicSpinner($element, {
      icon: this.icon.get()
    })).init());
  });
});

Template.ionSpinner.helpers({
  icon: function() {
    return Template.instance().icon.get();
  }
});
