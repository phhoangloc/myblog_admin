/* eslint-disable */
'use client'
import React, { useState, useEffect } from 'react'
import { Editor, EditorState, RichUtils, Modifier, AtomicBlockUtils, CompositeDecorator } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import AddLinkIcon from '@mui/icons-material/AddLink';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { DividerSelect } from '../divider/divider';
import { useRef } from 'react';
type Props = {
    onChange: (e: string) => void,
    value: string,
    sx?: string,
    tool?: boolean
    colorhover?: string
}

const Image = (props: any) => {
    const { src } = props.contentState.getEntity(props.entityKey).getData();
    return <img src={src} alt="" style={{ maxWidth: '100%' }} />;
};
const IDSpan = (props: any) => {
    const { id, children } = props.contentState.getEntity(props.entityKey).getData();
    return <span id={id}>{children}</span>;
};
const decorator = new CompositeDecorator([
    {
        strategy: (contentBlock, callback, contentState) => {
            contentBlock.findEntityRanges((character) => {
                const entityKey = character.getEntity();
                return (
                    entityKey !== null && contentState.getEntity(entityKey).getType() === 'IMAGE'
                );
            }, callback);
        },
        component: Image,
    },
    {
        strategy: (contentBlock, callback, contentState) => {
            contentBlock.findEntityRanges((character) => {
                const entityKey = character.getEntity();
                return (
                    entityKey !== null && contentState.getEntity(entityKey).getType() === 'ID'
                );
            }, callback);
        },
        component: IDSpan,
    },
]);

