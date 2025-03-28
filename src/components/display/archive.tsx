/* eslint-disable no-var */
'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import moment from 'moment'
import AddIcon from '@mui/icons-material/Add';
import { UploadButton } from '../button/button';
import Image from 'next/image';
import store from '@/redux/store'
import { setAlert } from '@/redux/reducer/alertReducer';
import { ApiCreateItem, ApiDeleteItem, ApiUpdateItem, ApiUploadFile } from '@/api/user';
import { AlertType } from '@/redux/reducer/alertReducer';
import { ModalType, setModal } from '@/redux/reducer/ModalReducer';
import Pagination from './pagination';
import { UserType } from '@/redux/reducer/UserReduce';
import { setNotice } from '@/redux/reducer/noticeReducer';
import { ImageType } from '../modal/imagemodal';
import { ApiItemUser } from '@/api/user';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
export type ItemType = {
    id: number,
    archive: string
    name: string
    slug: string
    coverId: number,
    cover: {
        name: string,
    }
    host: {
        username: string,
    }
    categoryId: number,
    category: {
        name: string,
    }
    content: string
    infor: string
    createdAt: Date,
    updateDate: Date,
}
export const Archive = ({ archive }: { archive: string }) => {

    const [currentUser, setCurrentUser] = useState<UserType>(store.getState().user)

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))

    }
    useEffect(() => {
        update()
    })
    const toPage = useRouter()
    const [items, setItems] = useState<(ItemType & UserType)[]>([])
    // const [_refresh, set_refresh] = useState<number>(0)

    //page
    const limit: number = 23
    const [_page, set_page] = useState<number>(0)

    //get Item //
    const getItems = async (position: string, archive: string, page: number, limit: number) => {
        const result = await ApiItemUser({ position, archive, skip: page * limit, limit })
        setItems(result.data)
    }

    useEffect(() => {
        getItems(currentUser.position, archive, _page, limit)
    }, [_page, archive, currentUser.position])

    return (
        <div className='bg-lv-0 dark:bg-lv-18 rounded shadow-md p-4 grid gap-2 grid-cols-1'>
            <div className='flex border-b-2 border-lv-2 dark:border-lv-17 justify-between'>
                <div className="flex h-12">
                    <h3 className='text-xl font-bold text-lv-11 dark:text-lv-0 h-full flex flex-col justify-center'>{archive.toUpperCase()} </h3>
                    <AddIcon className='!w-12 !h-full p-3 opacity-50 hover:opacity-100 cursor-pointer text-lv-11 dark:text-lv-0' onClick={() => toPage.push(archive + "/news")} />
                </div>
                {/* <SearchButton placehoder='search' func={(v) => setSearch(v)} /> */}
            </div>
            <div className="h-12 flex flex-col justify-end font-bold opacity-50">
                <h4>Title</h4>
            </div>
            {
                items && items.length ?
                    items.map((n: ItemType & UserType, index: number) =>
                        <div key={index} className={`h-12 flex justify-between`} >
                            <div className="flex flex-col justify-center  text-sm md:text-base cursor-pointer" style={{ width: "calc(100% - 96px)" }}>
                                <h4 title={n.name} className={`truncate font-semibold w-full hover:text-lv-11`}
                                    onClick={() => toPage.push(n.slug ? "/" + n.archive + "/" + n.slug : "/" + n.archive + "/" + n.id)}>
                                    {n.username || n.name}
                                </h4>
                                {n.category?.name ?
                                    <p className="text-xs opacity-50"> {n.category.name}</p>
                                    : <p className="text-xs opacity-50"> {n.position || n.updateDate && moment(n.updateDate).format("MM/DD") || moment(n.createdAt).format("MM/DD")} {n.host?.username ? " - " + n.host?.username : null}</p>
                                }
                            </div>

                            <div className="w-max flex h-12">
                                <Link className='h-max m-auto' style={{ textDecoration: "none", color: "inherit" }} href={n.slug ? "/" + n.archive + "/" + n.slug : "/" + n.archive + "/" + n.id} target='_blank'>
                                    <RemoveRedEyeOutlinedIcon className='!w-12 !h-full p-3 m-auto opacity-50 hover:opacity-100  text-lv-11 ' />
                                </Link>
                                <DeleteOutlineOutlinedIcon className='!w-12 !h-full p-3 m-auto opacity-50 hover:opacity-100 cursor-pointer text-lv-11 ' onClick={() => console.log(n.id)} />
                            </div>
                        </div>

                    )
                    : <div>There is no {archive}</div>
            }
            <div className="h-12"></div>
            <div className='flex border-t-2 dark:border-slate-700 '>
                <Pagination page={_page} next={() => set_page(n => n + 1)} prev={() => set_page(n => n - 1)} end={items && items.length < limit ? true : false} />
            </div>
        </div>
    )
}
export const ArchivePic = () => {

    const [currentUser, setCurrentUser] = useState<UserType>(store.getState().user)
    const [currentAlert, setCurrentAlert] = useState<AlertType>(store.getState().alert)
    const [currentModal, setCurrentModal] = useState<ModalType>(store.getState().modal)

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
        store.subscribe(() => setCurrentAlert(store.getState().alert))
        store.subscribe(() => setCurrentModal(store.getState().modal))

    }
    useEffect(() => {
        update()
    })

    //upload file
    const [file, setFile] = useState<File | undefined>()
    const [files, setFiles] = useState<FileList>()
    const [isUpload, setIsUpload] = useState<boolean>(false)


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getFile = async (e: any) => {
        var files = e.target.files;
        const file: File = files[0]
        var reader: FileReader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async function () {
            store.dispatch(setAlert({ value: false, msg: "do you want to update this picture", open: true }))
            setIsUpload(true)
            if (files.length > 1) {
                setFiles(files)
            } else {
                setFile(file)
            }
        }
    }

    // const [_id, set_Id] = useState<number>(0)

    const [items, setItems] = useState<(ItemType)[]>([])

    const [_refresh, set_refresh] = useState<number>(0)

    //page
    const limit: number = 23
    const [_page, set_page] = useState<number>(0)

    //get Item //
    const getItems = async (position: string, archive: string, page: number, limit: number) => {
        const result = await ApiItemUser({ position, archive, skip: page * limit, limit })
        setItems(result.data)
    }

    useEffect(() => {
        getItems(currentUser.position, "pic", _page, limit)
    }, [_page, _refresh, currentUser.position])

    useEffect(() => {
        if (currentAlert.value && isUpload && currentUser.position && file) {
            const UpdateImage = async (p: string, a: string, f: File) => {
                const result = await ApiUploadFile({ position: p, archive: a, file: f })
                if (result.success) {
                    setTimeout(() => {
                        setIsUpload(false)
                        store.dispatch(setAlert({ value: false, msg: "", open: false }))
                        set_refresh(n => n + 1)
                    }, 3000)
                }
            }
            UpdateImage(currentUser.position, "pic", file)
        }
    }, [currentAlert, currentUser, isUpload, file])

    useEffect(() => {
        if (currentAlert.value && isUpload && files?.length) {
            const UpdateImage = async (p: string, a: string, f: File) => {
                const result = await ApiUploadFile({ position: p, archive: a, file: f })
                if (result) {
                    setTimeout(() => {
                        setIsUpload(false)
                        store.dispatch(setAlert({ value: false, msg: "", open: false }))
                        set_refresh(n => n + 1)
                    }, 3000)
                }
            }
            for (let index = 0; index < files.length; index++) {
                if (currentUser.position) {
                    UpdateImage(currentUser.position, "pic", files[index])
                }
            }
        }
    }, [currentAlert, currentUser, isUpload, files])

    useEffect(() => {
        const deleteImage = async (p: string, a: string, id: number) => {
            const result = await ApiDeleteItem({ position: p, archive: a, id: id })
            if (result.success) {
                store.dispatch(setNotice({ open: true, success: false, msg: result.msg }))
                setTimeout(() => {
                    store.dispatch(setNotice({ open: false, success: false, msg: "" }))
                    store.dispatch(setAlert({ open: false, value: false, msg: "" }))
                    store.dispatch(setModal({ value: "", data: {} as ImageType }))
                    set_refresh(n => n + 1)
                }, 3000)
            } else {
                store.dispatch(setNotice({ open: true, success: false, msg: result.msg }))
                setTimeout(() => {
                    store.dispatch(setNotice({ open: false, success: false, msg: "" }))
                }, 3000)
            }
        }
        if (currentAlert.value && currentModal.value === "viewimage_detail" && currentUser.position && currentModal.data && currentModal.data.id) {
            deleteImage(currentUser.position, currentModal.data.archive, currentModal.data.id)
        }
    }, [currentAlert, currentModal, currentUser])

    return (
        <div className='w-full'>
            <div className="grid grid-cols-12 gap-4">
                <div className=' relative col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2  aspect-square overflow-hidden rounded flex flex-col justify-center text-center cursor-pointer shadow-lg  bg-lv-0 dark:bg-lv-18'>
                    <UploadButton name={isUpload ? "UPLOADING" : "UPLOAD"} onClick={(e) => { getFile(e); setFile(undefined); setFiles(undefined) }} sx='!m-auto' />
                </div>
                {
                    items.map((item, index) =>
                        <div key={index} className='col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2 relative aspect-square sm overflow-hidden rounded cursor-pointer shadow-lg bg-lv-0 dark:bg-lv-18' onClick={() => store.dispatch(setModal({ value: "viewimage_detail", data: item }))}>
                            <Image quality={100} src={process.env.ftp_url + item.name} alt='pic' fill sizes='100%' priority style={{ objectFit: "cover" }} />
                        </div>
                    )
                }
            </div>
            <div className='flex mt-4 border-t-2 dark:border-slate-700 '>
                <Pagination page={_page} next={() => set_page(n => n + 1)} prev={() => set_page(n => n - 1)} end={items.length < limit ? true : false} />
            </div>
        </div>
    )
}
export const ArchiveCategory = () => {

    const [currentUser, setCurrentUser] = useState<UserType>(store.getState().user)

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))

    }
    useEffect(() => {
        update()
    })
    const toPage = useRouter()
    const [items, setItems] = useState<(ItemType & UserType)[]>([])
    // const [_refresh, set_refresh] = useState<number>(0)

    //page
    const limit: number = 23
    const [_page, set_page] = useState<number>(0)
    const [_refresh, set_refresh] = useState<number>(0)

    //get Item //
    const getItems = async (position: string, archive: string, page: number, limit: number) => {
        const result = await ApiItemUser({ position, archive, skip: page * limit, limit })
        setItems(result.data)
    }

    useEffect(() => {
        getItems(currentUser.position, "category", _page, limit)
    }, [_refresh, _page, currentUser.position])

    const [_is_createCategory, set_is_createCategory] = useState<boolean>(false)
    const [_is_UpdateCategory, set_is_UpdateCategory] = useState<number>(-1)
    const [_newCategory, set_newCategory] = useState<string>("")

    const createCategory = async (position: string, archive: string, body: { name: string }) => {
        const result = await ApiCreateItem({ position, archive }, body)
        if (result.success) {
            set_refresh(n => n + 1)
        }
        set_is_createCategory(false)
        set_newCategory("")
    }
    const updateCategory = async (position: string, archive: string, id: number, body: { name: string }) => {
        const result = await ApiUpdateItem({ position, archive, id }, body)
        if (result.success) {
            set_refresh(n => n + 1)
        }
        set_is_UpdateCategory(-1)
        set_newCategory("")
    }
    const updateDelete = async (position: string, archive: string, id: number) => {
        const result = await ApiDeleteItem({ position, archive, id })
        if (result.success) {
            set_refresh(n => n + 1)
        }
        set_is_UpdateCategory(-1)
        set_newCategory("")
    }
    return (
        <div className='bg-lv-0 dark:bg-lv-18 rounded shadow-md p-4 grid gap-2 grid-cols-1'>
            <div className='flex border-b-2 border-lv-2 dark:border-lv-17 justify-between'>
                <div className="flex h-12">
                    <h3 className='text-xl font-bold text-lv-11 dark:text-lv-0 h-full flex flex-col justify-center'>{"category".toUpperCase()} </h3>
                    {/* <SearchButton placehoder='search' func={(v) => setSearch(v)} /> */}

                    <AddIcon className='!w-12 !h-full p-3 opacity-50 hover:opacity-100 cursor-pointer text-lv-11 dark:text-lv-0' onClick={() => set_is_createCategory(true)} />
                </div>
            </div>
            <div className="h-12 flex flex-col justify-end font-bold opacity-50">
                <h4>Title</h4>
            </div>
            {
                _is_createCategory ?
                    <div className={`h-12 flex justify-between`} >
                        <div className="flex flex-col justify-center  text-sm md:text-base cursor-pointer" style={{ width: "calc(100% - 96px)" }}>
                            <input className='h-full bg-transparent bg-lv-0 border-lv-4 dark:bg-lv-17 focus:border dark:border-lv-13 rounded-md px-4' onChange={(e) => set_newCategory(e.target.value)} value={_newCategory} onFocus={(e) => e.target.style.outline = "none"} />
                        </div>

                        <div className="w-max flex h-12">
                            <AddIcon className='!w-12 !h-full p-3 m-auto opacity-50 hover:opacity-100 cursor-pointer text-lv-11 ' onClick={() => createCategory(currentUser.position, "category", { name: _newCategory })} />
                            <DeleteOutlineOutlinedIcon className='!w-12 !h-full p-3 m-auto opacity-50 hover:opacity-100 cursor-pointer text-lv-11 ' onClick={() => set_is_createCategory(false)} />
                        </div>
                    </div> : null
            }
            {
                items && items.length ?
                    items.map((n: ItemType & UserType, index: number) =>
                        <div key={index} className={`h-12 flex justify-between`} >
                            {_is_UpdateCategory !== index ?
                                <div className="flex flex-col justify-center  text-sm md:text-base cursor-pointer" style={{ width: "calc(100% - 96px)" }}>
                                    <h4 title={n.name} className={`truncate font-semibold w-full hover:text-lv-11`}
                                        onClick={() => toPage.push(n.slug ? "/" + n.archive + "/" + n.slug : "/" + n.archive + "/" + n.id)}>
                                        {n.username || n.name}
                                    </h4>
                                </div> :
                                <div className="flex flex-col justify-center  text-sm md:text-base cursor-pointer" style={{ width: "calc(100% - 96px)" }}>
                                    <input className='h-full bg-transparent bg-lv-0 border-lv-4 dark:bg-lv-17 focus:border dark:border-lv-13 rounded-md px-4' onChange={(e) => set_newCategory(e.target.value)} value={_newCategory} onFocus={(e) => e.target.style.outline = "none"} />
                                </div>
                            }

                            <div className="w-max flex h-12">
                                {_is_UpdateCategory === index ?
                                    <SaveIcon className='!w-12 !h-full p-3 m-auto opacity-50 hover:opacity-100 cursor-pointer text-lv-11 ' onClick={() => updateCategory(currentUser.position, "category", n.id, { name: _newCategory })} />
                                    :
                                    <EditIcon className='!w-12 !h-full p-3 m-auto opacity-50 hover:opacity-100 cursor-pointer text-lv-11 ' onClick={() => { set_is_UpdateCategory(index); set_newCategory(n.name) }} />
                                }
                                <DeleteOutlineOutlinedIcon className='!w-12 !h-full p-3 m-auto opacity-50 hover:opacity-100 cursor-pointer text-lv-11 ' onClick={() => updateDelete(currentUser.position, "category", n.id)} />
                            </div>
                        </div>

                    )
                    : <div>There is no category</div>
            }
            <div className="h-12"></div>
            <div className='flex border-t-2 dark:border-slate-700 '>
                <Pagination page={_page} next={() => set_page(n => n + 1)} prev={() => set_page(n => n - 1)} end={items && items.length < limit ? true : false} />
            </div>
        </div>
    )
}