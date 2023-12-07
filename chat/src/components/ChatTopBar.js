import React from 'react'
import { ArrowLeft, ChevronDown, ChevronUp, FolderPlus, MoreVertical, Plus } from 'react-feather'
import { Card, CardBody, CardFooter, CardHeader, Col, Row } from 'reactstrap'
import "../css/chat.css"

export default function ChatTopBar({ user, setCurrentView, currentView }) {
    return (
        <Row className='p-2'>


            <Col>
                {
                    currentView === 'chat' &&
                    <div className='chat-top-bar p-2'>
                        <img src={user.image}

                            className="rounded-circle me-3 chat-profile"
                        />
                        <div style={{ marginLeft: "auto" }} className='d-flex py-3' >

                            <FolderPlus className='chat-folder-plus' onClick={() => setCurrentView('newChat')} />
                            <MoreVertical className='chat-more-verticle' />
                        </div>
                    </div>
                }

                {
                    currentView === 'newChat' &&

                    <div className='newChat-top-bar'>
                        <div className='px-2 chat-left-arrow' >
                            <ArrowLeft className='' size={18} onClick={() => setCurrentView('chat')} />

                        </div>
                        <div className='px-2 new-chat '>
                            <p className='' >New Chat</p>

                        </div>

                    </div>



                }

            </Col>
        </Row>
    )
}
