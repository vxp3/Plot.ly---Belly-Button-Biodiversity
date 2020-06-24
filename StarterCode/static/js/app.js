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
    var firstSample = sampleNames[0];
    getData(firstSample);
  });
}
init();