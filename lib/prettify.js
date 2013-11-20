$(function () {
    var pres = $("pre");
    pres.each(
        function() {
            var prevSibling = this.previousSibling;
            var nodeValue = null;
            while (prevSibling && prevSibling.nodeType!==1) {
                if (prevSibling.nodeType === 8) {
                    nodeValue = prevSibling.nodeValue;   
                }
                prevSibling = prevSibling.previousSibling;
            }        
            console.log(this.innerHTML, nodeValue);
        }
    );
});
