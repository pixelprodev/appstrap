import React from 'react'
import styled from 'react-emotion'
import Cell from './Cell'

const Row = styled.div(({ theme, header }) => ({
  display: 'grid',
  gridTemplateColumns: header.map(h => h.props.width || '1fr').join(' '),
  minHeight: 35,
  padding: `0 ${theme.spacing.standard}`
}))

class TRow extends React.Component {
  render () {
    const { cellData, header } = this.props
    return (
      <Row header={header}>
        {
          header.map((h, indx) => {
            if (cellData[h.props.name]) {
              return (
                <Cell key={indx} position={indx} align={h.props.align}>
                  {typeof cellData[h.props.name] === 'string'
                    ? <span>{cellData[h.props.name]}</span>
                    : cellData[h.props.name]}
                </Cell>
              )
            }
          })
        }
      </Row>
    )
  }
}

export default TRow
