import * as d3 from 'd3'
import questNodes from '../data/poi.json'
import questLinks from '../data/edges.json'

const drag = simulation => {
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }

  function dragged(d) {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }

  return d3
    .drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended)
}

const color = type => {
  // @see https://github.com/kcwikizh/kcdata/wiki/Quest
  const defaultColor = '#111'
  const colorMap = {
    1: 'rgb(152, 217, 142)',
    2: 'rgb(255, 151, 151)',
    3: 'rgb(152, 217, 142)',
    4: 'rgb(166, 255, 255)',
    5: 'rgb(215, 207, 58)',
    6: 'rgb(168, 111, 76)',
    7: 'rgb(201, 165, 226)',
    8: 'rgb(255, 151, 151)',
    9: '#222',
  }
  if (!colorMap[type]) {
    return defaultColor
  }
  return colorMap[type]
}

const chart = ({ width, height }) => {
  const links = questLinks
  const nodes = questNodes

  const simulation = d3
    .forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.game_id))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2))

  const svg = d3.create('svg').attr('viewBox', [0, 0, width, height])

  const text_dx = -20
  const text_dy = 20

  const nodesText = svg
    .selectAll('.nodetext')
    .data(nodes)
    .enter()
    .append('text')
    .attr('class', 'nodetext')
    .attr('dx', text_dx)
    .attr('dy', text_dy)
    .text(d => d.name)

  const link = svg
    .append('g')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke-width', d => Math.sqrt(d.value))

  const node = svg
    .append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', 10)
    .attr('fill', d => color(d.category))
    .call(drag(simulation))

  node.append('title').text(d => d.name)

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)

    node.attr('cx', d => d.x).attr('cy', d => d.y)

    nodesText.attr('x', d => d.x)
    nodesText.attr('y', d => d.y)
  })

  return svg.node()
}

export { chart }
