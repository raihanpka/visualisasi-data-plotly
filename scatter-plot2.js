function makeplot() {
    Plotly.d3.csv("https://raw.githubusercontent.com/raihanpka/visualisasi-data-plotly/refs/heads/master/DataTanamanPadi.csv", 
    function(data){ processData(data) } );
};
  
function processData(allRows) {
  console.log(allRows);
  
  const groupedData = {};
  allRows.forEach(row => {
    const provinsi = row['Provinsi'];
    if (!groupedData[provinsi]) {
      groupedData[provinsi] = { x: [], y: [] };
    }
    groupedData[provinsi].x.push(row['Curah Hujan']);
    groupedData[provinsi].y.push(row['Produksi']);
  });

  const traces = Object.keys(groupedData).map(province => ({
    x: groupedData[province].x,
    y: groupedData[province].y,
    mode: 'markers',
    type: 'scatter',
    name: province,
    marker: { size: 12 }
  }));

    // Regression line trace
    const xData = allRows.map(row => parseFloat(row['Curah Hujan']));
    const yData = allRows.map(row => parseFloat(row['Produksi']));
  
    const n = xData.length;
    const xMean = xData.reduce((sum, val) => sum + val, 0) / n;
    const yMean = yData.reduce((sum, val) => sum + val, 0) / n;
  
    let numerator = 0, denominator = 0;
    for (let i = 0; i < n; i++) {
      numerator += (xData[i] - xMean) * (yData[i] - yMean);
      denominator += (xData[i] - xMean) ** 2;
    }
  
    const slope = numerator / denominator;
    const intercept = yMean - slope * xMean;
  
    const regressionTrace = {
      x: [Math.min(...xData), Math.max(...xData)],
      y: [slope * Math.min(...xData) + intercept, slope * Math.max(...xData) + intercept],
      mode: 'lines',
      type: 'scatter',
      name: 'Regression Line',
      line: { color: 'red' }
    };
  
    traces.push(regressionTrace);

  makePlotly(traces);
}

function makePlotly(traces) {
  const plotDiv = document.getElementById("scatter2");
  const layout = {
    title: { text: 'Hubungan Curah Hujan dengan Hasil Produksi di Pulau Sumatera (Tahun 1993-2020)' },
    xaxis: { title: 'Curah Hujan' },
    yaxis: { title: 'Produksi (ton)' },
    autosize: true
  };

  Plotly.newPlot(plotDiv, traces, layout, {responsive: true});
}

makeplot();