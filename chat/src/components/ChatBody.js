import React, {useState,useRef} from 'react'
import "../css/chat.css"
import { Card, CardBody, CardFooter, CardHeader, Col, Row } from 'reactstrap'
import useAutosizeTextArea from '../hooks/useAutoSizeTextArea'
import { Bell, MoreVertical, Smile, Send } from 'react-feather'
import { useSelector } from 'react-redux'

export default function ChatBody({ currentChat ,socket}) {

    const user = useSelector(state => state.auth.user);

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

        // let response = await postMessageRequest(payload)
        // if (response.status) {
        //   let _currentChat = { ...currentChat };
        //   _currentChat.messages = [..._currentChat.messages, response.data];
        //   // setCurrentChat(_currentChat)
        // }

        // console.log('response of post message', response);




    }
    return (
        <Card className='border-0 chat-card '>
            <CardHeader className='chat-header'>
                <Row>
                    <Col md={3} className='totalCenter'>
                        <img src={currentChat.userDetails.image} alt={currentChat.userDetails.name} style={{ width: '35px', height: '35px' }} className="rounded-circle me-3" />
                        <h4 className='user-name' style={{ margin: "unset" }}>{currentChat.userDetails.name}</h4>

                    </Col>
                    <Col md={2} className=''>
                    </Col>
                </Row>
            </CardHeader>
            <CardBody className='chat-container p-2'>
                {currentChat.messages.sort((a, b) => a.timestamp - b.timestamp).map((message, index) => (
                    <div
                        key={index}
                        className={(message.senderId === user._id) ? 'right-message mb-2' : 'left-message mb-2'}
                    >
                        <div className="message-content">{message.content}</div>
                        {/* <div className="timestamp">{message.timestamp}</div> */}
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
                >
                </textarea >
                <div style={{ width: "10%" }}>
                    <Send size={16} color="#6f5cc4" onClick={sendMessage} style={{ cursor: 'pointer' }} />

                </div>


            </CardFooter>



        </Card>
    )
}
