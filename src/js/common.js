$(function () {
    /**
     * Init Highlighting.
     */
    $('pre code[class*="language-"]').each(function (i, block) {
        hljs.highlightBlock(block);
    });

    /**
     * Init search animation.
     */

    $('#search').addClass('transition');
});