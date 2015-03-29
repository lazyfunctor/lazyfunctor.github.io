function createDice(diceConfig) {
    var marker = 0.0;
    var domain = [], range = [];
    for (var i = diceConfig.length - 1; i >= 0; i--) {[0];
        var val = diceConfig[i][0];
        var prob = diceConfig[i][1];
        marker += prob;
        domain.push(marker);
        range.push(val);
    };
    domain.pop();
    var dice = d3.scale.threshold().domain(domain).range(range);
    return dice;
}

function roll(dice)  {
    return dice(Math.random());
}

function generateDataset(sampleCount, diceConfig) {
    var dice = createDice(diceConfig);
    var frequency = {};
    for (var cnt = 0; cnt < sampleCount; cnt++) {
        var number = roll(dice);
        if (! frequency[number]) {
            frequency[number] = 1;
        } else {
            frequency[number] += 1;
        }
    };
    return frequency;
}

function generateSampledDataset(sampleCount, diceConfig, sampleSize) {
    var dice = createDice(diceConfig);
    var frequency = {};
    for (var cnt = 0; cnt < sampleCount; cnt++) {
        var sum = 0;
        for (var n = 0; n < sampleSize; n++) {
            sum += roll(dice);    
        }
        if (! frequency[sum]) {
            frequency[sum] = 1;
        } else {
            frequency[sum] += 1;
        }
    };
    return frequency;

}

function plotFrequency(frequency, chartConfig, svg) {

    var min_num = Number.POSITIVE_INFINITY; 
    var max_num = Number.NEGATIVE_INFINITY;
    var min_count = Number.POSITIVE_INFINITY; 
    var max_count = Number.NEGATIVE_INFINITY;
    var width = chartConfig.width;
    var height = chartConfig.height;
    var padding = chartConfig.padding;

    for (var num in frequency) {
        num = parseInt(num);
        if (num <= min_num) {
            min_num = num;
        }
        if (num >= max_num) {
            max_num = num;
        }
        var count = frequency[num];
        if (count < min_count) {
            min_count = count;
        }
        if (count > max_count) {
            max_count = count;
        }
    }
    var xScale = d3.scale.linear().domain([min_num, max_num]).range([padding, width - padding]);
    var yScale = d3.scale.linear().domain([0, max_count]).range([height - padding, padding]);

    var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom");

    var yAxis = d3.svg.axis()
                  .scale(yScale)
    
    
    d3.selectAll(svg + " > *").remove();

    var chart = d3.select(svg)
    .attr("width", width)
    .attr("height", height)
    .append("g")

    //chart.attr("class", "axis").call(yAxis);
    for (var num in frequency) {
        count = frequency[num];
        var x_val = xScale(num), y_val = yScale(count);
        chart.append("circle")
        .style("opacity", .6)
        .style("fill", "blue")
        .attr("cx", x_val)
        .attr("cy", y_val)
        .attr("r", 5);
        chart.append("line")
        .attr("stroke", "blue")
        .attr("stroke-width", "0.5")
        .attr("x1", x_val)
        .attr("y1", y_val)
        .attr("x2", x_val)
        .attr("y2", height - padding);

    }


    chart.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis);


}