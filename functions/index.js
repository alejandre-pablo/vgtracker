const { TWITCH_TOKEN_URL, IGDB_API } = require("./constants.js");

const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

const IGDB_CLIENT_ID = defineSecret("IGDB_CLIENT_ID");
const IGDB_CLIENT_SECRET = defineSecret("IGDB_CLIENT_SECRET");

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.searchGames = onRequest(
    {
      secrets: [IGDB_CLIENT_ID, IGDB_CLIENT_SECRET],
      cors: true
    },
    async (req, res) => {
      const clientId = IGDB_CLIENT_ID.value();
      const clientSecret = IGDB_CLIENT_SECRET.value();
  
      try {
        const authRes = await fetch(TWITCH_TOKEN_URL, {
          method: 'POST',
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'client_credentials'
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
  
        const authData = await authRes.json();
        const accessToken = authData.access_token;
  
        const { searchQuery } = req.body;

        if (!searchQuery) {
          res.status(400).send({error: 'Missing query parameter'});
          return;
        }
  
        const igdbRes = await fetch(IGDB_API.GAMES, {
          method: 'POST',
          headers: {
            'Client-ID': clientId,
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
            'Content-Type': 'text/plain'
          },
          body: `
            search "${searchQuery}";
            fields name, platforms.name, cover.image_id, artworks.image_id, genres.name, themes.name, total_rating, game_type, involved_companies.company.name, involved_companies.developer, involved_companies.publisher;
            limit 50;
          `
        });
  
        const games = await igdbRes.json();
        res.status(200).json(games);
  
      } catch (err) {
        console.error("Error fetching games:", err);
        res.status(500).send({ error: "Failed to fetch games" });
      }
    }
  );
