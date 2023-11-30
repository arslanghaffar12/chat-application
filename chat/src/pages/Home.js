import React, { useState, useEffect, useRef } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Card, CardBody, CardFooter, CardHeader, Col, Row } from 'reactstrap'
import "../css/chat.css"
import brand from "../assets/img/download.png"
import { getChatByConversationId, getConservationByUser, getByCvnIdsRequest, postMessageRequest } from '../helpers/request'
import { useDispatch, useSelector } from 'react-redux'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Bell, MoreVertical, Smile, Send } from 'react-feather'
import useAutosizeTextArea from '../hooks/useAutoSizeTextArea'
import io from "socket.io-client"


export default function Home() {


  const [currentChat, setCurrentChat] = useState({ messages: [], userDetails: {} });
  console.log('currentChat',currentChat);

  const [isScrolled, setIsScrolled] = useState(false);
  const user = useSelector(state => state.auth.user);
  const [allChats, setAllChats] = useState([])
  console.log('allChats', allChats);
  const [message, setMessage] = useState()
  const textAreaRef = useRef()
  useAutosizeTextArea(textAreaRef.current, message)
  const dispatch = useDispatch()

  const fetchConservationIds = async () => {

    const response = await getConservationByUser({ _id: user._id, dispatch });

    if (response.status) {
      const payload = {
        data: {
          cnv_ids: response.data.map((item) => { return item._id }),
          user_id: user._id
        }
      }
      const _allChats = await getByCvnIdsRequest(payload);
      if (_allChats.status) {
        setAllChats(_allChats.data)
      }
    }

  }

  const handleChange = (evt) => {
    const val = evt.target?.value;

    setMessage(val);
  };


  const socket = io("http://localhost:4200");


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











  useEffect(() => {
    const handleScroll = () => {
      const dataListingDiv = document.getElementById('style-3');
      if (dataListingDiv) {
        const scrollY = dataListingDiv.scrollTop;
        const threshold = 1; // You can adjust this threshold as needed

        // Check if the scroll position is beyond the threshold
        setIsScrolled(scrollY > threshold);
      }
    };

    // Attach the scroll event listener to the data listing div
    const dataListingDiv = document.getElementById('style-3');
    if (dataListingDiv) {
      dataListingDiv.addEventListener('scroll', handleScroll);
    }



    // Cleanup the event listener on component unmount
    return () => {
      if (dataListingDiv) {
        dataListingDiv.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);


  useEffect(() => {
    fetchConservationIds()
  }, [])

  useEffect(() => {
    if (currentChat) {
      socket.emit("joinRoom", { conversationId: currentChat.conversationId, user: user });


    }

  }, [currentChat])


  useEffect(() => {
   

    socket.on("message", (message) => {
      console.log('message is recieing',message);
      let _currentChat = {...currentChat};
      _currentChat.messages = [..._currentChat.messages, message];
      setCurrentChat(_currentChat);
    })




    return () => {
      socket.disconnect(); // Disconnect when the component unmounts
    };

  }, [])









  return (
    <div className='m-3'>
      <h1 className="heading">Chat</h1>
      <span className='primary-text'>Dashboard.chat</span>
      <Row className='p-0 m-0 my-4' >
        <Col md={4} className='p-0 m-0'>

          <Card className='chat-card w-98 border-0'>
            <div className={`mx-3 mt-3 d-flex`}>
              <ChevronDown size={14} />
              <h3 className='my-chat mx-2'>My chats</h3>

              <span className='my-chat' style={{ marginLeft: "auto" }}>{allChats.length}</span>



            </div>

            <div className={`m-3 ${isScrolled ? 'scrolled' : ''}`} id="style-3" style={{ width: "100%", overflowY: "auto", cursor: "pointer" }}>
              {allChats?.map((item, ind) => (
                <div key={ind} className='d-flex align-items-center border-bottom py-2' onClick={() => setCurrentChat(item)}>
                  <img src={item.userDetails.image} alt={item.name} style={{ width: '50px', height: '50px' }} className="rounded-circle me-3" />
                  <div className='d-flex flex-column'>
                    <h4 className='user-name'>{item.userDetails.name}</h4>
                  </div>
                </div>
              ))}
            </div>



          </Card>
        </Col>
        <Col md={8} className='p-0 m-0'>

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
        </Col>
      </Row>


    </div>
  )
}
