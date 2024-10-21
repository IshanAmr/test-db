const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { initDB, closeDB } = require('./initDB');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
app.use(cors());

initDB();
const db = new sqlite3.Database('./database.sqlite');

const fetchAllArtworks = async () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT id, title, artist FROM artworks', [], (err, data) => {
            if(err) {
                return reject(err);
            }

            resolve({ artworks: data });
        })
    })
}

app.get('/artworks', async (req, res) => {
    try {
       let results = await fetchAllArtworks();
       if(results.artworks.length === 0) return res.status(404).json({ message : `No artwork found`});

       res.status(200).json(results);
    } catch(error) {
       return res.status(500).json({ error: error.message });
    }
})

const fetchArtworksByArtist = async (artist) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT id, title, artist, year FROM artworks WHERE artist = ?', [artist], (err, data) => {
            if(err) {
                return reject(err);
            }

            resolve({ artworks: data });
        })
    })
}

app.get('/artworks/artist/:artist', async (req, res) => {
    try {
        let artist = req.params.artist;
        let results = await fetchArtworksByArtist(artist);
        if(results.artworks.length === 0) return res.status(404).json({ message : `No artwork for the artist ${artist} found`});

        res.status(200).json(results);
    } catch(error) {
        return res.status(500).json({ error: error.message });
    }
})

const fetchArtworksByYear = async (year) => {
     return new Promise((resolve, reject) => {
         db.all('SELECT id, title, artist, year FROM artworks WHERE year = ?', [year], (err, data) =>{
             if(err) {
                 return reject(err);
             }

             resolve({ artworks: data });
         })
     })
}

app.get('/artworks/year/:year', async (req, res) => {
    try {
       let year = req.params.year;
       let results = await fetchArtworksByYear(year);
       if(results.artworks.length === 0) return res.status(404).json({ message : `No artwork for the year ${year} found`});

       res.status(200).json(results);
    } catch(error) {
        return res.status(500).json({ error: error.message });
    }
})

const fetchArtworksByMedium = async (medium) => {
     return new Promise((resolve, reject) => {
         db.all('SELECT id, title, artist, medium FROM artworks WHERE medium = ?', [medium], (err, data) => {
              if(err) {
                 return reject(err);
              }

              resolve({ artworks: data });
         })
     })
}

app.get('/artworks/medium/:medium', async (req, res) => {
    try {
       let medium = req.params.medium;
       let results = await fetchArtworksByMedium(medium);
       if(results.artworks.length === 0) return res.status(404).json({ message : `No artwork for the medium ${medium} found`});

       res.status(200).json(results);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  closeDB();
  process.exit();
});
