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

// Fungsi untuk memproses data yang diambil dari file CSV
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
      // Menambahkan data curah hujan ke sumbu x dan produksi ke sumbu y
      groupedData[provinsi].x.push(row['Curah Hujan']);
      groupedData[provinsi].y.push(row['Produksi']);
  });

  // Membuat array trace untuk setiap provinsi
  const traces = Object.keys(groupedData).map(province => ({
      x: groupedData[province].x, // Data sumbu x (curah hujan)
      y: groupedData[province].y, // Data sumbu y (produksi)
      mode: 'markers', // Mode visualisasi: hanya penanda
      type: 'scatter', // Jenis plot: scatter plot
      name: province, // Nama provinsi untuk legenda
      marker: { size: 12 } // Ukuran penanda
  }));

  // Membuat data untuk garis regresi
  const xData = allRows.map(row => parseFloat(row['Curah Hujan'])); // Mengambil semua data curah hujan
  const yData = allRows.map(row => parseFloat(row['Produksi'])); // Mengambil semua data produksi

  const n = xData.length; // Jumlah data
  const xMean = xData.reduce((sum, val) => sum + val, 0) / n; // Rata-rata curah hujan
  const yMean = yData.reduce((sum, val) => sum + val, 0) / n; // Rata-rata produksi

  // Menghitung slope (kemiringan) dan intercept (titik potong) untuk regresi linear
  let numerator = 0, denominator = 0;
  for (let i = 0; i < n; i++) {
      numerator += (xData[i] - xMean) * (yData[i] - yMean); // Pembilang
      denominator += (xData[i] - xMean) ** 2; // Penyebut
  }

  const slope = numerator / denominator; // Kemiringan garis regresi
  const intercept = yMean - slope * xMean; // Titik potong garis regresi

  // Membuat trace untuk garis regresi
  const regressionTrace = {
      x: [Math.min(...xData), Math.max(...xData)], // Titik x untuk garis regresi
      y: [slope * Math.min(...xData) + intercept, slope * Math.max(...xData) + intercept], // Titik y untuk garis regresi
      mode: 'lines', // Mode visualisasi: garis
      type: 'scatter', // Jenis plot: scatter plot
      name: 'Garis Regresi', // Nama garis untuk legenda
      line: { color: 'red' } // Warna garis regresi
  };

  // Menambahkan garis regresi ke array traces
  traces.push(regressionTrace);

  // Memanggil fungsi makePlotly untuk membuat grafik
  makePlotly(traces);
}

// Fungsi untuk membuat grafik menggunakan Plotly
function makePlotly(traces) {
  const plotDiv = document.getElementById("scatter2"); // Elemen HTML tempat grafik akan ditampilkan
  const layout = {
      title: { 
          text: 'Hubungan Curah Hujan dengan Hasil Produksi Padi di Pulau Sumatera (Tahun 1993-2020)' 
      }, // Judul grafik
      xaxis: { title: 'Curah Hujan' }, // Label sumbu x
      yaxis: { title: 'Produksi Padi (ton)' }, // Label sumbu y
      autosize: true // Grafik otomatis menyesuaikan ukuran
  };

  // Membuat grafik menggunakan Plotly.newPlot
  Plotly.newPlot(plotDiv, traces, layout, {responsive: true});
}

// Memanggil fungsi makeplot untuk memulai proses
makeplot();