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
    var isIndexLoaded = false;

    search.addClass('transition');

    var loadIndex = function () {
        if(!isIndexLoaded) {
            isIndexLoaded = true;

            $.ajax({
                url: "/index.js",
                dataType: "script"
            });
        }
    };

    search.one('click', loadIndex);

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

    var foundedResults = 0;
    var selectedResult = 1;
    var lastSearchQuery = '';

    search.bind('keyup', debounce(function () {
        loadIndex();

        var searchQuery = $(this).val();

        if (searchQuery < 2 || lastSearchQuery == searchQuery) {
            return;
        }

        searchResults.html('<li class="dropdown-header">Результаты поиска:</li>');
        search.dropdown('toggle');

        var result = index.search(lastSearchQuery = searchQuery);

        for (var i = 0; i < result.length && i < 10; i++) {
            var span, obj = reference[result[i].ref];

            if (obj.title.length <= 24 ) {
                span = '<span>' + decodeURI(obj.title) + '</span>';
            } else {
                span = '<span class="long">' + decodeURI(obj.title) + '</span>';
            }

            searchResults.append('<li><a href="' + obj.url + '">' + span + '</a></li>');
        }

        foundedResults = i;
        selectedResult = 1;

    }));

    search.on('focus', function () {

    });

    search.on('blur', function () {
        setTimeout(function () {
            search.parent().removeClass('open');
        }, 200);
    });

    var deselectLast = function () {
        var li = searchResults.find('li:nth-child(' + selectedResult + ')').removeClass('active');
    };

    var selectResult = function (i) {
        var li = searchResults.find('li:nth-child(' + i + ')').addClass('active');
    };

    search.keydown(function (e) {
        switch (e.which) {
            case 38: // up
                if (selectedResult > 1) {
                    deselectLast();
                    selectResult(--selectedResult);
                }
                break;

            case 40: // down
                if (selectedResult <= foundedResults) {
                    deselectLast();
                    selectResult(++selectedResult);
                }
                break;

            case 13: // enter
                var href = searchResults.find('li:nth-child(' + selectedResult + ') > a').attr('href');

                if (typeof href != "undefined") {
                    location.href = href;
                }
                break;

            default:
                return; // exit this handler for other keys
        }

        e.preventDefault();
    });
});

function init_index_callback(data) {
    reference = data;
    reference.forEach(function (obj) {
        index.add(obj);
    });
}