export const TextAreaTool = (props: Props) => {
    //content
    const [editorState, setEditorState] = useState(EditorState.createEmpty(decorator));
    const [content, setContent] = useState<string>("");
    const [newContent, setNewContent] = useState<string>("");
    const contentState = editorState.getCurrentContent();

    //selection
    const selectionState = editorState.getSelection();
    const startKey = selectionState.getStartKey();
    const block = editorState.getCurrentContent().getBlockForKey(startKey);
    const newEditorState = EditorState.acceptSelection(editorState, selectionState)
    const blockType = block.getType();
    const title = blockType === "header-one" && "h1" || blockType === "header-two" && "h2" || blockType === "header-three" && "h3" || blockType === "header-four" && "h4" || blockType === "header-five" && "h5" || "p"
    const startOffset = selectionState.getStartOffset();
    const [entityKey, setEntityKey] = useState<any>("")
    const [entity, setEntity] = useState<any>("")

    useEffect(() => {
        block.getEntityAt(startOffset) ? setEntityKey(block.getEntityAt(startOffset)) : setEntityKey("")
    }, [block, startOffset])

    useEffect(() => {
        entityKey ? setEntity(contentState.getEntity(entityKey)) : setEntity("")
    }, [entityKey])

    //link
    const [link, setLink] = useState<string>("")
    const [linkImg, setLinkImg] = useState<string>("")
    const [isInputLink, setIsInputLink] = useState<boolean>(false)
    const [isInputLinkImg, setIsInputLinkImg] = useState<boolean>(false)
    const [imgArr, setImgArr] = useState<any[]>([])


    const createBlockStyle = (value: any, type: string) => {
        setEditorState(RichUtils.toggleBlockType(value, type));
    }
    const createInlineStyle = (value: any, type: string) => {
        setEditorState(RichUtils.toggleInlineStyle(value, type));
    }
    const createLink = (value: string) => {
        const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', { url: value });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newContentState = Modifier.applyEntity(
            contentStateWithEntity,
            editorState.getSelection(),
            entityKey
        );
        let newEditorState = EditorState.push(editorState, newContentState, 'apply-entity');
        newEditorState = newEditorState.getCurrentInlineStyle().has("UNDERLINE") ? RichUtils.toggleInlineStyle(newEditorState, '') : RichUtils.toggleInlineStyle(newEditorState, 'UNDERLINE');
        setEditorState(newEditorState);

    }
    const removeLink = () => {
        if (!selectionState.isCollapsed()) {
            const contentStateWithEntity = contentState.createEntity('', 'MUTABLE',);
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            const newContentState = Modifier.applyEntity(
                contentStateWithEntity,
                editorState.getSelection(),
                entityKey
            );
            let newEditorState = EditorState.push(editorState, newContentState, 'apply-entity');
            newEditorState = newEditorState.getCurrentInlineStyle().has("UNDERLINE") ? RichUtils.toggleInlineStyle(newEditorState, 'UNDERLINE') : RichUtils.toggleInlineStyle(newEditorState, '');
            setEditorState(newEditorState);
        }
    };
    const createImage = async (value: string) => {
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity('IMAGE', 'MUTABLE', { src: value });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
        setEditorState(newEditorState);

    }
    const addId = (id: string) => {
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity('ID', 'MUTABLE', { id });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newContentState = Modifier.applyEntity(
            contentStateWithEntity,
            editorState.getSelection(),
            entityKey
        );
        let newEditorState = EditorState.push(editorState, newContentState, 'apply-entity');
        setEditorState(newEditorState);
    }


    useEffect(() => {
        const valueState = stateFromHTML(props.value)
        setEditorState(EditorState.createWithContent(valueState, decorator))
    }, [props.value])

    useEffect(() => {
        setContent(stateToHTML(editorState.getCurrentContent()))
    }, [editorState])

    useEffect(() => {
        props.onChange && props.onChange(content)
    }, [content])

    const onCheck = (link: string) => {
        isInputLink && createLink(link)
        isInputLinkImg && createImage(link)
        setIsInputLink(false)
        setIsInputLinkImg(false)
        setLink("")
        setLinkImg("")
    }

    useEffect(() => {
        imgArr[0]?.src && createImage(imgArr[0].src)
    }, [imgArr])


    return (
        <div className={`relative border border-lv-2 dark:border-lv-17 px-2 ${props.sx ? props.sx : ""}`}>
            <div className='sticky p-1  top-0 border-b border-inherit bg-lv-0 dark:bg-lv-18'>
                <div className='relative'>
                    <div className='flex flex-wrap relative'>
                        <DividerSelect name={title} sx='w-24 z-[2]'
                            data={[
                                { name: "h1", func: () => createBlockStyle(editorState, "header-one") },
                                { name: "h2", func: () => createBlockStyle(editorState, "header-two") },
                                { name: "h3", func: () => createBlockStyle(editorState, "header-three") },
                                { name: "h4", func: () => createBlockStyle(editorState, "header-four") },
                                { name: "h5", func: () => createBlockStyle(editorState, "header-five") },
                                { name: "p", func: () => createBlockStyle(editorState, "paragraph") }
                            ]
                            } />
                        <FormatListBulletedIcon className={`!w-12 !h-12 p-3 rounded cursor-pointer  ${blockType === "unordered-list-item" ? props.colorhover ? props.colorhover : "bg-lv-11 text-white" : ""}`} onClick={() => createBlockStyle(editorState, "unordered-list-item")} />
                        <FormatBoldIcon className={`!w-12 !h-12 p-3 rounded cursor-pointer  ${newEditorState.getCurrentInlineStyle().has("BOLD") ? props.colorhover ? props.colorhover : "bg-lv-11 text-white" : ""}`} onClick={() => createInlineStyle(editorState, "BOLD")} />
                        <FormatItalicIcon className={`!w-12 !h-12 p-3 rounded cursor-pointer  ${newEditorState.getCurrentInlineStyle().has("ITALIC") ? props.colorhover ? props.colorhover : "bg-lv-11 text-white" : ""}`} onClick={() => createInlineStyle(editorState, "ITALIC")} />
                        <FormatUnderlinedIcon className={`!w-12 !h-12 p-3 rounded cursor-pointer  ${newEditorState.getCurrentInlineStyle().has("UNDERLINE") ? props.colorhover ? props.colorhover : "bg-lv-11 text-white" : ""}`} onClick={() => createInlineStyle(editorState, "UNDERLINE")} />
                        <AddLinkIcon className={`!w-12 !h-12 p-3 rounded cursor-pointer  ${entity && entity.getType() === "LINK" ? "bg-main" : ""}`} onClick={() => { setIsInputLink(!isInputLink) }} />
                        <LinkOffIcon className={`!w-12 !h-12 p-3 rounded cursor-pointer  `} onClick={() => removeLink()} />
                        <AddPhotoAlternateIcon className={`!w-12 !h-12 p-3 rounded cursor-pointer  `} onClick={() => setIsInputLinkImg(true)} />
                    </div>
                    <div className={`flex transition-all duration-200 absolute shadow-md rounded cursor-pointer p-1 bg-lv-0 dark:bg-lv-18 ${isInputLink || isInputLinkImg ? "top-14 z-[1]" : "top-0 z-[-1] opacity-0"}`}>
                        <input
                            className='bg-inherit border rounded cursor-pointer border-lv-11'
                            onChange={(e) => { isInputLink && setLink(e.target.value); isInputLinkImg && setLinkImg(e.target.value); }}
                            value={link || linkImg}
                            onFocus={(e) => {
                                e.target.style.outline = 'none'
                            }}>
                        </input>
                        <CloseIcon className={`!w-12 !h-12 p-3  bg-main rounded cursor-pointer `} onClick={() => { setIsInputLink(false), setIsInputLinkImg(false) }} />
                        <CheckIcon className={`!w-12 !h-12 p-3  bg-main rounded cursor-pointer `} onClick={() => onCheck(link || linkImg)} />
                    </div>
                </div>
            </div>
            <div className={` overflow-auto scroll_none pt-5 dangerous_box h-full-12`}>
                <Editor editorState={editorState} onChange={(editorState) => setEditorState(editorState)} />
            </div>
        </div >
    )
}
type TextAreaProps = {
    onChange: (e: any) => void,
    onSubmit?: () => void,
    onFocus?: () => void,
    name: React.ReactNode,
    value: any,
    type?: string,
    disabled?: boolean,
    warn?: string,
    icon1?: React.ReactNode,
    icon2?: React.ReactNode,
    data?: any[],
    sx?: string
}

