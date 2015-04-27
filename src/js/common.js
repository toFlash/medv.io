$(function () {
    /**
     * Init Highlighting
     */
    $('pre code[class*="language-"]').each(function (i, block) {
        hljs.highlightBlock(block);
    });

    var header = $('header');
    var backgroundImage = header.css('background-image').replace('url(', '').replace(')', '');
    header.parallax({imageSrc: backgroundImage});
    header.css({background: 'transparent'});
});