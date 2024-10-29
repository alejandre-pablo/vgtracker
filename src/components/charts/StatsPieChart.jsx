import React, {useCallback, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
    } = props;

    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";
    return (
      <g>
        <text style={{fontSize: '1.2rem'}}x={cx} y={cy} dy={-24} textAnchor="middle" fill="#9fa6cc">
            {payload.status.charAt(0).toUpperCase() + payload.status.slice(1)}
        </text>
        <text style={{fontSize: '1.3rem'}}x={cx} y={cy} dy={8} textAnchor="middle" fill="#ffffff">
            {payload.count}
        </text>
        <text style={{fontSize: '1.2rem'}}x={cx} y={cy} dy={40} textAnchor="middle" fill="#9fa6cc">
            games
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#9fa6cc"
        >{payload.status.charAt(0).toUpperCase() + payload.status.slice(1)}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#ffffff"
        >
          {`${(percent * 100).toFixed(2)}%`}
        </text>
      </g>
    );
  };

const StatsPieChart = (props) => {

    const COLORS = {finished: "#66cc66", playing: "#ffcc80", onhold: "#6680cc", dropped: "#ff8080", other: "#ffff80", plantoplay: "#804d99"};

    const data = props.data

    const [activeIndex, setActiveIndex] = useState(0);
    const onPieEnter = useCallback(
        (_, index) => {
        setActiveIndex(index);
        },
        [setActiveIndex]
    );


    return (
        <ResponsiveContainer width={'100%'} height={'100%'}>
            <PieChart>
                <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={data}
                    innerRadius={80}
                    outerRadius={130}
                    stroke="none"
                    fill="#8884d8"
                    dataKey="count"
                    onMouseEnter={onPieEnter}
                    animationDuration={1000}
                >
                    {data.map((entry, index) => (
                        <Cell key={entry.status} fill={COLORS[entry.status]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
}

export default StatsPieChart