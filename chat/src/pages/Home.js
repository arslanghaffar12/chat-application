import React, { useState, useEffect, useRef, useContext } from 'react'
import { ChevronDown, ChevronUp, FolderPlus, MoreVertical, Plus } from 'react-feather'
import { Card, CardBody, CardFooter, CardHeader, Col, Row } from 'reactstrap'
import "../css/chat.css"
import brand from "../assets/img/download.png"
import { getChatByConversationId, getConservationByUser, getByCvnIdsRequest, postMessageRequest, usersRequest, conversationIdRequest, getConversationChunkById } from '../helpers/request'
import { useDispatch, useSelector } from 'react-redux'
import { useLocalStorage } from '../hooks/useLocalStorage'
import useAutosizeTextArea from '../hooks/useAutoSizeTextArea'
import io from "socket.io-client"
import { SocketContext } from '../SocketContext'
import ChatBody from '../components/ChatBody'
import ChatTopBar from '../components/ChatTopBar'
import { setConversations } from '../redux/actions/chat'


export default function Home() {


  const [currentChat, setCurrentChat] = useState({ messages: [], userDetails: {}, isTyping: { status: false, text: '' } });
  const conversations = useSelector((state) => state.conversation.conversations);
  console.log('conversations==', conversations);
  const conversationRef = useRef(conversations);
  const [statusChange, setStatusChange] = useState();


  const [curCnv, setCurCnv] = useState()
  console.log('curCnv ', curCnv);
  const [cnv_id, setCnv_id] = useState('')
  const socket = useContext(SocketContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrolled2, setIsScrolled2] = useState(false);

  console.log('isScrolled==', isScrolled, isScrolled2);

  const user = useSelector(state => state.auth.user);
  const [allChats, setAllChats] = useState([])
  const [currentView, setCurrentView] = useState('chat');
  const dispatch = useDispatch()
  const [currentRoom, setCurrentRoom] = useState();
  const users = useSelector(state => state.users.users);
  const [usersToShow, setUsersToShow] = useState([]);
  console.log('usersToShow==', usersToShow);



  const fetchConservation = async () => {

    const response = await getConservationByUser({ _id: user._id, dispatch });


  }


  const handleChatClick = (item) => {
    setCurCnv(item)
    // setCnv_id(item.conversationId);
    // setCurrentChat({ ...item, isTyping: { status: false, text: '' } })
  }

  const handleNewChatClick = async (item) => {
    console.log('item', item);

    console.log('allChats', conversations);
    let isChatFound = conversations.filter((chat) => { return chat.members[0]._id === item._id })[0];
    console.log('isChatFound', isChatFound);
    if (typeof isChatFound !== undefined && isChatFound) {
      setCurCnv(isChatFound);

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
      console.log('response of conversationIdRequest', response);
      if (response.status) {
        let payload = {
          data: { userId: user._id, conversationId: response.data._id }
        }
        let newCvnResponse = await getConversationChunkById(payload);
        console.log('newCvnResponse', newCvnResponse);

        if (newCvnResponse.status) {
          console.log('newCvnResponse', newCvnResponse);
          if (newCvnResponse.data.length > 0) {
            let _currentCnv = newCvnResponse.data[0];

            let _conversations = [_currentCnv, ...conversations];
            dispatch(setConversations(_conversations));
            setCurrentView('chat')

            setTimeout(() => {
              setCurCnv(_currentCnv);

            }, 2000)


          }
        }

      }




      console.log('response==', response);
    }

  }


  const fetchUsers = async () => {
    await usersRequest({ dispatch })

  }






  useEffect(() => {
    const handleScroll = () => {
      const dataListingDiv = document.getElementsByClassName('chat')[0];
      if (dataListingDiv) {
        const scrollY = dataListingDiv.scrollTop;
        const threshold = 1; // You can adjust this threshold as needed

        // Check if the scroll position is beyond the threshold
        setIsScrolled(scrollY > threshold);
      }
    };

    // Attach the scroll event listener to the data listing div
    const dataListingDiv = document.getElementsByClassName('chat')[0];
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
      const dataListingDiv = document.getElementsByClassName('newChat')[0];
      if (dataListingDiv) {
        const scrollY = dataListingDiv.scrollTop;
        const threshold = 1; // You can adjust this threshold as needed

        // Check if the scroll position is beyond the threshold
        setIsScrolled2(scrollY > threshold);
      }
    };

    // Attach the scroll event listener to the data listing div
    const dataListingDiv = document.getElementsByClassName('newChat')[0];
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
    fetchConservation()
    fetchUsers();
  }, [])

  useEffect(() => {
    if (curCnv) {
      console.log('hello brother', curCnv);
      socket.emit("joinRoom", { conversationId: curCnv.conversationId, user: user });


    }

  }, [curCnv])

  useEffect(() => {

    if (typeof statusChange !== undefined && statusChange) {
      console.log('statusChange', statusChange);
      let _conversations = [...conversationRef.current];
      const index = _conversations.findIndex(item => item.conversationId === statusChange);
      if (index !== -1) {
        let current = _conversations[index];
        current.unreads = [];
        _conversations[index] = current;
        dispatch(setConversations(_conversations))

      }

    }


  }, [statusChange])






  useEffect(() => {

    if (users.length) {
      let _users = users.filter((item) => { return item.status != 0 }).sort((a, b) => { return a.name - b.name })
      setUsersToShow(_users)
    }

  }, [users])


  useEffect(() => {

    console.log('conversations in useefeect===', conversations);

    conversationRef.current = conversations;


  }, [conversations])

  useEffect(() => {


    socket.on('privateMessage', (params) => {
      console.log('personal message is receiving', params);
      let conversations = [...conversationRef.current];
      let message = params.message;
      let updatedConversion = params.conversation


      const index = conversations.findIndex(item => item.conversationId === updatedConversion.conversationId);
      if (index !== -1) {
        let currentConversation = { ...conversations[index], timestamp: updatedConversion.timestamp, unreads: updatedConversion.unreads, sortedMessages: [updatedConversion.sortedMessages] };
        console.log('currentConversation', currentConversation);




        conversations[index] = currentConversation;

        console.log('conversations===', conversations);




        dispatch(setConversations(conversations))

      }
    })

    socket.on('update-message', (message) => {
      console.log('message is updating', message);

      let conversations = JSON.parse(JSON.stringify([...conversationRef.current]));


      const index = conversations.findIndex(item => item.conversationId === message.conversationId);
      if (index !== -1) {
        let currentConversation = conversations[index];
        currentConversation.unreads = currentConversation.unreads.filter((item) => { return item._id !== message._id });
        console.log('currentConversation', currentConversation);




        conversations[index] = currentConversation;

        console.log('conversations===', conversations);

        dispatch(setConversations(conversations))

      }
    })





  }, [socket])




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

                  <span className='my-chat' style={{ marginLeft: "auto" }}>{conversations.length}</span>



                </div>
                <div className='m-0 p-0' id='chat' style={{ height: "62vh" }}>

                  <div className={`m-3 scrollbar chat ${isScrolled ? 'scrolled' : ''}`} id="style-3" style={{ width: "95%", height: '100%', overflowY: "auto", cursor: "pointer" }}>
                    {conversations?.map((item, ind) => {

                      let user = item.members.length > 0 ? item.members[0] : {};
                      let latestMessage = item.sortedMessages.length > 0 ? item.sortedMessages[0] : {}


                      return (
                        <div key={ind} className='d-flex align-items-center border-bottom py-2' style={{ width: "92%" }} onClick={() => handleChatClick(item)}>
                          <img src={user.image} alt={user.name} style={{ width: '50px', height: '50px' }} className="rounded-circle me-3" />
                          <div className='d-flex flex-column' style={{ width: "100%" }} >
                            <h4 className='user-name'>{user.name}</h4>
                            <div className='d-flex m-0 first-text-div'>
                              <p className='first-text'>{latestMessage.content}</p>
                              {item.unreads.length > 0 && <div className='unread'>
                                <span>{item.unreads.length}</span>
                              </div>}

                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </>
            }

            {
              currentView === 'newChat' &&
              <>
                <div className='p-0 m-0' style={{ height: "62vh" }} id='newChat'>

                  <div className={`m-3 newChat scrollbar ${isScrolled2 ? 'scrolled' : ''}`} id="style-3" style={{ width: "96%", height: "100%", overflowY: "auto", cursor: "pointer" }}>
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
          {typeof curCnv !== undefined && curCnv &&
            <ChatBody socket={socket} curCnv={curCnv} setStatusChange={(e) => setStatusChange(e)} />
          }
          {!curCnv &&
            <Card className='border-0 chat-card '>

            </Card>
          }


        </Col>
      </Row>


    </div>
  )
}
