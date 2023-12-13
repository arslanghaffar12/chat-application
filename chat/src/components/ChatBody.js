import React, { useState, useRef, useEffect } from 'react'
import "../css/chat.css"
import { Card, CardBody, CardFooter, CardHeader, Col, Row } from 'reactstrap'
import useAutosizeTextArea from '../hooks/useAutoSizeTextArea'
import { Bell, MoreVertical, Smile, Send } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import useChatScroll from '../hooks/useChatScroll'
import { getByCvnIdsRequest, updateStatusByConversationId } from '../helpers/request'
import { setConversations } from '../redux/actions/chat'
export default function ChatBody({ socket, curCnv, setStatusChange }) {

    const dispatch = useDispatch()
    const chatboxRef = useRef(null);

    const [viewedMessages, setViewedMessages] = useState([]);

    let _member = {
        receiver: {},
        messages: [],
        conversationId: '',
        isTyping: { status: false, text: '' },
        unread: 0


    }
    const user = useSelector(state => state.auth.user);
    const [member, setMember] = useState(_member);
    const [newMessages, setNewMessages] = useState(_member)
    const memberRef = useRef(newMessages);

    const [currentChat, setCurrentChat] = useState()

    const chatBodyRef = useRef(member);

    const [message, setMessage] = useState()
    console.log('message type is', message);
    const textAreaRef = useRef()
    useAutosizeTextArea(textAreaRef.current, message)

    const handleChange = (evt) => {
        const val = evt.target?.value;
        console.log('handleChange is running');
        setMessage(val);

    };

    const sendMessage = async () => {


        let payload = {
            data: {
                conversationId: member.conversationId,
                content: message,
                senderId: user._id,
                senderName: user.name,
                recipientId: member.receiver._id,
                recipientName: member.receiver.name,
                socket: socket.id,
                status: 'sent'

            }
        };


        socket.emit('message', payload.data)
        setMessage('')


    }

    const [isTyping, setIsTyping] = useState(false);

    const isChattingRequest = (_status) => {

        let payload = {
            data: {
                conversationId: member.conversationId,
                content: message,
                senderId: user._id,
                senderName: user.name,
                recipientId: member.receiver._id,
                recipientName: member.receiver.name,
                isTyping: { text: `${user.name} is typing`, status: _status }
            }
        };

        socket.emit('isChatting', payload.data)
    }


    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            // Call your function here
            event.preventDefault();
            sendMessage();
            setMessage('')
        }
    };

    const fetchChat = async ({ id, _curCnv }) => {
        let payload = {
            data: {
                cnv_ids: [id],
            }

        }

        let chat = await getByCvnIdsRequest(payload);
        let _member = { ..._curCnv, receiver: _curCnv.members[0], }

        if (chat.status) {
            _member = { ..._member, messages: chat.data.length > 0 ? chat.data[0].messages : [] }
        }

        setMember(_member);
        setNewMessages({ ..._member, messages: [] })

        if (_member.unreads.length > 0) {
            let response = await updateStatusByConversationId({ _id: id });
            if (response.status) {
                setStatusChange(id)
            }
        }



    }

    const updateStatus = (message) => {
        console.log('message in update', message);
        if (message.status !== 'read' && message.senderId !== user._id) {
            console.log('this message is not read yet', message.content);
            socket.emit('update-message', { ...message, status: "read" })
        }
    }



    useEffect(() => {
        // Set a timer to consider someone still typing after a certain delay

        if (typeof member !== undefined && member && member.receiver) {
            const typingTimeout = setTimeout(() => {
                setIsTyping(false);
                isChattingRequest(false)


            }, 2000); // Adjust the delay as needed

            isChattingRequest(true)

            return () => clearTimeout(typingTimeout);

        }


    }, [message]);




    useEffect(() => {
        const fetchAndHandleChat = async () => {
            if (curCnv && curCnv.members.length > 0) {
                await fetchChat({ id: curCnv.conversationId, _curCnv: curCnv });
            }
        };

        // Fetch chat data when curCnv changes
        fetchAndHandleChat();


    }, [curCnv]); // Re-run when curCnv changes


    useEffect(() => {

        chatBodyRef.current?.scrollIntoView({ behavior: 'smooth' });
        memberRef.current = newMessages;


    }, [member, newMessages])


    useEffect(() => {



        socket.on('message', (message) => {
            let member = memberRef.current;


            if (member.conversationId === message.conversationId) {

                // setNewMessages((prevMember) => {
                //     const newMessages = [...prevMember, message];
                //     // _member.messages = [..._member.messages, message];
                //     return newMessages
                // })
                setNewMessages((prevMember) => {
                    const _member = { ...prevMember };
                    _member.messages = [..._member.messages, message];
                    return _member
                })

                updateStatus(message)
            }
            else {


            }

        })

        socket.on('isChatting', (message) => {
            let member = memberRef.current;

            console.log('isChatting is recieving', message);
            if (member.conversationId === message.conversationId) {
                setNewMessages((prevMember) => {
                    const _member = { ...prevMember };
                    _member.isTyping = message.isTyping;
                    return _member
                })

            }

        })





    }, [socket])


    return (
        <Card className='border-0 chat-card '>
            <CardHeader className='chat-header'>
                <Row>
                    <Col className='totalCenter'>
                        <img src={member.receiver.image} alt={member.receiver.name} style={{ width: '35px', height: '35px' }} className="rounded-circle me-3" />
                        <div>
                            <h4 className='user-name' style={{ margin: "unset" }}>{member.receiver.name}</h4>
                            {newMessages.isTyping.status && <p className='typing-indicator'>{newMessages.isTyping.text}...</p>}
                        </div>
                    </Col>
                </Row>
            </CardHeader>
            <CardBody className='chat-container scrollbar p-2 chatbox' id='style-3' >
                {member?.messages?.sort((a, b) => a.timestamp - b.timestamp).map((message, index) => {

                    let status = message.status;
                    console.log('status of message in old', status);
                    return (
                        <div
                            key={index}
                            id={message._id}
                            data-index={index}
                            className={(message.senderId === user._id) ? 'right-message mb-2' : 'left-message mb-2'}
                        >
                            <div className="message-content">{message.content}</div>
                        </div>
                    )



                })}

                {newMessages?.messages?.sort((a, b) => a.timestamp - b.timestamp).map((message, index) => {

                    let status = message.status;
                    console.log('status of message in new', status, message.content);
                    return (
                        <div
                            key={index}
                            id={message._id}
                            data-index={index}
                            className={(message.senderId === user._id) ? 'right-message mb-2' : 'left-message mb-2'}
                        >
                            <div className="message-content">{message.content}</div>
                        </div>
                    )



                })}

                <div ref={chatBodyRef}></div>

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
                    // onKeyDown={handleChange}
                    // onKeyUp={handleChange}
                    // onFocus={handleChange}
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
