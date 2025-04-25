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