'use client'
import React, { useRef, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { Divider } from '../divider/divider';
import CloseIcon from '@mui/icons-material/Close';
type Props = {
    onChange: (e: string) => void,
    onSubmit?: () => void,
    onFocus?: () => void,
    name: React.ReactNode,
    value: string,
    type?: string,
    disabled?: boolean,
    warn?: string,
    icon1?: React.ReactNode,
    icon2?: React.ReactNode,
    data?: { name: string }[],
    sx?: string
}

export const Input = ({ onChange, name, value, type, disabled, warn, icon1, icon2, sx, onFocus }: Props) => {

    const inputRef = useRef<HTMLInputElement>(null)
    const [_focus, set_focus] = useState<boolean>(false)

    return (
        <div className={`h-12 text-left relative mb-2 ${disabled ? "opacity-50" : ""} ${sx ? sx : ""}`}>
            <p className={` absolute transition-all duration-300 h-max px-2 opacity-75 ${_focus || value ? "top-0 text-sm text-lv-13 opacity-50" : "top-4"}`}
                onClick={() => { if (inputRef.current) { inputRef.current.focus() }; set_focus(true) }}>{name} <span className='text-xs text-red-500 '>{warn}</span></p>
            <input className={`w-full h-full bg-inherit pt-4 px-2 relative z-[1]`}
                ref={inputRef}
                type={type ? type : "text"}
                onChange={(e) => onChange(e.currentTarget.value)}
                defaultValue={value}
                onFocus={(e) => { if (e) { e.currentTarget.style.outline = 'none' }; set_focus(true); if (onFocus) { onFocus() } }}
                onBlur={() => set_focus(false)}
                disabled={disabled}
                style={{ fontFamily: "revert" }}
            />
            <div className='w-max absolute flex right-1 bottom-0 h-12 z-[1]'>
                {icon1}{icon2}
            </div>
            <div className={`w-full h-full absolute z-0 border-b-2 top-0 left-0 border-lv-2 dark:border-lv-17`}></div>
            <div className={`w-full h-full absolute z-0 border-b-2 top-0 left-0 transition-all duration-300 border-lv-11 ${_focus || value ? "scale-x-[100%]" : "scale-x-[0%]"}`}></div>
        </div>
    )
}
export const InputSelect = ({ onChange, onFocus, name, value, type, disabled, warn, icon1, data }: Props) => {

    const inputRef = useRef<HTMLInputElement>(null)
    const [_focus, set_focus] = useState<boolean>(false)
    const [_select, set_select] = useState<boolean>(false)

    return (
        <div className={`h-12 text-left relative ${disabled ? "opacity-50" : ""}`}>
            <p className={` absolute transition-all duration-300 h-max px-2  ${_focus || value ? "top-0 text-sm text-lv-13 opacity-50" : "top-4"}`}
                onClick={() => { if (inputRef.current) { inputRef.current.focus() }; set_focus(true) }}>{name} <span className='text-xs text-red-500 '>{warn}</span></p>
            <input className={`w-full h-full bg-inherit pt-4 px-2 relative z-[1]`}
                ref={inputRef}
                type={type ? type : "text"}
                onChange={(e) => onChange(e.currentTarget.value)}
                value={value}
                onFocus={(e) => { if (e) { e.currentTarget.style.outline = 'none' }; set_focus(true); if (onFocus) { onFocus() } }}
                onBlur={() => set_focus(false)}
                disabled={disabled}
                style={{ fontFamily: "revert" }}
            />
            {_select ?
                <div className={` w-full absolute top-12 transition-all shadow-lg rounded bg-lv-1 dark:bg-lv-18 z-10 max-h-60 overflow-auto`} >
                    {
                        data?.length ? data.filter(item => value ? item.name.includes(value) : true).map((item, index) =>
                            <Divider name={item.name} key={index} onClick={() => { if (inputRef.current) { inputRef.current.value = item.name; onChange(inputRef.current.value) }; set_select(false) }} />) :
                            null
                    }

                </div> :
                null}
            <div className='w-max absolute flex right-2 bottom-0 h-12 z-[1]'>
                {inputRef.current && inputRef.current.value ?
                    <CloseIcon className='!w-8 !h-8 my-auto !cursor-pointer' onClick={() => { if (inputRef.current) { inputRef.current.value = ""; onChange("") }; set_select(true) }} /> :
                    <KeyboardArrowDownIcon className='!w-9 !h-9 my-auto !cursor-pointer p-1' onClick={() => set_select(!_select)} />}{icon1}
            </div>
            <div className={`w-full h-full absolute z-0 border-b-2 top-0 left-0 border-borderlight dark:border-borderdark`}></div>
            <div className={`w-full h-full absolute z-0 border-b-2 top-0 left-0 transition-all duration-300 border-colormain ${_focus || value ? "scale-x-[100%]" : "scale-x-[0%]"}`}></div>
        </div>
    )
}
export const InputIcon = ({ onChange, value, name, icon1, icon2, onSubmit }: Props) => {

    const inputRef = useRef<HTMLInputElement>(null)

    const [isSeaching, setIsSearching] = useState<boolean>(false)

    return (
        <div className='flex w-max'>
            <input
                className={`bg-inherit w-0 h-10 p-0 transition-all duration-200 border-[0px] rounded text-sm m-auto border-lv-2 dark:border-lv-17 ${isSeaching ? "w-52 px-1 !border-2" : ""}`}
                ref={inputRef}
                type="text"
                onFocus={(e) => e.target.style.outline = 'none'}
                defaultValue={value}
                onChange={(e) => {
                    onChange(e.target.value)
                }}
            />
            <div className='w-max flex right-1 bottom-0 h-12'>
                <div className='h-max my-auto' onClick={() => setIsSearching(false)}>{icon1}</div>
                <div className='h-max my-auto' onClick={() => setIsSearching(false)}>{icon2}</div>
                <div className='h-max my-auto' onClick={() => { setIsSearching(!isSeaching); if (isSeaching && onSubmit) { onSubmit() }; if (inputRef.current) { inputRef.current.focus() } }}>{name}</div>
            </div>
        </div>
    )
}