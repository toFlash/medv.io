$(function () {
    $("pre").each(function() {
        var pre = $(this);
        
        // Not for this 
        if (
            pre.parents().hasClass('highlight') ||
            pre.parents().hasClass('gist')
        ) {
            return;
        }
        
        // Find comment
        var prevSibling = this.previousSibling;
        var nodeValue = null;
        while (prevSibling && prevSibling.nodeType!==1) {
            if (prevSibling.nodeType === 8) {
                nodeValue = prevSibling.nodeValue;   
            }
            prevSibling = prevSibling.previousSibling;
        }       
        
        // Pretty it
        pre.addClass('prettyprint');
        
        // Do we have lang comment?
        var match = nodeValue.match(/^\s*lang:\s*(.*?)\s*$/i);
        if(null !== match) {
            pre.addClass('lang-' + match[1]);
        }
    });
    
    // Do prettify
    prettyPrint();
});
