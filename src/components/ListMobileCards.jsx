import React, { useState } from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import EditForm from './forms/EditForm';
import GameMobile from './GameMobile';

const ListMobileCards = ({ list, isEmptyList, isListLoaded, handleEditItem, handleRemoveItem }) => {
  const [nav1, setNav1] = useState();
  const [nav2, setNav2] = useState();

  const [gameData, setGameData] = useState({});
  const [showModal, setShowModal] = useState(false);

  function handleShowEditModal(id) {
    setGameData(list.find(game => game.id === id));
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  const categories = [
    { label: 'ALL GAMES', filter: () => true, background: '#cccccccc' },
    { label: 'COMPLETED', filter: game => game.playstatus === 'finished', background: '#66cc66bb' },
    { label: 'PLAYING', filter: game => game.playstatus === 'playing', background: '#ffcc80bb' },
    { label: 'ON HOLD', filter: game => game.playstatus === 'onhold', background: '#6080ccbb' },
    { label: 'DROPPED', filter: game => game.playstatus === 'dropped', background: '#ff8080bb' },
    { label: 'OTHER', filter: game => game.playstatus === 'other', background: '#ffff80bb' },
    { label: 'PLAN TO PLAY', filter: game => game.playstatus === 'plantoplay', background: 'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(128,77,153,1) 100%)' },
  ];

  return (
    <>
      <EditForm
        show={showModal}
        handleCloseModal={handleCloseModal}
        gameData={gameData}
        updateItemHandler={handleEditItem}
      />
      <Col className="listColumn">
        <Slider asNavFor={nav2} ref={setNav1} className="mobileTabTitleWrapper">
          {categories.map((cat, idx) => (
            <Row key={idx} className="mobileTabTitle">
              <div style={{ background: cat.background }}>{cat.label}</div>
            </Row>
          ))}
        </Slider>

        <Slider
          asNavFor={nav1}
          ref={setNav2}
          slidesToShow={1}
          arrows={false}
          swipe={false}
        >
          {categories.map((cat, idx) => {
            const filteredList = list.filter(cat.filter);
            const gameList = filteredList.map(game => (
              <GameMobile
                game={game}
                style="cards"
                onClickRemoveItem={handleRemoveItem}
                onClickEditItem={handleShowEditModal}
                
              />
            ));

            return (
              <Row key={idx} className="scrollableMobile">
                <div className="gameGrid">
                  {!isListLoaded ? (
                    <Spinner animation="grow" variant="light" style={{ margin: 'auto', marginTop: '50%' }} />
                  ) : isEmptyList ? (
                    <span className="emptyListMessage">Start by adding some games</span>
                  ) : gameList.length === 0 ? (
                    <span className="emptyListMessage">No games to show in this category</span>
                  ) : (
                    gameList
                  )}
                </div>
              </Row>
            );
          })}
        </Slider>
      </Col>
    </>
  );
};

export default ListMobileCards;
