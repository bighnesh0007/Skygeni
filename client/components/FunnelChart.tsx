import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { FunnelItem } from '@/types/index';

interface FunnelChartProps {
  data: FunnelItem[];
}

const FunnelChart: React.FC<FunnelChartProps> = ({ data }) => {
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    d3.select(chartRef.current).selectAll('*').remove();

    const svg = d3.select(chartRef.current);
    const margin = { top: 20, right: 20, bottom: 30, left: 20 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);
    const yScale = d3.scalePoint().domain(data.map(d => d.label)).range([0, height]).padding(0.5);

    const barHeight = (yScale(data[1]?.label)! - yScale(data[0]?.label)!) * 0.7;

    data.forEach((item, i) => {
      const y = yScale(item.label)! - barHeight / 2;

      g.append('rect')
        .attr('x', 0)
        .attr('y', y)
        .attr('width', xScale(item.totalConversionACV))
        .attr('height', barHeight)
        .attr('fill', '#3182ce')
        .attr('rx', 4)
        .attr('ry', 4);

      g.append('text')
        .attr('x', -5)
        .attr('y', y + barHeight / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .text(item.label)
        .style('font-size', '12px')
        .style('font-weight', '500');

      g.append('text')
        .attr('x', 10)
        .attr('y', y + barHeight / 2)
        .attr('dy', '0.35em')
        .attr('fill', 'white')
        .text(`${item.count}`)
        .style('font-size', '12px')
        .style('font-weight', 'bold');

      g.append('text')
        .attr('x', xScale(item.totalConversionACV) + 10)
        .attr('y', y + barHeight / 2)
        .attr('dy', '0.35em')
        .text(item.formattedACV)
        .style('font-size', '12px');

      if (i > 0) {
        g.append('text')
          .attr('x', width + 5)
          .attr('y', y + barHeight / 2)
          .attr('dy', '0.35em')
          .attr('text-anchor', 'start')
          .text(`${item.conversionRate}%`)
          .style('font-size', '11px')
          .style('fill', '#2f855a');

        const prevY = yScale(data[i - 1].label)! + barHeight / 2;
        const currY = y;

        g.append('path')
          .attr('d', `M${xScale(data[i - 1].totalConversionACV) / 2},${prevY + barHeight / 2} L${xScale(item.totalConversionACV) / 2},${currY - 5}`)
          .attr('stroke', '#cbd5e0')
          .attr('stroke-width', 1.5)
          .attr('fill', 'none')
          .attr('marker-end', 'url(#arrow)');
      }
    });

    svg.append('defs').append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 5)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#cbd5e0');

  }, [data, chartRef.current?.clientWidth]);

  return (
    <div className="w-full h-[400px] overflow-hidden">
      <svg 
        ref={chartRef} 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${chartRef.current?.clientWidth || 800} 400`}
      ></svg>
    </div>
  );
};

export default FunnelChart;
