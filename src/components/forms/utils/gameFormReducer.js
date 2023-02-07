
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
    playstatusCache: '',
    image: '',
    customImage: '',
    detail: ''
}

export function gameReducer (game, action) {
    switch (action.type) {
        case 'opened': {
            if(action.id !== -1) {
                let existingGames = JSON.parse(sessionStorage.getItem('games'));
                return {...existingGames.filter(res => (res.id === action.id))[0]}
            } else {
                return game;
            }
        }
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

