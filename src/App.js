import './App.scss';
import ListContainer from './routes/ListContainer';
import StatsContainer from './routes/StatsContainer';
import GameDetailContainer from './routes/GameDetailContainer';
import SearchResultsContainer from './routes/SearchResultsContainer';
import LoginContainer from './routes/auth/LoginContainer';
import SignupContainer from './routes/auth/SignupContainer';
import ErrorContainer from './routes/auth/ErrorContainer';
import NavBar from './components/NavBar';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { AuthProvider, FirestoreProvider, useFirebaseApp, useSigninCheck } from 'reactfire';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

    const AuthWrapper = ({children, fallback,}) => {
        const { status, data: signInCheckResult } = useSigninCheck();
        console.log(signInCheckResult);
      
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

    return (
        <AuthProvider sdk={auth}>
            <FirestoreProvider sdk={firestoreDatabase}>
                <BrowserRouter>
                    <div className="container-xxl">
                    <AuthWrapper fallback={<AuthRoute />}>
                        <Routes>
                            <Route path ='/' element ={<><NavBar /><ListContainer /></>}/>
                            <Route path ='/home' element ={<><NavBar /><ListContainer /></>}/>
                            <Route path ='/stats' element ={<><NavBar /><StatsContainer /></>}/>
                            <Route path ='/search/:string' element ={<><NavBar /><SearchResultsContainer /></>}/>
                            <Route path ='/game/:game' element ={<><NavBar /><GameDetailContainer /></>}/>
                            <Route path ='/error' element ={<ErrorContainer />}/>
                        </Routes>
                        </ AuthWrapper>
                    </div>
                </BrowserRouter>
            </FirestoreProvider>
        </AuthProvider>
    );
}

export default App;
