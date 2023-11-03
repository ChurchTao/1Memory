import {
  IconCopy,
  IconDots,
  IconHtml,
  IconPhoto,
  IconPin,
  IconRegex,
  IconTextPlus,
  IconTrash,
  IconTxt
} from '@tabler/icons-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import ClipContentItem from '../components/clip/ClipContentItem'
import ClipBottomBar from '../components/clip/ClipBottomBar'
import { ClipItemType, ClipItem } from '@renderer/domain/data'
import { ClipItemDocVO } from '@common/vo'
import { MimeTypes, SearchModes } from '@common/const'
import { useTranslation } from 'react-i18next'
import { useHotkeys } from 'react-hotkeys-hook'
import { Key } from 'ts-key-enum'
import {
  ActionIcon,
  Box,
  Button,
  Code,
  Collapse,
  Group,
  Menu,
  Modal,
  ScrollArea,
  rem
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import classes from '../assets/Clip.module.scss'
import { Command } from 'cmdk'

function convertToClipItem(item: ClipItemDocVO): ClipItem | null {
  if (item.types.includes(MimeTypes.IMG) && item.thumbnail !== null) {
    const blob = new Blob([item.thumbnail], { type: MimeTypes.IMG })
    return {
      id: item._id,
      createdAt: item.createdAt,
      type: 'image',
      value: URL.createObjectURL(blob)
    }
  }
  const hasTxt = item.types.includes(MimeTypes.TXT)
  const hasRtf = item.types.includes(MimeTypes.RTF)
  const hasHtml = item.types.includes(MimeTypes.HTML)
  if (hasTxt || hasRtf || hasHtml) {
    let _type: ClipItemType = 'text'
    if (hasHtml) {
      _type = 'html'
    } else if (hasRtf) {
      _type = 'rtf'
    }
    return {
      id: item._id,
      createdAt: item.createdAt,
      type: _type,
      value: item.txt
    }
  }
  return null
}

function onCopy(id: string, onlyTxt: boolean): void {
  if (onlyTxt) {
    window.api.clip.handleCopyTxt(id)
  } else {
    window.api.clip.handleCopy(id)
  }
}

function Clip(): JSX.Element {
  const scrollbar = useRef<HTMLDivElement>(null)
  const [pin, setPin] = useState(false)
  const [selectId, setSelectId] = useState('')
  const [selectIndex, setSelectIndex] = useState(0)
  const [contentList, setContentList] = useState<Array<ClipItem>>([])
  const [init, setInit] = useState(false)
  const [showIndex, setShowIndex] = useState(false)
  const [searchTxt, setSearchTxt] = useState('')
  const [inputTipShow, setInputTipShow] = useState(false)
  const [inputTips, setInputTips] = useState('')
  const { t } = useTranslation()
  const [opened, { open, close }] = useDisclosure(false)
  const [stopListenShortcut, setStopListenShortcut] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchMode, setSearchMode] = useState(SearchModes.ALL)
  const [contextMenuOpen, setContextMenuOpen] = useState(false)
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 })

  const handleChangeSearchMode = (mode: string): void => {
    let finalMode = SearchModes.ALL
    if (mode != searchMode) {
      finalMode = mode
    }
    let _searchTxt = searchTxt
    if (
      finalMode === SearchModes.REGEXP ||
      finalMode === SearchModes.IMG ||
      finalMode === SearchModes.ALL
    ) {
      _searchTxt = ''
    }
    setSearchMode(finalMode)
    handleContentChange(_searchTxt, finalMode)
  }

  const handleMoveSelect = useCallback(
    (event: KeyboardEvent): void => {
      if (opened || stopListenShortcut) {
        return
      }
      if (selectId === '' && contentList.length > 0) {
        setSelectIndex(0)
        setSelectId(contentList[0].id)
        return
      }
      if (event.key === Key.ArrowUp) {
        if (selectIndex > 0) {
          setSelectIndex(selectIndex - 1)
          setSelectId(contentList[selectIndex - 1].id)
          scrollToCenter(Key.ArrowUp)
        }
      }
      if (event.key === Key.ArrowDown) {
        if (selectIndex < contentList.length - 1) {
          setSelectIndex(selectIndex + 1)
          setSelectId(contentList[selectIndex + 1].id)
          scrollToCenter(Key.ArrowDown)
        }
      }
    },
    [contentList, opened, selectId, selectIndex, stopListenShortcut]
  )

  const handleCopy = useCallback(
    (event: KeyboardEvent): void => {
      if (opened || stopListenShortcut) {
        return
      }
      if (event.metaKey || event.ctrlKey) {
        window.api.clip.handleCopyTxt(selectId)
      } else {
        window.api.clip.handleCopy(selectId)
      }
    },
    [opened, selectId, stopListenShortcut]
  )

  const handleEscape = useCallback((): void => {
    if (opened || stopListenShortcut) {
      close()
      return
    }
    window.api.win.closeWin('clip')
  }, [opened, stopListenShortcut])

  const handleShowIndex = useCallback(
    (event: KeyboardEvent): void => {
      if (opened || stopListenShortcut) {
        return
      }
      if (event.type === 'keydown') {
        setShowIndex(true)
      }
      if (event.type === 'keyup') {
        setShowIndex(false)
      }
    },
    [opened, stopListenShortcut]
  )

  const handleQuickCopyByIndex = useCallback(
    (event: KeyboardEvent): void => {
      if (opened || stopListenShortcut) {
        return
      }
      const index = parseInt(event.key)
      if (contentList.length > index - 1) {
        if (event.shiftKey) {
          window.api.clip.handleCopyTxt(contentList[index - 1].id)
        } else {
          window.api.clip.handleCopy(contentList[index - 1].id)
        }
      }
    },
    [contentList, opened, stopListenShortcut]
  )

  const handleShowDeleteDialog = useCallback((): void => {
    if (opened || stopListenShortcut) {
      return
    }
    console.log('handleShowDeleteDialog', selectId)
    if (selectId !== '') {
      open()
      setShowIndex(false)
    }
  }, [opened, selectId, stopListenShortcut])

  function initHotkeys(): void {
    // 上下箭头选择
    useHotkeys([Key.ArrowUp, Key.ArrowDown], handleMoveSelect, { enableOnFormTags: true })
    useHotkeys([Key.Meta + '+' + Key.Enter, Key.Enter], handleCopy, { enableOnFormTags: true })
    useHotkeys(Key.Escape, handleEscape, { enableOnFormTags: true })
    // 按住 Command 显示序号
    useHotkeys(Key.Meta, handleShowIndex, { keydown: true, keyup: true, enableOnFormTags: true })
    // 按住 Command + index 时，复制第一行
    useHotkeys(
      [
        Key.Meta + '+1',
        Key.Meta + '+2',
        Key.Meta + '+3',
        Key.Meta + '+4',
        Key.Meta + '+5',
        Key.Meta + '+6',
        Key.Meta + '+7',
        Key.Meta + '+8',
        Key.Meta + '+9',
        Key.Meta + '+' + Key.Shift + '+1',
        Key.Meta + '+' + Key.Shift + '+2',
        Key.Meta + '+' + Key.Shift + '+3',
        Key.Meta + '+' + Key.Shift + '+4',
        Key.Meta + '+' + Key.Shift + '+5',
        Key.Meta + '+' + Key.Shift + '+6',
        Key.Meta + '+' + Key.Shift + '+7',
        Key.Meta + '+' + Key.Shift + '+8',
        Key.Meta + '+' + Key.Shift + '+9'
      ],
      handleQuickCopyByIndex,
      { enableOnFormTags: true }
    )
    // Command + backSpace 删除选中行
    useHotkeys(Key.Meta + '+' + Key.Backspace, handleShowDeleteDialog, { enableOnFormTags: true })
  }

  function scrollToCenter(key: Key): void {
    // 移动到可视区域中间,保证当前选中的元素始终在可视区域最中间
    const item = document.getElementById(selectId)
    if (scrollbar.current && item !== null) {
      // 元素距离容器顶部的距离
      const itemTop = item.offsetTop
      // 元素的高度
      const itemHeight = item.offsetHeight
      // 容器的高度
      const containerHeight = scrollbar.current.offsetHeight
      // 容器的滚动高度
      const scrollTop = scrollbar.current.scrollTop
      if (key === Key.ArrowDown) {
        if (itemTop - scrollTop > containerHeight / 2) {
          scrollbar.current.scrollTo({
            top: itemTop + itemHeight - containerHeight / 2,
            behavior: 'smooth'
          })
        }
      }
      if (key === Key.ArrowUp) {
        if (itemTop - scrollTop < containerHeight / 2) {
          scrollbar.current.scrollTo({ top: itemTop - containerHeight / 2, behavior: 'smooth' })
        }
      }
    }
  }

  const handlePin = useCallback((): void => {
    setPin(!pin)
    window.api.win.pin('clip', !pin)
    // scrollbars.current?.scrollTop(0)
  }, [pin])

  const handleClickItem = (id: string, index: number): void => {
    setSelectId(id)
    setSelectIndex(index)
    console.log('handleClickItem', id)
  }
  function handleDoubleClickItem(item: ClipItem): void {
    console.log('copy', item)
    window.api.clip.handleCopy(item.id)
  }

  const handleContentChange = (txt: string | null, _searchMode?: string): void => {
    if (txt === null) {
      txt = searchTxt
    }
    if (!_searchMode) {
      _searchMode = searchMode
    }
    // 通过正则表达式，过滤highLight中所有的空白符
    txt = txt.replace(/\s+/g, '')
    // 如果searchByRegex为true，则使用正则表达式搜索,否则把txt内需要转义的字符转义
    const _searchTxt =
      _searchMode === SearchModes.REGEXP ? txt : txt.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
    if (_searchMode === SearchModes.REGEXP) {
      try {
        new RegExp(_searchTxt)
        setInputTips('')
        setInputTipShow(false)
      } catch (e) {
        setInputTips(t('clip_regexp_error'))
        setInputTipShow(true)
        return
      }
    }
    const searchType =
      _searchMode === SearchModes.ALL || _searchMode === SearchModes.REGEXP ? '' : _searchMode
    window.api.clip.findByTxtLike(_searchTxt, searchType, 1, 100).then((res) => {
      const list: Array<ClipItem> = []
      res.forEach((item: ClipItemDocVO) => {
        const clipItem = convertToClipItem(item)
        if (clipItem !== null) {
          list.push(clipItem)
        }
      })
      setContentList(list)
      setSearchTxt(_searchTxt)
    })
  }

  function handleInit(): void {
    handleContentChange('')
    window.api.clip.onChange(() => {
      handleContentChange(null)
    })
    window.api.clip.onBlur(() => {
      setShowIndex(false)
    })
    setInit(true)
  }

  function handleDeleteById(): void {
    if (selectId !== '') {
      window.api.clip.deleteById(selectId)
      const _selectIndex = selectIndex
      if (_selectIndex < contentList.length - 1) {
        setSelectIndex(_selectIndex + 1)
        setSelectId(contentList[_selectIndex + 1].id)
      } else if (_selectIndex > 0) {
        setSelectIndex(_selectIndex - 1)
        setSelectId(contentList[_selectIndex - 1].id)
      } else {
        setSelectIndex(0)
        setSelectId('')
      }
      close()
    }
  }

  const handleContextMenu = (e, id: string, index: number): void => {
    handleClickItem(id, index)
    setAnchorPoint({ x: e.clientX, y: e.clientY })
    setContextMenuOpen(true)
  }

  initHotkeys()

  useEffect(() => {
    if (!init) {
      handleInit()
    }
    return () => {}
  }, [init, setInit, setShowIndex])

  return (
    <>
      <Box h="100vh" w="100%" className={classes.main}>
        <Command shouldFilter={false}>
          <Command.Input
            spellCheck={false}
            ref={inputRef}
            autoFocus
            placeholder={t('search_placeholder')}
            onValueChange={(e): void => handleContentChange(e)}
          />
          <Collapse in={inputTipShow} animateOpacity>
            <Code ml={20} color="red.9" c="white">
              {inputTips}
            </Code>
          </Collapse>
          <Menu shadow="md" width={200} position={'bottom-end'}>
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                aria-label="more"
                color="gray"
                radius="md"
                className={classes.btnMore}
              >
                <IconDots size={20} stroke={1.2} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>筛选</Menu.Label>
              <Menu.Item
                color={searchMode === SearchModes.TXT ? 'blue' : ''}
                onClick={(): void => handleChangeSearchMode(SearchModes.TXT)}
                leftSection={<IconTxt style={{ width: rem(14), height: rem(14) }} />}
              >
                文本
              </Menu.Item>
              <Menu.Item
                color={searchMode === SearchModes.IMG ? 'blue' : ''}
                onClick={(): void => handleChangeSearchMode(SearchModes.IMG)}
                leftSection={<IconPhoto style={{ width: rem(14), height: rem(14) }} />}
              >
                图片
              </Menu.Item>
              <Menu.Item
                color={searchMode === SearchModes.RTF ? 'blue' : ''}
                onClick={(): void => handleChangeSearchMode(SearchModes.RTF)}
                leftSection={<IconTextPlus style={{ width: rem(14), height: rem(14) }} />}
              >
                富文本
              </Menu.Item>
              <Menu.Item
                color={searchMode === SearchModes.HTML ? 'blue' : ''}
                onClick={(): void => handleChangeSearchMode(SearchModes.HTML)}
                leftSection={<IconHtml style={{ width: rem(14), height: rem(14) }} />}
              >
                HTML
              </Menu.Item>
              <Menu.Divider />
              <Menu.Label>操作</Menu.Label>
              <Menu.Item
                color={searchMode === SearchModes.REGEXP ? 'blue' : ''}
                onClick={(): void => handleChangeSearchMode(SearchModes.REGEXP)}
                leftSection={<IconRegex style={{ width: rem(14), height: rem(14) }} />}
              >
                正则表达式搜索
              </Menu.Item>
              <Menu.Item
                color={pin ? 'blue' : ''}
                onClick={handlePin}
                leftSection={<IconPin style={{ width: rem(14), height: rem(14) }} />}
              >
                窗口置顶
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <hr className={classes.loader} />
          <ScrollArea.Autosize
            viewportRef={scrollbar}
            mah={390}
            className="no-drag"
            scrollHideDelay={200}
          >
            <Command.List>
              <Command.Empty>No results found.</Command.Empty>
              {contentList.length > 0 && (
                <Command.Group heading="Records">
                  {contentList.map((item: ClipItem, index: number) => {
                    return (
                      <ClipContentItem
                        id={item.id}
                        key={item.id}
                        content={item}
                        selected={selectId === item.id}
                        index={index}
                        showIndex={showIndex}
                        highLight={searchTxt}
                        onClick={(): void => handleClickItem(item.id, index)}
                        onDoubleClick={(): void => handleDoubleClickItem(item)}
                        onContextMenu={(e): void => handleContextMenu(e, item.id, index)}
                      />
                    )
                  })}
                </Command.Group>
              )}
            </Command.List>
          </ScrollArea.Autosize>
        </Command>
        <Menu
          shadow="md"
          width={150}
          opened={contextMenuOpen}
          onChange={setContextMenuOpen}
          position="bottom-start"
        >
          <Menu.Target>
            <span style={{ position: 'absolute', left: anchorPoint.x, top: anchorPoint.y }}></span>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              onClick={(): void => onCopy(selectId, false)}
              leftSection={<IconCopy style={{ width: rem(14), height: rem(14) }} />}
            >
              Only Copy
            </Menu.Item>
            <Menu.Item
              onClick={(): void => onCopy(selectId, true)}
              leftSection={<IconTxt style={{ width: rem(14), height: rem(14) }} />}
            >
              Copy Text
            </Menu.Item>
            <Menu.Item
              onClick={handleDeleteById}
              leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
              color="red"
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <ClipBottomBar
          size={contentList.length}
          onKbdMenuClose={(): void => {
            setStopListenShortcut(false)
            inputRef.current?.focus()
          }}
          onKbdMenuOpen={(): void => setStopListenShortcut(true)}
        />
      </Box>
      <Modal
        size={'sm'}
        opened={opened}
        onClose={close}
        closeOnEscape={false}
        centered
        radius={'md'}
        title={t('clip_item_delete_confirm')}
      >
        <Group justify="right">
          <Button data-autofocus onClick={handleDeleteById} color={'red'}>
            Delete
          </Button>
          <Button onClick={close} color={'gray'}>
            Cancel
          </Button>
        </Group>
      </Modal>
    </>
  )
}

export default Clip
