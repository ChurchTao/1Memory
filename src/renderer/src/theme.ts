import {
  MantineThemeOverride,
  createTheme,
  Image,
  CSSVariablesResolver,
  Select
} from '@mantine/core'

export const theme: MantineThemeOverride = createTheme({
  colors: {
    // #f7f7f7 ~ #313131 ，计算出10个颜色
    blk: [
      '#f7f7f7',
      '#eaeaea',
      '#dcdcdc',
      '#cecece',
      '#c0c0c0',
      '#b2b2b2',
      '#a4a4a4',
      '#969696',
      '#888888',
      '#313131'
    ]
  },
  fontFamily: 'var(--font-sans)',
  primaryShade: { light: 6, dark: 8 },
  focusRing: 'never',
  /** Put your mantine theme override here */
  components: {
    Image: Image.extend({
      styles: {
        root: {
          borderRadius: 8
        }
      }
    }),
    Select: Select.extend({
      defaultProps: {
        checkIconPosition: 'right'
      }
    })
  }
})

//--sa-thumb-height
export const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {
    '--mantine-color-body': '#fff',
    '--mantine-color-text': '#262626'
  },
  dark: {
    '--mantine-color-body': '#262626',
    '--mantine-color-text': '#fff'
  }
})
