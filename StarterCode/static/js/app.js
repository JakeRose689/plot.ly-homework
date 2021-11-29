//Step 1: Plotly

//Use the D3 library to read in samples.json.
function plotter (sample){

    d3.json('samples.json').then(json =>{

    // console.log(json)

    var samples = json.samples;
    var filter = samples.filter(item => item.id==sample);
    var data = filter[0]; 

    // console.log(data)

//Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.

    var sample_value = data.sample_values.slice(0,10).reverse();    
    var max_otu = (data.otu_ids.slice(0,10).reverse());
    var max_otu_id = max_otu.map(top => 'OTU ' + top);
    var max_otu_label = data.otu_labels.slice(0,10);
    var id = data.otu_ids; 
    var otu_labels = data.otu_labels.slice(0,10);

    var trace = {
        x: sample_value, 
        y: max_otu_id, 
        text: max_otu_label, 
        marker:{
            color: 'blue'
            }, 
        type: 'bar', 
        orientation: 'h', 
        };

    var data = [trace];

    var layout = {
        title: 'Top 10 OTU',
        xaxis: {title: 'Sample Values'}, 
        yaxis: {
            tickmode: 'linear'
            }, 
        }; 

    Plotly.newPlot('bar', data, layout);

    //Create a bubble chart that displays each sample.

    var Trace = {
        x: id,
        y: sample_value, 
        mode: 'markers',
        marker: {
            size: sample_value,
            color: id
            },
        text: otu_labels,
        };

    var Data = [Trace];

    var Layout = {
        xaxis: {title: 'OTU IDs'}, 
        yaxis: {title: 'Sample Values'},
        height: 600, 
        width: 1200
        }; 

    Plotly.newPlot('bubble', Data, Layout);
    }); 
};

//Display the sample metadata, i.e., an individual's demographic information.
//Display each key-value pair from the metadata JSON object somewhere on the page.

function metadata(sample){
    d3.json('samples.json').then(data =>{
    var metadata = data.metadata;
    
    // console.log(metadata);

    var all = metadata.filter(meta => meta.id == sample)[0];
    var demographics = d3.select('#sample-metadata');

    demographics.html(''); 

    Object.entries(all).forEach((key) => {
        demographics.append('h5').text(key[0] + ': ' + key[1] + '\n');
        });
    }); 
};

//Update all of the plots any time that a new sample is selected.
function optionChanged(sample){
    plotter(sample);
    metadata(sample);
}; 

function infobox(){
    var dropdown = d3.select ('#selDataset'); 
    d3.json('samples.json').then((data) => {
        data.names.forEach(function(name) {
            dropdown.append('option').text(name).property('value',name); 
            }); 
        plotter(data.names[0]);
        metadata(data.names[0]);
    });
};

infobox();