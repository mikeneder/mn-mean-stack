'use strict';

angular.module('mnMeanApp')
  .directive('isotope', ['$timeout', function ($timeout) {
    return {
      restrict: 'EA',
      link: function (scope, element, attrs) {
        $timeout(function() {
          var $container = element.find('#container-thumbs');
          $container.isotope({
            itemSelector : '.items',
            layoutMode : 'fitRows',
            // disable resizing
            resizable: false,
            // set columnWidth to a percentage of container width
            masonry: {
              columnWidth: $container.width() / 12
            }
          });

          // update columnWidth on window resize
          $(window).smartresize(function(){
            $container.isotope({
              // set columnWidth to a percentage of container width
              masonry: {
                columnWidth: $container.width() / 12
              }
            });
          });

          var $optionSets = element.find('.option-set'),
            $optionLinks = $optionSets.find('a');

          $optionLinks.click(function(){
            var $this = $(this);
            // don't proceed if already selected
            if ( $this.hasClass('selected') ) {
              return false;
            }
            var $optionSet = $this.parents('.option-set');
            $optionSet.find('.selected').removeClass('selected');
            $this.addClass('selected');

            // make option object dynamically, i.e. { filter: '.my-filter-class' }
            var options = {},
              key = $optionSet.attr('data-option-key'),
              value = $this.attr('data-option-value');
            // parse 'false' as false boolean
            value = value === 'false' ? false : value;
            options[ key ] = value;
            if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {
              // changes in layout modes need extra logic
              changeLayoutMode( $this, options )
            } else {
              // otherwise, apply new options
              $container.isotope( options );
            }

            return false;
          });
        });
      }
    };
  }]);