export const TextArea = ({ onChange, name, value, type, disabled, warn, icon1, icon2, sx, onFocus }: TextAreaProps) => {

    const [editorState, setEditorState] = useState(EditorState.createEmpty(decorator));
    const [content, setContent] = useState<string>("");

    const inputRef = useRef<any>("")
    const [_focus, set_focus] = useState<boolean>(false)
    useEffect(() => {
        const valueState = stateFromHTML(value)
        setEditorState(EditorState.createWithContent(valueState, decorator))
    }, [])

    useEffect(() => {
        setContent(stateToHTML(editorState.getCurrentContent()))
    }, [editorState])

    useEffect(() => {
        onChange && onChange(content)
    }, [content])

    return (
        <div className={` text-left relative mb-2 ${disabled ? "opacity-50" : ""} ${sx ? sx : ""}`}>
            <p className={` absolute transition-all duration-300 h-max px-2 opacity-75  ${_focus || content !== "<p><br></p>" ? "top-0 text-sm text-lv-13 opacity-50" : "top-4"}`}
            >{name}</p>

            <div className={`relative z-[1] overflow-auto scroll_none pt-5 min-h-11 px-2`} onClick={() => { inputRef.current.focus(), set_focus(true) }}>
                <Editor ref={inputRef} editorState={editorState} onChange={(editorState) => setEditorState(editorState)} onBlur={() => set_focus(false)} onFocus={() => onFocus && onFocus()} />
            </div>
            <div className={`w-full h-full absolute z-0 border-b-2 top-0 left-0 border-lv-2 dark:border-lv-17`}
            ></div>
            <div className={`w-full h-full absolute z-0 border-b-2 top-0 left-0 transition-all duration-300 border-lv-11 ${_focus || content !== "<p><br></p>" ? "scale-x-[100%]" : "scale-x-[0%]"}`} ></div>
        </div>
    )
}