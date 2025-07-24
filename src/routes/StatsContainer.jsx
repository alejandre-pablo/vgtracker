import { useEffect, useState, useMemo } from "react"
import { Col, Container, Dropdown, DropdownButton, Row } from "react-bootstrap"
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

    /* const yearTags = 
        <DropdownButton onSelect={handleYearSelect} className="statsYearDropdown" title={activeYear} variant='dark'>
            {yearsCount.map(year => <Dropdown.Item key={year.year} eventKey={year.year}>{year.year}</Dropdown.Item>)}
            <Dropdown.Item eventKey={'All Time'}>All Time</Dropdown.Item>
        </DropdownButton> */

    const getTopRankedItems = (list, key, filterFn = () => true, excludeNames = [], maxItems = 5) => {
        const counts = list
            .filter(game => game[key] && game.playstatus !== 'plantoplay' && filterFn(game))
            .reduce((acc, game) => {
                game[key].forEach(item => {
                    if (!excludeNames.includes(item.name)) {
                        acc[item.id] = acc[item.id] || { id: item.id, name: item.name, count: 0 };
                        acc[item.id].count++;
                    }
                });
                return acc;
            }, {});

        return Object.values(counts)
            .sort((a, b) => b.count - a.count)
            .slice(0, maxItems);
    };

    const renderRankedList = (items) => (
        <div className="statsRanking">
            {items.map((item, index) => {
                let icon;
                switch (index) {
                    case 0:
                        icon = '/img/gold_medal.png'; break;
                    case 1:
                        icon = '/img/silver_medal.png'; break;
                    case 2:
                        icon = '/img/bronze_medal.png'; break;
                    default:
                        icon = null;
                }
    
                return (
                    <Row key={index}>
                        <Col xs={2} style={{display: 'flex', justifyContent: 'center'}}>
                            {icon ? (
                                <img className='topPositionIcon' src={window.location.origin + icon} alt={`position ${index + 1}`} />
                            ) : (
                                <span>{index + 1}. </span>
                            )}
                        </Col>
                        <Col xs={10}>
                            <span>{item.name} </span>
                            <span>({item.count} games)</span>
                        </Col>
                    </Row>
                );
            })}
        </div>
    );

    const genresList = renderRankedList(getTopRankedItems(list, 'genres', () => true, ['Indie']));
    const devsList = renderRankedList(getTopRankedItems(list, 'developer'));
    const pubsList = renderRankedList(getTopRankedItems(list, 'publisher'));

    function clickBarHandler(e) {
        handleYearSelect(e.year);
    }

    const numbersToAnimate = [
        {
            label: "Games Played", 
            value: activeList.length ? activeList.length : 0
        },
        {
            label: "Hours Spent", 
            value: parseFloat(activeList.map(game => parseFloat(game.playtime.replace(',', '.')))
                .reduce((partialSum, a) => partialSum + a, 0)
                .toFixed(1)),
        },
        {
            label: "Average Rating", 
            value: (Math.round(((activeList.map(game => game.rating.reduce((a, b) => a + b, 0) / game.rating.length)
                .reduce((a, b) => a + b, 0) /(activeList.length)) + Number.EPSILON)*100)/100)
        }
    ]

    return (
        <Container fluid>
            <Row className="statsContainer" style={{paddingTop: '9vh'}}>
                <Col md={9} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: '3vh'}}>
                    <div className="statsBox" style={{ height: '42vh'}}>
                        <Row className="statsMainRow">
                            <h3> Games Played</h3>
                        </Row>
                        <div style={{marginTop: '0.5rem', width: '100%', height: '100%'}}>
                            <StatsBarChart data={yearsCount} handleBarClick={clickBarHandler}/>
                        </div>
                    </div>
                    <div className="statsBox" style={{height: '45vh'}}>
                        <Row className="statsMainRow">
                            <Col md={9}>
                                <h3> {activeYear} Play Stats</h3>
                            </Col>
                            {/* <Col>
                                {yearTags}
                            </Col> */}
                        </Row>
                        <Row style={{display: 'flex', flex: '1', alignItems:'center'}}>
                            <Col md={5} style={{flexDirection: 'column', padding: '1rem'}}>
                                {numbersToAnimate.map((number) => (
                                    <Row className='statDivRow' key={number.label}>
                                        <AnimatedNumbers
                                        fontStyle={{
                                            fontSize: '2.2rem',
                                            fontWeight: 'bold',
                                            transition: '0.8s ease-out',
                                            paddingRight: '0',
                                            transitionProperty: 'background-color, color, opacity'
                                        }}
                                        locale="es-ES"
                                        configs={[{ mass: 1, tension: 300, friction: 50 }]}
                                        animateToNumber={number.value}
                                        />
                                        <h4>{number.label}</h4>
                                    </Row>
                                ))}
                            </Col>
                            {!isTabletOrMobile ? 
                            <Col md={7} style={{height: '100%'}}>
                                <StatsPieChart data={activeYearCount} />
                            </Col>
                            : <></>}
                        </Row>
                    </div>
                </Col>
                <Col style={isTabletOrMobile ? {} : { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: '3vh'}}>
                    <div className="statsBox">
                        <h5 style={{paddingBottom: '0.5rem', borderBottom: '1px solid var(--darkAccent)', display: 'flex', alignItems: 'center'}}> <AiOutlineTrophy />&nbsp;Top Genres</h5>
                        <div style={{padding: '0.5rem 0 1rem 1.5rem', flex: '1', display: 'flex', alignItems:'center'}}>
                            {genresList}
                        </div>
                    </div>
                    <div className="statsBox">
                        <h5 style={{paddingBottom: '0.5rem', borderBottom: '1px solid var(--darkAccent)', display: 'flex', alignItems: 'center'}}> <AiOutlineTrophy />&nbsp;Top Devs</h5>
                        <div style={{padding: '0.5rem 0 1rem 1.5rem', flex: '1', display: 'flex', alignItems:'center'}}>
                            {devsList}
                        </div>
                    </div>
                    <div className="statsBox" >
                        <h5 style={{paddingBottom: '0.5rem', borderBottom: '1px solid var(--darkAccent)', display: 'flex', alignItems: 'center'}}> <AiOutlineTrophy />&nbsp;Top Publishers</h5>
                        <div style={{padding: '0.5rem 0 1rem 1.5rem', flex: '1', display: 'flex', alignItems:'center'}}>
                            {pubsList}
                        </div>
                    </div>
                </Col>                
            </Row>
        </Container>
        
    )
}

export default StatsContainer
