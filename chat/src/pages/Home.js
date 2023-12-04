import React, { useState, useEffect, useRef, useContext } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Card, CardBody, CardFooter, CardHeader, Col, Row } from 'reactstrap'
import "../css/chat.css"
import brand from "../assets/img/download.png"
import { getChatByConversationId, getConservationByUser, getByCvnIdsRequest, postMessageRequest } from '../helpers/request'
import { useDispatch, useSelector } from 'react-redux'
import { useLocalStorage } from '../hooks/useLocalStorage'
import useAutosizeTextArea from '../hooks/useAutoSizeTextArea'
import io from "socket.io-client"
import { SocketContext } from '../SocketContext'
import ChatBody from '../components/ChatBody'


export default function Home() {


  const [currentChat, setCurrentChat] = useState({ messages: [], userDetails: {} });
  const currentChatRef = useRef(currentChat);
  console.log('currentChatRef==', currentChatRef);
  const [cnv_id, setCnv_id] = useState('')
  console.log('currentChat', currentChat);
  const socket = useContext(SocketContext);
  console.log('socket in home', socket);
  const [isScrolled, setIsScrolled] = useState(false);
  const user = useSelector(state => state.auth.user);
  const [allChats, setAllChats] = useState([])
  console.log('allChats', allChats);

  const dispatch = useDispatch()
  const [currentRoom, setCurrentRoom] = useState();



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


  const handleChatClick = (item) => {
    setCnv_id(item.conversationId);
    setCurrentChat(item)
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
    if (cnv_id) {
      socket.emit("joinRoom", { conversationId: currentChat.conversationId, user: user });


    }

  }, [cnv_id])

  let count = 1;

  // useEffect(() => {

  //   if (currentChat) {
  //     console.log('count is==========', ++count);
  //     currentChatRef.current = currentChat;
  //   }

  // }, [currentChat])

  console.log('current room usetstae is===', currentRoom);

  useEffect(() => {


    socket.on('message', (message) => {
      console.log('message is recieing', message);
 
      setCurrentChat((prevChat) => {
        const updatedChat = { ...prevChat };
        updatedChat.messages = [...prevChat.messages, message];
        return updatedChat;
      });

    })

  }, [socket])

































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
                <div key={ind} className='d-flex align-items-center border-bottom py-2' onClick={() => handleChatClick(item)}>
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
          <ChatBody currentChat={currentChat} socket={socket} />


        </Col>
      </Row>


    </div>
  )
}
