function print_filter(filter){
	var f=eval(filter);
	if (typeof(f.length) != "undefined") {}else{}
	if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
	if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
	console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
}
function getvalues(d){
    var str=d.key.getDate() + "/" + (d.key.getMonth() + 1) + "/" + d.key.getFullYear()+"\n";
    var key_filter = dateDim.filter(d.key).top(Infinity);
    var total=0
    key_filter.forEach(function(a) {
        str+=a.status+": "+a.hits+" Hit(s)\n";
        total+=a.hits;
    });

    str+="Total:"+total;
    //remove filter so it doesn't effect the graphs,
    //this is the only filter so we can do this
    dateDim.filterAll();
    return str;
}
