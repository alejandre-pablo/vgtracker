import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

const StatsBarChart = (props) => {

    const data = props.data

    const handleClick = props.handleBarClick

    const [activeIndex, setActiveIndex] = useState(-1);
    const [hoverIndex, setHoverIndex] = useState(-1);

    function handleClickWrapper (data, index) {
        setActiveIndex(index);
        handleClick(data);
    }

    function handleHover(data, index) {
        setHoverIndex(index);
    }

    function handleHoverOut(data, index) {
        setHoverIndex(-1);
    }

    return (
        <ResponsiveContainer width={'100%'} height={'90%'}>
            <BarChart
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            maxBarSize={60}
            >
                <YAxis dataKey="count" stroke="#9fa6cc" />
                <XAxis dataKey="year" stroke="#9fa6cc"/>
                <Bar dataKey="count" fill="#9fa6cc" radius={[8, 8, 0, 0]} animationDuration={2000} onClick={handleClickWrapper} onMouseOver={handleHover} onMouseOut={handleHoverOut}>
                {data.map((entry, index) => (
                    <Cell cursor="pointer" fill={index === activeIndex ? '#fff' : index === hoverIndex ? '#9fa6cc99' : '#9fa6cc'} key={`cell-${index}`} />
                ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

export default StatsBarChart
