// Fungsi utama untuk memulai proses plotting
function makeplot() {
    // Mengambil data CSV dari URL menggunakan Plotly.d3.csv
    Plotly.d3.csv("https://raw.githubusercontent.com/raihanpka/visualisasi-data-plotly/refs/heads/master/DataTanamanPadi.csv", 
      function(data){ 
        // Memproses data yang diambil dengan memanggil fungsi processData
        processData(data); 
      });
}

// Fungsi untuk memproses data CSV yang telah diambil
function processData(allRows) {
  console.log(allRows); // Menampilkan semua baris data di konsol untuk debugging

  // Objek untuk mengelompokkan data berdasarkan provinsi
  const groupedData = {};
  allRows.forEach(row => {
    const provinsi = row['Provinsi']; // Mengambil nama provinsi dari setiap baris
    if (!groupedData[provinsi]) {
      // Jika provinsi belum ada di groupedData, buat entri baru
      groupedData[provinsi] = { x: [], y: [] };
    }
    // Menambahkan data tahun ke sumbu x dan produksi ke sumbu y
    groupedData[provinsi].x.push(row['Tahun']);
    groupedData[provinsi].y.push(row['Produksi']);
  });

  // Membuat array trace untuk setiap provinsi
  const traces = Object.keys(groupedData).map(province => ({
    x: groupedData[province].x, // Data sumbu x (tahun)
    y: groupedData[province].y, // Data sumbu y (produksi)
    mode: 'lines+markers', // Mode visualisasi: garis dengan penanda
    type: 'scatter', // Jenis plot: scatter plot
    name: province, // Nama provinsi untuk legenda
    line: { width: 2 }, // Ketebalan garis
    marker: { size: 8 } // Ukuran penanda
  }));

  // Memanggil fungsi makePlotly untuk membuat grafik
  makePlotly(traces, groupedData);
}

// Fungsi untuk membuat grafik menggunakan Plotly
function makePlotly(traces, groupedData) {
  const plotDiv = document.getElementById("line"); // Elemen HTML tempat grafik akan ditampilkan
  const width = plotDiv.clientWidth; // Lebar elemen
  const height = plotDiv.clientHeight; // Tinggi elemen
  const layout = {
    title: { 
      text: 'Grafik Produksi Padi Berdasarkan Provinsi di Pulau Sumatera (Tahun 1993 - 2020)' 
    }, // Judul grafik
    xaxis: { 
      title: 'Tahun', // Label sumbu x
      tickmode: 'linear' // Mode tick: linear
    },
    yaxis: { 
      title: 'Produksi Padi (ton)' // Label sumbu y
    },
    showlegend: true, // Menampilkan legenda
    annotations: [], // Anotasi (kosong untuk saat ini)
    autosize: true, // Grafik otomatis menyesuaikan ukuran
    width: width, // Lebar grafik
    height: height // Tinggi grafik
  };

  // Membuat grafik menggunakan Plotly.newPlot
  Plotly.newPlot(plotDiv, traces, layout, {responsive: true});
}

// Memanggil fungsi makeplot untuk memulai proses
makeplot();