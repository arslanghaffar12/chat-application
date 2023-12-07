import React, { useState, useEffect, useRef, useContext } from 'react'
import { ChevronDown, ChevronUp, FolderPlus, MoreVertical, Plus } from 'react-feather'
import { Card, CardBody, CardFooter, CardHeader, Col, Row } from 'reactstrap'
import "../css/chat.css"
import brand from "../assets/img/download.png"
import { getChatByConversationId, getConservationByUser, getByCvnIdsRequest, postMessageRequest, usersRequest, conversationIdRequest } from '../helpers/request'
import { useDispatch, useSelector } from 'react-redux'
import { useLocalStorage } from '../hooks/useLocalStorage'
import useAutosizeTextArea from '../hooks/useAutoSizeTextArea'
import io from "socket.io-client"
import { SocketContext } from '../SocketContext'
import ChatBody from '../components/ChatBody'
import ChatTopBar from '../components/ChatTopBar'


export default function Home() {


  const [currentChat, setCurrentChat] = useState({ messages: [], userDetails: {}, isTyping: { status: false, text: '' } });
  const [cnv_id, setCnv_id] = useState('')
  const socket = useContext(SocketContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrolled2, setIsScrolled2] = useState(false);

  const user = useSelector(state => state.auth.user);
  const [allChats, setAllChats] = useState([])
  const [currentView, setCurrentView] = useState('chat');
  const dispatch = useDispatch()
  const [currentRoom, setCurrentRoom] = useState();
  const users = useSelector(state => state.users.users);
  const [usersToShow, setUsersToShow] = useState([]);
  console.log('usersToShow==', usersToShow);
  console.log('currentChat', currentChat);



  const fetchConservationIds = async () => {

    const response = await getConservationByUser({ _id: user._id, dispatch });
    console.log('response===', response);
    if (response.status && 'data' in response) {
      const payload = {
        data: {
          cnv_ids: response?.data?.map((item) => { return item._id }),
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
    setCurrentChat({ ...item, isTyping: { status: false, text: '' } })
  }

  const handleNewChatClick = async (item) => {
    console.log('item', item);
    console.log('allChats', allChats);
    let isChatFound = allChats.filter((chat) => { return chat.userDetails._id === item._id })[0];
    console.log('isChatFound', isChatFound);
    if (typeof isChatFound !== undefined && isChatFound) {
      setCurrentChat({ ...isChatFound, isTyping: { status: false, text: '' } })
      setCnv_id(isChatFound.conversationId);

      setCurrentView('chat')
    }
    else {
      let obj = {
        data: {
          participants: [item._id, user._id]
        },
        dispatch
      }

      let response = await conversationIdRequest(obj);
      let payload = {
        data: {
          cnv_ids: [response.data[0]?._id],
          user_id: user._id
        }
      }
      const newChat = await getByCvnIdsRequest(payload);
      if (newChat.status) {

        setAllChats([...allChats, newChat.data])
        setCurrentChat({ ...newChat.data[0], isTyping: { status: false, text: '' } })
      }

      console.log('response==', response);
    }

  }


  const fetchUsers = async () => {
    await usersRequest({ dispatch })

  }






  useEffect(() => {
    const handleScroll = () => {
      const dataListingDiv = document.getElementById('chat');
      if (dataListingDiv) {
        const scrollY = dataListingDiv.scrollTop;
        const threshold = 1; // You can adjust this threshold as needed

        // Check if the scroll position is beyond the threshold
        setIsScrolled(scrollY > threshold);
      }
    };

    // Attach the scroll event listener to the data listing div
    const dataListingDiv = document.getElementById('chat');
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
    const handleScroll = () => {
      const dataListingDiv = document.getElementById('newChat');
      if (dataListingDiv) {
        const scrollY = dataListingDiv.scrollTop;
        const threshold = 1; // You can adjust this threshold as needed

        // Check if the scroll position is beyond the threshold
        setIsScrolled2(scrollY > threshold);
      }
    };

    // Attach the scroll event listener to the data listing div
    const dataListingDiv = document.getElementById('newChat');
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
    fetchUsers()
  }, [])

  useEffect(() => {
    if (cnv_id) {
      socket.emit("joinRoom", { conversationId: currentChat.conversationId, user: user });


    }

  }, [cnv_id])




  useEffect(() => {


    socket.on('message', (message) => {
      console.log('message is recieing', message);

      setCurrentChat((prevChat) => {
        const updatedChat = { ...prevChat };
        updatedChat.messages = [...prevChat.messages, message];
        return updatedChat;
      });

    })

    socket.on('isChatting', (message) => {

      setCurrentChat((prevChat) => {
        const updatedChat = { ...prevChat };
        updatedChat.isTyping = message.isTyping;
        return updatedChat
      })
    })

  }, [socket])


  useEffect(() => {

    if (users.length) {
      let _users = users.filter((item) => { return item.status != 0 }).sort((a, b) => { return a.name - b.name })
      setUsersToShow(_users)
    }

  }, [users])



  return (
    <div className='m-3'>
      <h1 className="heading">Chat</h1>
      <span className='primary-text'>Dashboard.chat</span>
      <Row className='p-0 m-0 my-4' >
        <Col md={4} className='p-0 m-0'>

          <Card className='chat-card w-98 border-0'>


            <ChatTopBar
              user={user}
              setCurrentView={(e) => setCurrentView(e)}
              currentView={currentView}
            />


            {
              currentView === 'chat' &&
              <>


                <div className={`mx-3 mt-3 d-flex`}>
                  <ChevronDown size={14} />
                  <h3 className='my-chat mx-2'>My chats</h3>

                  <span className='my-chat' style={{ marginLeft: "auto" }}>{allChats.length}</span>



                </div>
                <div className='m-0 p-0' id='chat'>

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
                </div>

              </>
            }

            {
              currentView === 'newChat' &&
              <>
                <div className='p-0 m-0' id='newChat'>

                  <div className={`m-3 ${isScrolled2 ? 'scrolled' : ''}`} id="style-3" style={{ width: "100%", overflowY: "auto", cursor: "pointer" }}>
                    {usersToShow?.map((item, ind) => (
                      <div key={ind} className='d-flex align-items-center border-bottom py-2' onClick={() => handleNewChatClick(item)}>
                        <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px' }} className="rounded-circle me-3" />
                        <div className='d-flex flex-column'>
                          <h4 className='user-name'>{item.name}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </>
            }




          </Card>
        </Col>
        <Col md={8} className='p-0 m-0'>
          <ChatBody currentChat={currentChat} socket={socket} />


        </Col>
      </Row>


    </div>
  )
}
