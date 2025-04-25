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
    groupedData[provinsi].x.push(row['Tahun']);
    groupedData[provinsi].y.push(row['Produksi']);
  });

  const traces = Object.keys(groupedData).map(province => ({
    x: groupedData[province].x,
    y: groupedData[province].y,
    mode: 'lines+markers',
    type: 'scatter',
    name: province,
    line: { width: 2 },
    marker: { size: 8 }
  }));

  makePlotly(traces, groupedData);
}

function makePlotly(traces, groupedData) {
  const plotDiv = document.getElementById("line");
  const layout = {
    title: { text: 'Grafik Produksi Berdasarkan Provinsi di Pulau Sumatera (Tahun 1993 - 2020)' },
    xaxis: { title: 'Tahun', tickmode: 'linear' },
    yaxis: { title: 'Produksi (ton)' },
    showlegend: true,
    annotations: []
  };

  Plotly.newPlot(plotDiv, traces, layout);
}

makeplot();