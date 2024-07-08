import { useEffect, useState } from 'react';
import axios from 'axios';

const LoginPageOkta = () => {
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');

    useEffect(() => {
        axios({
            method: 'GET',
            url: 'http://localhost:3000/whoami',
            withCredentials: true
        })
            .then(response => {
                if (response.data.user && response.data.user.email) {
                    setEmail(response.data.user.email);
                    setLoading(false);
                } else {
                    redirectToLogin();
                }
            })
            .catch(error => {
                console.error(error);
                redirectToLogin();
            });
    }, []);

    const redirectToLogin = () => {
        window.location.replace('http://localhost:3000/login');
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <p>Hello {email}!</p>
        </div>
    );
}

export default LoginPageOkta;
