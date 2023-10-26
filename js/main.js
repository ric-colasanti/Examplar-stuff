

var dictScopus = {}
var dictWebOf = {}
let scopus = []
let webOfScience = []
let hdata=[]
let wosSelect = ["Statistics & Probability","Mathematics","Construction & Building Technology","Meteorology & Atmospheric Sciences","Engineering- Manufacturing","Remote Sensing","Engineering- Civil","Water Resources","Computer Science- Information Systems","Computer Science- Interdisciplinary Applications","Mathematics- Interdisciplinary Applications","Chemistry- Analytical","Computer Science- Cybernetics","Neurosciences","Physics- Applied","Computer Science- Artificial Intelligence","Engineering- Mechanical","Telecommunications","Computer Science- Theory & Methods","Computer Science- Software Engineering","Energy & Fuels","Imaging Science & Photographic Technology","Computer Science- Hardware & Architecture","Engineering- Multidisciplinary","Engineering- Electrical & Electronic","Automation & Control Systems","Mathematics- Applied"]
let scopusSelect=["Computer-Science","Health-Professions","Earth and Planetary-Sciences","Energy","Multidisciplinary","Mathematics","Environmental-Science","Agricultural and Biological-Sciences","Nursing","Social-Science","Arts and Humanities","Decision-Sciences"]
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
    const exaNotSelect = d3.scaleLinear()
        .range(["white", "darkGreen"])
        .domain([0, 350])
    const exaSelect = d3.scaleLinear()
        .range(["white", "purple"])
        .domain([0, 350])


    var hspots = svg.selectAll("rect")
        .data(paperdata)
    
    hspots.enter()
    .append("rect")
    .attr("x", function (d) { return x(d[0]) })
        .attr("y", function (d) { return y(d[1]) })
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", function (d) { if ((scopusSelect.includes(d[0]))&&( wosSelect.includes(d[1]))){
          return exaSelect(d[2])
        }return exaNotSelect(d[2]) })
        .style("stroke", "black")
        .attr("stroke-width",  function(d) { if(d[2]>0){ if ((scopusSelect.includes(d[0]))&&( wosSelect.includes(d[1]))){return 0.4}return 0.1}else{return 0} })
    
    hspots
    .transition()
    .duration(1000)
    .attr("x", function (d) { return x(d[0]) })
    .attr("y", function (d) { return y(d[1]) })

}