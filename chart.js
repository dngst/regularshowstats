async function drawBarChart() {
    // access data
    const dataset = await d3.csv('./data/average_viewership.csv').then(response => {
        return response;
    })

    const yAccessor = d => d['Average Viewership']
    const xAccessor = d => d['Season']

    // chart dimensions
    const width = 500
    let dimensions = {
        width: width,
        height: width * 1,
        margin: {
            top: 30,
            right: 10,
            bottom: 50,
            left: 50
        }
    }

    dimensions.boundedWidth = dimensions.width
        - dimensions.margin.left
        - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height
        - dimensions.margin.top
        - dimensions.margin.bottom

    // draw canvas
    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)

    let bounds = wrapper.append("g")
        .style("transform", `translate(${
            dimensions.margin.left
        }px, ${
            dimensions.margin.top
        }px)`)

    // create scales
    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        .range([dimensions.boundedHeight, 0])
        .nice()

    const xScale = d3.scaleBand()
        .domain(dataset.map(xAccessor))
        .range([0, dimensions.boundedWidth])
        .padding(0.1)

    // draw peripherals
    const yAxisGenerator = d3.axisLeft()
        .scale(yScale)

    const yAxis = bounds.append("g")
        .call(yAxisGenerator)
        .attr("id", "y-axis")

    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)

    const xAxis = bounds.append("g")
        .call(xAxisGenerator)
        .attr("id", "x-axis")
        .style("transform", `translateY(${dimensions.boundedHeight}px)`)

    const yAxisLabel = yAxis.append("text")
        .attr("x", -dimensions.boundedHeight / 2)
        .attr("y", -dimensions.margin.left + 17)
        .text("U.S Viewers (Millions)")
        .attr("class", "y-axis-label")

    // draw data
    const bars = bounds.append("g")
        .selectAll("g")
        .data(dataset)
        .enter().append("rect")
        .on("mouseenter", function(e, datum) {
            onMouseEnter(datum)
        })
        .on("mousemove", onMouseMove)
        .on("mouseleave", onMouseLeave)
        .attr("x", d => xScale(xAccessor(d)))
        .attr("y", d => yScale(yAccessor(d)))
        .attr("width", xScale.bandwidth())
        .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
        .attr("class", "bar")

    const tooltip = d3.select("#tooltip")
        .attr("class", "tooltip")

    function onMouseEnter(d) {
        tooltip.select("#season")
            .text(`Season ${d['Season']}`)
        tooltip.select("#viewers")
            .text(`${d['Average Viewership']}M`)
        tooltip.style("opacity", 0.9)
    }

    function onMouseMove() {
        tooltip.style("left", `${event.pageX - 42}px`)
        tooltip.style("top", `${event.pageY - 65}px`)
    }

    function onMouseLeave() {
        tooltip.style("opacity", 0)
    }
}

drawBarChart()

