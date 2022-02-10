import type { CSSObject, Preset } from '@unocss/core'
import { getPreflights } from './preflights'

/**
 * @public
 */
export interface TypographyOptions {
  /**
   * The class name to use the typographic utilities.
   * To undo the styles to the elements, use it like
   * `not-${className}` which is by default `not-prose`.
   *
   * Note: `not` utility is only available in class.
   *
   * @defaultValue `prose`
   */
  className?: string

  /**
   * Extend or override CSS selectors with CSS declaration block.
   *
   * @defaultValue undefined
   */
  cssExtend?: Record<string, CSSObject>
}

/**
 * UnoCSS Preset for Typography
 *
 * ```js
 * // unocss.config.js
 * import { presetAttributify, presetUno, defineConfig } from 'unocss'
 * import { presetTypography } from '@unocss/preset-typography'
 *
 * export default defineConfig({
 *   presets: [
 *     presetAttributify(), // required if using attributify mode
 *     presetUno(), // required
 *     presetTypography()
 *   ]
 * })
 * ```
 *
 * @returns typography preset
 * @public
 */
export function presetTypography(options?: TypographyOptions): Preset {
  let hasProseClass = false
  let selectorProse = ''
  const className = options?.className || 'prose'
  const classNameRE = new RegExp(`^${className}$`)
  const colorsRE = new RegExp(
    `^${className}-(rose|pink|fuchsia|purple|violet|indigo|blue|sky|cyan|teal|emerald|green|lime|yellow|amber|orange|red|gray|slate|zinc|neutral|stone)$`,
  )
  const invertRE = new RegExp(`^${className}-invert$`)
  const cssExtend = options?.cssExtend

  return {
    name: '@unocss/preset-typography',
    enforce: 'post',
    layers: { typography: -1 },
    rules: [
      [
        classNameRE,
        (_, { rawSelector }) => {
          hasProseClass = true
          selectorProse = rawSelector
          return { 'color': 'var(--un-prose-body)', 'max-width': '65ch' }
        },
        { layer: 'typography' },
      ],
      [
        colorsRE,
        ([, color], { theme }) => {
          return {
            // @ts-expect-error colors exist
            '--un-prose-body': theme.colors[color][700],
            // @ts-expect-error colors exist
            '--un-prose-headings': theme.colors[color][900],
            // @ts-expect-error colors exist
            '--un-prose-links': theme.colors[color][900],
            // @ts-expect-error colors exist
            '--un-prose-lists': theme.colors[color][400],
            // @ts-expect-error colors exist
            '--un-prose-hr': theme.colors[color][200],
            // @ts-expect-error colors exist
            '--un-prose-captions': theme.colors[color][500],
            // @ts-expect-error colors exist
            '--un-prose-code': theme.colors[color][900],
            // @ts-expect-error colors exist
            '--un-prose-borders': theme.colors[color][200],
            // @ts-expect-error colors exist
            '--un-prose-bg-soft': theme.colors[color][100],

            // invert colors (dark mode)
            // @ts-expect-error colors exist
            '--un-prose-invert-body': theme.colors[color][200],
            // @ts-expect-error colors exist
            '--un-prose-invert-headings': theme.colors[color][100],
            // @ts-expect-error colors exist
            '--un-prose-invert-links': theme.colors[color][100],
            // @ts-expect-error colors exist
            '--un-prose-invert-lists': theme.colors[color][500],
            // @ts-expect-error colors exist
            '--un-prose-invert-hr': theme.colors[color][700],
            // @ts-expect-error colors exist
            '--un-prose-invert-captions': theme.colors[color][400],
            // @ts-expect-error colors exist
            '--un-prose-invert-code': theme.colors[color][100],
            // @ts-expect-error colors exist
            '--un-prose-invert-borders': theme.colors[color][700],
            // @ts-expect-error colors exist
            '--un-prose-invert-bg-soft': theme.colors[color][800],
          }
        },
        { layer: 'typography' },
      ],
      [
        invertRE,
        () => {
          return {
            '--un-prose-body': 'var(--un-prose-invert-body)',
            '--un-prose-headings': 'var(--un-prose-invert-headings)',
            '--un-prose-links': 'var(--un-prose-invert-links)',
            '--un-prose-lists': 'var(--un-prose-invert-lists)',
            '--un-prose-hr': 'var(--un-prose-invert-hr)',
            '--un-prose-captions': 'var(--un-prose-invert-captions)',
            '--un-prose-code': 'var(--un-prose-invert-code)',
            '--un-prose-borders': 'var(--un-prose-invert-borders)',
            '--un-prose-bg-soft': 'var(--un-prose-invert-bg-soft)',
          }
        },
        { layer: 'typography' },
      ],
    ],
    preflights: [
      {
        layer: 'typography',
        getCSS: () =>
          hasProseClass
            ? getPreflights(selectorProse, className, cssExtend)
            : undefined,
      },
    ],
  }
}
