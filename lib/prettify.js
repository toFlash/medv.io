$(function () {
    $("pre").each(function() {
        var pre = $(this);
        
        if (
            pre.parents().hasClass('highlight') ||
            pre.parents().hasClass('gist')
        ) {
            return;
        }
        
        var prevSibling = this.previousSibling;
        var nodeValue = null;
        while (prevSibling && prevSibling.nodeType!==1) {
            if (prevSibling.nodeType === 8) {
                nodeValue = prevSibling.nodeValue;   
            }
            prevSibling = prevSibling.previousSibling;
        }       
        
        pre.addClass('prettyprint');
        
        console.log(this.innerHTML, nodeValue);
    });
    
    // Do prettify
    prettyPrint();
});
