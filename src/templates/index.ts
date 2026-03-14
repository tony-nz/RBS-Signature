import type { SignatureTemplate } from '../types'
import { modernTemplate } from './modern'
import { minimalTemplate } from './minimal'
import { corporateTemplate } from './corporate'
import { boldTemplate } from './bold'
import { compactTemplate } from './compact'
import { stackedTemplate } from './stacked'
import { classicTemplate } from './classic'

export const templates: SignatureTemplate[] = [
  modernTemplate,
  stackedTemplate,
  classicTemplate,
  minimalTemplate,
  corporateTemplate,
  boldTemplate,
  compactTemplate,
]
