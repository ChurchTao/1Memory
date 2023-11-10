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
import { useEffect, useRef, useState, KeyboardEvent as ReactKeyboardEvent } from 'react'
import ClipContentItem from '../components/clip/ClipContentItem'
import ClipBottomBar from '../components/clip/ClipBottomBar'
import { ClipItemType, ClipItem } from '@renderer/domain/data'
import { ClipItemDocVO } from '@common/vo'
import { MimeTypes, SearchModes } from '@common/const'
import { useTranslation } from 'react-i18next'
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
  const [alwaysFocusInput, setAlwaysFocusInput] = useState(true)
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
  const deleteDialogRef = useRef<HTMLDivElement>(null)
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

  const handleMoveSelect = (event: ReactKeyboardEvent): void => {
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
  }

  const handleCopy = (event: ReactKeyboardEvent): void => {
    if (event.metaKey || event.ctrlKey) {
      window.api.clip.handleCopyTxt(selectId)
    } else {
      window.api.clip.handleCopy(selectId)
    }
  }

  const handleEscape = (): void => {
    window.api.win.closeWin('clip')
  }

  const handleQuickCopyByIndex = (event: ReactKeyboardEvent): void => {
    const index = parseInt(event.key)
    if (contentList.length > index - 1) {
      if (event.shiftKey) {
        window.api.clip.handleCopyTxt(contentList[index - 1].id)
      } else {
        window.api.clip.handleCopy(contentList[index - 1].id)
      }
    }
  }

  const handleShowDeleteDialog = (): void => {
    if (selectId !== '') {
      setAlwaysFocusInput(false)
      setShowIndex(false)
      open()
    }
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

  const handlePin = (): void => {
    setPin(!pin)
    window.api.win.pin('clip', !pin)
  }

  const handleClickItem = (id: string, index: number): void => {
    setSelectId(id)
    setSelectIndex(index)
    console.log('handleClickItem', id)
  }
  const handleDoubleClickItem = (item: ClipItem): void => {
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

  const handleDeleteById = (): void => {
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
      handleDeleteDialogClose()
    }
  }

  const handleContextMenu = (e, id: string, index: number): void => {
    handleClickItem(id, index)
    setAnchorPoint({ x: e.clientX, y: e.clientY })
    setContextMenuOpen(true)
  }

  useEffect(() => {
    if (!init) {
      handleInit()
    }
    return () => {}
  }, [init, setInit, setShowIndex])

  const handleOnKeyDown = (e: ReactKeyboardEvent): void => {
    if (opened || stopListenShortcut) {
      return
    }
    // 按住 Command 显示序号
    if (e.key === Key.Meta || e.key === Key.Control) {
      setShowIndex(true)
    }
    // Escape 关闭窗口
    if (e.key === Key.Escape) {
      handleEscape()
    }
    // Command + backSpace 删除选中行
    if (e.key === Key.Backspace && (e.metaKey || e.ctrlKey)) {
      handleShowDeleteDialog()
    }
    if (e.key === Key.ArrowUp || e.key === Key.ArrowDown) {
      handleMoveSelect(e)
    }
    if (e.key === Key.Enter) {
      handleCopy(e)
    }
    // 数字快捷键复制
    if (e.key >= '1' && e.key <= '9' && (e.metaKey || e.ctrlKey)) {
      handleQuickCopyByIndex(e)
    }
  }

  const handleOnKeyUp = (e: ReactKeyboardEvent): void => {
    if (e.key === Key.Meta || e.key === Key.Control) {
      setShowIndex(false)
    }
  }

  const handleDeleteDialogClose = (): void => {
    setAlwaysFocusInput(true)
    close()
    inputRef.current?.focus()
  }

  const handleKbdMenuClose = (): void => {
    setStopListenShortcut(false)
    setAlwaysFocusInput(true)
    inputRef.current?.focus()
  }

  const handleKdbMenuOpen = (): void => {
    setStopListenShortcut(true)
    setAlwaysFocusInput(false)
  }

  return (
    <>
      <Box h="100vh" w="100%" className={classes.main}>
        <Command shouldFilter={false}>
          <Command.Input
            spellCheck={false}
            ref={inputRef}
            autoFocus
            onBlur={(): void => {
              if (alwaysFocusInput) {
                inputRef.current?.focus()
              }
            }}
            placeholder={t('search_placeholder')}
            onValueChange={(e): void => handleContentChange(e)}
            onKeyDown={(e): void => handleOnKeyDown(e)}
            onKeyUp={(e): void => handleOnKeyUp(e)}
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
              <Menu.Label>{t('clip_search_mode_menu_title')}</Menu.Label>
              <Menu.Item
                color={searchMode === SearchModes.TXT ? 'blue' : ''}
                onClick={(): void => handleChangeSearchMode(SearchModes.TXT)}
                leftSection={<IconTxt style={{ width: rem(14), height: rem(14) }} />}
              >
                {t('clip_search_mode_txt')}
              </Menu.Item>
              <Menu.Item
                color={searchMode === SearchModes.IMG ? 'blue' : ''}
                onClick={(): void => handleChangeSearchMode(SearchModes.IMG)}
                leftSection={<IconPhoto style={{ width: rem(14), height: rem(14) }} />}
              >
                {t('clip_search_mode_image')}
              </Menu.Item>
              <Menu.Item
                color={searchMode === SearchModes.RTF ? 'blue' : ''}
                onClick={(): void => handleChangeSearchMode(SearchModes.RTF)}
                leftSection={<IconTextPlus style={{ width: rem(14), height: rem(14) }} />}
              >
                {t('clip_search_mode_rich_text')}
              </Menu.Item>
              <Menu.Item
                color={searchMode === SearchModes.HTML ? 'blue' : ''}
                onClick={(): void => handleChangeSearchMode(SearchModes.HTML)}
                leftSection={<IconHtml style={{ width: rem(14), height: rem(14) }} />}
              >
                {t('clip_search_mode_html')}
              </Menu.Item>
              <Menu.Divider />
              <Menu.Label>{t('clip_search_mode_menu_title2')}</Menu.Label>
              <Menu.Item
                color={searchMode === SearchModes.REGEXP ? 'blue' : ''}
                onClick={(): void => handleChangeSearchMode(SearchModes.REGEXP)}
                leftSection={<IconRegex style={{ width: rem(14), height: rem(14) }} />}
              >
                {t('clip_search_mode_regexp')}
              </Menu.Item>
              <Menu.Item
                color={pin ? 'blue' : ''}
                onClick={handlePin}
                leftSection={<IconPin style={{ width: rem(14), height: rem(14) }} />}
              >
                {t('clip_top_window')}
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
              <Command.Empty>{t('clip_search_empty')}</Command.Empty>
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
              {t('clip_item_context_menu_copy')}
            </Menu.Item>
            <Menu.Item
              onClick={(): void => onCopy(selectId, true)}
              leftSection={<IconTxt style={{ width: rem(14), height: rem(14) }} />}
            >
              {t('clip_item_context_menu_copy_text')}
            </Menu.Item>
            <Menu.Item
              onClick={handleDeleteById}
              leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
              color="red"
            >
              {t('clip_item_delete_btn')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <ClipBottomBar
          size={contentList.length}
          onKbdMenuClose={handleKbdMenuClose}
          onKbdMenuOpen={handleKdbMenuOpen}
        />
      </Box>
      <Modal
        ref={deleteDialogRef}
        size={'sm'}
        withCloseButton={false}
        opened={opened}
        onClose={handleDeleteDialogClose}
        closeOnEscape
        centered
        radius={'md'}
        title={t('clip_item_delete_confirm')}
      >
        <Group justify="right">
          <Button data-autofocus onClick={handleDeleteById} color={'red'} variant="subtle">
            {t('clip_item_delete_btn')}
          </Button>
          <Button onClick={handleDeleteDialogClose} color={'gray'} variant="subtle">
            {t('clip_item_cancel_btn')}
          </Button>
        </Group>
      </Modal>
    </>
  )
}

export default Clip
