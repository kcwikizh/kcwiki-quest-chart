import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'

import { GlobalStyle } from './styles'
import { chart } from './chart'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const Wrapper = styled.div`
  flex: 1;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
`

const Chart = styled.div`
  width: 100%;
  height: 100%;

  .nodetext {
    font-family: SimSun;
    font-size: 12px;
    fill: #000;
    user-select: none;
  }
`

export const App = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const drawChart = () => {
      if (!chartRef.current) {
        return
      }

      const node: HTMLElement = chart({
        width: chartRef.current.clientWidth,
        height: chartRef.current.clientHeight,
      })
      chartRef.current.appendChild(node)
    }
    drawChart()
  }, [chartRef])

  return (
    <>
      <GlobalStyle />
      <Container>
        <Wrapper>
          <Chart ref={chartRef}></Chart>
        </Wrapper>
      </Container>
    </>
  )
}
