const express = require('express');

const port = 3000;
const app = express();

app.get('/skibidi', (req, res) => {
    res.send("<html>Oglądacie może skibidi toilet?Skibidi toilet ? A co to jest ?Już opowiadam, skibidi toilet to świetny serial oparty na problemach naszego świata. Toczy się w nim nieskończona wojna, którą twórca nawiązuje do syzyfa. Wojne toczą kameraludzie i skibidi-toalety, czyli głowy wystające z kibla.Pierdolisz farmazony. Do kwadratu Cie już pojebało.Niezrozumiecie.....</html>");
    }
);

app.get('/', (req, res) => {
    res.send("Dupsko")
    }
);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
);
