/**
 *  Search index.
 */
var reference = [];
var index = lunr(function () {
    this.use(lunr.ru);
    this.field('title', {boost: 10});
    this.field('content');
});

$(function () {
    /**
     * Init Highlighting.
     */
    $('pre code[class*="language-"]').each(function (i, block) {
        hljs.highlightBlock(block);
    });


    /**
     * Init search.
     */
    var search = $('#search');
    var searchResults = $('#search-results');

    search.addClass('transition');

    search.one('click', function () {
        $.ajax({
            url: "/index.js",
            dataType: "script"
        });
    });

    var debounce = function (fn) {
        var timeout;
        return function () {
            var args = Array.prototype.slice.call(arguments),
                ctx = this;

            clearTimeout(timeout);
            timeout = setTimeout(function () {
                fn.apply(ctx, args)
            }, 100);
        }
    };

    search.bind('keyup', debounce(function () {
        if ($(this).val() < 2) {
            return;
        }

        searchResults.html('<li class="dropdown-header">Результаты поиска:</li>');
        search.dropdown('toggle');

        var result = index.search($(this).val());

        for(var i = 0; i < result.length && i < 10; i++) {
            var obj = reference[result[i].ref];
            searchResults.append('<li><a href="' + obj.url + '">' + decodeURI(obj.title) + '</a></li>');
        }

    }));

    search.on('focus', function () {

    });

    search.on('blur', function () {
        setTimeout(function () {
            search.parent().removeClass('open');
        }, 200);
    });
});

function init_index_callback(data) {
    reference = data;
    reference.forEach(function (obj) {
        index.add(obj);
    });
}