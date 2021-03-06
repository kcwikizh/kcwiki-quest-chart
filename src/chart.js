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

const mapColor = type => {
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

/**
 * update position
 */
const updateLink = link =>
  link
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y)

const updateNode = node =>
  node.attr('transform', d => `translate(${d.x}, ${d.y})`)
// node.attr('cx', d => d.x).attr('cy', d => d.y)

const updateNodeText = nodesText =>
  nodesText.attr('x', d => d.x).attr('y', d => d.y)

/**
 * draw chart
 */
const chart = ({ width, height }) => {
  const nodeRadius = 10
  const markerWidth = 6
  const markerHeight = 6
  const refX = 28
  const refY = 0

  const linksData = questLinks
  const nodesData = questNodes

  const simulation = d3
    .forceSimulation(nodesData)
    .force('link', d3.forceLink(linksData).id(d => d.game_id))
    .force('charge', d3.forceManyBody().strength(-250))
    // positioning forces
    .force('x', d3.forceX())
    .force('y', d3.forceY())
  // .force('center', d3.forceCenter(0, 0))

  const svg = d3
    .create('svg')
    .attr('viewBox', [-width / 2, -height / 2, width, height])
  const container = svg.append('g')

  /**
   * arrowhead
   */
  svg
    .append('defs')
    .selectAll('marker')
    .data(['arrowhead'])
    .enter()
    .append('marker')
    .attr('id', String)
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', refX)
    .attr('refY', refY)
    .attr('markerWidth', markerWidth)
    .attr('markerHeight', markerHeight)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#999')

  const text_dx = -40
  const text_dy = 22

  const nodesText = container
    .append('g')
    .selectAll('.nodetext')
    .data(nodesData)
    .enter()
    .append('text')
    .attr('class', 'nodetext')
    .attr('dx', text_dx)
    .attr('dy', text_dy)
    .text(d => d.name)

  const link = container
    .append('g')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .selectAll('line')
    .data(linksData)
    .join('line')
    .attr('marker-end', 'url(#arrowhead)')

  const node = container
    .append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .selectAll('circle')
    .data(nodesData)
    .join('circle')
    .attr('r', nodeRadius)
    .attr('fill', d => mapColor(d.category))
    .call(drag(simulation))

  node.append('title').text(d => d.name)

  simulation.on('tick', () => {
    updateLink(link)
    updateNode(node)
    updateNodeText(nodesText)
  })

  svg.call(
    d3
      .zoom()
      .scaleExtent([0.5, 4])
      .on('zoom', function() {
        container.attr('transform', d3.event.transform)
      }),
  )

  return svg.node()
}

export { chart }
