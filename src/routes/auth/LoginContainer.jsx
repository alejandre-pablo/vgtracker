import React from 'react';
import { useState } from 'react';
import { Form, Row, FloatingLabel, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { getAuth, getRedirectResult, GoogleAuthProvider, signInWithEmailAndPassword, signInWithRedirect } from 'firebase/auth';
import { AuthProvider, useFirebaseApp} from 'reactfire';

const LoginContainer = () => {

    const navigate = useNavigate();
    const app = useFirebaseApp();
    const auth = getAuth(app);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState({});


    const validate = () => {
        let errors = {}

        let emailRegEx = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

        if(!emailRegEx.test(email)) {
            errors.email = "Enter a valid email"
        }

        return errors
    }

    const emailAndPasswordHandler = async(e) => {
        e.preventDefault();

        const err = validate();
        if ( Object.keys(err).length > 0 ) {
            setErrors(err)
        } else {
            await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
                navigate('/', {replace: true})
              })
              .catch((error) => {
                // ..
              });
        }
    }

    const googleLoginHandler = async() => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithRedirect(auth, provider).then(
                getRedirectResult(auth).then((result) => {
                    navigate('/', {replace: true});
                })
            )
                
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AuthProvider sdk={auth}>
            <div className='appTitleWrapper'>
                <h1 className='appTitle'> 
                    VGTracker 
                </h1>
                <div className='appTitleSubheader'>
                    v0.3 Powered by <a href='https://rawg.io/'>RAWG.io</a>
                </div>
            </div>
            <div className= 'authForm'>
                <Form onSubmit={emailAndPasswordHandler}>
                    <Row className='formGroup'>
                    <ul className='authNavbar'>
                        <Link to ={'/login'} className={'authNavItem activeItem'}>
                            <li>LOG IN</li>
                        </Link>
                        <span className='authNavbarSeparator'> | </span>
                        <Link to ={'/signup'} className={'authNavItem'}>
                            <li>SIGN UP</li>
                        </Link>
                    </ul>
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
                        <FloatingLabel
                        controlId='passwordLabel'
                        label='Password'
                        className='formLabel'
                        >   
                            <Form.Control required autoComplete="on" type='password' className="inputText" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} isInvalid={!!errors.password}/>
                            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                        </FloatingLabel>
                    </Form.Group>
                    <Button type='submit' className='authFormSubmitButton'> Login </Button>
                    <Form.Label className='authFormText'>  </Form.Label>
                    <button className='authFormProviderButton' onClick={googleLoginHandler}> 
                        <FcGoogle/> 
                        <span className='bigSpanAuthFormProviderButton'> Sign In Using Google </span>
                        <span className='reducedSpanAuthFormProviderButton'> Google </span>
                    </button>
                    </Row>
                </Form>
            </div>
        </AuthProvider>
    )
}

export default LoginContainer