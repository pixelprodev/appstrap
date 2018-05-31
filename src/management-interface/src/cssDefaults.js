import { css } from 'glamor'

css.global(`html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section, summary,
  time, mark, audio, video`, ({
    margin: 0,
    padding: 0,
    border: 0,
    outline: 0,
    fontSize: 14,
    verticalAlign: 'baseline'
  })
)
/* HTML5 display-role reset for older browsers */
css.global(`article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section`, {display: 'block'})
css.global('body', {lineHeight: 1})
css.global('ol, ul', {listStyle: 'none'})

css.global('table', {borderCollapse: 'collapse', borderSpacing: 0})

css.global('*, *:before, *:after', {
  fontFamily: 'Source Sans Pro',
  fontStyle: 'normal',
  boxSizing: 'border-box'
})
