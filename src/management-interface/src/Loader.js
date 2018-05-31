import { css } from 'glamor'
import glamorous from 'glamorous'
import React from 'react'
import colors from './colors'

const CenteringDiv = glamorous.div({
  height: 'calc(100vh - 265px)',
  minHeight: 300,
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
})
const OuterDiv = glamorous.div({
  display: 'flex',
  background: 'none',
  justifyContent: 'center',
  alignItems: 'center',
  width: 50,
  height: 50
})
const ringAnimation = () => {
  const ring = css.keyframes({
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  })
  return {animation: `${ring} 1s linear infinite`}
}
const AnimatedRing = glamorous.div(ringAnimation)
const InnerDiv = glamorous(AnimatedRing)('error', {
  display: 'block',
  borderRadius: 80,
  width: '100%',
  height: '100%',
  boxShadow: `0 2px 0 0 ${colors.grey.default}`
})

const Loader = () =>
  <CenteringDiv>
    <OuterDiv><InnerDiv /></OuterDiv>
  </CenteringDiv>

export default Loader
