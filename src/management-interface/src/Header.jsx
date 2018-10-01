import React from 'react'
import styled from 'react-emotion'
import AppstrapLogo from './svgs/AppstrapLogo'

const Container = styled.header(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: `0 ${theme.spacing.standard}`,
  height: 70,
  width: '100%',
  borderBottom: `${theme.border.width} solid ${theme.border.color}`
}))

const Title = styled.span({
  fontSize: 26,
  fontWeight: 300,
  ' > strong': {
    fontSize: 'inherit',
    display: 'inline-block',
    margin: '0 5px 0 15px'
  }
})

class Header extends React.Component {
  render () {
    return (
      <Container>
        <AppstrapLogo />
        <Title><strong>Appstrap</strong> Management Interface</Title>
      </Container>
    )
  }
}

export default Header
