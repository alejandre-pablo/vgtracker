import React, { useState } from 'react';
import { Form, Row, FloatingLabel, Button } from 'react-bootstrap';
import { FcGoogle } from 'react-icons/fc'
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
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
        console.log(email,password,passwordMatch)
        console.log(err)
        if ( Object.keys(err).length > 0 ) {
            setErrors(err)
        } else {
            await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
                navigate('/login', {replace: true});
              })
              .catch((error) => {
                // ..
              });
        }
    }

    const googleSignupHandler = e => {

    }

    const handleLoginClick= e => {
        e.preventDefault();
        navigate('/login', {})
    }

    return (
        <AuthProvider sdk={auth}>
            <h1 className='appTitle'> VGTracker</h1>
            <Form className= 'signupForm' onSubmit={emailAndPasswordHandler}>
                <Row className='formGroup'>
                <Form.Label className='formHeader'> Sign Up </Form.Label>
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
                        <Form.Control required type='password' className="inputText" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} isInvalid={!!errors.password}/>
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className='mb-3'>
                    <FloatingLabel
                    controlId='passwordMatchLabel'
                    label='Repeat Password'
                    className='formLabel'
                    >   
                        <Form.Control required type='password' className="inputText" placeholder='Repeat Password' value={passwordMatch} onChange={e => setPasswordMatch(e.target.value)} isInvalid={!!errors.match} />
                        <Form.Control.Feedback type="invalid">{errors.match}</Form.Control.Feedback>
                    </FloatingLabel>
                </Form.Group>
                <Button type='submit' className='loginButton'> Sign Up </Button>
                <Form.Label className='formHeader'> ... using Google </Form.Label>
                <button className='loginButton' onClick={googleSignupHandler}> 
                    <FcGoogle/>
                </button>
                </Row>
            </Form>
            <button onClick={handleLoginClick}> Already registered? Log in </button>
        </AuthProvider>
    )
}

export default SignupContainer