console.log("14.45");




// fetch("../data/confusion.csv")
//   .then((res) => res.text())
//   .then((text) => {
//     console.log();
//     var paperdata = [["scopus","webOfScience","value"]]
//     var allRows = text.split(/\r?\n|\r/);
//     let topline = allRows[0].split(',')
//     // console.log(topline);
//     for (let i = 1; i < topline.length; i++) {
//       topline[i] = topline[i].replace("%2c", " -").replace("\\", "").replace("\\&", "&")
//       dictWebOf[topline[i]] = 0
//     }
//     for (let r = 1; r < allRows.length; r++) {
//       let cols = allRows[r].split(',')
//       let scops = cols[0]
//       if (!(scops in dictScopus)) {
//         dictScopus[scops] = 0
//       }
//       for (let c = 1; c < cols.length; c++) {
//         let v = (parseInt(cols[c]) | 0)
//         dictScopus[scops] += v
//         dictWebOf[topline[c]] += v
//         paperdata.push([cols[0], topline[c], v])
//       }
//     }
//     for (var [key, _] of Object.entries(dictScopus)) {
//       scopus.push(key)
//     }
//     for (var [key, _] of Object.entries(dictWebOf)) {
//       webOfScience.push(key)
//     }
//     scopus.sort(function(a, b){return dictScopus[b] - dictScopus[a]}); 
//     webOfScience.sort(function(a, b){return dictWebOf[b] - dictWebOf[a]}); 
//     draw(paperdata)
//   })
//   .catch((e) => console.error(e));
// // set the dimensions and margins of the graph
// let c = 0

var dictScopus = {}
var dictWebOf = {}
let scopus = []
let webOfScience = []
hdata=[]
d3.csv("data/heat.csv", function(data){
  if(!(scopus.includes(data.scopus))){
    scopus.push(data.scopus)
  }
  if (!(data.scopus in dictScopus)) {
    dictScopus[data.scopus] = 0
  }

  if(!(webOfScience.includes(data.webOfScience))){
    webOfScience.push(data.webOfScience)
  }
  if (!(data.webOfScience in dictWebOf)) {
    dictWebOf[data.webOfScience] = 0
  }
  dictWebOf[data.webOfScience]+=+data.value
  dictScopus[data.scopus]+=+data.value
  hdata.push([data.scopus,data.webOfScience,data.value])

}).then(function(){
  scopus.sort(function(a, b){return dictScopus[b] - dictScopus[a]}); 
  webOfScience.sort(function(a, b){return dictWebOf[b] - dictWebOf[a]}); 
  draw(hdata);
});


function sort(){
  scopus.sort(function(a, b){return dictScopus[b] - dictScopus[a]}); 
  webOfScience.sort(function(a, b){return dictWebOf[b] - dictWebOf[a]}); 
  draw(hdata);

}
const margin = { top: 30, right: 30, bottom: 300, left: 300 },
    width = 950 - margin.left - margin.right,
    height = 3300 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Labels of row and columns
function draw(paperdata) {
    const x = d3.scaleBand()
        .range([0, width])
        .domain(scopus)
        .padding(0.1);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)

        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.25em")
        .attr("transform", "rotate(-90)");


    // Build X scales and axis:
    const y = d3.scaleBand()
        .range([height, 0])
        .domain(webOfScience)
        .padding(0.1);
    svg.append("g")
        .attr("transform", "translate(0,30")
        .call(d3.axisLeft(y))

    // Build color scale
    const myColor = d3.scaleLinear()
        .range(["white", "darkGreen"])
        .domain([0, 350])


    var hspots = svg.selectAll("rect")
        .data(paperdata)
    
    hspots.enter()
    .append("rect")
    .attr("x", function (d) { return x(d[0]) })
        .attr("y", function (d) { return y(d[1]) })
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", function (d) {return myColor(d[2]) })
        .style("stroke", "black")
        .attr("stroke-width",  function(d) { if(d[2]>0){return 0.1}else{return 0} })
    
    hspots
    .transition()
    .duration(1000)
    .attr("x", function (d) { return x(d[0]) })
    .attr("y", function (d) { return y(d[1]) })

}