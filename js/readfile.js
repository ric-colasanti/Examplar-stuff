console.log("read file");
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
    console.log(data);
    draw(data)
  })
  .catch((e) => console.error(e));