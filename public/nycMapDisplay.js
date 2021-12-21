

function displayMap(callback) {


    var height = 500,
        width = 500,
        projection = d3.geoMercator(), // geoMercator() is a way of projecting the map. 
        nyc = void 0,
        map


    var path = d3.geoPath().projection(projection);

    var svg = d3.select(".formIllustration")
        .append("svg")
        .attr("id", "MapSVG_")
        .attr("width", width)
        .attr("height", height)
        .style("position", "relative")
        .style("top", "0%")
        .style("left", "10%")
        .style("opacity", "0.8")
        .style("overflow", 'visible');


    d3.json('geo-data.json', function (error, data) {
        if (error) return;

        //-----------Selecting the geometry features from the json OBJ------------------//
        var districts = topojson.feature(data, data.objects.districts);

        var b, s, t;
        projection.scale(1).translate([0, 0]);
        var b = path.bounds(districts); // bounds represent a two dimensional array : [[left, bottom], [right, top]],
        var s = .85 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
        var t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
        projection.scale(s).translate(t);


        map = svg.append('g')
            .attr('class', 'boundary')
            .attr('x', 300)



        nyc = map.selectAll('path').data(districts.features);
        nyc.enter()
            .append('path')
            .attr('d', path)
            .attr('class', 'nycDistrict')
            .style("stroke", "rgb(226, 252, 255)")
            .style('cursor', 'pointer')
            .attr("stroke-width", .7)
            .attr("fill", "#2D4859")


        nyc.attr('fill', '#eee');
        nyc.exit().remove();





    })

}

displayMap()