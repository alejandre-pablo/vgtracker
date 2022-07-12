import React, { useState } from 'react';
import { Form, Row, FloatingLabel, Button } from 'react-bootstrap';
import { FcGoogle } from 'react-icons/fc'
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, signInWithRedirect, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { AuthProvider, useFirebaseApp} from 'reactfire';

const SignupContainer = () => {

    const navigate = useNavigate();
    const app = useFirebaseApp();
    const auth = getAuth(app);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [passwordMatch, setPasswordMatch] = useState('')
    const [username, setUsername] = useState('')

    const [errors, setErrors] = useState({});


    const validate = () => {
        let errors = {}

        let emailRegEx = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        let passRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm

        if(!emailRegEx.test(email)) {
            errors.email = "Enter a valid email"
        }

        if(!passRegEx.test(password)) {
            errors.password = "Password must be 8 characters long and contain at least a lowercase and uppercase letter and a number"
        }

        if(passwordMatch !== password) {
            errors.match = "Passwords don't match"
        }

        return errors
    }

    const emailAndPasswordHandler = async(e) => {
        e.preventDefault();

        const err = validate();
        if ( Object.keys(err).length > 0 ) {
            setErrors(err)
        } else {
            await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
                debugger
                updateProfile(auth.currentUser, {displayName : username}).then(() => {
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

    const googleSignupHandler = async() => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithRedirect(auth, provider).then(navigate('/', {replace: true}));
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
                Powered by <a href='https://rawg.io/'>RAWG.io</a>
                </div>
            </div>
            <Form className= 'authForm' onSubmit={emailAndPasswordHandler}>
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
                    <FloatingLabel
                    controlId='passwordLabel'
                    label='Password'
                    className='formLabel'
                    >   
                        <Form.Control required autoComplete="on" type='password' className="inputText" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} isInvalid={!!errors.password}/>
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className='mb-3'>
                    <FloatingLabel
                    controlId='passwordMatchLabel'
                    label='Repeat Password'
                    className='formLabel'
                    >   
                        <Form.Control required autoComplete="on" type='password' className="inputText" placeholder='Repeat Password' value={passwordMatch} onChange={e => setPasswordMatch(e.target.value)} isInvalid={!!errors.match} />
                        <Form.Control.Feedback type="invalid">{errors.match}</Form.Control.Feedback>
                    </FloatingLabel>
                </Form.Group>
                <Button type='submit' className='authFormSubmitButton'> Sign Up </Button>
                <Form.Label className='authFormText'> OR SIGN IN USING </Form.Label>
                <button className='authFormProviderButton' onClick={googleSignupHandler}> 
                    <FcGoogle/> <span> GOOGLE </span>
                </button>
                </Row>
            </Form>
        </AuthProvider>
    )
}

export default SignupContainer