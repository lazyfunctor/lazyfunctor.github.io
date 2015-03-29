// f(x,y) = [a b] * [x] + [e]
//          [c d]   [y]   [f]

var t1 = {'a': 0.81, 'b': 0.07, 'e': 0.12, 'c': -0.04, 'd': 0.84, 'f': 0.195, 'p': 0.701, 'tid': 1}
var t2 = {'a': 0.18, 'b': -0.25, 'e': 0.12, 'c': 0.27, 'd': 0.23, 'f': 0.02, 'p': 0.15, 'tid': 2}
var t3 = {'a': 0.19, 'b': 0.275, 'e': 0.16, 'c': 0.238, 'd': -0.14, 'f': 0.12, 'p': 0.129, 'tid': 3}
var t4 = {'a': 0.0235, 'b': 0.087, 'e': 0.11, 'c': 0.045, 'd': 0.1666, 'f': 0, 'tid': 4}

//Muatated Barnsley's fern
// var t1 = {'a': 0, 'b': 0, 'e': 0, 'c': 0, 'd': 0.25, 'f': -0.4, 'p': 0.02, 'tid': 1}
// var t2 = {'a': 0.95, 'b': 0.005, 'e': -0.002, 'c': -0.005, 'd': 0.93, 'f': 0.5, 'p': 0.84, 'tid': 2}
// var t3 = {'a': 0.035, 'b': -0.2, 'e': -0.09, 'c': 0.16, 'd': 0.04, 'f': 0.02, 'p': 0.07, 'tid': 3}
// var t4 = {'a': -0.04, 'b': 0.2, 'e': 0.083, 'c': 0.16, 'd': 0.04, 'f': 0.12, 'tid': 4}


function transformer(t) {
    return function(x, y) {
        return {"X": t.a*x + t.b*y + t.e, "Y": t.c*x + t.d*y + t.f, 'tid': t.tid};
    }
}

var transform1 = transformer(t1);
var transform2 = transformer(t2);
var transform3 = transformer(t3);
var transform4 = transformer(t4);

function generate_dataset() {
    var data = [];
    var point = {"X": 0, "Y": 0};
    data.push({"X": 0, "Y": 0});
    var min_x = Number.POSITIVE_INFINITY; 
    var max_x = Number.NEGATIVE_INFINITY;
    var min_y = Number.POSITIVE_INFINITY; 
    var max_y = Number.NEGATIVE_INFINITY;
    var palatte = d3.scale.category20();

    for (i=0; i <= 60000; i++) {
        var transform;
        var toss = Math.random();
        if (toss <= t1.p) {
            transform = transform1;
        } else if (t1.p < toss &&  toss <= (t1.p + t2.p)) {
            transform = transform2;
        } else if ((t1.p + t2.p) < toss &&  toss <= (t1.p + t2.p + t3.p)) {
            transform = transform3;
        } else {
            transform = transform4;
        }
        new_point = transform(point.X, point.Y);
        new_point.color = palatte(4);
        data.push(new_point);
        point.X = new_point.X;
        point.Y = new_point.Y;

        if (point.X >= max_x) {
            max_x = point.X;
        }
        if (point.X <= min_x) {
            min_x = point.X;
        }
        if (point.Y >= max_y) {
            max_y = point.Y;
        }
        if (point.Y <= min_y) {
            min_y = point.Y;
        }
    }
    return {'data': data, 'min_x': min_x, 'max_x': max_x, 'min_y': min_y, 'max_y': max_y}
}

function plot(dataset) {
    var width = 500;
    var height = 500;
    //var palatte = d3.scale.category20();
    //var color_map = {1: palatte(0), 2: palatte(5), 3: palatte(10), 4: palatte(15)};
    var xScale = d3.scale.linear().domain([dataset.min_x,  dataset.max_x]).range([0, width]);
    var yScale = d3.scale.linear().domain([dataset.min_y, dataset.max_y]).range([0, height]);
    var chart = d3.select("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g");

    chart.selectAll("circle")
    .data(dataset.data)
    .enter().append("circle")
    .style("opacity", .6)
    .style("fill", function(d) {/*console.log(color_map[d.tid]);*/ return d.color})
    .attr("cx", function(d) { return xScale(d.X)})
    .attr("cy", function(d) { return yScale(d.Y)})
    .attr("r", 0.7);
}

$(function() {
    plot(generate_dataset());
});
