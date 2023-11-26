import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Card, Col, Row } from 'reactstrap'
import "../css/chat.css"
import brand from "../assets/img/download.png"
import useLocalStorage from '../hooks/useLocalStorage'
import { getChatByConversationId, getConservationByUser } from '../helpers/request'
import { useDispatch, useSelector } from 'react-redux'

export default function Home() {

  const [isScrolled, setIsScrolled] = useState(false);
  const [allChats, setAllChats] = useLocalStorage('allChats', []);
  console.log('allChats', allChats);

  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch()

  const fetchConservationIds = async () => {

    const response = await getConservationByUser({ _id: user._id, dispatch });
    // console.log('getConservationByUser',response);

    if (response.status) {
      let _chats = [];
      for (let i = 0; i < response.data.length; i++) {
        const chats = await getChatByConversationId({ conservationId: response.data[i]._id })
        _chats.push(chats)
      }
      setAllChats(_chats)

    }

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





  const Data = [
    { id: 1, photo: brand, memberName: 'John Doe', mobile: '123-456-7890', email: 'johndoe@email.com', status: 'Active', operation: 'Edit' },
    { id: 2, photo: brand, memberName: 'Jane Smith', mobile: '987-654-3210', email: 'janesmith@email.com', status: 'Inactive', operation: 'Delete' },
    { id: 3, photo: brand, memberName: 'Peter Jones', mobile: '555-123-4567', email: 'peterjones@email.com', status: 'Pending', operation: 'View' },

    { id: 1, photo: brand, memberName: 'John Doe', mobile: '123-456-7890', email: 'johndoe@email.com', status: 'Active', operation: 'Edit' },
    { id: 2, photo: brand, memberName: 'Jane Smith', mobile: '987-654-3210', email: 'janesmith@email.com', status: 'Inactive', operation: 'Delete' },
    { id: 3, photo: brand, memberName: 'Peter Jones', mobile: '555-123-4567', email: 'peterjones@email.com', status: 'Pending', operation: 'View' },

    { id: 1, photo: brand, memberName: 'John Doe', mobile: '123-456-7890', email: 'johndoe@email.com', status: 'Active', operation: 'Edit' },
    { id: 2, photo: brand, memberName: 'Jane Smith', mobile: '987-654-3210', email: 'janesmith@email.com', status: 'Inactive', operation: 'Delete' },
    { id: 3, photo: brand, memberName: 'Peter Jones', mobile: '555-123-4567', email: 'peterjones@email.com', status: 'Pending', operation: 'View' },

    { id: 1, photo: brand, memberName: 'John Doe', mobile: '123-456-7890', email: 'johndoe@email.com', status: 'Active', operation: 'Edit' },
    { id: 2, photo: brand, memberName: 'Jane Smith', mobile: '987-654-3210', email: 'janesmith@email.com', status: 'Inactive', operation: 'Delete' },
    { id: 3, photo: brand, memberName: 'Peter Jones', mobile: '555-123-4567', email: 'peterjones@email.com', status: 'Pending', operation: 'View' },

    { id: 1, photo: brand, memberName: 'John Doe', mobile: '123-456-7890', email: 'johndoe@email.com', status: 'Active', operation: 'Edit' },
    { id: 2, photo: brand, memberName: 'Jane Smith', mobile: '987-654-3210', email: 'janesmith@email.com', status: 'Inactive', operation: 'Delete' },
    { id: 3, photo: brand, memberName: 'Peter Jones', mobile: '555-123-4567', email: 'peterjones@email.com', status: 'Pending', operation: 'View' },
  ]
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

              <span className='my-chat' style={{ marginLeft: "auto" }}>{Data.length}</span>



            </div>

            <div className={`m-3 ${isScrolled ? 'scrolled' : ''}`} id="style-3" style={{ width: "100%", overflowY: "auto", cursor: "pointer" }}>
              {Data.map((item, ind) => (
                <div key={ind} className='d-flex align-items-center border-bottom py-2'>
                  <img src={item.photo} alt={item.memberName} style={{ width: '50px', height: '50px' }} className="rounded-circle me-3" />
                  <div className='d-flex flex-column'>
                    <h4 className='user-name'>{item.memberName}</h4>
                  </div>
                </div>
              ))}
            </div>



          </Card>
        </Col>
        <Col md={8} className='p-0 m-0'>

          <Card className='chat-card border-0'>


          </Card>
        </Col>
      </Row>


    </div>
  )
}
