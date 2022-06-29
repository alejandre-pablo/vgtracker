import React, {Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { FirebaseAppProvider } from 'reactfire';
import firebaseConfig from './firebaseConfig';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <FirebaseAppProvider firebaseConfig={ firebaseConfig }>
        <Suspense fallback={ 'Initializing...' }>
            <App />
        </Suspense>
        
    </FirebaseAppProvider>
);

