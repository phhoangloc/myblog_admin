'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import store from '@/redux/store';
import { Input } from '../tool/input/input';
import { Button } from '../button/button';
import { ModalType, setModal } from '@/redux/reducer/ModalReducer';
import { ApiCreateItem, ApiItemUser, ApiUpdateItem } from '@/api/user';
import { DividerSelect } from '../tool/divider/divider';
import { UserType } from '@/redux/reducer/UserReduce';
import { setNotice } from '@/redux/reducer/noticeReducer';
import { EditAvatar } from '../tool/picture/editPicture';
import { setRefresh } from '@/redux/reducer/RefreshReduce';
import Link from 'next/link';
import EditPicture from '../tool/picture/editPicture';
import moment from 'moment';
import { TextAreaTool } from '../tool/input/textarea';
import { InputTable } from '../tool/input/inputTable';
import { InputTableVideo } from '../tool/input/inputTableVideo';
type Props = {
    archive: string,
    slug: string,
}
type ItemType = {
    id: number,
    name: string,
    slug: string,
    categoryId: number,
    coverId: number,
    infor: string,
    video: string,
    content: string,
    createdAt: Date,
    updateDate: Date,
    category: { id: string, name: string }
    avata: { id: string, name: string },
    keyword: string,
    description: string
}

type ItemBodyType = {
    name: string;
    slug: string;
    categoryId: number | undefined;
    coverId: number | undefined;
    infor: string | undefined;
    video: string | undefined;
    content: string;
    updateDate: Date;
}

