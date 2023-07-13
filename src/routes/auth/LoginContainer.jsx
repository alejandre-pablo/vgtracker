import React from 'react';
import { useState } from 'react';
import { Form, Row, FloatingLabel, Button, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { BiShow, BiHide } from 'react-icons/bi';
import { getAuth, getRedirectResult, GoogleAuthProvider, signInWithEmailAndPassword, signInWithRedirect } from 'firebase/auth';
import { AuthProvider, useFirebaseApp} from 'reactfire';
import { useEffect } from 'react';

const { version } = require('../../../package.json');

//Populate the error array based on RegEx for each input field
const validate = (email) => {
    let errorArray = {}

    let emailRegEx = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

    if(!emailRegEx.test(email) && email !== '') {
        errorArray.email = "Please provide a valid email"
    }

    return errorArray
}

const LoginContainer = () => {

    const navigate = useNavigate();
    const app = useFirebaseApp();
    const auth = getAuth(app);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [errors, setErrors] = useState({});

    //Handler for login using email and password as auth
    const emailAndPasswordHandler = async(e) => {
        e.preventDefault();

        if (Object.keys(errors).length === 0) {
            await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
                navigate('/', {replace: true})
                //Temp Fix to "Insufficent Permissions Reactfire bug, issue #228 on Github @FirebaseExtended/reactfire"
                window.location.reload();
              })
              .catch((error) => {
                //Manage invalid credentials
                setErrors({password: 'Incorrect password'})
              });
        }
    }

    //Handler for Login using Google as auth provided
    const googleLoginHandler = async() => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithRedirect(auth, provider).then(
                getRedirectResult(auth).then(() => {
                    navigate('/', {replace: true});
                })
            )  
        } catch (error) {
            console.log(error)
        }
    }
    

    //Delayed call to validate() on input change, waits for user to stop typing for 1 second
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const err = validate(email);
            setErrors(err)
        }, 1000)

        return () => clearTimeout(delayDebounceFn)
        
    }, [email, password]);

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
                        <InputGroup>
                            <FloatingLabel
                            controlId='passwordLabel'
                            label='Password'
                            className='formLabel'
                            >   
                                <Form.Control required autoComplete="on" type={showPassword ? 'text' : 'password'} className="inputText" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} isInvalid={!!errors.password}/>
                                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                            </FloatingLabel>
                            {!errors.password ? <InputGroup.Text className="inputButton" onClick={() => setShowPassword(!showPassword)}> {showPassword ? <BiShow/> : <BiHide/>} </InputGroup.Text> : <></>}     
                        </InputGroup>
                            
                        
                    </Form.Group>
                    <Button type='submit' className='authFormSubmitButton'> Login </Button>
                    <Form.Label className='authFormText'>  </Form.Label>
                    </Row>
                </Form>
                <button className='authFormProviderButton' onClick={googleLoginHandler}> 
                    <FcGoogle/> 
                    <span className='bigSpanAuthFormProviderButton'> Sign In Using Google </span>
                    <span className='reducedSpanAuthFormProviderButton'> Google </span>
                </button>
            </div>
        </AuthProvider>
    )
}

export default LoginContainer