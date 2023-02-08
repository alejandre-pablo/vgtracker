
export const defaultGame = {
    id: -1,
    title: '',
    developer: [],
    publisher: [],
    platform: '',
    genres: [],
    playtime: '',
    playtimeCache: '',
    rating: [0,0,0],
    ratingCache: [0,0,0],
    playdate: '',
    playdateCache: '',
    playstatus:'',
    image: '',
    customImage: '',
    detail: ''
}

export function gameReducer (game, action) {
    switch (action.type) {
        case 'edited': {
            return {
                ...game,
                ...action.fields
            }
            
        }
        case 'cleared': {
            return defaultGame;
        }
        default:
            return game;
    }
}

