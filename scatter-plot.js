SCATTER = document.getElementById("scatter");

// Memuat data dari file JSON
fetch('DataTanamanPadi.json')
    .then(response => response.json())
    .then(data => {

        // Kelompokkan data berdasarkan provinsi
        const traces = {};
        data.forEach(item => {
            if (!traces[item.Provinsi]) {
                traces[item.Provinsi] = { x: [], y: [], mode: 'markers', name: item.Provinsi, type: 'scatter' };
            }
            traces[item.Provinsi].x.push(item.LuasPanen); // Menggunakan Luas Panen sebagai sumbu x
            traces[item.Provinsi].y.push(item.Produksi); // Menggunakan Produksi sebagai sumbu y
        });

        // Konversi objek traces menjadi array
        const scatterData = Object.values(traces);

        var layout = {
            title: 'Hubungan Luas Panen dengan Hasil Produksi',
            xaxis: { title: 'Luas Panen' },
            yaxis: { title: 'Produksi' },
            font: { size: 16 }
        };
        var config = { responsive: true };

        // Render scatter plot
        Plotly.newPlot(SCATTER, scatterData, layout, config);
    })
    .catch(error => console.error('Error loading JSON data:', error));