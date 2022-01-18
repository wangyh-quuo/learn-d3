import * as d3 from "d3";

async function drawHistogram(metric) {
  // 1. 获取数据
  const dataset = await d3.json("/json/my-weather.json");
  const metricAccessor = (d) => d[metric];

  // 2. 创建度量
  const width = 600;
  let dimensions = {
    width: width,
    height: width * 0.6,
    margin: {
      top: 30,
      right: 10,
      bottom: 50,
      left: 50,
    },
  };
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;
  // 3. 绘制容器
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
  // 4. 创建比例尺
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, metricAccessor))
    .range([0, dimensions.boundedWidth])
    .nice();
  const binsGenerator = d3
    .histogram() // 直方图
    .domain(xScale.domain())
    .value(metricAccessor)
    .thresholds(12);
  const bins = binsGenerator(dataset);

  const yAccessor = (d) => d.length;

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(bins, yAccessor)])
    .range([dimensions.boundedHeight, 0]);

  // 5. 绘制数据
  const binsGroup = bounds.append("g");
  const binGroups = binsGroup.selectAll("g").data(bins).enter();

  const barPadding = 10;

  const barRects = binGroups
    .append("g")
    .append("rect")
    .attr("x", (d) => xScale(d.x0) + barPadding / 2)
    .attr("y", (d) => yScale(yAccessor(d)))
    .attr("width", (d) => d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding]))
    .attr("height", (d) => dimensions.boundedHeight - yScale(yAccessor(d)))
    .attr("fill", "cornflowerblue");

  binGroups
    .filter(yAccessor)
    .append("text")
    .attr("x", (d) => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
    .attr("y", (d) => yScale(yAccessor(d)) - 5)
    .text(yAccessor)
    .style("text-anchor", "middle")
    .attr("fill", "darkgrey")
    .style("font-size", "12px")
    .style("font-family", "sans-serif");

  // 6. 绘制其它内容
  // 中间线
  const mean = d3.mean(dataset, metricAccessor);
  console.log(mean);
  const meanLine = bounds
    .append("line")
    .attr("x1", xScale(mean))
    .attr("x2", xScale(mean))
    .attr("y1", -15)
    .attr("y2", dimensions.boundedHeight)
    .attr("stroke", "maroon")
    .attr("stroke-dasharray", "2px 4px");
  const meanLabel = bounds
    .append("text")
    .attr("x", xScale(mean))
    .attr("y", -20)
    .style("text-anchor", "middle")
    .text("mean")
    .attr("fill", "maroon")
    .style("font-size", "12px")
    .style("font-family", "sans-serif");
  // 边界
  const xAxisGenerator = d3.axisBottom().scale(xScale);
  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator)
    .style("transform", `translate(0, ${dimensions.boundedHeight}px)`);
  const xAxisLabel = xAxis
    .append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .text(metric)
    .style("text-transform", "capitalize");

  // 设置SVG为图形区域
  // wrapper.attr("role", "figure").attr("tabindex", "0");
  // wrapper
  //   .append("title")
  //   .text("Histogram looking at the distribution of humidity in 2016");
  // wrapper.attr("role", "list").attr("aria-label", "histogram bars");
}

const metrics = [
  "windSpeed",
  "moonPhase",
  "dewPoint",
  "humidity",
  "uvIndex",
  "windBearing",
  "temperatureMin",
  "temperatureMax",
];
metrics.forEach(drawHistogram);
// drawBarChart();
