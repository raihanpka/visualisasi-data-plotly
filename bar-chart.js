function makeplot() {
    Plotly.d3.csv("https://raw.githubusercontent.com/raihanpka/visualisasi-data-plotly/refs/heads/master/DataTanamanPadi.csv", 
      function(data){ processData(data) } );
  };
  
function processData(allRows) {
    console.log(allRows);

    const groupedData = {};
    allRows.forEach(row => {
        const provinsi = row['Provinsi'];
        const tahun = row['Tahun'];
        const produksi = parseFloat(row['Produksi']);
        if (!groupedData[tahun]) {
            groupedData[tahun] = {};
        }
        groupedData[tahun][provinsi] = produksi;
    });

    const provinces = [...new Set(allRows.map(row => row['Provinsi']))];
    const traces = provinces.map(province => ({
        x: Object.keys(groupedData),
        y: Object.keys(groupedData).map(year => groupedData[year][province] || 0),
        name: province,
        type: 'bar'
    }));

    makePlotly(traces);
}

function makePlotly(traces) {
    const plotDiv = document.getElementById("bar");
    const layout = {
        title: {
            text: 'Perbandingan Produksi Antar Provinsi dan Tahun di Pulau Sumatera (Tahun 1993-2020)',
        },
        xaxis: {
            title: 'Tahun',
            tickfont: {
                size: 14,
                color: 'rgb(107, 107, 107)'
            }
        },
        yaxis: {
            title: {
                text: 'Produksi (ton)',
                font: {
                    size: 16,
                    color: 'rgb(107, 107, 107)'
                }
            },
            tickfont: {
                size: 14,
                color: 'rgb(107, 107, 107)'
            }
        },
        legend: {
            x: 1.0,
            y: 1.0,
            bgcolor: 'rgba(255, 255, 255, 0)',
            bordercolor: 'rgba(255, 255, 255, 0)'
        },
        barmode: 'stack',
        bargap: 0.15,
        bargroupgap: 0.1,
        autosize: true
    };

    Plotly.newPlot(plotDiv, traces, layout, {responsive: true});
}

makeplot();