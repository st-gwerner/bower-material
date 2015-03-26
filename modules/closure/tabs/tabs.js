/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3-master-0afb8b8
 */
goog.provide('ng.material.components.tabs');
goog.require('ng.material.components.icon');
goog.require('ng.material.core');
(function() {
'use strict';

/**
 * @ngdoc module
 * @name material.components.tabs
 * @description
 *
 *  Tabs, created with the `<md-tabs>` directive provide *tabbed* navigation with different styles.
 *  The Tabs component consists of clickable tabs that are aligned horizontally side-by-side.
 *
 *  Features include support for:
 *
 *  - static or dynamic tabs,
 *  - responsive designs,
 *  - accessibility support (ARIA),
 *  - tab pagination,
 *  - external or internal tab content,
 *  - focus indicators and arrow-key navigations,
 *  - programmatic lookup and access to tab controllers, and
 *  - dynamic transitions through different tab contents.
 *
 */
/*
 * @see js folder for tabs implementation
 */
angular.module('material.components.tabs', [
  'material.core',
  'material.components.icon'
]);

})();

(function () {
  'use strict';
  angular
      .module('material.components.tabs')
      .directive('mdLabelTemplate', MdLabelTemplate);

  function MdLabelTemplate ($compile) {
    return {
      restrict: 'A',
      link: link,
      scope: { template: '=mdLabelTemplate' },
      require: '^mdTabs'
    };
    function link (scope, element, attr, ctrl) {
      var index = scope.$parent.$index;
      scope.$watch('template', function (html) {
        element.html(html);
        $compile(element.contents())(ctrl.tabs[index].parent);
      });
    }
  }
  MdLabelTemplate.$inject = ["$compile"];
})();
(function () {
  'use strict';
  angular
      .module('material.components.tabs')
      .directive('mdTabContent', MdTabContent);

  function MdTabContent ($compile, $mdUtil) {
    return {
      terminal: true,
      scope: {
        tab: '=mdTabData',
        active: '=mdActive'
      },
      link: link
    };
    function link (scope, element) {
      element.html(scope.tab.template);
      $compile(element.contents())(scope.tab.parent);
    }
  }
  MdTabContent.$inject = ["$compile", "$mdUtil"];
})();

/**
 * @ngdoc directive
 * @name mdTab
 * @module material.components.tabs
 *
 * @restrict E
 *
 * @description
 * Use the `<md-tab>` a nested directive used within `<md-tabs>` to specify a tab with a **label** and optional *view content*.
 *
 * If the `label` attribute is not specified, then an optional `<md-tab-label>` tag can be used to specify more
 * complex tab header markup. If neither the **label** nor the **md-tab-label** are specified, then the nested
 * markup of the `<md-tab>` is used as the tab header markup.
 *
 * If a tab **label** has been identified, then any **non-**`<md-tab-label>` markup
 * will be considered tab content and will be transcluded to the internal `<div class="md-tabs-content">` container.
 *
 * This container is used by the TabsController to show/hide the active tab's content view. This synchronization is
 * automatically managed by the internal TabsController whenever the tab selection changes. Selection changes can
 * be initiated via data binding changes, programmatic invocation, or user gestures.
 *
 * @param {string=} label Optional attribute to specify a simple string as the tab label
 * @param {boolean=} disabled If present, disabled tab selection.
 * @param {expression=} md-on-deselect Expression to be evaluated after the tab has been de-selected.
 * @param {expression=} md-on-select Expression to be evaluated after the tab has been selected.
 *
 *
 * @usage
 *
 * <hljs lang="html">
 * <md-tab label="" disabled="" md-on-select="" md-on-deselect="" >
 *   <h3>My Tab content</h3>
 * </md-tab>
 *
 * <md-tab >
 *   <md-tab-label>
 *     <h3>My Tab content</h3>
 *   </md-tab-label>
 *   <p>
 *     Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
 *     totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
 *     dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
 *     sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
 *   </p>
 * </md-tab>
 * </hljs>
 *
 */

