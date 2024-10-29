import React, { useEffect, useState } from 'react';
import { Form, Row, FloatingLabel, Button, InputGroup } from 'react-bootstrap';
import { FcGoogle } from 'react-icons/fc'
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, updateProfile, signInWithPopup } from 'firebase/auth';
import { AuthProvider, useFirebaseApp, useFirestore, useStorage} from 'reactfire';
import { BiHide, BiShow } from 'react-icons/bi';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const { version } = require('../../../package.json');

//Populate the error array based on RegEx for each input field
const validate = (email, password, passwordMatch) => {
    let errorArray = {}

    let emailRegEx = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    let passRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm

    if(!emailRegEx.test(email) && email !== '') {
        errorArray.email = "Please provide a valid email"
    }

    if(!passRegEx.test(password) && password !== '') {
        errorArray.password = "Password must be 8 characters long and contain at least a lowercase and uppercase letter and a number"
    }

    if(passwordMatch !== password && passwordMatch !== '') {
        errorArray.match = "Passwords don't match"
    }
    return errorArray
}

const SignupContainer = () => {

    const navigate = useNavigate();
    const app = useFirebaseApp();
    const firestore = useFirestore();
    const auth = getAuth(app);
    const storage = useStorage();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState('');
    const [username, setUsername] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordMatch, setShowPasswordMatch] = useState(false);

    const [errors, setErrors] = useState({});

    //Handler for Sign Up using email and password as auth
    const emailAndPasswordHandler = async(e) => {
        e.preventDefault();

        if (Object.keys(errors).length === 0) {
            await createUserWithEmailAndPassword(auth, email, password).then(() => {
                //Update current user with input from form
                updateProfile(auth.currentUser, {displayName : username}).then(() => {
                    //Create empty list on session
                    sessionStorage.setItem('games', []);
                    //Create user profile using the data from the provider
                    setDoc(doc(firestore, 'profiles', auth.currentUser.uid), {username: username, name: '', surname: '', picture: ''});
                    navigate('/', {replace: true});
                })
                .catch((error) => {

                }) 
              })
              .catch((error) => {
                // ..
              });
        }
    }

    //Handler for Sign Up using Google as auth provided
    const googleSignupHandler = async() => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider).then( () => {
                //Create empty list on session
                sessionStorage.setItem('games', []);
                //Get the current user
                const user = auth.currentUser;
                //Create a ref to the storage location for the user profile picture
                const imageRef = ref(storage, `images/${user.uid}`);
                //Store the blob for the Google provided photo.
                fetch(user.photoURL)
                .then(response => response.blob())
                .then(blob => { 
                    uploadBytes(imageRef, blob).then(() => {
                        getDownloadURL(imageRef).then((imageURL) => {
                            updateProfile(user, {photoURL: imageURL})
                            .catch(function(error) { 
                                console.log(error) 
                        });
                    })
                })
                    
                 })
                //Create user profile using the data from the provider
                setDoc(doc(firestore, 'profiles', user.uid), {username: user.displayName, name: '', surname: '', picture: user.photoURL});
                navigate('/', {replace: true})
            });
        } catch (error) {
            console.log(error)
        }
        
    }

    //Delay call to validate() on input change, waits for user to stop typing for 1 second
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const err = validate(email, password, passwordMatch);
            setErrors(err)
        }, 1000)

        return () => clearTimeout(delayDebounceFn)
        
    }, [email, password, passwordMatch]);

    return (
        <AuthProvider sdk={auth}>
            <div className='appTitleWrapper'>
                <h1 className='appTitle'> 
                    VGTracker 
                </h1>
                <div className='appTitleSubheader'>
                    v{version} Powered by <a href='https://rawg.io/'>RAWG.io</a>
                </div>
            </div>
            <div className= 'authForm'>
                <Form  onSubmit={emailAndPasswordHandler}>
                    <Row className='formGroup'>
                    <ul className='authNavbar'>
                        <Link to ={'/login'} className={'authNavItem'}>
                            <li>LOG IN</li>
                        </Link>
                        <span className='authNavbarSeparator'> | </span>
                        <Link to ={'/signup'} className={'authNavItem activeItem'}>
                            <li>SIGN UP</li>
                        </Link>
                    </ul>
                    <Form.Group className='mb-3'>
                        <FloatingLabel
                        controlId='usernameLabel'
                        label='Username'
                        className='formLabel'
                        >   
                            <Form.Control type='text' className="inputText" placeholder='Username' value={username} onChange={e => setUsername(e.target.value)} />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <FloatingLabel
                        controlId='emailLabel'
                        label='Email'
                        className='formLabel'
                        >   
                            <Form.Control required type='text' className="inputText" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} isInvalid={!!errors.email}/>
                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <InputGroup>
                            <FloatingLabel
                            controlId='passwordLabel'
                            label='Password'
                            className='formLabel'
                            >   
                                <Form.Control required autoComplete="on" type={showPassword ? 'text' : 'password'} className="inputText" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} isInvalid={!!errors.password}/>
                                <Form.Control.Feedback type="invalid" >{errors.password}</Form.Control.Feedback>
                            </FloatingLabel>
                            {!errors.password ? <InputGroup.Text className="inputButton" onClick={() => setShowPassword(!showPassword)}> {showPassword ? <BiShow/> : <BiHide/>} </InputGroup.Text> : <></>}   
                        </InputGroup>
                            
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <InputGroup>
                            <FloatingLabel
                            controlId='passwordMatchLabel'
                            label='Repeat Password'
                            className='formLabel'
                            >   
                                <Form.Control required autoComplete="on" type={showPasswordMatch ? 'text' : 'password'} className="inputText" placeholder='Repeat Password' value={passwordMatch} onChange={e => setPasswordMatch(e.target.value)} isInvalid={!!errors.match} />
                                <Form.Control.Feedback type="invalid" >{errors.match}</Form.Control.Feedback>
                            </FloatingLabel>
                            {!errors.match ? <InputGroup.Text className="inputButton" onClick={() => setShowPasswordMatch(!setShowPasswordMatch)}> {showPasswordMatch ? <BiShow/> : <BiHide/>} </InputGroup.Text> : <></>}             
                        </InputGroup>
                    </Form.Group>
                    <Button type='submit' className='authFormSubmitButton'> Sign Up </Button>
                    <Form.Label className='authFormText'> </Form.Label>
                    </Row>
                </Form>
                <button className='authFormProviderButton' onClick={googleSignupHandler}> 
                    <FcGoogle/> 
                    <span className='bigSpanAuthFormProviderButton'> Sign In Using Google </span>
                    <span className='reducedSpanAuthFormProviderButton'> Google </span>
                </button>
            </div>
        </AuthProvider>
    )
}

export default SignupContainer