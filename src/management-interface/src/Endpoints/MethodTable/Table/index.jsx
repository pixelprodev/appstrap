import PropTypes from 'prop-types'
import React from 'react'
import styled from 'react-emotion'
import HeaderCell from './HeaderCell'
import THeader from './THeader'
import TRow from './TRow'

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column'
})

class Table extends React.Component {
  render () {
    const { header, rows } = this.props
    return (
      <Container>
        <THeader>{header}</THeader>
        {rows.map((row, indx) => <TRow key={indx} header={header} cellData={row} />)}
      </Container>
    )
  }
}

export default Table