(function () {
  'use strict';

  angular
      .module('material.components.tabs')
      .directive('mdTab', MdTab);

  function MdTab () {
    return {
      require: '^mdTabs',
      terminal: true,
      scope: {
        label:    '@',
        active:   '=?mdActive',
        disabled: '=?ngDisabled'
      },
      link: link
    };

    function link (scope, element, attr, ctrl) {
      var tabs = element.parent()[0].getElementsByTagName('md-tab'),
          index = Array.prototype.indexOf.call(tabs, element[0]),
          data = ctrl.insertTab({
            scope: scope,
            parent: scope.$parent,
            index: index,
            template: getTemplate(),
            label: getLabel()
          }, index);

      scope.$watch('active', function (active) { if (active) ctrl.select(data.getIndex()); });
      scope.$watch('disabled', function () { ctrl.refreshIndex(); });
      scope.$watch(getTemplate, function (template, oldTemplate) {
        if (template === oldTemplate) return;
        data.template = template;
        ctrl.updateInkBarStyles();
      });
      scope.$watch(getLabel, function (label, oldLabel) {
        if (label === oldLabel) return;
        data.label = label;
        ctrl.updateInkBarStyles();
      });
      scope.$on('$destroy', function () { ctrl.removeTab(data); });

      function getLabel () {
        //-- if label provided, then send label
        if (attr.label) return attr.label;
        //-- otherwise, we have to search for the `md-tab-label` element
        var label = element.find('md-tab-label');
        if (label) return label.html();
        //-- otherwise, we have no label.
        return 'Missing Label';
      }

      function getTemplate () {
        var content = element.find('md-tab-template');
        return content.length ? content.html() : attr.label ? element.html() : null;
      }
    }
  }
})();

