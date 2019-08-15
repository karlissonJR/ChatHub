import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';
import api from '../services/api';
import uuid from 'uuid/v4';
import './Main.css';
import { from, Observable } from 'rxjs';
import { count, map, filter } from 'rxjs/operators';

const myId = uuid();
const socket = io('http://localhost:3333');

export default function Main({ match , history}){

    const [users, setUsers] = useState([]);

    var [messages, setMessages] = useState([]);
    var [message, setMessage] = useState('');

    const [loggedUsers, setLoggedUsers] = useState([]);
    const [usersOnline, setUsersOnline] = useState(0);

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

    useEffect(() => {

        async function loadUsers(){
            const response = await api.get('/devs', {
                headers: {
                    user: match.params.id,
                }
            });

            setUsers(response.data);

            console.log(response.data);
        }

        loadUsers();
        
    },[match.params.id]);

    useEffect(() => {
        const handleNewMessage = newMessage =>
            setMessages([...messages, newMessage]);

        socket.on('sendMessage', handleNewMessage);
        return () => socket.off('sendMessage', handleNewMessage);
    }, [messages]);

    useEffect(() => {

        socket.on('logUsers', data => {

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

    async function handleSubmit(event){
        event.preventDefault();
        
        if(message.trim()){
            socket.emit('sendMessage', {
                id: myId,
                author: users[0].user,
                message
            })
            setMessage('');
        }
    }

    function handleLogout(event){
        event.preventDefault();

        const socket = io('http://localhost:3333');

        console.log('LOGOUT');
        
        socket.emit('logout', users[0]._id);

        history.push('/');

    }

    return(

        <div className="main-container">
            <form onSubmit={handleLogout}>
                <button type="submit">logout</button>                
            </form>

            <p>Usuarios {usersOnline}</p>
            
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