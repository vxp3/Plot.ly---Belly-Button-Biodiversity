function getData(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(m => m.id == sample);
    var result = resultArray[0];
    var demo = d3.select("#sample-metadata");
    demo.html("");
    Object.entries(result).forEach(([key, value]) => {
      demo.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}


function optionChanged(newSample) {
  getData(newSample);
  barChart(newSample);
  buildGauge(newSample);
}

function init() {
  var dropDown = d3.select("#selDataset");
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      dropDown
        .append("option")
        .text(sample)
        .property("value", sample);
    });
  //dropdown pick to get bar data to go along with other data
    var firstSample = sampleNames[0];
    getData(firstSample);
    barChart(firstSample);
  });
}

init();

function barChart(sample) {
  d3.json("samples.json").then((data) => {
      var values = data.samples;
      
      var target = values.filter(v => v.id == sample);
      // put it into a  empty list
      barData=[];
      // each id may have multiple data, use for loop to get corresponding data
      for (var i = 0; i < target.length; i++) {
          var sampleD = target[i].sample_values;
          var id = target[i].otu_ids;
          var label = target[i].otu_labels;
          for (var d = 0; d < sampleD.length; d++) {
              barData.push({"otu_ids": id[d], 
                            "otu_labels":label[d], 
                            "sample_values":sampleD[d]});
          };
      };

      barD = barData
      barD.sort((a, b) => b.sample_values - a.sample_values);
      barD = barD.slice(0, 10);
      barD = barD.reverse();
      //console.log(barD);

      var trace1 = {
          x: barD.map(row => row.sample_values),
          y: barD.map(row => "OTU " + row.otu_ids.toString()),
          text: barD.map(row => row.otu_labels),
          type: "bar",
          orientation: "h"
          }; 
      var bar=[trace1];
      var layout1 = {
          showlegend: false,
        };
      Plotly.newPlot("bar", bar, layout1);
  
      
      var trace2 = {
          x: barD.map(row => row.otu_ids),
          y: barD.map(row => row.sample_values),
          type: 'scatter',
          mode: 'markers', 
          marker:{
              size: barData.map(row => row.sample_values),
              color: barData.map(row => row.otu_ids)
          },
          text: barData.map(row => row.otu_labels)
      };
      var bubble=[trace2]
      var layout2 = {
          xaxis: {
              title: "OTU ID",
              tickmode: "linear",
              tick0: 0,
              dtick: 500
          },
          showlegend: false,
          height: 600,
        };
      Plotly.newPlot("bubble", bubble,layout2);
  });
};