(function () {
  'use strict';

  angular
      .module('material.components.tabs')
      .directive('mdTabItem', MdTabItem);

  function MdTabItem () {
    return { require: '^mdTabs', link: link };
    function link (scope, element, attr, ctrl) {
      ctrl.attachRipple(scope, element);
    }
  }
})();
(function () {
  'use strict';
  angular.module('material.components.tabs')
      .directive('mdTabScroll', MdTabScroll);

  function MdTabScroll () {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        element.on('mousewheel', function (event) {
          var newScope = scope.$new();
          newScope.$event = event;
          newScope.$element = element;
          newScope.$apply(function () {
            newScope.$eval(attr.mdTabScroll);
          });
        });
      }

    }
  }
})();
(function () {
  'use strict';

  angular
      .module('material.components.tabs')
      .controller('MdTabsController', MdTabsController);

  function MdTabsController ($scope, $element, $window, $timeout, $mdConstant, $mdInkRipple, $mdUtil) {
    var ctrl = this,
        elements = getElements();

    ctrl.scope = $scope;
    ctrl.parent = $scope.$parent;
    ctrl.tabs = [];
    ctrl.lastSelectedIndex = null;
    ctrl.focusIndex = 0;
    ctrl.offsetLeft = 0;
    ctrl.hasContent = true;
    ctrl.hasFocus = false;
    ctrl.lastClick = false;

    ctrl.redirectFocus = redirectFocus;
    ctrl.attachRipple = attachRipple;
    ctrl.shouldStretchTabs = shouldStretchTabs;
    ctrl.shouldPaginate = shouldPaginate;
    ctrl.insertTab = insertTab;
    ctrl.removeTab = removeTab;
    ctrl.select = select;
    ctrl.scroll = scroll;
    ctrl.nextPage = nextPage;
    ctrl.previousPage = previousPage;
    ctrl.keydown = keydown;
    ctrl.canPageForward = canPageForward;
    ctrl.canPageBack = canPageBack;
    ctrl.refreshIndex = refreshIndex;
    ctrl.incrementSelectedIndex = incrementSelectedIndex;
    ctrl.updateInkBarStyles = updateInkBarStyles;

    init();

    function init () {
      $scope.$watch('selectedIndex', handleSelectedIndexChange);
      $scope.$watch('$mdTabsCtrl.focusIndex', handleFocusIndexChange);
      $scope.$watch('$mdTabsCtrl.offsetLeft', handleOffsetChange);
      angular.element($window).on('resize', function () { $scope.$apply(handleWindowResize); });
      $timeout(updateInkBarStyles, 0, false);
    }

    function getElements () {
      var elements = {};
      elements.canvas = $element[0].getElementsByTagName('md-tabs-canvas')[0];
      elements.wrapper = elements.canvas.getElementsByTagName('md-pagination-wrapper')[0];
      elements.tabs    = elements.wrapper.getElementsByTagName('md-tab-item');
      elements.dummies = elements.canvas.getElementsByTagName('md-dummy-tab');
      elements.inkBar  = elements.wrapper.getElementsByTagName('md-ink-bar')[0];
      return elements;
    }

    function keydown (event) {
      switch (event.keyCode) {
        case $mdConstant.KEY_CODE.LEFT_ARROW:
          event.preventDefault();
          incrementSelectedIndex(-1, true);
          break;
        case $mdConstant.KEY_CODE.RIGHT_ARROW:
          event.preventDefault();
          incrementSelectedIndex(1, true);
          break;
        case $mdConstant.KEY_CODE.SPACE:
        case $mdConstant.KEY_CODE.ENTER:
          event.preventDefault();
          $scope.selectedIndex = ctrl.focusIndex;
          break;
      }
      ctrl.lastClick = false;
    }

    function incrementSelectedIndex (inc, focus) {
      var newIndex,
          index = focus ? ctrl.focusIndex : $scope.selectedIndex;
      for (newIndex = index + inc;
           ctrl.tabs[newIndex] && ctrl.tabs[newIndex].scope.disabled;
           newIndex += inc) {}
      if (ctrl.tabs[newIndex]) {
        if (focus) ctrl.focusIndex = newIndex;
        else $scope.selectedIndex = newIndex;
      }
    }

    function handleOffsetChange (left) {
      angular.element(elements.wrapper).css('left', '-' + left + 'px');
      $scope.$broadcast('$mdTabsPaginationChanged');
    }

    function handleFocusIndexChange (newIndex, oldIndex) {
      if (newIndex === oldIndex) return;
      if (!elements.tabs[newIndex]) return;
      adjustOffset();
      redirectFocus();
    }

    function redirectFocus () {
      elements.dummies[ctrl.focusIndex].focus();
    }

    function adjustOffset () {
      var tab = elements.tabs[ctrl.focusIndex],
          left = tab.offsetLeft,
          right = tab.offsetWidth + left;
      ctrl.offsetLeft = Math.max(ctrl.offsetLeft, fixOffset(right - elements.canvas.clientWidth));
      ctrl.offsetLeft = Math.min(ctrl.offsetLeft, fixOffset(left));
    }

    function handleWindowResize () {
      ctrl.lastSelectedIndex = $scope.selectedIndex;
      updateInkBarStyles();
      ctrl.offsetLeft = fixOffset(ctrl.offsetLeft);
    }

    function insertTab (tabData, index) {
      var proto = {
            getIndex: function () { return ctrl.tabs.indexOf(tab); },
            isActive: function () { return this.getIndex() === $scope.selectedIndex; },
            isLeft:   function () { return this.getIndex() < $scope.selectedIndex; },
            isRight:  function () { return this.getIndex() > $scope.selectedIndex; },
            hasFocus: function () { return !ctrl.lastClick && ctrl.hasFocus && this.getIndex() === ctrl.focusIndex; },
            id:       $mdUtil.nextUid()
          },
          tab = angular.extend(proto, tabData);
      if (!angular.isString(tabData.template)) {
        ctrl.hasContent = false;
      }
      if (angular.isDefined(index)) {
        ctrl.tabs.splice(index, 0, tab);
      } else {
        ctrl.tabs.push(tab);
      }
      return tab;
    }

    function removeTab (tabData) {
      ctrl.tabs.splice(tabData.getIndex(), 1);
      refreshIndex();
      $timeout(function () {
        updateInkBarStyles();
        ctrl.offsetLeft = fixOffset(ctrl.offsetLeft);
      });
    }

    function refreshIndex () {
      $scope.selectedIndex = getNearestSafeIndex($scope.selectedIndex);
      ctrl.focusIndex = getNearestSafeIndex(ctrl.focusIndex);
    }

    function handleSelectedIndexChange (newValue, oldValue) {
      if (newValue === oldValue) return;
      $scope.selectedIndex = getNearestSafeIndex(newValue);
      ctrl.lastSelectedIndex = oldValue;
      updateInkBarStyles();
      $scope.$broadcast('$mdTabsChanged');
    }

    function updateInkBarStyles () {
      if (!ctrl.tabs.length) return;
      var index = $scope.selectedIndex,
          totalWidth = elements.wrapper.offsetWidth,
          tab = elements.tabs[index],
          left = tab.offsetLeft,
          right = totalWidth - left - tab.offsetWidth;
      updateInkBarClassName();
      angular.element(elements.inkBar).css({ left: left + 'px', right: right + 'px' });

    }

    function updateInkBarClassName () {
      var newIndex = $scope.selectedIndex,
          oldIndex = ctrl.lastSelectedIndex,
          ink = angular.element(elements.inkBar);
      ink.removeClass('md-left md-right');
      if (!angular.isNumber(oldIndex)) return;
      if (newIndex < oldIndex) {
        ink.addClass('md-left');
      } else if (newIndex > oldIndex) {
        ink.addClass('md-right');
      }
    }

    function getNearestSafeIndex(newIndex) {
      var maxOffset = Math.max(ctrl.tabs.length - newIndex, newIndex),
          i, tab;
      for (i = 0; i <= maxOffset; i++) {
        tab = ctrl.tabs[newIndex + i];
        if (tab && (tab.scope.disabled !== true)) return tab.getIndex();
        tab = ctrl.tabs[newIndex - i];
        if (tab && (tab.scope.disabled !== true)) return tab.getIndex();
      }
      return newIndex;
    }

    function shouldStretchTabs () {
      switch ($scope.stretchTabs) {
        case 'always': return true;
        case 'never':  return false;
        default:       return !shouldPaginate() && $window.matchMedia('(max-width: 600px)').matches;
      }
    }

    function shouldPaginate () {
      var canvasWidth = $element.prop('clientWidth');
      angular.forEach(elements.tabs, function (tab) { canvasWidth -= tab.offsetWidth; });
      return canvasWidth <= 0;
    }

    function select (index) {
      ctrl.focusIndex = $scope.selectedIndex = index;
      ctrl.lastClick = true;
    }

    function scroll (event) {
      if (!shouldPaginate()) return;
      event.preventDefault();
      ctrl.offsetLeft = fixOffset(ctrl.offsetLeft - event.wheelDelta);
    }

    function fixOffset (value) {
      var lastTab = elements.tabs[elements.tabs.length - 1],
          totalWidth = lastTab.offsetLeft + lastTab.offsetWidth;
      value = Math.max(0, value);
      value = Math.min(totalWidth - elements.canvas.clientWidth, value);
      return value;
    }

    function nextPage () {
      var viewportWidth = elements.canvas.clientWidth,
          totalWidth = viewportWidth + ctrl.offsetLeft,
          i, tab;
      for (i = 0; i < elements.tabs.length; i++) {
        tab = elements.tabs[i];
        if (tab.offsetLeft + tab.offsetWidth > totalWidth) break;
      }
      ctrl.offsetLeft = fixOffset(tab.offsetLeft);
    }

    function previousPage () {
      var i, tab;
      for (i = 0; i < elements.tabs.length; i++) {
        tab = elements.tabs[i];
        if (tab.offsetLeft + tab.offsetWidth >= ctrl.offsetLeft) break;
      }
      ctrl.offsetLeft = fixOffset(tab.offsetLeft + tab.offsetWidth - elements.canvas.clientWidth);
    }

    function canPageBack () {
      return ctrl.offsetLeft > 0;
    }

    function canPageForward () {
      var lastTab = elements.tabs[elements.tabs.length - 1];
      return lastTab && lastTab.offsetLeft + lastTab.offsetWidth > elements.canvas.clientWidth + ctrl.offsetLeft;
    }

    function attachRipple (scope, element) {
      var options = { colorElement: angular.element(elements.inkBar) };
      $mdInkRipple.attachTabBehavior(scope, element, options);
    }
  }
  MdTabsController.$inject = ["$scope", "$element", "$window", "$timeout", "$mdConstant", "$mdInkRipple", "$mdUtil"];
})();
/**
 * @ngdoc directive
 * @name mdTabs
 * @module material.components.tabs
 *
 * @restrict E
 *
 * @description
 * The `<md-tabs>` directive serves as the container for 1..n `<md-tab>` child directives to produces a Tabs components.
 * In turn, the nested `<md-tab>` directive is used to specify a tab label for the **header button** and a [optional] tab view
 * content that will be associated with each tab button.
 *
 * Below is the markup for its simplest usage:
 *
 *  <hljs lang="html">
 *  <md-tabs>
 *    <md-tab label="Tab #1"></md-tab>
 *    <md-tab label="Tab #2"></md-tab>
 *    <md-tab label="Tab #3"></md-tab>
 *  </md-tabs>
 *  </hljs>
 *
 * Tabs supports three (3) usage scenarios:
 *
 *  1. Tabs (buttons only)
 *  2. Tabs with internal view content
 *  3. Tabs with external view content
 *
 * **Tab-only** support is useful when tab buttons are used for custom navigation regardless of any other components, content, or views.
 * **Tabs with internal views** are the traditional usages where each tab has associated view content and the view switching is managed internally by the Tabs component.
 * **Tabs with external view content** is often useful when content associated with each tab is independently managed and data-binding notifications announce tab selection changes.
 *
 * Additional features also include:
 *
 * *  Content can include any markup.
 * *  If a tab is disabled while active/selected, then the next tab will be auto-selected.
 *
 * ### Explanation of tab stretching
 *
 * Initially, tabs will have an inherent size.  This size will either be defined by how much space is needed to accommodate their text or set by the user through CSS.  Calculations will be based on this size.
 *
 * On mobile devices, tabs will be expanded to fill the available horizontal space.  When this happens, all tabs will become the same size.
 *
 * On desktops, by default, stretching will never occur.
 *
 * This default behavior can be overridden through the `md-stretch-tabs` attribute.  Here is a table showing when stretching will occur:
 *
 * `md-stretch-tabs` | mobile    | desktop
 * ------------------|-----------|--------
 * `auto`            | stretched | ---
 * `always`          | stretched | stretched
 * `never`           | ---       | ---
 *
 * @param {integer=} md-selected Index of the active/selected tab
 * @param {boolean=} md-no-ink If present, disables ink ripple effects.
 * @param {boolean=} md-no-bar If present, disables the selection ink bar.
 * @param {string=}  md-align-tabs Attribute to indicate position of tab buttons: `bottom` or `top`; default is `top`
 * @param {string=} md-stretch-tabs Attribute to indicate whether or not to stretch tabs: `auto`, `always`, or `never`; default is `auto`
 *
 * @usage
 * <hljs lang="html">
 * <md-tabs md-selected="selectedIndex" >
 *   <img ng-src="img/angular.png" class="centered">
 *   <md-tab
 *       ng-repeat="tab in tabs | orderBy:predicate:reversed"
 *       md-on-select="onTabSelected(tab)"
 *       md-on-deselect="announceDeselected(tab)"
 *       ng-disabled="tab.disabled">
 *     <md-tab-label>
 *       {{tab.title}}
 *       <img src="img/removeTab.png" ng-click="removeTab(tab)" class="delete">
 *     </md-tab-label>
 *     <md-tab-template>
 *       {{tab.content}}
 *     </md-tab-template>
 *   </md-tab>
 * </md-tabs>
 * </hljs>
 *
 */