export const EditDetailbySlug = ({ archive, slug }: Props) => {

    const [currentUser, setCurrentUser] = useState<UserType>(store.getState().user)
    const [currentModal, setCurrentModal] = useState<ModalType>(store.getState().modal)

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
        store.subscribe(() => setCurrentModal(store.getState().modal))
    }

    useEffect(() => {
        update()
    })

    const [_item, set_item] = useState<ItemType>()
    const [_id, set_id] = useState<number>(0)
    const [_isCoverId, set_isCoverId] = useState<boolean>(false)
    const [_coverId, set_coverId] = useState<number>(0)
    const [_categoryId, set_categoryId] = useState<number>(0)
    const [_category, set_category] = useState<{ name: string }>()
    const [_coverName, set_coverName] = useState<string>("")
    const [_name, set_name] = useState<string>("")
    const [_slug, set_slug] = useState<string>("")
    const [_content, set_content] = useState<string>("")
    const [_infor, set_infor] = useState<string>("")
    const [_newContent, set_newContent] = useState<string>("")
    const [_createdDate, set_createdDate] = useState<Date>()
    const [_updateDate, set_updateDate] = useState<Date>()
    const [_video, set_video] = useState<string>("")
    const [_keyword, set_keyword] = useState<string>("")
    const [_description, set_description] = useState<string>("")


    const body = {
        name: _name,
        slug: _slug,
        categoryId: _categoryId || undefined,
        coverId: _coverId || undefined,
        infor: _infor || undefined,
        content: _newContent || _content,
        updateDate: new Date(),
        video: _video || undefined,
        keyword: _keyword || undefined,
        description: _description || undefined,
    }

    const toPage = useRouter()

    const getItem = async (position: string, archive: string, slug: string) => {
        const result = await ApiItemUser({ position, archive, slug })
        if (result.success) {
            set_item(result.data[0])
        } else {
            set_item(undefined)
        }
    }
    useEffect(() => {
        getItem(currentUser.position, archive, slug)
    }, [archive, currentUser.position, slug])

    useEffect(() => {
        if (_item) {
            set_id(_item.id)
            set_name(_item.name)
            set_slug(_item.slug)
            set_category(_item.category)
            set_categoryId(_item.categoryId)
            set_coverId(_item.coverId)
            set_content(_item.content)
            set_infor(_item.infor)
            set_video(_item.video)
            set_createdDate(_item.createdAt)
            set_updateDate(_item.updateDate)
            set_keyword(_item.keyword)
            set_description(_item.description)
        }

    }, [_item])

    // get image from id
    useEffect(() => {
        const getImageById = async (id: number) => {
            const result = await ApiItemUser({ position: currentUser.position, archive: "pic", id: id })
            if (result.success) {
                set_coverName(result.data[0].name)
            }
        }
        if (_coverId) {
            getImageById(_coverId)
        }
    }, [_coverId, currentUser.position])

    //get cover id from modal
    useEffect(() => {
        if (_isCoverId && currentModal.id) {
            set_coverId(currentModal.id);
            set_isCoverId(false);
        }
    }, [_isCoverId, currentModal.id])


    const [_categories, set_categories] = useState<ItemType[]>([])
    // get Category
    const getAllCategory = async (position: string, archive: string) => {
        const result = await ApiItemUser({ position, archive })
        if (result.success) {
            set_categories(result.data)
        }
    }
    useEffect(() => {
        if (archive === "blog") {
            getAllCategory(currentUser.position, "category")
        }
    }, [archive, currentUser.position])

    const updateItem = async (archive: string, id: number, body: ItemBodyType) => {
        const result = await ApiUpdateItem({ position: currentUser.position, archive, id: id }, body)
        if (result.success) {
            store.dispatch(setNotice({ success: true, msg: result.msg, open: true }))
            setTimeout(() => {
                store.dispatch(setRefresh())
                store.dispatch(setNotice({ success: false, msg: "", open: false }))
            }, 3000)
        } else {
            store.dispatch(setNotice({ success: false, msg: result.msg, open: true }))
            setTimeout(() => {
                store.dispatch(setNotice({ success: false, msg: "", open: false }))
            }, 3000)
        }
    }
    const createItem = async (archive: string, body: ItemBodyType) => {
        const result = await ApiCreateItem({ position: currentUser.position, archive }, body)
        if (result.success) {
            store.dispatch(setNotice({ success: true, msg: result.msg, open: true }))
            setTimeout(() => {
                store.dispatch(setRefresh())
                store.dispatch(setNotice({ success: false, msg: "", open: false }))
            }, 3000)
        } else {
            store.dispatch(setNotice({ success: false, msg: result.msg, open: true }))
            setTimeout(() => {
                store.dispatch(setNotice({ success: false, msg: "", open: false }))
            }, 3000)
        }
    }

    return (
        <div className='flex flex-wrap gap-4 '>
            <div className='w-full bg-lv-0 dark:bg-lv-18 shadow-md rounded h-12 flex flex-col justify-center px-2'>
                <div className='flex'>
                    <p onClick={() => toPage.push(`/${archive}/`)} className="hover:text-lv-11 cursor-pointer" >{archive}</p>
                </div>
            </div>
            <div className='w-full bg-lv-0 dark:bg-lv-18 shadow-md rounded h-12 flex flex-col justify-center px-2'>
                <Link href={"/" + archive + "/" + archive + "_preview"} target='__blank'><p className='truncate'> <span className='opacity-50'>Preview : </span><span className='opacity-75 hover:opacity-100'>{"/" + archive + "/" + slug + "_preview"} </span> </p></Link>
            </div>
            <div className="w-full flex flex-wrap gap-4 xl:flex-nowrap flex-row-reverse ">
                <div className='w-full xl:w-3/12 bg-lv-0 dark:bg-lv-18 shadow-md rounded flex flex-col justify-center p-2 h-max'>
                    <div className='w-full bg-lv-0 dark:bg-lv-18 rounded hidden xl:block'>
                        <EditPicture sx='h-auto aspect-square' src={_coverName ? process.env.ftp_url + _coverName : undefined} setPictureModal={() => { store.dispatch(setModal({ value: "viewimage" })); set_isCoverId(true) }} />
                    </div>
                    <div className="flex h-12 gap-1 ml-auto mr-0">
                        <Button name="cancel" onClick={() => toPage.back()} sx="!m-auto !w-24 !h-6  !text-sm" />
                        <Button name={slug === "news" ? "create" : "save"} onClick={() => slug !== "news" ? updateItem(archive, _id, body) : createItem && createItem(archive, body)} sx="!m-0 !m-auto !w-24 !h-6  !text-sm" />
                    </div>
                    {_createdDate ?
                        <div className='flex flex-wrap max-w-sm ml-auto gap-1 h-6 flex-col justify-center'>
                            <p className='opacity-50 text-sm'>Created Date :</p>
                            <p >{moment(_createdDate).format("YYYY/MM/DD")}</p>
                        </div> : null}
                    {_updateDate ? <div className='flex flex-wrap max-w-sm ml-auto gap-1 h-6 flex-col justify-center'>
                        <p className='opacity-50 text-sm'>Update Date :</p>
                        <p >{moment(_updateDate).format("YYYY/MM/DD")}</p>
                    </div> : null}
                </div>
                <div className="w-full grid gap-4 xl:w-9/12">
                    <EditPicture sx='border-2 border-lv-2 dark:border-lv-17 rounded shadow-md  xl:hidden' cover src={_coverName ? process.env.ftp_url + _coverName : undefined} setPictureModal={() => { store.dispatch(setModal({ value: "viewimage" })); set_isCoverId(true) }} />
                    <div className="relative">
                        <div className='w-full grid  h-max bg-lv-0 dark:bg-lv-18 shadow-md rounded p-2 gap-2'>
                            <Input name="title" onChange={(v) => set_name(v)} value={_name} />
                            <Input name="slug" onChange={(v) => set_slug(v)} value={_slug} />
                            {archive === "blog" ?
                                <>
                                    <p className='text-sm px-2 text-lv-13 opacity-50"'>category</p>
                                    <DividerSelect name={_category?.name} data={_categories} valueReturn={(v) => { if (v) { set_categoryId(Number(v)) } else { set_categoryId(Number(_categoryId)) } }} />
                                </>
                                : null}
                            <TextAreaTool value={_content} onChange={(v) => set_newContent(v)} sx='min-h-screen' />
                            {/* {archive !== "page" ? <Input name="video link" onChange={(v) => set_video(v)} value={_video} /> : null} */}
                            {archive !== "page" ? <InputTableVideo table={_video ? JSON.parse(_video) : []} exportTable={tbl => set_video(JSON.stringify(tbl))} /> : null}
                            {archive !== "page" ? <InputTable table={_infor ? JSON.parse(_infor) : []} exportTable={tbl => set_infor(JSON.stringify(tbl))} /> : null}
                            {archive !== "page" ?
                                <div className={`relative border border-lv-2 dark:border-lv-17 px-2`}>
                                    <Input name="keyword" onChange={(v) => set_keyword(v)} value={_keyword} />
                                    <Input name="description" onChange={(v) => set_description(v)} value={_description} />

                                </div>
                                : null}
                        </div >
                        <div className="flex h-12">
                            <Button name={slug === "news" ? "create" : "save"} onClick={() => slug !== "news" ? updateItem(archive, _id, body) : createItem && createItem(archive, body)} sx="!m-0 !m-auto !w-24 !h-6  !text-sm" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

type BodyType = {
    username: string | undefined;
    position: string | undefined;
    active: boolean | undefined;
    avata: {
        connect: {
            id: number;
        };
    }
}
export const EditDetailbyId = ({ archive, slug }: Props) => {
    console.log(slug)

    const [currentUser, setCurrentUser] = useState<UserType>(store.getState().user)
    const [currentModal, setCurrentModal] = useState<ModalType>(store.getState().modal)

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
        store.subscribe(() => setCurrentModal(store.getState().modal))
    }

    useEffect(() => {
        update()
    })

    const [_item, set_item] = useState<UserType>()

    const getItem = async (position: string, archive: string, slug: string) => {
        const result = await ApiItemUser({ position, archive, id: Number(slug) })
        set_item(result.data[0])
    }

    useEffect(() => {
        getItem(currentUser.position, archive, slug)
    }, [archive, currentUser.position, slug])

    const toPage = useRouter()
    const [_username, set_username] = useState<string>("")
    const [_active, set_active] = useState<boolean>(false)
    const [_position, set_position] = useState<string>("")

    const [_avataId, set_avataId] = useState<number>(0)
    const [_avataName, set_avataName] = useState<string>("")
    const body: BodyType = {
        username: _username || _item?.username,
        position: _position || _item?.position,
        active: _active || _item?.active,
        avata: {
            connect: {
                id: _avataId
            }
        }
    }



    const updateItem = async (id: number, body: BodyType) => {
        const result = await ApiUpdateItem({ position: currentUser.position, archive: "user", id: id }, body)
        if (result.success) {
            store.dispatch(setNotice({ success: true, msg: result.msg, open: true }))
            setTimeout(() => {
                store.dispatch(setRefresh())
                store.dispatch(setNotice({ success: false, msg: "", open: false }))
            }, 3000)
        } else {
            store.dispatch(setNotice({ success: false, msg: result.msg, open: true }))
            setTimeout(() => {
                store.dispatch(setNotice({ success: false, msg: "", open: false }))
            }, 3000)
        }
    }

    const selectAvata = async (id: number) => {
        set_avataId(id)
        const result = await ApiItemUser({ position: currentUser.position, archive: "pic", id: id })
        set_avataName(result.data[0].name)
        console.log(result.data[0].name)
    }

    useEffect(() => {
        if (currentModal.id) {
            selectAvata(Number(currentModal.id))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentModal.id])

    return (
        <div className='grid gap-4 max-w-screen-md m-auto'>
            {_item ?
                <div>
                    <div className='bg-lv-0 dark:bg-lv-18 shadow-md rounded'>
                        <div className="w-max m-auto py-10 text-center">
                            <h2 className='font-bold text-xl mb-1'>{_username || _item?.username}</h2>
                            <h3 className='font-bold text-lg mb-1 opacity-75'>{_position || _item?.position}</h3>
                        </div>
                    </div>
                    <div className='bg-lv-0 dark:bg-lv-18  shadow-md rounded '>
                        <div className='max-w-screen-md m-auto p-4'>
                            <Input name="username" onChange={(v) => set_username(v)} value={_item?.username || _username} />
                            <Input name="email" onChange={() => { }} value={_item && _item.email || ""} disabled={true} />
                        </div>
                        <div className='max-w-screen-md m-auto p-4'>
                            {currentUser.position === "admin" &&
                                <div className="flex mb-4">
                                    <div className='flex flex-col justify-center w-24 text-center'>position</div>
                                    <DividerSelect data={
                                        [{
                                            name: "admin",
                                        },
                                        {
                                            name: "user",
                                        },]
                                    }
                                        name={_item?.position || _position}
                                        sx="!w-24"
                                        valueReturn={(v) => v && set_position(v.toString())}
                                    />
                                </div>}
                            {currentUser.position === "admin" &&
                                <div className="flex mb-4">
                                    <div className='flex flex-col justify-center w-24 text-center'>active</div>
                                    <DividerSelect data={
                                        [{
                                            name: "true",
                                        },
                                        {
                                            name: "false",
                                        },]
                                    }
                                        name={_item?.active.toString() || _active.toString()}
                                        sx="!w-24"
                                        valueReturn={(v) => set_active(Boolean(v))}
                                    />
                                </div>}

                        </div>
                        <div className='max-w-screen-md m-auto p-4'>

                            <div className='w-24'>
                                <EditAvatar src={_avataName ? process.env.ftp_url + _avataName : _item && _item.avata?.name ? process.env.ftp_url + _item.avata.name : undefined} setPictureModal={() => { store.dispatch(setModal({ value: "viewimage" })); }} cover={true} />
                            </div>
                        </div>
                    </div>
                </div> :
                <div className='h-screen-32 flex flex-col justify-center text-center'>There are no Item</div>
            }
            <div className="flex h-12 gap-1 ml-auto mr-4 w-max">
                <Button name="cancel" onClick={() => toPage.back()} sx="!m-auto !w-24 !h-6  !text-sm" />
                <Button name={"save"} onClick={() => { updateItem(Number(slug), body) }} sx="!m-0 !m-auto !w-24 !h-6  !text-sm" />
            </div>
        </div>
    )
}