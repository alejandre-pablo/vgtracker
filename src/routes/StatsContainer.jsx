import { useEffect, useState, useMemo } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { AiOutlineTrophy } from 'react-icons/ai'
import StatsBarChart from "../components/charts/StatsBarChart";
import StatsPieChart from "../components/charts/StatsPieChart";
import AnimatedNumbers from "react-animated-numbers";
import { useMediaQuery } from "react-responsive";

const StatsContainer = () => {

    const isTabletOrMobile = useMediaQuery({query: '(max-width: 1224px)'})

    const [list, setList] = useState([])
    const [activeList, setActiveList] = useState([]);
    const [activeYear, setActiveYear] = useState('');

    const handleYearSelect=(e) =>{
        setActiveYear(e);
        e === 'All Time'
            ? setActiveList(list.filter(game => (game.playstatus !== 'plantoplay')))
            : setActiveList(list.filter(game => game.playdate === e))
    }

    useEffect(() => {
        setList(JSON.parse(sessionStorage.getItem('games')))
        setActiveList(JSON.parse(sessionStorage.getItem('games')).filter(game => (game.playstatus !== 'plantoplay')))
        setActiveYear("All Time")
    }, [])

    const yearsCount = useMemo(() => Object.values( 
        list.filter(game => game.playstatus !== 'plantoplay')
        .reduce((years, item) => {
            years[item.playdate] = years[item.playdate] || {"year": item.playdate, "count": 0};
            years[item.playdate].count++;
            return years;
        },{}))
        .sort((a,b) => a.year - b.year)
        .filter(year => year.year !== '9999'),
        [list]);
    
    const activeYearCount = Object.values( 
        activeList.filter(game => game.playdate !== 'plantoplay')
        .reduce((statuses, item) => {
            statuses[item.playstatus] = statuses[item.playstatus] || {"status": item.playstatus, "count": 0};
            statuses[item.playstatus].count++;
            return statuses;
        },{
            finished: {"status": "finished", "count": 0},
            playing: {"status": "playing", "count": 0},
            onhold: {"status": "onhold", "count": 0},
            dropped: {"status": "dropped", "count": 0},
            other: {"status": "other", "count": 0}
        }))

/*     const yearTags = 
        <DropdownButton onSelect={handleYearSelect} className="statsYearDropdown" title={activeYear} variant='dark'>
            {yearsCount.map(year => <Dropdown.Item eventKey={year.year}>{year.year}</Dropdown.Item>)}
            <Dropdown.Item eventKey={'All Time'}>All Time</Dropdown.Item>
        </DropdownButton> */

    const genres =  useMemo(() => Object.values( 
        list.filter(game => game.playstatus !== 'plantoplay')
        .reduce((genres, item) => {
        item.genres.forEach(genre => {
            genres[genre.id] = genres[genre.id] || {"id": genre.id, "name": genre.name, "count": 0};
            genres[genre.id].count++;
        });
        return genres;
        }, {})).sort((a,b) => b.count - a.count)
        .filter(genre => genre.name !== 'Indie')
        .slice(0, 5),
        [list]);

    const genresList = useMemo(() => <div className="statsRanking">
        {genres.map((genre, index)=> {
            switch (index) {
                case 0:
                    return <Row key={index}>
                    <Col md={2} sm={3} className="flexCentered">
                        <img className = 'topPositionIcon' src={window.location.origin +'/img/gold_medal.png'} alt="first position"/>
                    </Col>
                    <Col md={10} sm={9}>
                        <span>{genre.name} </span>
                        <span>({genre.count} games)</span>
                    </Col>
                    
                </Row>
                case 1:
                    return <Row key={index}>
                    <Col md={2} sm={3} className="flexCentered">
                        <img className = 'topPositionIcon' src={window.location.origin +'/img/silver_medal.png'} alt="second position"/>
                    </Col>
                    <Col md={10} sm={9}>
                        <span>{genre.name} </span>
                        <span>({genre.count} games)</span>
                    </Col>
                    
                </Row>
                case 2:
                    return <Row key={index}>
                        <Col md={2} sm={3} className="flexCentered">
                            <img className = 'topPositionIcon' src={window.location.origin +'/img/bronze_medal.png'} alt="third position"/>
                        </Col>
                        <Col md={10} sm={9}>
                            <span>{genre.name} </span>
                            <span>({genre.count} games)</span>
                        </Col>
                        
                    </Row>
                default:
                    return <Row key={index}>
                        <Col md={2} sm={3} className="flexCentered">
                            <span className="topPositionText">{index + 1}. </span>
                        </Col>
                        <Col md={10} sm={9}>
                            <span>{genre.name} </span>
                            <span>({genre.count} games)</span>
                        </Col>
                    </Row>
            }
        })}
        </div>,
        [genres]);

    const devs =  useMemo(() => Object.values( 
        list.filter(game => (game.developer && game.playstatus !== 'plantoplay' ))
        .reduce((devs, item) => {
        item.developer.forEach(dev => {
            devs[dev.id] = devs[dev.id] || {"id": dev.id, "name": dev.name, "count": 0};
            devs[dev.id].count++;
        });
        return devs;
        }, {})).sort((a,b) => b.count - a.count)
        .slice(0, 5),
        [list]);
    
    const devsList = useMemo(() => <div className="statsRanking">
        {devs.map((dev, index)=> {
            switch (index) {
            case 0:
                return <Row key={index}>
                <Col md={1} sm={2} className="flexCentered">
                    <img className = 'topPositionIcon' src={window.location.origin +'/img/gold_medal.png'} alt="first position"/>
                </Col>
                <Col md={11} sm={10}>
                    <span>{dev.name} </span>
                    <span>({dev.count} games)</span>
                </Col>
                
            </Row>
            case 1:
                return <Row key={index}>
                <Col md={1} sm={2} className="flexCentered">
                    <img className = 'topPositionIcon' src={window.location.origin +'/img/silver_medal.png'} alt="second position"/>
                </Col>
                <Col md={11} sm={10}>
                    <span>{dev.name} </span>
                    <span>({dev.count} games)</span>
                </Col>
                
            </Row>
            case 2:
                return <Row key={index}>
                    <Col md={1} sm={2} className="flexCentered">
                        <img className = 'topPositionIcon' src={window.location.origin +'/img/bronze_medal.png'} alt="third position"/>
                    </Col>
                    <Col md={11} sm={10}>
                        <span>{dev.name} </span>
                        <span>({dev.count} games)</span>
                    </Col>
                    
                </Row>
            default:
                return <Row key={index}>
                    <Col md={1} sm={2} className="flexCentered">
                        <span className="topPositionText">{index + 1}. </span>
                    </Col>
                    <Col md={11} sm={10}>
                        <span>{dev.name} </span>
                        <span>({dev.count} games)</span>
                    </Col>
                </Row>
            }
        })}
        </div>,
        [devs]);

    const pubs =  useMemo(() =>Object.values( 
        list.filter(game => (game.publisher && game.playstatus !== 'plantoplay'))
        .reduce((pubs, item) => {
        item.publisher.forEach(pub => {
            pubs[pub.id] = pubs[pub.id] || {"id": pub.id, "name": pub.name, "count": 0};
            pubs[pub.id].count++;
        });
        return pubs;
        }, {})).sort((a,b) => b.count - a.count)
        .slice(0, 5),
        [list]);

    const pubsList = useMemo(() => <div className="statsRanking">
        {pubs.map((pub, index)=> {
            switch (index) {
            case 0:
                return <Row key={index}>
                <Col md={1} sm={2} className="flexCentered">
                    <img className = 'topPositionIcon' src={window.location.origin +'/img/gold_medal.png'} alt="first position"/>
                </Col>
                <Col md={11} sm={10}>
                    <span>{pub.name} </span>
                    <span>({pub.count} games)</span>
                </Col>
                
            </Row>
            case 1:
                return <Row key={index}>
                <Col md={1} sm={2} className="flexCentered">
                    <img className = 'topPositionIcon' src={window.location.origin +'/img/silver_medal.png'} alt="second position"/>
                </Col>
                <Col md={11} sm={10}>
                    <span>{pub.name} </span>
                    <span>({pub.count} games)</span>
                </Col>
                
            </Row>
            case 2:
                return <Row key={index}>
                    <Col md={1} sm={2} className="flexCentered">
                        <img className = 'topPositionIcon' src={window.location.origin +'/img/bronze_medal.png'} alt="third position"/>
                    </Col>
                    <Col md={11} sm={10}>
                        <span>{pub.name} </span>
                        <span>({pub.count} games)</span>
                    </Col>
                    
                </Row>
            default:
                return <Row key={index}>
                    <Col md={1} sm={2} className="flexCentered">
                        <span className="topPositionText">{index + 1}. </span>
                    </Col>
                    <Col md={11} sm={10}>
                        <span>{pub.name} </span>
                        <span>({pub.count} games)</span>
                    </Col>
                </Row>
            }
        })}
        </div>,
        [pubs]);

    function clickBarHandler(e) {
        handleYearSelect(e.year);
    }

    return (
        <Container fluid>
            <Row className="statsContainer">
                <Col md={9}>
                    <div className="statsBox" style={{ height: '42%'}}>
                        <Row className="statsMainRow">
                            <h3> Games Played</h3>
                        </Row>
                        <div style={{marginTop: '0.5rem', width: '100%', height: '100%'}}>
                            <StatsBarChart data={yearsCount} handleBarClick={clickBarHandler}/>
                        </div>
                    </div>
                    <div className="statsBox" style={{margin: 'auto', marginTop:'1rem', height: '54%', paddingBottom: '0'}}>
                        <Row className="statsMainRow">
                            <Col md={9}>
                                <h3> {activeYear} Play Stats</h3>
                            </Col>
                            {/* <Col>
                                {yearTags}
                            </Col> */}
                        </Row>
                        <Row style={{height: '90%'}}>
                            <Col md={5} className='flexCentered' style={{flexDirection: 'column', padding: '1rem'}}>
                                <Row className='statDivRow'>
                                    <AnimatedNumbers
                                        fontStyle={{
                                            fontSize: '2.2rem',
                                            fontWeight: 'bold',
                                            transition: '0.8s ease-out',
                                            paddingRight: '0',
                                            transitionProperty: 'background-color, color, opacity'
                                        }}
                                        includeComma
                                        locale="es-ES"
                                        configs={[{ mass: 1, tension: 300, friction: 50 }]}
                                        animateToNumber={activeList.length ? activeList.length : 0}
                                    />
                                    <h4>Games Played</h4>
                                </Row>
                                <Row className='statDivRow'>
                                    <AnimatedNumbers
                                        fontStyle={{
                                            fontSize: '2.2rem',
                                            fontWeight: 'bold',
                                            transition: '0.8s ease-out',
                                            paddingRight: '0',
                                            transitionProperty: 'background-color, color, opacity'
                                        }}
                                        includeComma
                                        locale="es-ES"
                                        configs={[{ mass: 1, tension: 300, friction: 50}]}
                                        animateToNumber={parseFloat(activeList.map(game => parseFloat(game.playtime.replace(',', '.')))
                                            .reduce((partialSum, a) => partialSum + a, 0)
                                            .toFixed(1))}
                                    />
                                    <h4>Hours Spent</h4>
                                </Row>
                                <Row className='statDivRow'>
                                    <AnimatedNumbers
                                        fontStyle={{
                                            fontSize: '2.2rem',
                                            fontWeight: 'bold',
                                            transition: '0.8s ease-out',
                                            paddingRight: '0',
                                            transitionProperty: 'background-color, color, opacity'
                                        }}
                                        includeComma
                                        locale="es-ES"
                                        configs={[{ mass: 1, tension: 300, friction: 50 }]}
                                        initialValue={0}
                                        animateToNumber={(Math.round(((activeList.map(game => game.rating.reduce((a, b) => a + b, 0) / game.rating.length)
                                        .reduce((a, b) => a + b, 0) /(activeList.length)) + Number.EPSILON)*100)/100)}
                                    />
                                    {/* <span style={{fontSize: '1.8rem',fontWeight: 'bold', display: 'inline-block', width: 'min-content', padding: '0'}}> /5</span> */}
                                    {/* <Rating 
                                        readonly={true} 
                                        size={30} 
                                        ratingValue={activeList.map(game => game.rating.reduce((a, b) => a + b, 0) / game.rating.length)
                                        .reduce((partialSum, a) => partialSum + a, 0)/activeList.length} 
                                        fillColor ={'#fff'} 
                                        emptyColor={'#000'}/> */}
                                    <h4>Average Rating</h4>
                                </Row>
                            </Col>
                            {!isTabletOrMobile ? 
                            <Col md={7} className='statDivChart'>
                                <div style={{width: '100%', height: '100%'}}>
                                    <StatsPieChart data={activeYearCount} />
                                </div>
                            </Col>
                            : <></>}
                        </Row>
                    </div>
                </Col>
                <Col style={{ height:'99%'}}>
                    <div className="statsBox" style={{ height: '30%'}}>
                        <h5 style={{paddingBottom: '0.5rem', borderBottom: '1px solid var(--darkAccent)', display: 'flex', alignItems: 'center'}}> <AiOutlineTrophy />&nbsp;Top Genres</h5>
                        <div style={{margin: 'auto', height: '85%', padding: '0.5rem 0 1rem 1.5rem'}}>
                            {genresList}
                        </div>
                    </div>
                    <div className="statsBox" style={{ marginTop: '2.3rem', height: '30%'}}>
                        <h5 style={{paddingBottom: '0.5rem', borderBottom: '1px solid var(--darkAccent)', display: 'flex', alignItems: 'center'}}> <AiOutlineTrophy />&nbsp;Top Devs</h5>
                        <div style={{margin: 'auto', height: '85%', padding: '0.5rem 0 1rem 1.5rem'}}>
                            {devsList}
                        </div>
                    </div>
                    <div className="statsBox" style={{ marginTop: '2.3rem', height: '30%'}}>
                        <h5 style={{paddingBottom: '0.5rem', borderBottom: '1px solid var(--darkAccent)', display: 'flex', alignItems: 'center'}}> <AiOutlineTrophy />&nbsp;Top Publishers</h5>
                        <div style={{margin: 'auto', height: '85%', padding: '0.5rem 0 1rem 1.5rem'}}>
                            {pubsList}
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
        
    )
}

export default StatsContainer