(function () {
  'use strict';

  angular
      .module('material.components.tabs')
      .directive('mdTabs', MdTabs);

  function MdTabs ($mdTheming) {
    return {
      scope: {
        selectedIndex: '=?mdSelected',
        stretchTabs: '@?mdStretchTabs'
      },
      transclude: true,
      template: '\
        <md-tabs-wrapper ng-class="{ \'md-stretch-tabs\': $mdTabsCtrl.shouldStretchTabs() }">\
          <md-tab-data ng-transclude></md-tab-data>\
          <md-prev-button\
              tabindex="-1"\
              role="button"\
              aria-label="Previous Page"\
              aria-disabled="{{!$mdTabsCtrl.canPageBack()}}"\
              ng-class="{ \'md-disabled\': !$mdTabsCtrl.canPageBack() }"\
              ng-if="$mdTabsCtrl.shouldPaginate()"\
              ng-click="$mdTabsCtrl.previousPage()">\
            <md-icon md-svg-icon="tabs-arrow"></md-icon>\
          </md-prev-button>\
          <md-next-button\
              tabindex="-1"\
              role="button"\
              aria-label="Next Page"\
              aria-disabled="{{!$mdTabsCtrl.canPageForward()}}"\
              ng-class="{ \'md-disabled\': !$mdTabsCtrl.canPageForward() }"\
              ng-if="$mdTabsCtrl.shouldPaginate()"\
              ng-click="$mdTabsCtrl.nextPage()">\
            <md-icon md-svg-icon="tabs-arrow"></md-icon>\
          </md-next-button>\
          <md-tabs-canvas\
              tabindex="0"\
              aria-activedescendant="tab-item-{{$mdTabsCtrl.tabs[$mdTabsCtrl.focusIndex].id}}"\
              ng-focus="$mdTabsCtrl.redirectFocus()"\
              ng-class="{ \'md-paginated\': $mdTabsCtrl.shouldPaginate() }"\
              ng-keydown="$mdTabsCtrl.keydown($event)"\
              role="tablist">\
            <md-pagination-wrapper\
                md-tab-scroll="$mdTabsCtrl.scroll($event)">\
              <md-tab-item\
                  tabindex="-1"\
                  class="md-tab"\
                  style="max-width: {{ tabWidth ? tabWidth + \'px\' : \'none\' }}"\
                  role="tab"\
                  aria-selected="{{tab.isActive()}}"\
                  aria-disabled="{{tab.scope.disabled}}"\
                  aria-controls="tab-content-{{tab.id}}"\
                  ng-repeat="tab in $mdTabsCtrl.tabs"\
                  ng-click="$mdTabsCtrl.select(tab.getIndex())"\
                  ng-class="{ \'md-active\': tab.isActive(),\
                      \'md-focus\': tab.hasFocus(),\
                      \'md-disabled\': tab.scope.disabled }"\
                  ng-disabled="tab.scope.disabled"\
                  md-swipe-left="$mdTabsCtrl.nextPage()"\
                  md-swipe-right="$mdTabsCtrl.previousPage()"\
                  md-label-template="tab.label"></md-tab-item>\
              <md-ink-bar ng-hide="noInkBar"></md-ink-bar>\
            </md-pagination-wrapper>\
            <div class="visually-hidden">\
              <md-dummy-tab\
                  tabindex="-1"\
                  id="tab-item-{{tab.id}}"\
                  role="tab"\
                  aria-controls="tab-content-{{tab.id}}"\
                  aria-selected="{{tab.isActive()}}"\
                  aria-disabled="{{tab.scope.disabled}}"\
                  ng-focus="$mdTabsCtrl.hasFocus = true"\
                  ng-blur="$mdTabsCtrl.hasFocus = false"\
                  ng-repeat="tab in $mdTabsCtrl.tabs"\
                  md-label-template="tab.label"></md-dummy-tab>\
            </div>\
          </md-tabs-canvas>\
        </md-tabs-wrapper>\
        <md-tabs-content-wrapper ng-if="$mdTabsCtrl.hasContent">\
          <md-tab-content\
              ng-repeat="(index, tab) in $mdTabsCtrl.tabs" \
              md-tab-data="tab"\
              id="tab-content-{{tab.id}}"\
              aria-labelledby="tab-item-{{tab.id}}"\
              role="tabpanel"\
              md-swipe-left="$mdTabsCtrl.incrementSelectedIndex(1)"\
              md-swipe-right="$mdTabsCtrl.incrementSelectedIndex(-1)"\
              ng-class="{\
                \'md-no-transition\': $mdTabsCtrl.lastSelectedIndex == null,\
                \'md-active\': tab.isActive(),\
                \'md-left\':   tab.isLeft(),\
                \'md-right\':  tab.isRight()\
              }"></md-tab-content>\
        </md-tabs-content-wrapper>\
      ',
      controller: 'MdTabsController',
      controllerAs: '$mdTabsCtrl',
      link: function (scope, element, attr) {
        //-- watch attributes
        attr.$observe('mdNoBar', function (value) { scope.noInkBar = angular.isDefined(value); });
        //-- set default value for selectedIndex
        scope.selectedIndex = angular.isNumber(scope.selectedIndex) ? scope.selectedIndex : 0;
        //-- apply themes
        $mdTheming(element);
      }
    };
  }
  MdTabs.$inject = ["$mdTheming"];
})();