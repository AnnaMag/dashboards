function print_filter(filter){
	var f=eval(filter);
	if (typeof(f.length) != "undefined") {}else{}
	if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
	if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
	console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
}

var data = [
		{date: "12/27/2012", http_404: 2, http_200: 190, http_302: 100},
		{date: "12/28/2012", http_404: 2, http_200: 10, http_302: 100},
		{date: "12/29/2012", http_404: 1, http_200: 300, http_302: 200},
		{date: "12/30/2012", http_404: 2, http_200: 90, http_302: 0},
		{date: "12/31/2012", http_404: 2, http_200: 90, http_302: 0},
		{date: "01/01/2013", http_404: 2, http_200: 90, http_302: 0},
		{date: "01/02/2013", http_404: 1, http_200: 10, http_302: 1},
		{date: "01/03/2013", http_404: 2, http_200: 90, http_302: 0},
		{date: "01/04/2013", http_404: 2, http_200: 90, http_302: 0},
		{date: "01/05/2013", http_404: 2, http_200: 90, http_302: 0},
		{date: "01/06/2013", http_404: 2, http_200: 200, http_302: 1},
		{date: "01/07/2013", http_404: 1, http_200: 200, http_302: 100}
		];
var data = [
        {"status":"http_302","hits":0,"date":"01/03/2013"},
        {"status":"http_200","hits":90,"date":"01/03/2013"},
        {"status":"http_200","hits":200,"date":"01/07/2013"},
        {"status":"http_302","hits":1,"date":"01/06/2013"},
        {"status":"http_200","hits":200,"date":"01/06/2013"},
        {"status":"http_404","hits":2,"date":"01/06/2013"},
        {"status":"http_302","hits":0,"date":"01/05/2013"},
        {"status":"http_200","hits":90,"date":"01/05/2013"},
        {"status":"http_404","hits":2,"date":"01/05/2013"},
        {"status":"http_302","hits":0,"date":"01/04/2013"},
        {"status":"http_200","hits":90,"date":"01/04/2013"},
        {"status":"http_404","hits":2,"date":"01/04/2013"},
        {"status":"http_302","hits":100,"date":"01/07/2013"},
        {"status":"http_404","hits":1,"date":"01/07/2013"},
        {"status":"http_404","hits":2,"date":"01/03/2013"},
        {"status":"http_302","hits":1,"date":"01/02/2013"},
        {"status":"http_200","hits":10,"date":"01/02/2013"},
        {"status":"http_404","hits":1,"date":"01/02/2013"},
        {"status":"http_302","hits":0,"date":"01/01/2013"},
        {"status":"http_200","hits":90,"date":"01/01/2013"},
        {"status":"http_404","hits":2,"date":"01/01/2013"},
        {"status":"http_302","hits":0,"date":"12/31/2012"},
        {"status":"http_200","hits":90,"date":"12/31/2012"},
        {"status":"http_302","hits":100,"date":"12/27/2012"},
        {"status":"http_404","hits":2,"date":"12/27/2012"},
        {"status":"http_200","hits":90,"date":"12/30/2012"},
        {"status":"http_404","hits":2,"date":"12/30/2012"},
        {"status":"http_302","hits":200,"date":"12/29/2012"},
        {"status":"http_200","hits":300,"date":"12/29/2012"},
        {"status":"http_404","hits":1,"date":"12/29/2012"},
        {"status":"http_302","hits":100,"date":"12/28/2012"},
        {"status":"http_200","hits":10,"date":"12/28/2012"},
        {"status":"http_404","hits":2,"date":"12/28/2012"},
        {"status":"http_200","hits":190,"date":"12/27/2012"},
        {"status":"http_404","hits":2,"date":"12/31/2012"},
        {"status":"http_302","hits":0,"date":"12/30/2012"}
    ];
var ndx = crossfilter(data);
var totalDim = ndx.dimension(function(d) { return d.total; });
var total_90 = totalDim.filter(90);

var parseDate = d3.time.format("%m/%d/%Y").parse;
data.forEach(function(d) {
	d.date = parseDate(d.date);
	d.total= d.http_404+d.http_200+d.http_302;
  d.Year=d.date.getFullYear();
  console.log(d.date);
});
var dateDim = ndx.dimension(function(d) {return d.date;});
//var hits = dateDim.group().reduceSum(dc.pluck('total'));
var minDate = dateDim.bottom(1)[0].date;
var maxDate = dateDim.top(1)[0].date;

var status_200=dateDim.group().reduceSum(function(d) {return d.http_200;});
var status_302=dateDim.group().reduceSum(function(d) {return d.http_302;});
var status_404=dateDim.group().reduceSum(function(d) {return d.http_404;});
var hitslineChart  = dc.lineChart("#chart-line-hitsperday");
var pie = dc.pieChart("#chart-ring-year");

var yearDim  = ndx.dimension(function(d) {return + d.Year;});
var year_total = yearDim.group().reduceSum(function(d) {return d.total;});


hitslineChart
   .width(500).height(200)
   .dimension(dateDim)
   .group(status_200,"200")
   .stack(status_302,"302")
   .stack(status_404,"404")
   .renderArea(true)
   .x(d3.time.scale().domain([minDate,maxDate]))
   .brushOn(false)
   .legend(dc.legend().x(50).y(10).itemHeight(13).gap(5))
   .yAxisLabel("Hits per day");

pie
    .width(480).height(300)
    .dimension(yearDim)
    .group(year_total)
    .label(function(d){return d.value});

var datatable   = dc.dataTable("#dc-data-table");
datatable
    .dimension(dateDim)
    .group(function(d) {return d.Year;})
    // dynamic columns creation using an array of closures
    .columns([
        function(d) { return d.date.getDate() + "/" + (d.date.getMonth() + 1) + "/" + d.date.getFullYear(); },
        function(d) {return d.http_200;},
        function(d) {return d.http_302;},
        function(d) {return d.http_404;},
        function(d) {return d.total;}
    ]);

dc.renderAll();
