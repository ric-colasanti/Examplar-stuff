console.log("main");
var dictScopus = {}
var dictWebOf = {}

var scopus = []

var webOfScience = []


fetch("../data/confusion.csv")
  .then((res) => res.text())
  .then((text) => {
    var data = [["scopus","webOfScience","value"]]
    var allRows = text.split(/\r?\n|\r/);
    let topline = allRows[0].split(',')
    // console.log(topline);
    for (let i = 1; i < topline.length; i++) {
      topline[i] = topline[i].replace("%2c", " -").replace("\\", "").replace("\\&", "&")
      dictWebOf[topline[i]] = 0
    }
    for (let r = 1; r < allRows.length; r++) {
      let cols = allRows[r].split(',')
      let scops = cols[0]
      if (!(scops in dictScopus)) {
        dictScopus[scops] = 0
      }
      for (let c = 1; c < cols.length; c++) {
        let v = (parseInt(cols[c]) | 0)
        dictScopus[scops] += v
        dictWebOf[topline[c]] += v
        data.push([cols[0], topline[c], v])
      }
    }
    for (var [key, _] of Object.entries(dictScopus)) {
      scopus.push(key)
    }
    for (var [key, _] of Object.entries(dictWebOf)) {
      webOfScience.push(key)
    }
    scopus.sort(function(a, b){return dictScopus[b] - dictScopus[a]}); 
    webOfScience.sort(function(a, b){return dictWebOf[b] - dictWebOf[a]}); 
    draw(data)
  })
  .catch((e) => console.error(e));
// set the dimensions and margins of the graph
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
var draw = function (data) {
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

    // create a tooltip


    //Read the data
    //d3.csv("data/heat.csv").then(function (data) {

    svg.selectAll("rect")
        .data(data)//, function (d) { return d. + ':' + d.webOfScience; })
        .enter()
        .append("rect")
        .attr("x", function (d) { return x(d[0]) })
        .attr("y", function (d) { return y(d[1]) })
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", function (d) {return myColor(d[2]) })

    //})
}