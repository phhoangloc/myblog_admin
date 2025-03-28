'use client'
import React, { useState, useEffect } from 'react'
import store from '@/redux/store'
import Image from 'next/image'
import { Input } from '../tool/input/input'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { ModalType, setModal } from '@/redux/reducer/ModalReducer'
import { setNotice } from '@/redux/reducer/noticeReducer'
import { AlertType, setAlert } from '@/redux/reducer/alertReducer'
// import { ApiDeleteItem } from '@/api/user'
import { ApiItemUser } from '@/api/user'
import { ApiUploadFile } from '@/api/user'
import { UploadButton } from '../button/button'
import CloseIcon from '@mui/icons-material/Close';
import Pagination from '../display/pagination'
import { UserType } from '@/redux/reducer/UserReduce'
export type ImageType = {
  id: number
  name: string
  archive: string
  host: { username: string }
}
type ImageProps = {
  data: ImageType
}
const ImageModalDetail = ({ data }: ImageProps) => {

  const [isCopyLink, setIsCopyLink] = useState<boolean>(false)

  useEffect(() => {
    if (isCopyLink) {
      navigator.clipboard.writeText(process.env.ftp_url + data.name);
      store.dispatch(setNotice({ open: true, success: false, msg: "copied" }))
      setTimeout(() => {
        store.dispatch(setNotice({ open: false, success: false, msg: "" }))
      }, 3000)
    }
  }, [data.name, isCopyLink])


  const deleteImage = async () => {
    store.dispatch(setAlert({ value: false, msg: "do you want to delete this picture", open: true }))
  }


  return (
    <div className="w-full max-w-screen-xl h-max m-auto p-4 grid grid-cols-1 lg:grid-cols-2  bg-lv-1 dark:bg-lv-19 dark:text-lv-0">
      <div className="relative rounded overflow-hidden m-auto lg:h-max">
        <Image quality={100} src={process.env.ftp_url + data.name} width={500} height={500} alt="" priority style={{ width: "100%", height: "auto", margin: "auto" }} />
      </div>
      <div className="relative ">
        <Input name="name" value={data.name} onChange={() => { }} disabled={true} />
        <Input name="author" value={data.host.username} onChange={() => { }} disabled={true} />
        <Input name="url" value={process.env.ftp_url + data.name} onChange={() => { }} disabled={true}
          icon1={<ContentCopyIcon className='!w-10 !h-10 p-2 m-auto bg-lv-0 dark:bg-lv-19 hover:text-lv-11 cursor-pointer' onClick={() => setIsCopyLink(true)} />} />
        <div className='flex justify-between w-full mt-6'>
          <DeleteOutlineOutlinedIcon className='dark:text-white hover:text-lv-11 cursor-pointer' onClick={() => deleteImage()} />
          <p className=' dark:text-white hover:text-lv-11 cursor-pointer' onClick={() => store.dispatch(setModal({ value: "", data: {} as ImageType }))} ><CloseIcon /></p>
        </div>
      </div>
    </div>
  )
}
const ImageModal = () => {
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

  useEffect(() => {
    update()
  })

  const archive = "pic"
  const [items, setItems] = useState<ImageType[]>([])
  const [refresh, setRefresh] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [file, setFile] = useState<File | undefined>()
  const [files, setFiles] = useState<FileList>()
  const [isUpload, setIsUpload] = useState<boolean>(false)
  const [page, setPage] = useState<number>(0)
  const limit = 23

  const getItems = async (p: string, a: string, skip: number | undefined, li: number | undefined) => {
    setLoading(true)
    const result = await ApiItemUser({ position: p, archive: a, skip: skip, limit: li })
    if (result.success) {
      setLoading(false)
      setItems(result.data)
    } else {
      setLoading(false)
      setItems([])
    }
  }

  useEffect(() => {
    if (currentUser.position) { getItems(currentUser.position, archive, page * limit, limit) }
  }, [currentUser.position, refresh, page])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getFile = async (e: any) => {
    const files = e.target.files;
    const file: File = files[0]
    const reader: FileReader = new FileReader();
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

  useEffect(() => {
    if (currentAlert.value && isUpload && currentUser.position && file) {
      const UpdateImage = async (p: string, a: string, f: File) => {
        const result = await ApiUploadFile({ position: p, archive: a, file: f })
        if (result) {
          setIsUpload(false)
          setTimeout(() => {
            setIsUpload(false)
            store.dispatch(setAlert({ value: false, msg: "", open: false }))
            setRefresh(n => n + 1)
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
          setIsUpload(false)
          setTimeout(() => {
            setIsUpload(false)
            store.dispatch(setAlert({ value: false, msg: "", open: false }))
            setRefresh(n => n + 1)
          }, 3000)
        }
      }
      for (let index = 0; index < files.length; index++) {
        if (currentUser.position) {
          UpdateImage(currentUser.position, "pic", files[index])
        }
      }
    }
  }, [currentAlert, currentUser, isUpload, files, refresh])

  useEffect(() => {
    setRefresh(n => n + 1)
  }, [currentModal.value])

  return (
    <div className='w-full dark:text-white'>
      <div className="grid grid-cols-12 gap-2">
        <div className=' relative col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2  aspect-square overflow-hidden rounded flex flex-col justify-center text-center cursor-pointer shadow-lg  bg-lv-1 dark:bg-lv-18 '>
          <UploadButton name={loading ? "UPLOADING" : "UPLOAD"} onClick={(e) => { getFile(e); setFile(undefined); setFiles(undefined) }} sx='m-auto' />
        </div>
        {
          items.map((item, index) =>
            <div key={index} className='col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2 relative aspect-square sm overflow-hidden rounded cursor-pointer bg-bgwhite dark:bg-bgdark' onClick={() => store.dispatch(setModal({ value: "", id: item.id }))}>
              <Image className='opacity-90 hover:scale-110 hover:opacity-100 transition-all duration-200 ' quality={100} src={process.env.ftp_url + item.name} alt='pic' fill priority style={{ objectFit: "cover" }} sizes='100' />
            </div>
          )
        }
      </div>
      <div className='flex mt-4'>
        <Pagination page={page ? page : 0} next={() => setPage(p => p + 1)} prev={() => setPage(p => p - 1)} end={items.length < limit} />
      </div>
      <div className="flex py-2">
        <CloseIcon className='!w-9 !h-9 p-1 bg-orange-600 text-lv-0 rounded cursor-pointer' onClick={() => store.dispatch(setModal({ value: "", id: 0 }))} />
      </div>
    </div>
  )
}

export const Modal = () => {
  const [currentModal, setCurrentModal] = useState<ModalType>(store.getState().modal)
  const update = () => {
    store.subscribe(() => setCurrentModal(store.getState().modal))
  }
  useEffect(() => {
    update()
  })

  switch (currentModal.value) {
    case "viewimage_detail":
      return (
        currentModal.data ?
          <div className='fixed w-screen h-screen top-0 left-0 backdrop-brightness-50 backdrop-blur-sm z-[11] flex flex-col justify-center p-2'>
            <ImageModalDetail data={currentModal.data} />
          </div> : null
      )
    case "viewimage":
      return (
        <div className='fixed w-screen h-screen top-0 left-0 backdrop-brightness-50 backdrop-blur-sm z-[11] overflow-scroll scroll_none p-2'>
          <ImageModal />
        </div>
      )
    default:
      return (
        <div></div>
      )
  }

}


