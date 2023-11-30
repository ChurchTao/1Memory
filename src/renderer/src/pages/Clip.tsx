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
import { MemoryItemContentType, MimeTypes, SearchModes } from '@common/const'
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
import { useDebouncedState, useDisclosure } from '@mantine/hooks'
import classes from '../assets/Clip.module.scss'
import { Command } from 'cmdk'
import i18n from 'i18next'
import { MemoryItemListVO, MemoryItemReact, PageResult } from '@common/bo'

function convertToMemoryItem(item: MemoryItemListVO): MemoryItemReact | null {
  if (item.types.includes(MimeTypes.IMG) && item.thumbnail) {
    const blob = new Blob([item.thumbnail.data], { type: MimeTypes.IMG })
    return {
      id: item._id,
      createdAt: item.createdAt,
      type: MemoryItemContentType.image,
      value: URL.createObjectURL(blob)
    }
  }
  const hasTxt = item.types.includes(MimeTypes.TXT)
  const hasRtf = item.types.includes(MimeTypes.RTF)
  const hasHtml = item.types.includes(MimeTypes.HTML)
  if (hasTxt || hasRtf || hasHtml) {
    let _type = MemoryItemContentType.text
    if (hasRtf) {
      _type = MemoryItemContentType.rtf
    } else if (hasHtml) {
      _type = MemoryItemContentType.html
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

function onCopy(id: string[], onlyTxt: boolean): void {
  let _selectedId: string
  if (id.length > 1) {
    _selectedId = id.join(',')
  } else {
    _selectedId = id[0]
  }
  if (onlyTxt) {
    window.api.clip.handleCopyTxt(_selectedId)
  } else {
    window.api.clip.handleCopy(_selectedId)
  }
}

function Clip(): JSX.Element {
  const [alwaysFocusInput, setAlwaysFocusInput] = useState(true)
  const scrollbar = useRef<HTMLDivElement>(null)
  const [pin, setPin] = useState(false)
  const [selectedIdList, setSelectedIdList] = useState<Array<string>>([])
  const [selectIndex, setSelectIndex] = useState(0)
  const [contentList, setContentList] = useState<Array<MemoryItemReact>>([])
  const [showIndex, setShowIndex] = useState(false)
  const [ctrlPressed, setCtrlPressed] = useState(false)
  const [shiftPressed, setShiftPressed] = useState(false)
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
  const [kbdOpened, setKbdOpened] = useState(false)
  const [total, setTotal] = useState(0)
  const [searchTxtDebounced, setSearchTxtDebounced] = useDebouncedState('', 200)

  const isMultiSelect: boolean = selectedIdList.length > 1
  const hasSelected: boolean = selectedIdList.length > 0

  const handleChangeSearchMode = (mode: string): void => {
    let finalMode = SearchModes.ALL
    if (mode != searchMode) {
      finalMode = mode
    }
    let _searchTxt = searchTxtDebounced
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
    if (isMultiSelect) {
      return
    }
    if (!hasSelected && contentList.length > 0) {
      setSelectIndex(0)
      setSelectedIdList([contentList[0].id])
      return
    }
    if (event.key === Key.ArrowUp) {
      if (selectIndex > 0) {
        setSelectIndex(selectIndex - 1)
        setSelectedIdList([contentList[selectIndex - 1].id])
        scrollToCenter(Key.ArrowUp)
      }
    }
    if (event.key === Key.ArrowDown) {
      if (selectIndex < contentList.length - 1) {
        setSelectIndex(selectIndex + 1)
        setSelectedIdList([contentList[selectIndex + 1].id])
        scrollToCenter(Key.ArrowDown)
      }
    }
  }

  const handleCopy = (event: ReactKeyboardEvent): void => {
    let _selectedId: string
    if (isMultiSelect) {
      _selectedId = selectedIdList.join(',')
    } else {
      _selectedId = selectedIdList[0]
    }
    if (event.metaKey || event.ctrlKey) {
      window.api.clip.handleCopyTxt(_selectedId)
    } else {
      window.api.clip.handleCopy(_selectedId)
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
    if (hasSelected) {
      setAlwaysFocusInput(false)
      setShowIndex(false)
      setCtrlPressed(false)
      open()
    }
  }

  function scrollToCenter(key: Key): void {
    // 移动到可视区域中间,保证当前选中的元素始终在可视区域最中间
    const _selectId = selectedIdList[0]
    const item = document.getElementById(_selectId)
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
    console.log('handleClickItem', id)
    if (shiftPressed) {
      // 按住shift，选中当前行 index 到上一次选中的行 selectIndex 之间的所有行
      const _selectIndex = selectIndex
      const _selectedIdList = selectedIdList
      const _contentList = contentList
      if (_selectIndex < index) {
        for (let i = _selectIndex; i <= index; i++) {
          if (!_selectedIdList.includes(_contentList[i].id)) {
            _selectedIdList.push(_contentList[i].id)
          }
        }
      } else {
        for (let i = index; i <= _selectIndex; i++) {
          if (!_selectedIdList.includes(_contentList[i].id)) {
            _selectedIdList.push(_contentList[i].id)
          }
        }
      }
      setSelectIndex(index)
      setSelectedIdList(_selectedIdList)
    } else if (ctrlPressed) {
      // 按住ctrl，选中当前行+之前选中的行
      const _selectedIdList = selectedIdList
      if (!_selectedIdList.includes(id)) {
        _selectedIdList.push(id)
      }
      setSelectIndex(index)
      setSelectedIdList(_selectedIdList)
    } else {
      // 普通点击，选中当前行
      setSelectIndex(index)
      setSelectedIdList([id])
    }
  }
  const handleDoubleClickItem = (item: MemoryItemReact): void => {
    window.api.clip.handleCopy(item.id)
  }
  const handleContentChange = (txt: string | null, _searchMode?: string): void => {
    if (txt === null) {
      txt = searchTxtDebounced
    }
    if (!_searchMode) {
      _searchMode = searchMode
    }
    // 通过正则表达式，过滤highLight中所有的空白符
    txt = txt.replace(/\s+/g, '')
    if (_searchMode === SearchModes.REGEXP) {
      try {
        new RegExp(txt)
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
    window.api.clip
      .findByTxtLike(txt, searchType, 1, 100)
      .then((res: PageResult<MemoryItemListVO>) => {
        const list: Array<MemoryItemReact> = []
        if (res.total > 0) {
          res.list.forEach((item: MemoryItemListVO) => {
            const clipItem = convertToMemoryItem(item)
            if (clipItem !== null) {
              list.push(clipItem)
            }
          })
        } else {
          setSelectedIdList([])
          setSelectIndex(0)
        }
        setTotal(res.total)
        setContentList(list)
        // 如果searchByRegex为true，则使用正则表达式搜索,否则把txt内需要转义的字符转义
        const _searchTxt =
          _searchMode === SearchModes.REGEXP
            ? txt
            : txt!.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
        setSearchTxt(_searchTxt!)
      })
  }

  const handleDeleteById = (): void => {
    if (hasSelected) {
      let _selectedId: string
      if (isMultiSelect) {
        _selectedId = selectedIdList.join(',')
      } else {
        _selectedId = selectedIdList[0]
      }
      window.api.clip.deleteById(_selectedId)
      const _selectIndex = selectIndex
      if (_selectIndex < contentList.length - 1) {
        setSelectIndex(_selectIndex + 1)
        setSelectedIdList([contentList[_selectIndex + 1].id])
      } else if (_selectIndex > 0) {
        setSelectIndex(_selectIndex - 1)
        setSelectedIdList([contentList[_selectIndex - 1].id])
      } else {
        setSelectIndex(0)
        setSelectedIdList([])
      }
      handleDeleteDialogClose()
    }
  }

  const handleContextMenu = (e, id: string, index: number): void => {
    if (!isMultiSelect) {
      handleClickItem(id, index)
    }
    setAnchorPoint({ x: e.clientX, y: e.clientY })
    setContextMenuOpen(true)
  }

  useEffect(() => {
    // init
    window.api.clip.onChange(() => {
      handleContentChange(null)
    })
    window.api.clip.onBlur(() => {
      setShowIndex(false)
    })
    window.api.clip.onUILanguageChange((event: string) => {
      i18n.changeLanguage(event)
    })
  }, [])

  useEffect(() => {
    // on searchTxtDebounced changed
    handleContentChange(searchTxtDebounced)
  }, [searchTxtDebounced])

  const handleOnKeyDown = (e: ReactKeyboardEvent): void => {
    if (opened || stopListenShortcut) {
      return
    }
    // 按住 Command 显示序号
    if (e.key === Key.Meta || e.key === Key.Control) {
      setShowIndex(true)
      setCtrlPressed(true)
    }
    if (e.key === Key.Shift) {
      setShiftPressed(true)
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
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      handleKdbMenuOpen()
    }
  }

  const handleOnKeyUp = (e: ReactKeyboardEvent): void => {
    if (e.key === Key.Meta || e.key === Key.Control) {
      setShowIndex(false)
      setCtrlPressed(false)
    }
    if (e.key === Key.Shift) {
      setShiftPressed(false)
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
    setKbdOpened(false)
    inputRef.current?.focus()
  }

  const handleKdbMenuOpen = (): void => {
    setStopListenShortcut(true)
    setAlwaysFocusInput(false)
    setShowIndex(false)
    setCtrlPressed(false)
    setKbdOpened(true)
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
            onValueChange={(e): void => setSearchTxtDebounced(e)}
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
                  {contentList.map((item: MemoryItemReact, index: number) => {
                    return (
                      <ClipContentItem
                        id={item.id}
                        key={item.id}
                        content={item}
                        selected={selectedIdList.includes(item.id)}
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
              onClick={(): void => onCopy(selectedIdList, false)}
              leftSection={<IconCopy style={{ width: rem(14), height: rem(14) }} />}
            >
              {t('clip_item_context_menu_copy')}
            </Menu.Item>
            <Menu.Item
              onClick={(): void => onCopy(selectedIdList, true)}
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
          size={total}
          onKbdMenuClose={handleKbdMenuClose}
          onKbdMenuOpen={handleKdbMenuOpen}
          kbdOpened={kbdOpened}
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
