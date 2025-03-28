import React, { useState, useEffect } from 'react'
import { Input } from './input'
import { Divider } from '../divider/divider'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { TextArea } from './textarea';

type PropsTable = {
    table: { title: string, content: string }[],
    sx?: string,
    exportTable: (tbl: { title: string, content: string }[]) => void
}
export const InputTableVideo = (pros: PropsTable) => {
    const [_edit, set_edit] = useState<boolean>(false)

    const [_currentTable, set_currentTable] = useState<{ title: string, content: string }[]>([])
    const [draggedItem, setDraggedItem] = useState<number>(-1);
    const [_index, set_index] = useState<number>(-1)
    const [_indexForward, set_indexForward] = useState<number>(-1)
    const [_title, set_title] = useState<string>("")
    const [_content, set_content] = useState<string>("")
    const [_newtable, set_newtable] = useState<{ title: string, content: string }[]>([])
    const [startY, setStartY] = useState<number>(0)
    const [event, setEvent] = useState<HTMLDivElement>()
    // const [_refresh, set_refresh] = useState<number>(0)
    const [_onMouseDown, set_onMouseDown] = useState<boolean>(false)

    const [key, setKey] = useState<number>(0)
    const [refresh_table, setRefresh_table] = useState<number>(1)
    const handleMouseDown = (index: number) => {
        set_onMouseDown(true)
        setDraggedItem(index)

    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
        if (index !== draggedItem) { set_indexForward(index) }
        if (event) { event.style.transform = `translate(0px, ${e.pageY - startY}px)` }
        set_newtable(_currentTable)
    }

    useEffect(() => {
        if (pros.table) { set_currentTable(pros.table) }
    }, [pros.table])

    const createTable = (body: { title: string, content: string }) => {
        set_currentTable((tbl) => [...tbl, body])
        set_title("")
        set_content("")
        setKey(k => k + 1)
        set_edit(true)
    }
    const updateTable = (body: { title: string, content: string }, index: number) => {
        const newTable = _currentTable
        newTable[index] = body
        set_currentTable(newTable)
    }

    // useEffect(() => {
    //     set_currentTable(_currentTable)
    // }, [_currentTable, refresh_table])

    useEffect(() => {
        set_title("")
        set_content("")
    }, [_index])



    useEffect(() => {

        if (!_onMouseDown && draggedItem !== _indexForward && event) {
            const _newtable_v2 = _newtable.filter((newtbl, index) => index !== draggedItem)
            _newtable_v2.splice(_indexForward, 0, _newtable[draggedItem])
            set_currentTable(_newtable_v2)
            event.style.transform = `translate(0px, 0px)`
            setRefresh_table(n => n + 1)
        }
    }, [_indexForward, _newtable, _onMouseDown, draggedItem, event])

    useEffect(() => {
        if (_currentTable && _edit === true && pros.exportTable) { pros.exportTable(_currentTable) }
    }, [_currentTable, _edit, pros])

    return (
        <div className={`relative border border-lv-2 dark:border-lv-17 px-2 ${pros.sx ? pros.sx : ""}`}>

            <div className='h-12 flex font-bold px-2'><p className='flex flex-col justify-end'>Video</p>{_edit ? <CheckIcon className='!h-6 !w-6 mx-2 mt-auto mb-1' onClick={() => set_edit(!_edit)} /> : <EditIcon className='!h-6 !w-6 mx-2 mt-auto mb-1' onClick={() => { set_edit(!_edit) }} />}</div>

            <div key={refresh_table}>
                {_currentTable
                    .map((tbl, index: number) =>
                        _edit ?
                            <div className='flex relative' key={index}>
                                <div className={`flex gap-4 w-full ${_onMouseDown && _index === index ? "absolute z-[0] shadow-md rounded" : "relative z-[1]"}`}
                                    // draggable
                                    onMouseDown={(e) => { handleMouseDown(index); set_index(index); setStartY(e.pageY); setEvent(e.currentTarget) }}
                                    onMouseUp={() => { set_onMouseDown(false) }}
                                    onMouseMove={(e) => _onMouseDown && handleMouseMove(e, index)}>
                                    <div className='w-full'
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onMouseUp={(e) => e.stopPropagation()}
                                        onMouseMove={(e) => e.stopPropagation()}>
                                        <Input sx='w-full' name="url" onChange={(v) => { set_title(v) }} value={_index === index ? _title || tbl.title : tbl.title} onFocus={() => set_index(index)} />
                                    </div>
                                    <div className='w-full'
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onMouseUp={(e) => e.stopPropagation()}
                                        onMouseMove={(e) => e.stopPropagation()}>
                                        <TextArea sx='w-full min-h-12' name="commnet" onChange={(v) => { set_content(v) }} value={_index === index ? _content || tbl.content : tbl.content} onFocus={() => set_index(index)} />
                                    </div>
                                    {_index === index ?
                                        <CheckIcon onMouseUp={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} onMouseMove={(e) => e.stopPropagation()} className="!h-12 !w-12 p-3 cursor-pointer" onClick={(e) => { e.stopPropagation(); updateTable({ title: _title || tbl.title, content: _content || tbl.content }, index); set_title(""); set_content(""); set_index(-1) }} />
                                        : <CloseIcon onMouseUp={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} onMouseMove={(e) => e.stopPropagation()} className="!h-12 !w-12 p-3 cursor-pointer" onClick={(e) => { set_currentTable(tbl => tbl.filter((t, i) => i !== index)); e.stopPropagation() }} />}
                                    <DragIndicatorIcon className='cursor-grab !h-12 !w-12 p-3' />
                                </div>
                                <div className="h-14"></div>
                            </div> :
                            <div className='flex gap-4 w-full' key={index}>
                                <Divider name={tbl.title} sx='w-full border border-lv-4 dark:border-lv-17 line-clamp-1 mb-1' onClick={() => set_edit(true)} />
                                <div dangerouslySetInnerHTML={{ __html: tbl.content }} className='w-full border border-lv-4 dark:border-lv-17 !block leading-6 p-2 mb-1' onClick={() => set_edit(true)} />
                                <div className='h-12 !w-12 p-3'></div>
                                <div className='h-12 !w-12 p-3'></div>
                            </div>

                    )}
            </div>
            <div className='flex gap-4 w-full' key={key}>
                <Input sx='w-full' name="url" onChange={(v) => { set_title(v) }} value={_index === -1 ? _title : ""} onFocus={() => {
                    set_index(-1)
                    setRefresh_table(n => n + 1)
                }} />
                <TextArea sx='w-full' name="comment" onChange={(v) => { set_content(v) }} value={_index === -1 ? _content : ""} onFocus={() => {
                    set_index(-1)
                    setRefresh_table(n => n + 1)
                }} />
                <div className='h-12 !w-12 p-3'></div>
                <AddIcon className="!h-12 !w-12 p-3 cursor-pointer opacity-50 hover:opacity-100 hover:text-lv-11"
                    onClick={() => { if (_title && _content) { createTable({ title: _title, content: _content }) } }} />
            </div>
        </div>
    )
}
