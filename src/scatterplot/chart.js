import * as d3 from "d3";

async function drawScatterplotChart() {
  // 1. access data
  const dataset = await d3.json("/json/my-weather.json");
  console.table(dataset[0]);
  const xAccessor = (data) => data.dewPoint;
  const yAccessor = (data) => data.humidity;

  const colorAccessor = (d) => d.cloudCover;

  // 2. create chart dimensions
  const width = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9]);
  let dimensions = {
    width,
    height: width,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50,
    },
  };
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;
  // 3. draw canvas
  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);
  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );
  // 4. create scales
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice();
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice();
  const colorScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, colorAccessor))
    .range(["skyblue", "darkslategrey"]);
  // 5. draw data
  // data join
  // dataset.forEach((item) => {
  //   bounds
  //     .append("circle")
  //     .attr("cx", xScale(xAccessor(item)))
  //     .attr("cy", yScale(yAccessor(item)))
  //     .attr("r", 5);
  // });
  function drawDots(dataset, color) {
    const dots = bounds.selectAll("circle").data(dataset);
    dots
      .enter() // update select
      .append("circle")
      .merge(dots) // 重复绘制的图形后者操作合并前者
      .attr("cx", (data) => xScale(xAccessor(data)))
      .attr("cy", (data) => yScale(yAccessor(data)))
      .attr("r", 2)
      .attr("fill", color);
  }
  // const dots = bounds
  //   .selectAll("circle")
  //   .data(dataset)
  //   .enter() // update select
  //   .append("circle")
  //   .attr("cx", (data) => xScale(xAccessor(data)))
  //   .attr("cy", (data) => yScale(yAccessor(data)))
  //   .attr("r", 2)
  //   .attr("fill", 'cornflowerblue');
  drawDots(dataset, (d) => colorScale(colorAccessor(d)));
  // setTimeout(() => {
  //   drawDots(dataset.slice(0, 100), "green");
  // }, 2000);
  // 6. draw peripherals
  const xAxisGenerator = d3.axisBottom().scale(xScale);
  const xAxis = bounds.append("g").call(xAxisGenerator);
  xAxis.style("transform", `translate(0px, ${dimensions.boundedHeight}px)`);
  const xAxisLabel = xAxis
    .append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .html("Dew point (&deg;F)");
  const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(4);
  const yAxis = bounds.append("g").call(yAxisGenerator);
  const yAxisLabel = yAxis
    .append("text")
    .attr("x", -dimensions.boundedHeight / 2)
    .attr("y", -dimensions.margin.left + 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .style("transform", "rotate(-90deg)")
    .style("text-anchor", "middle")
    .html("Dew point (&deg;F)");
  // 7. set up interactions
}

drawScatterplotChart();
