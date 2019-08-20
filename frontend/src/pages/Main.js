import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';
import api from '../services/api';
import uuid from 'uuid/v4';
import './Main.css';
import { from, Observable } from 'rxjs';
import { count, map, filter, find } from 'rxjs/operators';
import logoutImg from '../assets/logout.svg';

const myId = uuid();
const socket = io('http://localhost:3333');

export default function Main({ match , history }) {

    const [users, setUsers] = useState([]);

    var [messages, setMessages] = useState([]);
    var [message, setMessage] = useState('');

    const [loggedUsers, setLoggedUsers] = useState([]);
    const [usersOnline, setUsersOnline] = useState(1);

    /*
    const observer = Observable.create((observer) => {
        
        console.log("Iniciando o Observable");
        setInterval(() => observer.next(), 1000);
        
        //const interval = setInterval(() => observer.next(), 1000);
        //setTimeout(() => observer.complete(), 5000);
        //return () => clearInterval(interval);
    });

    const subscriber = observer.subscribe(() => {
        console.log("observer");
        console.log(loggedUsers.length)

        socket.on('logUsers', data => {
            //Operador Count
            from(data).pipe(
                count()
            ).subscribe(setUsersOnline);
        });

    });

    setTimeout(() => {
        subscriber.unsubscribe();
    }, 1000);
    */

    useEffect(() => {

        console.log('id', socket.id);
        async function loadCurrentUser() {
            const response = await api.get('/devs', {
                headers: {
                    user: match.params.id,
                }
            });

            setUsers(response.data);
        }

        
        loadCurrentUser();

        socket.on('onlineUsers', data => {

            // find operator
            const isLogged = from(data).pipe(
                find( user => user == match.params.id )
            );

            isLogged.subscribe(isLogged =>
                !isLogged && history.push('/')
            );
        });
        
    },[match.params.id]);

    useEffect(() => {
        const handleNewMessage = newMessage =>
            setMessages([...messages, newMessage]);

        socket.on('sendMessage', handleNewMessage);
        return () => socket.off('sendMessage', handleNewMessage);
    }, [messages]);

    useEffect(() => {

        socket.on('logUsers', data => {
            console.log('data', data);

            from(data).pipe(
                count()
            ).subscribe(setUsersOnline);

            setLoggedUsers(data);
        });

        socket.on('logoutUsers', data => {
            console.log('logout');
            console.log(data.length);
            from(data).pipe(
                count()
            ).subscribe(setUsersOnline);
 
        });
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        
        if(message.trim()) {
            socket.emit('sendMessage', {
                id: myId,
                author: users[0].user,
                message
            })
            setMessage('');
        }
    }

    function handleLogout(event) {
        event.preventDefault();

        const socket = io('http://localhost:3333');

        console.log('LOGOUT');
        
        socket.emit('logout', users[0]._id);
        console.log(users);

        history.push('/');

        // <form onSubmit={handleLogout}>
        //         <button type="submit">logout</button>                
        //     </form>
    }

    return(

        <div className="main-container">

            <div className="header">
                <div></div>
                <div className="onlineUsersCounter">
                    <p>usuários online: {usersOnline} </p>
                </div>
                <form className="logoutButton"onSubmit={handleLogout}>
                    <button className="logout" type="submit" on>
                        <img src={logoutImg} alt="logout" />
                    </button>
                </form>
            </div>

            
            <form id="chat" onSubmit={handleSubmit}>
                <div className="messages">
                    { messages.length > 0 &&
                    <ul>
                        {messages.map(msg => (
                            <li key={msg.id}>
                                <strong>{msg.author}</strong>
                                <p>{msg.message}</p>
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