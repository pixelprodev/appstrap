import styled, { keyframes } from 'react-emotion'
import React from 'react'

const CenteringDiv = styled.div({
  height: 'calc(100vh - 265px)',
  minHeight: 300,
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
})
const OuterDiv = styled.div({
  display: 'flex',
  background: 'none',
  justifyContent: 'center',
  alignItems: 'center',
  width: 50,
  height: 50
})
const ringAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`
const InnerDiv = styled.div(({ theme }) => ({
  display: 'block',
  borderRadius: 80,
  animation: `${ringAnimation} 1s linear infinite`,
  width: '100%',
  height: '100%',
  boxShadow: `0 2px 0 0 ${theme.colors.primary}`
}))

const Loader = () =>
  <CenteringDiv>
    <OuterDiv><InnerDiv /></OuterDiv>
  </CenteringDiv>

export default Loader
