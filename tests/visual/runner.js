require.config({
    paths: {
        'dust-full': '../../node_modules/dustjs-linkedin/dist/dust-full',
        'adaptivejs': '../../node_modules/adaptivejs',
        '$': '../../node_modules/jquery/dist/jquery',
    },
    shim: {
        'dust-full': {
            'exports': 'dust'
        },
        '$': {
            'exports': 'jQuery'
        }
    },
});

define(function(require) {
    var dust = require('dust-full');
    var componentHelper = require('adaptivejs/lib/dust-component-helper');
    var componentSugar = require('adaptivejs/lib/dust-component-sugar');
    var templates = require('../../tmp/templates');
    var ui = require('../../tabs-ui');
    var context;

    // Register helpers for precompiled component templates.
    dust = componentHelper(dust);
    templates.forEach(function(name) {
        dust.helpers[name] = componentSugar.makeHelper(name);
    });

    // Define any context required for the tests:
    var context = {
        repo: 'https://github.com/mobify/stencil-tabs',
        tabs: [
            {label: 'Tab One'}, {label: 'Tab Two'}, {label: 'Tab Three'},
        ],
        sections: [
            {contents: 'Pane One'}, {contents: 'Pane Two'}, {contents: 'Pane Three'},
        ],
    };

    // Render
    dust.render('tests', context, function(err, out) {
        if (!err) {
            document.querySelector('body').innerHTML = out;

            $('[data-adaptivejs-component="stencil-tabs"]').each(function(i, el) {
                var $component = $(el);

                ui.init($component);
                $component.attr('data-adaptivejs-component-processed', '');
            });
        } else {
            console.log(err);
        }
    });
});
