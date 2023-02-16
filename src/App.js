import './App.scss';
import ListContainer from './routes/ListContainer';
import StatsContainer from './routes/StatsContainer';
import GameDetailContainer from './routes/GameDetailContainer';
import SearchResultsContainer from './routes/SearchResultsContainer';
import LoginContainer from './routes/auth/LoginContainer';
import SignupContainer from './routes/auth/SignupContainer';
import ErrorContainer from './routes/auth/ErrorContainer';
import SharedListContainer from './routes/SharedListContainer';
import NavBar from './components/NavBar';
import SharedNavBar from './components/SharedNavBar'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { AuthProvider, FirestoreProvider, useFirebaseApp, useSigninCheck } from 'reactfire';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { useEffect } from 'react';

function App(){

    const app = useFirebaseApp();
    const firestoreDatabase = getFirestore(app)
    const auth = getAuth(app);

    const AuthRoute = () => {
        return (
          <Routes>
            <Route path="/login" exact={true} element={<LoginContainer />}/>
            <Route path="/signup" exact={true} element={<SignupContainer />}/>
            <Route path="*" exact={true} element={<LoginContainer />}/>
          </Routes>
        );
    };

    const AuthWrapper = ({children, fallback}) => {
        const { status, data: signInCheckResult } = useSigninCheck();
      
        if (!children) {
            throw new Error("Children must be provided");
        }
        if (status === "loading") {
            return <></>;
        } else if (signInCheckResult.signedIn === true) {
            return children;
        }
      
        return fallback;
    };

    useEffect(() => {
        let viewheight = window.innerHeight;
        let viewwidth = window.innerWidth;
        let viewport = document.querySelector("meta[name=viewport]");
        viewport.setAttribute("content", "height=" + viewheight + ", width=" + viewwidth + ", initial-scale=1.0");
    })
    

    return (
        <AuthProvider sdk={auth}>
            <FirestoreProvider sdk={firestoreDatabase}>
                <BrowserRouter>
                    <AuthWrapper fallback={<AuthRoute />}>
                        <Routes>
                            <Route path='/' element ={<Navigate to='/list' replace={true}/>}/>
                            <Route path ='/list' element ={<><NavBar /><ListContainer /></>}/>
                            <Route path ='/home' element ={<><NavBar /><ListContainer /></>}/>
                            <Route path ='/stats' element ={<><NavBar /><StatsContainer /></>}/>
                            <Route path ='/user/:userId' element ={<><SharedNavBar /><SharedListContainer /></>}/>
                            <Route path ='/search' element ={<><NavBar /><SearchResultsContainer /></>}/>
                            <Route path ='/game/:game' element ={<><NavBar /><GameDetailContainer /></>}/>
                            <Route path ='/error' element ={<ErrorContainer />}/>
                        </Routes>
                    </ AuthWrapper>
                </BrowserRouter>
            </FirestoreProvider>
        </AuthProvider>
    );
}

export default App;
