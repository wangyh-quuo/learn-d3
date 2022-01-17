import * as d3 from "d3";

async function drawLineChart() {
  // loading dataset
  const dataset = await d3.json("/json/my-weather.json");
  // console.table(dataset[0])
  // yAccessor
  const yAccessor = (d) => d.temperatureMax;
  // xAccessor
  const xAccessor = (d) => d3.timeParse("%Y-%m-%d")(d.date);

  // 定义dimensions
  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margin: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60,
    },
  };
  // 计算boundleWidth boundleHeight
  dimensions.boundleWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundleHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // 渲染的DOM元素
  const wrapper = d3.select("#wrapper");

  // add svg
  const svg = wrapper.append("svg");
  svg.attr("width", dimensions.width);
  svg.attr("height", dimensions.height);

  const bounds = svg
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );
  // 设置刻度尺 scale
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundleHeight, 0]);

  const freezingTemperaturePlacement = yScale(32);
  const freezingTemperatures = bounds
    .append("rect")
    .attr("x", 0)
    .attr("width", dimensions.boundleWidth)
    .attr("y", freezingTemperaturePlacement)
    .attr("height", dimensions.boundleHeight - freezingTemperaturePlacement)
    .attr("fill", "#00b295af")
    .attr("stroke", "#ddd")
    .attr("stroke-width", "1");

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundleWidth]);

  // bounds.append("path").attr("d", "M 0 0 L 100 0 L 100 100 L 23 89 Z")
  const lineGenerator = d3
    .line()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)));

  const line = bounds
    .append("path")
    .attr("d", lineGenerator(dataset))
    .attr("fill", "none")
    .attr("stroke", "#00b295")
    .attr("stroke-width", "2");

  const yAxisGenerator = d3.axisLeft().scale(yScale);

  // const yAxis = bounds.append('g')
  // yAxisGenerator(yAxis)
  const yAxis = bounds.append("g").call(yAxisGenerator);

  const xAxisGenerator = d3.axisBottom().scale(xScale);

  const xAxis = bounds.append("g").call(xAxisGenerator);

  // 我们需要移动x轴到底部，由于坐标轴生成器并不知道坐标轴需要放到哪个位置，它只知道刻度线和坐标的相对周标轴位置
  xAxis.style("transform", `translate(0px, ${dimensions.boundleHeight}px)`);
}

drawLineChart();
