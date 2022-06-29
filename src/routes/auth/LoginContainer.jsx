import React from 'react';
import { useState } from 'react';
import { Form, Row, FloatingLabel, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
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

    const handleRegisterClick= e => {
        e.preventDefault();
        navigate('/signup', {})
    }

    const emailAndPasswordHandler = async(e) => {
        e.preventDefault();

        const err = validate();
        console.log(email,password)
        console.log(err)
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

    const googleLoginHandler = e => {

    }

    return (
        <AuthProvider sdk={auth}>
            <h1 className='appTitle'> VGTracker</h1>
            <Form className= 'loginForm' onSubmit={emailAndPasswordHandler}>
                <Row className='formGroup'>
                <Form.Label className='formHeader'> Login </Form.Label>
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
                <Button type='submit' className='loginButton'> Login </Button>
                <Form.Label className='formHeader'> ... using Google </Form.Label>
                <button className='loginButton' onClick={googleLoginHandler}> 
                    <FcGoogle/>
                </button>
                </Row>
            </Form>
            <button onClick={handleRegisterClick}> Register </button>
        </AuthProvider>
    )
}

export default LoginContainer