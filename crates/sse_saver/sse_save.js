const fs = require('fs');
const https = require('https');

// SSE sunucusunun URL'si
const url = 'https://f1-live-d93b06d24842.herokuapp.com/api/sse';

// Dosya adı
const fileName = 'yasri.json';

// Dosyadan mevcut veriyi oku veya boş bir dizi başlat
let events = [];
if (fs.existsSync(fileName)) {
    const fileData = fs.readFileSync(fileName, 'utf8');
    try {
        events = JSON.parse(fileData);
    } catch (e) {
        console.error('JSON parse hatası:', e);
    }
}

// GET isteği gönder
https.get(url, (res) => {
    // Veri parçalarını biriktir
    res.on('data', (chunk) => {
        console.log('Sunucudan gelen veri:', chunk.toString());
        const resp = chunk.toString();
        try {

            let eventAll = resp.split('event: ')[1]
            let event = eventAll.split('\n')[0]
            let data = resp.split('data: ')[1]
            // Yeni veriyi diziye ekle
            events.push({ event: event, data: data });

        } catch (error) {

        }
        // Diziyi dosyaya yaz
        fs.writeFile(fileName, JSON.stringify(events), (err) => {
            if (err) {
                console.error('Dosyaya yazma hatası:', err);
            } else {
                console.log('Olay dosyaya yazıldı.');
            }
        });
    });

    // Yanıt tamamlandığında
    res.on('end', () => {
        console.log('Sunucudan gelen yanıt tamamlandı.');
    });

}).on('error', (err) => {
    console.error('İstek hatası:', err.message);
});
