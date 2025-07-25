# VGTracker

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

A working version of the project is available at [VGTracker](https://vgtracker.firebaseapp.com/)

## Introduction

VGTracker aims to provide a way to track and manage an ordered video game list. On top of allowing CRUD operations over a list, VGTracker will also provide:

- Fast and reliable querying from the [IGDB DB](https://www.igdb.com/) using the provided API.
- Sharing of user created lists to other users.
- List customization in the form of custom ordering and basic list styling, both of which show when the list is shared.
- Fast access to game details included in the DB such as the developer information, screenshots, ratings, etc.
- Insightful user-tailored statistics and information based on the added games and the data from them.

## Technologies

VGTracker is based on React v18 and written in JavaScript with Sass styles.

VGTracker uses Google Firebase for the following:

- Authentication for email/password and Google account auth providers.
- Functions for serverless access to the IGDB API.
- Firestore Database as BaaS.
- Hosting for application deployment.

This project also relies on the following node modules:

- React-Boostrap
- React Icons
- React Router
- Reactfire
- DnD-Kit
- Keen-Slider
- Recharts
- React Spring

### Disclaimer

This project is solely made with the purpose of learning and is not monetized in any form.

