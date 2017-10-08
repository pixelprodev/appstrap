import { colors } from '../styles'
import glamorous from 'glamorous'
import React from 'react'

const StyledButton = glamorous.button({
  cursor: 'pointer',
  outline: 'none',
  borderRadius: '5px',
  fontWeight: 500,
  fontSize: 12,
  background: '#ffffff',
  color: colors.text.greyDark,
  width: '100%',
  height: 30,
  border: `1px solid #D0D4E1`,
  ' a': {
    textDecoration: 'none',
    color: 'inherit'
  }
})

export default StyledButton
