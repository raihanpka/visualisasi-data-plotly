// Fungsi utama untuk memulai proses plotting
function makeplot() {
    // Mengambil data CSV dari URL menggunakan Plotly.d3.csv
    Plotly.d3.csv(
        "https://raw.githubusercontent.com/raihanpka/visualisasi-data-plotly/refs/heads/master/DataTanamanPadi.csv", 
        function(data) { 
            // Memproses data yang diambil dengan memanggil fungsi processData
            processData(data); 
        }
    );
}

// Fungsi untuk memproses data CSV yang telah diambil
function processData(allRows) {
    console.log(allRows); // Menampilkan semua baris data di konsol untuk debugging

    // Objek untuk mengelompokkan data berdasarkan tahun dan provinsi
    const groupedData = {};
    allRows.forEach(row => {
        const provinsi = row['Provinsi']; // Mengambil nama provinsi dari setiap baris
        const tahun = row['Tahun']; // Mengambil tahun dari setiap baris
        const produksi = parseFloat(row['Produksi']); // Mengonversi produksi menjadi angka
        if (!groupedData[tahun]) {
            // Jika tahun belum ada di groupedData, buat entri baru
            groupedData[tahun] = {};
        }
        // Menyimpan data produksi berdasarkan provinsi untuk setiap tahun
        groupedData[tahun][provinsi] = produksi;
    });

    // Mengambil daftar unik provinsi dari data
    const provinces = [...new Set(allRows.map(row => row['Provinsi']))];

    // Membuat array trace untuk setiap provinsi
    const traces = provinces.map(province => ({
        x: Object.keys(groupedData), // Data sumbu x (tahun)
        y: Object.keys(groupedData).map(year => groupedData[year][province] || 0), // Data sumbu y (produksi)
        name: province, // Nama provinsi untuk legenda
        type: 'bar' // Jenis plot: bar chart
    }));

    // Memanggil fungsi makePlotly untuk membuat grafik
    makePlotly(traces);
}

// Fungsi untuk membuat grafik menggunakan Plotly
function makePlotly(traces) {
    const plotDiv = document.getElementById("bar"); // Elemen HTML tempat grafik akan ditampilkan
    const layout = {
        title: {
            text: 'Perbandingan Produksi Padi Antar Provinsi dan Tahun di Pulau Sumatera (Tahun 1993-2020)', // Judul grafik
        },
        xaxis: {
            title: 'Tahun', // Label sumbu x
            tickfont: {
                size: 14, // Ukuran font untuk tick
                color: 'rgb(107, 107, 107)' // Warna font untuk tick
            }
        },
        yaxis: {
            title: {
                text: 'Produksi Padi (ton)', // Label sumbu y
                font: {
                    size: 16, // Ukuran font label
                    color: 'rgb(107, 107, 107)' // Warna font label
                }
            },
            tickfont: {
                size: 14, // Ukuran font untuk tick
                color: 'rgb(107, 107, 107)' // Warna font untuk tick
            }
        },
        legend: {
            x: 1.0, // Posisi legenda pada sumbu x
            y: 1.0, // Posisi legenda pada sumbu y
            bgcolor: 'rgba(255, 255, 255, 0)', // Warna latar belakang legenda
            bordercolor: 'rgba(255, 255, 255, 0)' // Warna border legenda
        },
        barmode: 'stack', // Mode bar chart: tumpukan
        bargap: 0.15, // Jarak antar bar
        bargroupgap: 0.1, // Jarak antar grup bar
        autosize: true // Grafik otomatis menyesuaikan ukuran
    };

    // Membuat grafik menggunakan Plotly.newPlot
    Plotly.newPlot(plotDiv, traces, layout, {responsive: true});
}

// Memanggil fungsi makeplot untuk memulai proses
makeplot();