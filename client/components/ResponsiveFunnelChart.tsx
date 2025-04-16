import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { FunnelItem } from '../types/index';
import { useTheme, useMediaQuery } from '@mui/material';

interface ResponsiveFunnelChartProps {
  data: FunnelItem[];
}

const ResponsiveFunnelChart: React.FC<ResponsiveFunnelChartProps> = ({ data }) => {
  const chartRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const is4K = useMediaQuery('(min-width: 3840px)');

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: is4K ? 800 : isMobile ? 300 : 400,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [isMobile, is4K]);

  useEffect(() => {
    if (!chartRef.current || !data.length || dimensions.width === 0) return;

    d3.select(chartRef.current).selectAll('*').remove();

    const svg = d3.select(chartRef.current);
    const margin = {
      top: is4K ? 40 : 20,
      right: is4K ? 60 : isMobile ? 10 : 30,
      bottom: is4K ? 60 : 30,
      left: is4K ? 100 : isMobile ? 60 : 80,
    };
    
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([0, width]);

    const yScale = d3
      .scalePoint()
      .domain(data.map(d => d.label))
      .range([0, height])
      .padding(0.5);

    const barHeight = Math.min(
      (height / data.length) * 0.7,
      is4K ? 80 : isMobile ? 30 : 50
    );

    data.forEach((item, i) => {
      const y = (yScale(item.label) as number) - barHeight / 2;
      
      g.append('rect')
        .attr('x', 0)
        .attr('y', y)
        .attr('width', width)
        .attr('height', barHeight)
        .attr('fill', '#f3f4f6')
        .attr('rx', is4K ? 8 : 4)
        .attr('ry', is4K ? 8 : 4);
      
      g.append('rect')
        .attr('x', 0)
        .attr('y', y)
        .attr('width', xScale(item.totalConversionACV))
        .attr('height', barHeight)
        .attr('fill', '#3182ce')
        .attr('rx', is4K ? 8 : 4)
        .attr('ry', is4K ? 8 : 4);

      g.append('text')
        .attr('x', -10)
        .attr('y', y + barHeight / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .text(item.label)
        .attr('fill', '#4a5568')
        .style('font-size', is4K ? '16px' : isMobile ? '10px' : '12px')
        .style('font-weight', '600');

      g.append('text')
        .attr('x', 10)
        .attr('y', y + barHeight / 2)
        .attr('dy', '0.35em')
        .attr('fill', 'white')
        .text(`${item.count}`)
        .style('font-size', is4K ? '16px' : isMobile ? '10px' : '12px')
        .style('font-weight', 'bold');

      if (!isMobile) {
        g.append('text')
          .attr('x', xScale(item.totalConversionACV) + 10)
          .attr('y', y + barHeight / 2)
          .attr('dy', '0.35em')
          .text(item.formattedACV)
          .attr('fill', '#4a5568')
          .style('font-size', is4K ? '14px' : '11px');
      }

      if (i > 0) {
        g.append('rect')
          .attr('x', width + 5)
          .attr('y', y)
          .attr('width', is4K ? 70 : isMobile ? 40 : 50)
          .attr('height', barHeight)
          .attr('fill', '#48bb78')
          .attr('rx', is4K ? 8 : 4)
          .attr('ry', is4K ? 8 : 4);
          
        g.append('text')
          .attr('x', width + (is4K ? 40 : isMobile ? 25 : 30))
          .attr('y', y + barHeight / 2)
          .attr('dy', '0.35em')
          .attr('text-anchor', 'middle')
          .text(`${item.conversionRate}%`)
          .attr('fill', 'white')
          .style('font-size', is4K ? '14px' : isMobile ? '9px' : '11px')
          .style('font-weight', 'bold');
      }

      if (i > 0) {
        const prevY = (yScale(data[i - 1].label) as number) + barHeight / 2;
        const currY = y;
        
        if (currY - prevY > 15) {
          g.append('path')
            .attr('d', `M${xScale(data[i - 1].totalConversionACV) / 2},${prevY + barHeight / 2} L${xScale(item.totalConversionACV) / 2},${currY - 5}`)
            .attr('stroke', '#cbd5e0')
            .attr('stroke-width', is4K ? 2.5 : 1.5)
            .attr('fill', 'none')
            .attr('marker-end', 'url(#arrow)');
          
          if (item.dropOffPercentage > 0) {
            const midY = (prevY + barHeight / 2 + currY - 5) / 2;
            
            g.append('rect')
              .attr('x', xScale(data[i - 1].totalConversionACV) / 2 + 10)
              .attr('y', midY - (is4K ? 12 : 8))
              .attr('width', is4K ? 60 : isMobile ? 30 : 40)
              .attr('height', is4K ? 24 : 16)
              .attr('fill', '#fc8181')
              .attr('rx', is4K ? 6 : 3)
              .attr('ry', is4K ? 6 : 3)
              .attr('opacity', 0.8);
              
            g.append('text')
              .attr('x', xScale(data[i - 1].totalConversionACV) / 2 + (is4K ? 40 : isMobile ? 15 : 30))
              .attr('y', midY)
              .attr('dy', '0.35em')
              .attr('text-anchor', 'middle')
              .text(`-${item.dropOffPercentage}%`)
              .attr('fill', 'white')
              .style('font-size', is4K ? '12px' : isMobile ? '8px' : '10px')
              .style('font-weight', 'bold');
          }
        }
      }
    });

    svg.append('defs').append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 5)
      .attr('refY', 0)
      .attr('markerWidth', is4K ? 8 : 6)
      .attr('markerHeight', is4K ? 8 : 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#cbd5e0');

    svg.append('text')
      .attr('x', dimensions.width / 2)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', is4K ? '24px' : '16px')
      .style('font-weight', 'bold')
      .text('Sales Funnel')
      .attr('fill', '#2d3748');

    const legendData = [
      { color: '#3182ce', label: 'ACV Value' },
      { color: '#48bb78', label: 'Conversion Rate' },
      { color: '#fc8181', label: 'Drop-off Rate' }
    ];

    const legendGroup = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${height + margin.top + (is4K ? 30 : 15)})`);

    legendData.forEach((item, i) => {
      const legendX = i * (is4K ? 200 : isMobile ? 90 : 150);
      
      legendGroup.append('rect')
        .attr('x', legendX)
        .attr('y', 0)
        .attr('width', is4K ? 16 : 12)
        .attr('height', is4K ? 16 : 12)
        .attr('fill', item.color)
        .attr('rx', 2)
        .attr('ry', 2);
        
      legendGroup.append('text')
        .attr('x', legendX + (is4K ? 24 : 18))
        .attr('y', is4K ? 8 : 6)
        .attr('dy', '0.35em')
        .text(item.label)
        .style('font-size', is4K ? '14px' : isMobile ? '8px' : '10px')
        .attr('fill', '#4a5568');
    });

  }, [data, dimensions, isMobile, is4K]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <svg 
        ref={chartRef} 
        width={dimensions.width} 
        height={dimensions.height}
        className="w-full"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid meet"
      ></svg>
    </div>
  );
};

export default ResponsiveFunnelChart;
