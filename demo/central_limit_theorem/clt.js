"use strict"

$(function () {

    var globalProb;

    function getPercentile(gap, count) {
        var percentiles = [];
        var threshold = 0
        for (var i = 1; i < count; i++) {
            threshold += gap;
            percentiles.push(threshold);
        };
        return percentiles;
    }

    function getProbabilities(percentiles) {
        var probabilties = [];
        var prev = 0;
        for (var i=0; i < percentiles.length; i++) {
            probabilties.push(percentiles[i] - prev);
            prev = percentiles[i];
        }
        probabilties.push(100 - prev);
        globalProb = probabilties;
        return probabilties;
    }

    function publish(probabilties) {
        var html = "";
        var diceConfig = [];
        for (var idx=0; idx < probabilties.length; idx++) {
            var probStr = probabilties[idx].toFixed(1);
            html += "<li>" + (idx+1).toString() + ": " +  probStr + "%</li>";
            diceConfig.push([idx + 1, probabilties[idx]/100]);
        }
        $("#probabilties").html(html);
        var freq = generateDataset(100000, diceConfig);
        plotFrequency(freq, {"width": 400, "height": 400, "padding": 20}, "svg.regular");

        var n = parseInt($("#sample-size").val());
        console.log(n);
        var freqSampled = generateSampledDataset(100000, diceConfig, n);
        //console.log(freq);
        plotFrequency(freqSampled, {"width": 400, "height": 400, "padding": 20}, "svg.sampled");

        $(".hider").show();

    }

    $('#die-sides-btn').click(function() {
        $('.dice-slider').empty();
        var sides = parseInt($('#die-sides').val());
        var gap = Math.round((100/sides) * 10)/10;
        var values = getPercentile(gap, sides);
        publish(getProbabilities(values));
        $('.dice-slider').limitslider({
            values: values,
            gap: 0,
            left: 0,
            right: 100,
            step: 0.1,
        });


        $(".dice-slider").on("slidestop", function(e, target){
            var probabilties = getProbabilities(target.values);
            publish(probabilties);
        });

        $("#sample-size").change(function() {
            publish(globalProb);
        });

    });



});
