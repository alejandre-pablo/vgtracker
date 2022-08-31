import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

const StatsBarChart = (props) => {

    const data = props.data

    const handleClick = props.handleBarClick

    const [activeIndex, setActiveIndex] = useState(0);

    function handleClickWrapper (data, index) {
        setActiveIndex(index);
        handleClick(data);
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
                <Bar dataKey="count" fill="#9fa6cc" animationDuration={2000} onClick={handleClickWrapper}>
                {data.map((entry, index) => (
                    <Cell cursor="pointer" fill={index === activeIndex ? '#fff' : '#9fa6cc'} key={`cell-${index}`} />
                ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

export default StatsBarChart
