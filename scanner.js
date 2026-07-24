document.addEventListener('DOMContentLoaded', () => {
    const resultBox = document.getElementById('result-box');
    const resultContent = document.getElementById('result-content');
    const btnScanAgain = document.getElementById('btn-scan-again');
    
    let html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: {width: 250, height: 250} },
        /* verbose= */ false
    );
    
    function onScanSuccess(decodedText, decodedResult) {
        // Stop scanning after successful scan
        html5QrcodeScanner.clear().then(() => {
            try {
                // Parse the JSON data from the QR Code
                const data = JSON.parse(decodedText);
                
                // Show success UI
                resultBox.className = 'success';
                resultContent.innerHTML = `
                    <div style="color: #16a34a; font-size: 3rem; text-align: center; margin-bottom: 10px;">
                        <i class='bx bx-check-circle'></i>
                    </div>
                    <h4 style="text-align:center;">Check-In Berhasil!</h4>
                    <hr style="margin: 15px 0; border: none; border-top: 1px solid #bbf7d0;">
                    <p><strong>Nama:</strong> ${data.nama || 'Tidak diketahui'}</p>
                    <p><strong>Status:</strong> ${data.hadir ? 'Hadir' : 'Tidak Hadir'}</p>
                    <p><strong>Jumlah Orang (Pax):</strong> ${data.pax || '-'}</p>
                    <p style="font-size: 0.8rem; color: #6b7280; margin-top: 10px;">Waktu RSVP: ${new Date(data.timestamp).toLocaleString()}</p>
                `;
            } catch (error) {
                // If it's not JSON, just show the text
                resultBox.className = 'error';
                resultContent.innerHTML = `
                    <div style="color: #dc2626; font-size: 3rem; text-align: center; margin-bottom: 10px;">
                        <i class='bx bx-error-circle'></i>
                    </div>
                    <h4 style="text-align:center;">Format QR Tidak Dikenali</h4>
                    <p>Isi QR: ${decodedText}</p>
                `;
            }
            
            btnScanAgain.style.display = 'block';
        }).catch(error => {
            console.error("Failed to clear html5QrcodeScanner. ", error);
        });
    }
    
    function onScanFailure(error) {
        // handle scan failure, usually better to ignore and keep scanning.
    }
    
    // Start scanner
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    
    // Reset scanner for next guest
    btnScanAgain.addEventListener('click', () => {
        resultBox.style.display = 'none';
        btnScanAgain.style.display = 'none';
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    });
});
