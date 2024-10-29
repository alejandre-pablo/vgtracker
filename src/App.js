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
import ListHandler from './components/ListHandler';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { AuthProvider, FirestoreProvider, StorageProvider, useFirebaseApp, useSigninCheck} from 'reactfire';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { useEffect } from 'react';
import { getStorage } from 'firebase/storage';
import { SearchProvider } from './components/contexts/SearchContext';

function App(){

    const app = useFirebaseApp();
    const firestoreDatabase = getFirestore(app)
    const auth = getAuth(app);
    const storage = getStorage(app);

    const AuthRoute = () => {
        return (
          <Routes>
            <Route path="/login" exact={true} element={<LoginContainer />}/>
            <Route path="/signup" exact={true} element={<SignupContainer />}/>
            <Route path ='/user/:userId' element ={<><NavBar /><SharedListContainer/></>}/>
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
                <StorageProvider sdk={storage}>
                    <BrowserRouter>
                        <AuthWrapper fallback={<AuthRoute />}>
                            <SearchProvider>
                                <NavBar />
                                <ListHandler>
                                    {(list, isEmptyList, isLoaded, handleEditItem, handleRemoveItem, handleSorting, handleOrderList) => (
                                        <Routes>
                                            <Route path='/' element ={<Navigate to='/list' replace={true}/>}/>
                                            <Route path ='/home' element ={<ListContainer list ={list} handleEditItem={handleEditItem} handleRemoveItem={handleRemoveItem} handleSorting={handleSorting} handleOrderList={handleOrderList} isEmptyList={isEmptyList} isLoaded={isLoaded}/>}/>
                                            <Route path ='/list' element ={<ListContainer list ={list} handleEditItem={handleEditItem} handleRemoveItem={handleRemoveItem} handleSorting={handleSorting} handleOrderList={handleOrderList} isEmptyList={isEmptyList} isLoaded={isLoaded}/>}/>
                                            <Route path ='/stats' element ={<StatsContainer />}/>
                                            <Route path ='/search' element ={<SearchResultsContainer list ={list} handleEditItem={handleEditItem}/>}/>
                                            <Route path ='/game/:game' element ={<GameDetailContainer/>}/>
                                            <Route path ='/user/:userId' element ={<><NavBar /><SharedListContainer/></>}/>
                                            <Route path ='/error' element ={<ErrorContainer />}/>
                                        </Routes>
                                    )}
                                </ListHandler>
                            </SearchProvider>
                        </ AuthWrapper>
                    </BrowserRouter>
                </StorageProvider>  
            </FirestoreProvider>
        </AuthProvider>
    );
}

export default App;
