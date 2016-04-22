/**
 * @ngdoc directive
 * @name ionFooterBar
 * @module meteoric
 * @restrict E
 *
 * @description
 * Adds a fixed footer bar below some content.
 *
 * Can also be a subfooter (higher up) if the 'bar-subfooter' class is applied.
 * See [the footer CSS docs](/docs/components/#footer).
 *
 * @param {string=} alignTitle Where to align the title.
 * Available: 'left', 'right', or 'center'.  Defaults to 'center'.
 *
 * @usage
 * ```html
 * {{#ion-content}}
 *   Some content!
 * {{/ion-content}}
 * {{#ion-footer-bar align-title="left" class="bar-assertive"}}
 *   <div class="buttons">
 *     <button class="button">Left Button</button>
 *   </div>
 *   <h1 class="title">Title!</h1>
 *   <div class="buttons">
 *     <button class="button">Right Button</button>
 *   </div>
 * {{/ion-footer-bar}}
 * ```
 */

Template.ionFooterBar.onCreated(function() {
  this.alignTitle = this.data? this.data.alignTitle : null;
  this.class = new ReactiveVar('');
  this.hide = new ReactiveVar(false);

  this.autorun(() => {
    let td = Template.currentData();
    if (!td) return;

    this.class.set(td.class ? td.class : '');
  });
});

Template.ionFooterBar.onRendered(function () {
  let isHeader = false;
  headerFooterBarDirective.call(this, isHeader);
});
