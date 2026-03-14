import type { SignatureTemplate, SignatureData } from '../types'
import { fontCss, fontSizePx, avatarRadiusCss, avatarDimPx, logoDimPx, dividerHtml, renderSocials, ctaHtml, meetingHtml, disclaimerHtml, resolveColors } from './helpers'

export const classicTemplate: SignatureTemplate = {
  id: 'classic',
  name: 'Classic',
  description: 'Title in accent color, contacts stacked vertically',
  render(data: SignatureData): string {
    const color = data.accentColor || '#6366f1'
    const fc = resolveColors(data)
    const sz = fontSizePx(data)
    const base = `${fontCss(data)}font-size:${sz.base}px;line-height:1.5;color:${fc.body};`

    const avatarDim = avatarDimPx(data)
    const radius = avatarRadiusCss(data)

    const leftParts: string[] = []
    if (data.visibility.avatar && data.avatar) {
      leftParts.push(`<img src="${data.avatar}" width="${avatarDim}" height="${avatarDim}" style="border-radius:${radius};display:block;object-fit:cover;" />`)
    }
    if (data.visibility.logo && data.logo) {
      const ld = logoDimPx(data)
      leftParts.push(`<img src="${data.logo}" width="${ld}" style="display:block;max-height:${ld}px;object-fit:contain;${leftParts.length ? 'margin-top:8px;' : ''}" />`)
    }
    const avatarCell = leftParts.length
      ? `<td style="padding-right:16px;vertical-align:top;">${leftParts.join('')}</td>`
      : ''

    return `
<table cellpadding="0" cellspacing="0" border="0" style="${base}">
  <tbody><tr>
    ${avatarCell}
    <td style="vertical-align:top;">
      <table cellpadding="0" cellspacing="0" border="0"><tbody>
        <tr><td style="font-size:${sz.name}px;font-weight:700;color:${fc.name};">${data.name}</td></tr>
        ${data.title ? `<tr><td style="font-size:${sz.meta}px;color:${color};padding-top:2px;">${data.title}</td></tr>` : ''}
        ${data.company ? `<tr><td style="font-size:${sz.meta}px;color:${fc.title};padding-top:1px;">${data.company}</td></tr>` : ''}
        ${data.tagline ? `<tr><td style="font-size:${sz.small}px;color:${fc.muted};font-style:italic;padding-top:1px;">${data.tagline}</td></tr>` : ''}
        ${dividerHtml(data, color)}
        ${data.email ? `<tr><td style="padding-top:6px;font-size:${sz.base}px;color:${fc.body};">${data.email}</td></tr>` : ''}
        ${data.phone ? `<tr><td style="font-size:${sz.base}px;color:${fc.body};">${data.phone}</td></tr>` : ''}
        ${data.mobile ? `<tr><td style="font-size:${sz.base}px;color:${fc.body};">M: ${data.mobile}</td></tr>` : ''}
        ${data.website ? `<tr><td style="font-size:${sz.base}px;color:${fc.body};">${data.website}</td></tr>` : ''}
        ${data.address ? `<tr><td style="font-size:${sz.small}px;color:${fc.muted};padding-top:2px;">${data.address}</td></tr>` : ''}
        ${meetingHtml(data, color)}
        ${renderSocials(data, color)}
        ${ctaHtml(data)}
        ${disclaimerHtml(data)}
      </tbody></table>
    </td>
  </tr></tbody>
</table>`.trim()
  },
}
