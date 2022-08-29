import { useEffect, useState } from "react"
import { Col, Container, Dropdown, DropdownButton, Row } from "react-bootstrap"
import { Rating } from "react-simple-star-rating";
import { AiOutlineTrophy } from 'react-icons/ai'

const StatsContainer = () => {

    const list = JSON.parse(sessionStorage.getItem('games'));

    const [activeYear, setActiveYear] = useState('');
    const [activeList, setActiveList] = useState(list);

    const handleYearSelect=(e) =>{
        setActiveYear(e);
        e === 'All Time'
            ? setActiveList(list.filter(game => (game.playstatus !== 'plantoplay')))
            : setActiveList(list.filter(game => game.playdate === e))
    }

    useEffect(() => {
        handleYearSelect("All Time")
    }, [])
    
    const years = uniq((list)
        .map( game => parseInt(game.playdate)))
        .filter(year => (1000 <= year && year <= new Date().getFullYear()))
        .sort(function(a, b) {
            return a - b
        });

    const yearTags = 
        <DropdownButton onSelect={handleYearSelect} className="statsYearDropdown" title={activeYear} variant='dark'>
            {years.map(year => <Dropdown.Item eventKey={year}>{year}</Dropdown.Item>)}
            <Dropdown.Item eventKey={'All Time'}>All Time</Dropdown.Item>
        </DropdownButton>

    const genres =  Object.values( 
        list.filter(game => game.playstatus !== 'plantoplay')
        .reduce((genres, item) => {
        item.genres.forEach(genre => {
            genres[genre.id] = genres[genre.id] || {"id": genre.id, "name": genre.name, "count": 0};
            genres[genre.id].count++;
        });
        return genres;
        }, {})).sort((a,b) => b.count - a.count)
        .slice(0, 5);

    const genresList = <div className="statsRanking">
        {genres.map((genre, index)=> {
            if(index === 0) {
                return <Row>
                <Col md={1} className="flexCentered">
                    <img className = 'topPositionIcon' src={window.location.origin +'/img/gold_medal.png'} alt="first position"/>
                </Col>
                <Col  md={11}>
                    <span>{genre.name} </span>
                    <span>({genre.count} games)</span>
                </Col>
                
            </Row>
            } else if (index === 1) {
                return <Row>
                <Col md={1} className="flexCentered">
                    <img className = 'topPositionIcon' src={window.location.origin +'/img/silver_medal.png'} alt="second position"/>
                </Col>
                <Col  md={11}>
                    <span>{genre.name} </span>
                    <span>({genre.count} games)</span>
                </Col>
                
            </Row>
            } else if (index === 2) {
                return <Row>
                    <Col md={1} className="flexCentered">
                        <img className = 'topPositionIcon' src={window.location.origin +'/img/bronze_medal.png'} alt="third position"/>
                    </Col>
                    <Col  md={11}>
                        <span>{genre.name} </span>
                        <span>({genre.count} games)</span>
                    </Col>
                    
                </Row>
            }
            return <Row>
                <Col md={1} className="flexCentered">
                    <span className="topPositionText">{index + 1}. </span>
                </Col>
                <Col  md={11}>
                    <span>{genre.name} </span>
                    <span>({genre.count} games)</span>
                </Col>
            </Row>
        })}
        </div>

    const devs =  Object.values( 
        list.filter(game => game.playstatus !== 'plantoplay')
        .reduce((devs, item) => {
        item.developer.forEach(dev => {
            devs[dev.id] = devs[dev.id] || {"id": dev.id, "name": dev.name, "count": 0};
            devs[dev.id].count++;
        });
        return devs;
        }, {})).sort((a,b) => b.count - a.count)
        .slice(0, 5);
    
    const devsList = <div className="statsRanking">
        {devs.map((dev, index)=> {
            if(index === 0) {
                return <Row>
                <Col md={1} className="flexCentered">
                    <img className = 'topPositionIcon' src={window.location.origin +'/img/gold_medal.png'} alt="first position"/>
                </Col>
                <Col  md={11}>
                    <span>{dev.name} </span>
                    <span>({dev.count} games)</span>
                </Col>
                
            </Row>
            } else if (index === 1) {
                return <Row>
                <Col md={1} className="flexCentered">
                    <img className = 'topPositionIcon' src={window.location.origin +'/img/silver_medal.png'} alt="second position"/>
                </Col>
                <Col  md={11}>
                    <span>{dev.name} </span>
                    <span>({dev.count} games)</span>
                </Col>
                
            </Row>
            } else if (index === 2) {
                return <Row>
                    <Col md={1} className="flexCentered">
                        <img className = 'topPositionIcon' src={window.location.origin +'/img/bronze_medal.png'} alt="third position"/>
                    </Col>
                    <Col  md={11}>
                        <span>{dev.name} </span>
                        <span>({dev.count} games)</span>
                    </Col>
                    
                </Row>
            }
            return <Row>
                <Col md={1} className="flexCentered">
                    <span className="topPositionText">{index + 1}. </span>
                </Col>
                <Col md={11}>
                    <span>{dev.name} </span>
                    <span>({dev.count} games)</span>
                </Col>
            </Row>
        })}
        </div>

    function uniq(a) {
        var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];
    
        return a.filter(function(item) {
            var type = typeof item;
            if(type in prims)
                return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
            else
                return objs.indexOf(item) >= 0 ? false : objs.push(item);
        });
    }

    return (
        <Container fluid>
            <Row className="statsContainer">
                <Col md={9}>
                    <div style={{margin: 'auto', height: '70%', border: '1px solid var(--accent)', backgroundColor: 'var(--darkBgBase)', padding: '1rem'}}>
                        <Row className="statsMainRow">
                            <Col md={9}>
                                <h2> {activeYear} Play Stats</h2>
                            </Col>
                            <Col>
                                {yearTags}
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4} className='statDiv'>
                                <div style={{fontSize: '2.5rem', fontWeight: 'bold'}}>{activeList.length}</div>
                                <h4>Games Played</h4>
                            </Col>
                            <Col md={4} className='statDiv'>
                                <div style={{fontSize: '2.5rem', fontWeight: 'bold'}}>{activeList.map(game => parseFloat(game.playtime.replace(',', '.')))
                                    .reduce((partialSum, a) => partialSum + a, 0)
                                    .toFixed(1)}
                                </div>
                                <h4>Hours Spent</h4>
                            </Col>
                            <Col md={4} className='statDiv'>
                                <div style={{fontSize: '2.5rem', fontWeight: 'bold'}}>{(Math.round(((activeList.map(game => game.rating.reduce((a, b) => a + b, 0) / game.rating.length)
                                    .reduce((a, b) => a + b, 0) /(20*activeList.length)) + Number.EPSILON)*100)/100)
                                    .toString() + '/5'}
                                </div>
                                <Rating 
                                    readonly={true} 
                                    size={30} 
                                    ratingValue={activeList.map(game => game.rating.reduce((a, b) => a + b, 0) / game.rating.length)
                                    .reduce((partialSum, a) => partialSum + a, 0)/activeList.length} 
                                    fillColor ={'#fff'} 
                                    emptyColor={'#000'}/>
                                <h4>Average Rating</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4} className='statDiv'>
                                <div style={{fontSize: '2.5rem', fontWeight: 'bold'}}>{activeList.filter(game => game.playstatus === 'finished').length}</div>
                                <h4>Games Completed</h4>
                            </Col>
                            <Col md={4} className='statDiv'>
                                <div style={{fontSize: '2.5rem', fontWeight: 'bold'}}>{activeList.filter(game => game.playstatus === 'finished').map(game => parseFloat(game.playtime.replace(',', '.')))
                                    .reduce((partialSum, a) => partialSum + a, 0).toFixed(1)}
                                </div>
                                <h4>Hours Spent (Comp)</h4>
                            </Col>
                            <Col md={4} className='statDiv'>
                                <div style={{fontSize: '2.5rem', fontWeight: 'bold'}}>{(Math.round(((activeList.filter(game => game.playstatus === 'finished').map(game => game.rating.reduce((a, b) => a + b, 0) / game.rating.length)
                                    .reduce((a, b) => a + b, 0) /(20*activeList.filter(game => game.playstatus === 'finished').length)) + Number.EPSILON)*100)/100).toString() + '/5'}</div>
                                <Rating 
                                    readonly={true} 
                                    size={30} 
                                    ratingValue={activeList.filter(game => game.playstatus === 'finished').map(game => game.rating.reduce((a, b) => a + b, 0) / game.rating.length)
                                    .reduce((partialSum, a) => partialSum + a, 0)/activeList.filter(game => game.playstatus === 'finished').length} 
                                    fillColor ={'#fff'} 
                                    emptyColor={'#000'}/>
                                <h4>Average Rating</h4>
                            </Col>
                        </Row>
                    </div>
                    <div style={{marginTop: '3%', height: '20%', border: '1px solid var(--accent)', backgroundColor: 'var(--darkBgBase)', padding: '1rem'}}>
                        <Row>
                            <div>aqui no se que va</div>
                        </Row>
                    </div>
                </Col>
                <Col style={{ marginRight: '0.8rem'}}>
                    <Row style={{ height: '33%', border: '1px solid var(--accent)', padding: '1rem', backgroundColor: 'var(--darkBgBase)'}}>
                        <h5 style={{paddingBottom: '0.5rem', borderBottom: '1px solid var(--accent)', display: 'flex', alignItems: 'center'}}> <AiOutlineTrophy />&nbsp;Top Genres</h5>
                        <div style={{margin: 'auto', height: '94%', padding: '1rem', paddingLeft: '1.5rem'}}>
                            {genresList}
                        </div>
                    </Row>
                    <Row style={{ marginTop: '15%', height: '33%', border: '1px solid var(--accent)', padding: '1rem', backgroundColor: 'var(--darkBgBase)'}}>
                        <h5 style={{paddingBottom: '0.5rem', borderBottom: '1px solid var(--accent)', display: 'flex', alignItems: 'center'}}> <AiOutlineTrophy />&nbsp;Top Devs</h5>
                        <div style={{margin: 'auto', height: '94%', padding: '1rem', paddingLeft: '1.5rem'}}>
                            {devsList}
                        </div>
                    </Row>
                </Col>
            </Row>
            
        </Container>
        
    )
}

export default StatsContainer
