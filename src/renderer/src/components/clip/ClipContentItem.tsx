import {
  IconSquare1Filled,
  IconSquare2Filled,
  IconSquare3Filled,
  IconSquare4Filled,
  IconSquare5Filled,
  IconSquare6Filled,
  IconSquare7Filled,
  IconSquare8Filled,
  IconSquare9Filled,
  IconClipboard
} from '@tabler/icons-react'
import { Fragment, useMemo } from 'react'
import { Flex, Image, Mark, Text } from '@mantine/core'
import classes from '../../assets/Clip.module.scss'
import { Command } from 'cmdk'
import { MemoryItemReact } from '@common/bo'
import { useTranslation } from 'react-i18next'

interface ClipContentItemProps {
  id: string
  content: MemoryItemReact
  selected: boolean
  index: number
  showIndex: boolean
  highLight: string
  onClick: () => void
  onDoubleClick: () => void
  onContextMenu: (e) => void
}

export default function ClipContentItem(props: ClipContentItemProps): JSX.Element {
  const { t } = useTranslation()
  const { id, content, selected, index, showIndex, highLight } = props
  return (
    <>
      <Command.Item
        id={id}
        value={id}
        onSelect={props.onClick}
        onDoubleClick={props.onDoubleClick}
        data-choose={selected}
        onContextMenu={props.onContextMenu}
      >
        <Flex align={'center'}>{getIcon(showIndex, index)}</Flex>
        {renderContent(content, highLight)}
        <span className={classes.itemRight} data-choose={selected}>
          {t(`mime_types_${content.type}`)}
        </span>
      </Command.Item>
    </>
  )
}
type Chunk = {
  text: string
  match: boolean
}

type HighlightOptions = {
  text: string
  query: string
}

function buildRegex(query: string): RegExp | null {
  const _query = query.trim()
  if (!_query.length) {
    return null
  }
  return new RegExp(`(${_query})`, 'i')
}

function highlightWords({ text, query }: HighlightOptions): Chunk[] {
  const regex = buildRegex(query)
  if (!regex) {
    return [{ text, match: false }]
  }
  const result = text.split(regex).filter(Boolean)
  return result.map((str) => ({ text: str, match: regex.test(str) }))
}

function useHighlight(props: HighlightOptions): Chunk[] {
  const { text, query } = props
  return useMemo(() => highlightWords({ text, query }), [text, query])
}

const MyHighlight = (props: { text: string; query: string }): JSX.Element => {
  // 通过正则匹配 text 中的 query，并高亮显示
  const { text, query } = props
  if (!query) {
    return (
      <Text lh={2} size="sm" lineClamp={5}>
        {text}
      </Text>
    )
  }
  const chunks = useHighlight({ query, text })
  return (
    <Text lh={2} size="sm" lineClamp={5}>
      {chunks.map((chunk, index) => {
        return chunk.match ? (
          <Mark key={index} bg="orange.1">
            {chunk.text}
          </Mark>
        ) : (
          <Fragment key={index}>{chunk.text}</Fragment>
        )
      })}
    </Text>
  )
}

const renderContent = (content: MemoryItemReact, highLight: string): JSX.Element => {
  switch (content.type) {
    case 'text':
      return <MyHighlight text={content.value} query={highLight} />
    case 'image':
      return <Image maw={150} mah={150} fit={'contain'} src={content.value} />
    case 'html':
      return <MyHighlight text={content.value} query={highLight} />
    // case 'file':
    //   return <Text>{'未知类型'}</Text>
    case 'rtf':
      return <MyHighlight text={content.value} query={highLight} />
    default:
      return <Text>{'未知类型'}</Text>
  }
}

//'text' | 'html' | 'image' | 'file'
const getIcon = (showIndex: boolean, index: number): JSX.Element => {
  if (showIndex && index < 9) {
    switch (index) {
      case 0:
        return <IconSquare1Filled size={18} />
      case 1:
        return <IconSquare2Filled size={18} />
      case 2:
        return <IconSquare3Filled size={18} />
      case 3:
        return <IconSquare4Filled size={18} />
      case 4:
        return <IconSquare5Filled size={18} />
      case 5:
        return <IconSquare6Filled size={18} />
      case 6:
        return <IconSquare7Filled size={18} />
      case 7:
        return <IconSquare8Filled size={18} />
      case 8:
        return <IconSquare9Filled size={18} />
      default:
        return <IconClipboard size={18} stroke={1.2} />
    }
  }
  return <IconClipboard size={18} stroke={1.2} />
}
