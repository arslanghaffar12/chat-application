import React, { useState, useRef, useEffect } from 'react'
import "../css/chat.css"
import { Card, CardBody, CardFooter, CardHeader, Col, Row } from 'reactstrap'
import useAutosizeTextArea from '../hooks/useAutoSizeTextArea'
import { Bell, MoreVertical, Smile, Send } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import useChatScroll from '../hooks/useChatScroll'
import { getByCvnIdsRequest } from '../helpers/request'
import { setConversations } from '../redux/actions/chat'

export default function ChatBody({ socket, curCnv }) {

    const conversations = useSelector((state) => state.conversation.conversations);
    const dispatch = useDispatch()


    console.log('curCnv===', curCnv);
    let _member = {
        receiver: {},
        messages: [],
        conversationId: '',
        isTyping: { status: false, text: '' },
        unread: 0


    }
    const user = useSelector(state => state.auth.user);
    const [member, setMember] = useState(_member);
    console.log('member==', member);
    const [currentChat, setCurrentChat] = useState()
    console.log('currentChat===', currentChat);

    const chatBodyRef = useRef(member);

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
                conversationId: member.conversationId,
                content: message,
                senderId: user._id,
                senderName: user.name,
                recipientId: member.receiver._id,
                recipientName: member.receiver.name
            }
        };
        console.log('payload', payload.data);


        socket.emit('message', payload.data)
        setMessage()


    }

    const [isTyping, setIsTyping] = useState(false);
    console.log('isTyping===', isTyping);

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

        setMember(_member)



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

        if (curCnv && curCnv.members.length > 0) {

            fetchChat({ id: curCnv.conversationId, _curCnv: curCnv });

        }
        return () => {

        }


    }, [curCnv])


    useEffect(() => {
        chatBodyRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [member])


    useEffect(() => {


        socket.on('message', (message) => {

            console.log('message received', "member", member.conversationId, 'message', message.conversationId, member.conversationId === message.conversationId, message);

            if (member.conversationId === message.conversationId) {

                console.log('message received inside', member.conversationId === message.conversationId, message);
                setMember((prevMember) => {
                    const _member = { ...prevMember };
                    _member.messages = [..._member.messages, message];
                    return _member
                })
            }
            else {
                const index = conversations.findIndex(item => item.conversationId === message.conversationId);

                if (index !== -1) {
                    const updatedConversation = {
                        ...conversations[index],
                        sortedMessages: [...conversations[index].sortedMessages, message].sort((a, b) => a.timestamp - b.timestamp),
                    };
                    console.log('updatedConversation', updatedConversation);
                    const updatedConversations = [...conversations];
                    updatedConversations[index] = updatedConversation;
                    console.log('updatedConversations==',updatedConversations);
                    dispatch(setConversations(updatedConversations))

                }




            }







        })

        socket.on('isChatting', (message) => {

            if (member.conversationId === message.conversationId) {
                setMember((prevMember) => {
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
                            {member.isTyping.status && <p className='typing-indicator'>{member.isTyping.text}...</p>}
                        </div>
                    </Col>
                </Row>
            </CardHeader>
            <CardBody className='chat-container scrollbar p-2' id='style-3' >
                {member?.messages?.sort((a, b) => a.timestamp - b.timestamp).map((message, index) => (
                    <div
                        key={index}
                        className={(message.senderId === user._id) ? 'right-message mb-2' : 'left-message mb-2'}
                    >
                        <div className="message-content">{message.content}</div>
                    </div>
                ))}
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
