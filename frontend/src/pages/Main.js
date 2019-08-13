import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Main.css';

export default function Main({ match , history}){

    var [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);

    var [message, setMessage] = useState('');

    useEffect(() => {
        async function loadUsers(){
            const response = await api.get('/devs', {
                headers: {
                    user: match.params.id,
                }
            });

            setUsers(response.data);

            console.log(response.data)
        }

        loadUsers();
    },[match.params.id]);

    useEffect(() => {
        async function loadMessages(){
            const response = await api.get('/message', {
                headers: {
                    author: match.params.id,
                }
            });

            setMessages(response.data);
            console.log(response.data);
        }

        loadMessages();
    }, [match.params.id]);

    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: { user: match.params.id }
        });

        socket.on('receivedMesage', async function(message){

            const response = await api.get('/message', {
                headers: {
                    author: match.params.id,
                }
            });

            setMessages(response.data);
        });
    }, [match.params.id]);

    async function handleSubmit(event){
        event.preventDefault();
        
        const socket = io('http://localhost:3333');
        
        const response = await api.post('/message', {
            author: users[0].user,
            text: message
        });
        
        const { _id } = response.data;

        history.push(`/message/${_id}`);

        const response2 = await api.post('/devs', {
            username: users[0].user,
        });

        history.push(`/dev/${response2.data._id}`);

        socket.emit('sendMessage', response.data);
    }

    return(

        <div className="main-container">
            <Link to="/">
                <p>logout</p>
            </Link>

            <form id="chat" onSubmit={handleSubmit}>
                <div className="messages">
                    { messages.length > 0 &&
                    <ul>
                        {messages.map(msg => (
                            <li key={msg._id}>
                                <strong>{msg.author}</strong>
                                <p>{msg.text}</p>
                            </li>
                        ))}
                    </ul>
                    }
                </div>

                <input
                    type="text"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="digite sua mensagem"
                    
                />

                <button type="submit">Enviar</button>
                
            </form>
                
        </div>
    );
}