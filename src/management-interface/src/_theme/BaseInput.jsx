import styled from 'react-emotion'

export default styled.input(({ theme }) => ({
  height: 36,
  width: 250,
  borderRadius: 3,
  fontWeight: 700,
  padding: `0 ${theme.spacing.thin}`,
  border: `1px solid ${theme.border.color}`
}))
