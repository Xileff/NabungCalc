const textFields = document.body.querySelectorAll("form input");
const submit = document.getElementById('btnCountNabung');
const closeHasil = document.getElementById('closeHasil');
// const containerHasil = document.getElementById('containerHasil');

textFields.forEach(textField => {
    new AutoNumeric(`#${textField.id}`, {
        decimalPlaces :'0',
        digitGroupSeparator:','
    });
});

submit.addEventListener('click', () => {
    // Cek semua input
    const arrTextFields = Array.from(textFields);
    const semuaNominal = arrTextFields.map(n => rupiahToInteger(n.value));

    semuaNominal.forEach(n => {
        if(n < 0) {
            alertError('Negatif', 'Tidak boleh ada input negatif', 'Ok');
            throw new Error("Input negatif");
        }
    });

    const [penghasilan, tanggungan, kebutuhan, keinginan, cicilan, pengeluaranRutin, tabungan] = semuaNominal;
    const alokasiUang = tanggungan + kebutuhan + keinginan + cicilan + pengeluaranRutin + tabungan;

    if (penghasilan === 0) {
        alertError('Periksa Input Anda', 'Penghasilan tidak boleh 0', 'Ok');
        throw new Error("Penghasilan kosong");
    }

    if (alokasiUang > penghasilan) {
        alertError('Periksa Input Anda', 'Jumlah uang yang anda alokasikan untuk pengeluaran dan menabung tidak boleh melebihi penghasilan.', 'Ok');
        throw new Error("Pengeluaran > Penghasilan");
    }

    // kalo blm muncul hasil, munculkan. kalo udh, tidak lakukan apa2
    if(!containerHasil.classList.contains('show')){
        containerHasil.classList.add('show');
        hitungSemua(textFields);
        window.scrollTo(0, 0);
    }
});

closeHasil.addEventListener('click', () => {
    containerHasil.classList.remove('show');
})

// functions
function rupiahToInteger(nominal){
    let result = 0;
    if (nominal.length > 0) {
        result = "";
        for (let n of nominal) {
            n === "," ? n = "" : n = n;
            result += n;
        }
    }
    return parseInt(result);
}

function percentage(x, y){
    let result = x / y;
    return result.toString().length > 4 ? result = parseFloat((result * 100).toFixed(2)) : result = (result * 100);
}

function hitungSemua(textFields){
    // mengubah format rupiah mjd integer dan menetapkan semua variabel
    const arrTextFields = Array.from(textFields);
    const semuaNominal = arrTextFields.map(n => rupiahToInteger(n.value));
    const [penghasilan, tanggungan, kebutuhan, keinginan, cicilan, pengeluaranRutin, tabungan] = semuaNominal;

    const totalPengeluaran = kebutuhan + tanggungan + keinginan + cicilan + pengeluaranRutin;

    // Persentase pengeluaran
    const persentasePengeluaran = percentage(totalPengeluaran, penghasilan);
    const persentaseTabungan = percentage(tabungan, penghasilan);

    // Tentuin hasil
    const h2JudulHasil = document.getElementById('h2JudulHasil');
    const imgHasil = document.getElementById('imgHasil');
    const judulHasil = document.getElementById('judulHasil');
    const spanMenabung = document.getElementById('spanMenabung');
    const spanPengeluaran = document.getElementById('spanPengeluaran');
    const olInsights = document.getElementById('olInsights');

    olInsights.innerHTML = '';

    judulHasil.innerHTML = `Dari ${penghasilan.toLocaleString('id', { style: 'currency', currency: 'IDR'})}`;
    spanPengeluaran.innerHTML = `${persentasePengeluaran}%`;
    spanMenabung.innerHTML = `${persentaseTabungan}%`;

    const liRekomendasi1 = document.createElement('li');
    const liRekomendasi2 = document.createElement('li');

    // Jika pngeluaran >= 80%
    if (persentasePengeluaran >= 80) {
        h2JudulHasil.innerHTML = "Kamu terlalu boros.";
        imgHasil.setAttribute('src', '../images/nabung/noob.png');

        liRekomendasi1.innerHTML = `Sebaiknya batasi pengeluaran hingga <span class="fw-bold font-red">${(0.79 * penghasilan).toLocaleString('id', { style: 'currency', currency: 'IDR'})}</span>`;
        liRekomendasi2.innerHTML = `Alokasikan minimal 20% dari penghasilanmu untuk ditabung, yaitu <span class="font-green fw-bold">${(0.2 * penghasilan).toLocaleString('id', { style: 'currency', currency: 'IDR'})}</span>`;
    }

    // Lainnya
    else {

        // Jika pengeluaran antara 50%-79%, maka rekomendasi 1 adalah
        if (persentasePengeluaran >= 50 && persentasePengeluaran < 80) {
            h2JudulHasil.innerHTML = "Anda lumayan hebat.";
            imgHasil.setAttribute('src', '../images/nabung/intermediate.png');
    
            liRekomendasi1.innerHTML = `Jumlah pengeluaran anda sudah baik, karena tidak sampai 80% penghasilan anda(<span class="fw-bold font-red">${(0.8 * penghasilan).toLocaleString('id', { style: 'currency', currency: 'IDR'})}</span>)`;
        }
    
        // Jika kurang dari 50%, maka rekomendasi 1 adalah
        else {
            h2JudulHasil.innerHTML = "Anda Juragan.";
            imgHasil.setAttribute('src', '../images/nabung/sultan.png');
    
            liRekomendasi1.innerHTML = `Pengeluaran Anda hanya <span class="fw-bold">${persentasePengeluaran} % </span> dari penghasilan anda, yaitu <span class="fw-bold font-red">${(totalPengeluaran).toLocaleString('id', { style: 'currency', currency: 'IDR'})}</span>. Ini <span class="fw-bold font-green">Sangat Bagus!</span>`;
        }

        // Rekomendasi 2, tergantung pada persentase tabungan. Berlaku untuk tingkat pengeluaran 50-79% maupun di bawah 50%
        if (persentaseTabungan < 20) {
            liRekomendasi2.innerHTML = `Alokasikan minimal 20% dari penghasilanmu untuk ditabung, yaitu <span class="font-green fw-bold">${(0.2 * penghasilan).toLocaleString('id', { style: 'currency', currency: 'IDR'})}</span>`;    
        }

        else if (persentaseTabungan == 20) {
            liRekomendasi2.innerHTML = `Anda juga sudah menyisihkan paling tidak 20% penghasilan untuk ditabung(<span class="font-green fw-bold">${(0.2 * penghasilan).toLocaleString('id', { style: 'currency', currency: 'IDR'})}</span>). <span class="fw-bold font-green">Bagus!</span>`;
        }

        else {
            liRekomendasi2.innerHTML = `Anda juga sudah menyisihkan ${persentaseTabungan}% penghasilan untuk ditabung(<span class="font-green fw-bold">${(tabungan).toLocaleString('id', { style: 'currency', currency: 'IDR'})}</span>). <span class="fw-bold font-green">Bagus!</span>`;
        }
    }
    olInsights.appendChild(liRekomendasi1);
    olInsights.appendChild(liRekomendasi2);
}