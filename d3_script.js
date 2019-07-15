// Define URLs for our zipcode shapes, and restaurant data
var ZIPCODE_URL1 = "https://raw.githubusercontent.com/karansaini282/out_repo/master/d3_data_la.csv";
var ZIPCODE_URL2 = "https://raw.githubusercontent.com/karansaini282/out_repo/master/d3_data_sf.csv";
var ZIPCODE_URL3 = "https://raw.githubusercontent.com/karansaini282/out_repo/master/d3_data_ny.csv";
var ZIPCODE_URL4 = "https://raw.githubusercontent.com/karansaini282/out_repo/master/d3_data_chic.csv";
var MAP_URL1 = "https://raw.githubusercontent.com/karansaini282/out_repo/master/d3_shp_ca.geojson";
var MAP_URL2 = "https://raw.githubusercontent.com/karansaini282/out_repo/master/d3_shp_ny.geojson";
var MAP_URL3 = "https://raw.githubusercontent.com/karansaini282/out_repo/master/d3_shp_chic.geojson";

  createChart('sf','8:30 - 9:00',false,'',false,'',0);


function createChart(city,time_period,is_color,color,is_zoom,zoom_center,zoom_no) {
  var city_map_dict = {'sf':ZIPCODE_URL2,'la':ZIPCODE_URL1,'ny':ZIPCODE_URL3,'chic':ZIPCODE_URL4};
  var city_map_url = city_map_dict[city];
  d3.csv(city_map_url).then(data_main=>
  {
  
  var zipcodes = data_main;
  var data = zipcodes;
  var center = {'ny':[-74.175,40.6],'chic':[-88.12,41.27],'la':[-118.81,33.36],'sf':[-122.77,37.05]};
  var zoom = {'ny':8.5,'chic':7.9,'la':8.2,'sf':8.2};

  let svg        = d3.select('#chart').select("#svg1"),
      gMap       = svg.select("g"),
      canvasSize = [700, 1000];
      
  if(is_zoom){
    var projection = d3.geoMercator()
      .scale(Math.pow(2, zoom[city] + 5.34+(zoom_no*0.5)))
      .center(zoom_center)
      .translate([(canvasSize[0]/2)-100,canvasSize[1]/2]);    
  }
  else{
    var projection = d3.geoMercator()
      .scale(Math.pow(2, zoom[city] + 5.34))
      .center(center[city])
      .translate([(canvasSize[0]/2)-50,canvasSize[1]/2]); 
  }

  var path = d3.geoPath()
    .projection(projection);
  
  gMap.on('click',function(){
 console.log(projection.invert(d3.mouse(this)));   createChart(city,time_period,is_color,color,true,projection.invert(d3.mouse(this)),zoom_no+1);});
  
  // Let's create a path for each (new) zipcode shape
  gMap.selectAll(".zipcode")
  .remove();
  
  plot_data = data.filter(d=>d.time_period==time_period);
  
  var city_data_dict = {'sf':MAP_URL1,'la':MAP_URL1,'ny':MAP_URL2,'chic':MAP_URL3};
  var city_data_url = city_data_dict[city];
  
  d3.json(city_data_url).then(map_data=>  
  {
    gMap.selectAll(".zipcode")
      .data(map_data.features)
      .enter().append("path")
        .attr("class", "zipcode")
        .attr("d", path);

    gMap.selectAll(".zipcode")
        .style("fill", "white");

    if(is_color){
      plot_data = data.filter(d=>d.time_period==time_period).filter(d=>d.color==color);
    }
    else{
      console.log('false');
    }

    gMap.selectAll(".zipcode")
        .data(plot_data, myKey)
        .style("fill", d => d.color);

    var gMap2 = d3.select('#chart').select("#svg2").select('g');
    var pArea = [50, 50, 390, 460];
    var pSize = [pArea[2]-pArea[0], pArea[3]-pArea[1]];
    var legend = gMap2.append("g")
      .attr("transform", `translate(10, ${pArea[1]+10})`);

    legend.append("rect")
      .attr("class", "legend--frame")
      .attr("x", -5)
      .attr("y", -5)
      .attr("width", 110)
      .attr("height", 80);

    var legendItems = legend.selectAll(".legend--item--box")
      .data(["ny", "la", "chic", "sf"])
      .enter().append("g")
      .on("click", d => {
        createChart(d,time_period,is_color,color,false,'',0);
      });
    
    legendItems.append("rect")
        .attr("class", "legend--item--box")
        .attr("x", 0)
        .attr("y", (d,i) => (i*20))
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", (d,i) => (d==city?"black":"white"));

    legendItems.append("text")
        .attr("class", "legend--item--label")
        .attr("x", 20)
        .attr("y", (d,i) => (9+i*20))
        .text((d, i) => d);

    var pArea2 = [50, 50, 390, 460];
    var pSize2 = [pArea2[2]-pArea2[0], pArea2[3]-pArea2[1]];
    var palette2 = ['SteelBlue', 'SeaGreen', 'IndianRed', 'Yellow','SteelBlue', 'SeaGreen', 'IndianRed', 'Yellow','SteelBlue'];  
    var legend2 = gMap2.append("g")
      .attr("transform", `translate(10, ${pArea2[1]+100})`);

    legend2.append("rect")
      .attr("class", "legend--frame")
      .attr("x", -5)
      .attr("y", -5)
      .attr("width", 110)
      .attr("height", 180);

    var legendItems2 = legend2.selectAll(".legend--item--box")
      .data(['6:00 - 6:30', '6:30 - 7:00', '7:00 - 7:30',
         '7:30 - 8:00', '8:00 - 8:30', '8:30 - 9:00', '9:00 - 9:30',
         '9:30 - 10:00','10:00 - 10:30'])
      .enter().append("g")
      .on("click", d => {
        createChart(city,d,is_color,color,is_zoom,zoom_center,zoom_no);
      });

    legendItems2.append("rect")
        .attr("class", "legend--item--box")
        .attr("x", 0)
        .attr("y", (d,i) => (i*20))
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", (d,i) => (d==time_period?"black":"white"));

    legendItems2.append("text")
        .attr("class", "legend--item--label")
        .attr("x", 20)
        .attr("y", (d,i) => (9+i*20))
        .text((d, i) => d);

    var net_dist = {'chic':['0:400',  '400:800',   '800:1200',      '1200:1600',    '1600:3000',   '3000:15000'],'sf':['0:400',  '400:800',   '800:1200',      '1200:1600',    '1600:3000',   '3000:15000'],'la':['0:400',  '400:800',   '800:1200',      '1200:1600',    '1600:3000',   '3000:15000'],'ny':['0:800',  '800:1600',   '1600:2400',      '2400:3200',    '3200:6000',   '6000:15000']};

    var pArea3 = [50, 50, 390, 460];
    var pSize3 = [pArea3[2]-pArea3[0], pArea3[3]-pArea3[1]];
    var palette3 = ['green','lime','yellow','orange','red','darkred'];  
    var legend3 = gMap2.append("g")
      .attr("transform", `translate(10, ${pArea3[1]+290})`);

    legend3.append("rect")
      .attr("class", "legend--frame")
      .attr("x", -5)
      .attr("y", -5)
      .attr("width", 110)
      .attr("height", 130)
      .on("click",(d,i)=>{createChart(city,time_period,false,'',is_zoom,zoom_center,zoom_no);});

    var legendItems3 = legend3.selectAll(".legend--item--box")
      .data(net_dist[city])
      .enter().append("g")
      .on("click", (d,i) => {
        createChart(city,time_period,true,palette3[i],is_zoom,zoom_center,zoom_no);
      });

    legendItems3.append("rect")
        .attr("class", "legend--item--box")
        .attr("x", 0)
        .attr("y", (d,i) => (i*20))
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", (d,i) => palette3[i]);

    legendItems3.append("text")
        .attr("class", "legend--item--label")
        .attr("x", 20)
        .attr("y", (d,i) => (9+i*20))
        .text((d, i) => d);
    
    var pArea4 = [50, 50, 390, 460];
    var pSize4 = [pArea4[2]-pArea4[0], pArea4[3]-pArea4[1]];
    
    var legend4 = gMap2.append("g")
      .attr("transform", `translate(10, ${pArea4[1]+425})`);

    legend4.append("image")
      .attr("xlink:href", "https://raw.githubusercontent.com/karansaini282/out_repo/master/reset.jpg")
      .attr("x", -5)
      .attr("y", -5)
      .attr("width", 120)
      .attr("height", 60)
      .on("click", (d,i) => {
        createChart(city,time_period,false,'',false,'',0);
      });    
  
  });
  
  });
}

function myKey(d) {
  return (d.ct_id?d.ct_id:d.properties.GEOID);
}
