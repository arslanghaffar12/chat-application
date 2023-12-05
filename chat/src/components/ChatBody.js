import React, { useState, useRef, useEffect } from 'react'
import "../css/chat.css"
import { Card, CardBody, CardFooter, CardHeader, Col, Row } from 'reactstrap'
import useAutosizeTextArea from '../hooks/useAutoSizeTextArea'
import { Bell, MoreVertical, Smile, Send } from 'react-feather'
import { useSelector } from 'react-redux'
import useChatScroll from '../hooks/useChatScroll'

export default function ChatBody({ currentChat, socket }) {

    const user = useSelector(state => state.auth.user);
    const chatBodyRef = useRef(currentChat);

    const [message, setMessage] = useState()
    const textAreaRef = useRef()
    useAutosizeTextArea(textAreaRef.current, message)

    const handleChange = (evt) => {
        const val = evt.target?.value;

        setMessage(val);

    };

    const sendMessage = async () => {


        let payload = {
            data: {
                conversationId: currentChat.conversationId,
                content: message,
                senderId: user._id,
                senderName: user.name,
                recipientId: currentChat.userDetails._id,
                recipientName: currentChat.userDetails.name
            }
        };
        console.log('payload', payload.data);


        socket.emit('message', payload.data)


    }

    const [isTyping, setIsTyping] = useState(false);
    console.log('isTyping===', isTyping);

    const isChattingRequest = (_status) => {

        let payload = {
            data: {
                conversationId: currentChat.conversationId,
                content: message,
                senderId: user._id,
                senderName: user.name,
                recipientId: currentChat.userDetails._id,
                recipientName: currentChat.userDetails.name,
                isTyping: { text: `${user.name} is typing`, status: _status }
            }
        };

        socket.emit('isChatting', payload.data)
    }

    const handleFocus = () => {
        setIsTyping(true);
        isChattingRequest(true)




    };

    const handleBlur = () => {
        setIsTyping(false);
        isChattingRequest(false)

    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            // Call your function here
            event.preventDefault();
            sendMessage();
            setMessage('')
        }
    };

    const scrollToBottom = () => {
        console.log("chatBodyRef===", chatBodyRef.current)
        const el = document.getElementById('style-3');
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
        console.log('el===', el.scrollTop, el.scrollHeight);
        if (!chatBodyRef.current) return;

    };

    useEffect(() => {
        // Set a timer to consider someone still typing after a certain delay
        const typingTimeout = setTimeout(() => {
            setIsTyping(false);
            isChattingRequest(false)


        }, 2000); // Adjust the delay as needed

        isChattingRequest(true)

        // Clear the timer if the component unmounts or if the user continues typing
        return () => clearTimeout(typingTimeout);
    }, [message,]);

    useEffect(() => {
        scrollToBottom();

    }, [currentChat])


    return (
        <Card className='border-0 chat-card '>
            <CardHeader className='chat-header'>
                <Row>
                    <Col className='totalCenter'>
                        <img src={currentChat.userDetails.image} alt={currentChat.userDetails.name} style={{ width: '35px', height: '35px' }} className="rounded-circle me-3" />
                        {/* <h4 className='user-name' style={{ margin: "unset" }}>{currentChat.userDetails.name}</h4> */}
                        <div>
                            <h4 className='user-name' style={{ margin: "unset" }}>{currentChat.userDetails.name}</h4>
                            {currentChat.isTyping.status && <p className='typing-indicator'>{currentChat.isTyping.text}...</p>}
                        </div>
                    </Col>
                </Row>
            </CardHeader>
            <CardBody   className='chat-container scrollbar p-2' id='style-3' >
                    {currentChat.messages.sort((a, b) => a.timestamp - b.timestamp).map((message, index) => (
                        <div
                            key={index}
                            className={(message.senderId === user._id) ? 'right-message mb-2' : 'left-message mb-2'}
                        >
                            <div className="message-content">{message.content}</div>
                        </div>
                    ))}

            </CardBody>
            <CardFooter className='chat-footer totalCenter p-2'>
                <div style={{ width: '10%' }} className='totalCenter'>
                    <p className='margin-unset'>#</p>
                    <Smile size={14} color='#6f5cc4' className='mx-1' />
                </div>

                <textarea className='border-0 chat-input' placeholder='message'

                    ref={textAreaRef}
                    onChange={handleChange}
                    rows={1}
                    value={message}
                    // onFocus={handleFocus}
                    // onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                >
                </textarea >
                <div style={{ width: "10%" }}>
                    <Send size={16} color="#6f5cc4" onClick={sendMessage} style={{ cursor: 'pointer' }} />

                </div>


            </CardFooter>



        </Card>
    )
}
