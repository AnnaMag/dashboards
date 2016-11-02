function loadJSON(callback) {

    var xhr = new XMLHttpRequest();
        xhr.overrideMimeType("application/json");
    xhr.open('GET', 'data.json', true);
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          callback(xhr.responseText);
        } else {
          console.log(xhr.statusText);
        }
      }
    };
    xhr.onerror = function (e) {
      console.error(xhr.statusText);
    };
    xhr.send(null);
 }


function drawdashboard(data) {
  var parseDate = d3.time.format("%m/%d/%Y").parse;
  var parseDate2 = d3.time.format("%m/%d").parse;
   data.forEach(function(d) {
     d.date = parseDate(d.date);
     d.qtime = parseDate2((d.date.getMonth()+1)+"/"+d.date.getDate());
           d.Year=d.date.getFullYear();
   });
  var ndx = crossfilter(data);

  var yearRingChart   = dc.pieChart("#chart-ring-year");
  var yearDim  = ndx.dimension(function(d) {return +d.Year;});

  var year_total = yearDim.group().reduceSum(function(d) {return d.hits;});
  yearRingChart
     .width(150).height(150)
     .dimension(yearDim)
     .group(year_total)
     .innerRadius(30)
     .width(200).height(200)
     .innerRadius(60)
     .legend(dc.legend().x(80).y(70).itemHeight(13).gap(5))
     .renderLabel(false)
     .renderTitle(false)
     .ordinalColors(["#56B2EA","#E064CD","#F8B700","#78CC00","#7B71C5"])
     ;

   	var dateDim = ndx.dimension(function(d) {return d.qtime;});
   	var hits = dateDim.group().reduceSum(function(d) {return d.hits;});
   	var minDate = new Date("01/01/1900");
   	var maxDate = new Date("12/30/1900");

   var hits_2011=dateDim.group().reduceSum(function(d) {if (d.Year===2011) {return d.hits;}else{return 0;}});
   var hits_2012=dateDim.group().reduceSum(function(d) {if (d.Year===2012) {return d.hits;}else{return 0;}});
   var hits_2013=dateDim.group().reduceSum(function(d) {if (d.Year===2013) {return d.hits;}else{return 0;}});


// adding dashed lines
   var target_2011=dateDim.group().reduceSum(function(d) {if (d.Year===2011 ) {return 10;}else{return 0;}});
   var target_2012=dateDim.group().reduceSum(function(d) {if (d.Year===2012 ) {return 20;}else{return 0;}});
   var target_2013=dateDim.group().reduceSum(function(d) {if (d.Year===2013 ) {return 30;}else{return 0;}});


    var hitslineChart  = dc.compositeChart("#chart-line-hitsperday");

    var compose2= dc.lineChart(hitslineChart)
                       .dimension(dateDim)
                       .ordinalColors(["#56B2EA","#E064CD","#F8B700","#78CC00","#7B71C5"])
                       .group(target_2011,"2011 Target")
                       .stack(target_2012,"2012 Target")
                       .stack(target_2013,"2013 Target")
                       .dashStyle([5,5]);
    var compose1=dc.lineChart(hitslineChart)
                  .dimension(hits)
                  .ordinalColors(["#56B2EA","#E064CD","#F8B700","#78CC00","#7B71C5"])
                  .renderArea(true)
                  .group(hits_2011, "2011")
                  .stack(hits_2012,"2012")
                  .stack(hits_2013,"2013");

    hitslineChart
	      .width(500).height(200)
	      .x(d3.time.scale().domain([minDate,maxDate]))
        .brushOn(false)
        .legend(dc.legend().x(60).y(10).itemHeight(13).gap(5))
        .yAxisLabel("Hits Per Day")
        .compose([compose1, compose2]);

  dc.renderAll();
}
