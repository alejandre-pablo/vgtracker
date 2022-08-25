import { useState } from "react"
import { Col, Container, Dropdown, DropdownButton, Row } from "react-bootstrap"
import { Rating } from "react-simple-star-rating";

const StatsContainer = () => {

    const list = JSON.parse(sessionStorage.getItem('games'));

    const [activeYear, setActiveYear] = useState('All Time');
    const [activeList, setActiveList] = useState(list);

    const years = uniq((list)
        .map( game => parseInt(game.playdate)))
        .filter(year => (1000 <= year && year <= new Date().getFullYear()))
        .sort(function(a, b) {
            return a - b
        });
    const handleYearSelect=(e) =>{
        setActiveYear(e);
        e === 'All Time'
            ? setActiveList(list.filter(game => game.playdate !== '9999'))
            : setActiveList(list.filter(game => game.playdate === e))
    }

    const yearTags = 
        <DropdownButton onSelect={handleYearSelect} className="statsYearDropdown" title= "Select Year" variant='dark'>
            {years.map(year => <Dropdown.Item eventKey={year}>{year}</Dropdown.Item>)}
            <Dropdown.Item eventKey={'All Time'}>All Time</Dropdown.Item>
        </DropdownButton>
    
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
                <Col>
                    <div style={{margin: 'auto', height: '94%', border: '1px solid var(--accent)', backgroundColor: 'var(--darkBgBase)', padding: '1rem'}}>
                        <Row style={{ height: '30%', border: '1px solid var(--accent)', padding: '1rem'}}>
                            <div> Top genres</div>
                            <div style={{margin: 'auto', height: '94%', border: '1px solid var(--accent)', backgroundColor: 'var(--darkBgBase)', padding: '1rem'}}>
                                Aqui van genres
                            </div>
                        </Row>
                        <Row style={{ marginTop: '15%', height: '30%', border: '1px solid var(--accent)', backgroundColor: 'var(--darkBgBase)', padding: '1rem'}}>
                            <div> Top devs</div>
                            <div style={{margin: 'auto', height: '94%', border: '1px solid var(--accent)', backgroundColor: 'var(--darkBgBase)', padding: '1rem'}}>
                                Aqui van devs
                            </div>
                        </Row>
                        <Row style={{ marginTop: '15%', height: '30%', border: '1px solid var(--accent)', backgroundColor: 'var(--darkBgBase)', padding: '1rem'}}>
                            <div> algo</div>
                            <div style={{margin: 'auto', height: '94%', border: '1px solid var(--accent)', backgroundColor: 'var(--darkBgBase)', padding: '1rem'}}>
                               ni aqui tampoco 
                            </div>
                        </Row>
                    </div>
                </Col>
            </Row>
            
        </Container>
        
    )
}

export default StatsContainer
