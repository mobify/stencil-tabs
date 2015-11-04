define(['$'], function($) {
    /**
     * Coordinator singleton
     *
     * Manages setting unique ids for tabs/tabpanes.
     */
    var TabsCoordinator = function() {
        if (TabsCoordinator.prototype._singletonInstance) {
            return TabsCoordinator.prototype._singletonInstance;
        }

        this.counter = 0;

        TabsCoordinator.prototype._singletonInstance = this;
    }

    /**
     * Get the next available id
     */
    TabsCoordinator.prototype.nextIndex = function() {
        return this.counter++;
    };

    /**
     * Tabs constructor
     */
    var Tabs = function($el, options) {
        var self = this;
        var coordinator = new TabsCoordinator();

        this.instanceId = coordinator.nextIndex();
        this.$el = $el;
        this.$tabs = $el.find('.c-tabs__tab');
        this.$panes = $el.find('.c-tabs__pane');
        this.selectedIndex = parseInt(this.$el.attr('data-selected-index'), 10) || 0;

        this.$tabs.each(function(i, tab) {
            var tabId = 'stencil-tab-' + self.instanceId + '.' + i;
            var paneId = 'stencil-tabpane-' + self.instanceId + '.' + i;
            var $tab = $(tab);
            var $tabAnchor = $(tab).find('a');

            $tabAnchor.attr({
                'id': tabId,
                'href': '#' + paneId,
                'aria-controls': paneId,
                'tabindex': '-1',
                'aria-selected': 'false',
            });

            self.$panes.eq(i).attr({
                'id': paneId,
                'aria-labelledby': tabId,
                'aria-hidden': 'true',
            });
        });

        this.$el.on('click', '.c-tabs__tab', function(event) {
            event.preventDefault();

            self.select(self.$tabs.index(this));
        });

        this.select(this.selectedIndex);
    }

    Tabs.prototype.select = function(index) {
        if (this.selectedIndex === index && this.$tabs.find('.c--is-selected').length) {
            return;
        }

        this.$tabs.eq(this.selectedIndex)
            .removeClass('c--is-selected')
            .find('a')
            .attr({
                'tabindex': '-1',
                'aria-selected': 'false',
            });

        this.$panes.eq(this.selectedIndex).attr({
            'aria-hidden': 'true',
        }).removeClass('c--is-selected');

        this.$tabs.eq(index)
            .addClass('c--is-selected')
            .find('a')
            .attr({
                'tabindex': '0',
                'aria-selected': 'true',
            });

        this.$panes.eq(index)
            .removeAttr('aria-hidden')
            .addClass('c--is-selected');

        this.selectedIndex = index;
    };

    return {
        init: function($el, options) {
            // If already initialized, return the instance; otherwise, create it
            // and expose it through `$('.c-tabs').data('component')`.
            return $el.data('component') || $el.data('component', new Tabs($el, options));
        }
    };
});
