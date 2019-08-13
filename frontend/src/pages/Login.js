import React, { useState } from 'react';
import '../App.css';
import './Login.css';
import api from '../services/api';

export default function Login({ history }){
    
    const [username, setUsername] = useState('');
    
    async function handleSubmit(e){
        e.preventDefault();

        const response = await api.post('/devs', {
            username: username,
        });

        const { _id } = response.data;

        history.push(`/dev/${_id}`);
    }

    return(
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2>ChatHub</h2>
                <input
                    placeholder="Digite seu usuário no Github"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}