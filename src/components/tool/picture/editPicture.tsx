import React from 'react'
import Image from 'next/image'
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import CloseIcon from '@mui/icons-material/Close';
type Props = {
    sx?: string,
    src?: string,
    cover?: boolean
    setPictureModal?: () => void
}

const EditPicture = (props: Props) => {
    return (

        <div className={`w-full relative overflow-hidden h-[400px] ${props.sx}`}>
            {
                props.src ?
                    < Image className={`bg-lv-1 dark:bg-lv-19 ${props.cover ? "object-cover" : 'object-contain'}`} src={props.src} alt='avata' fill sizes='100' priority={true} /> :
                    < div className='h-full bg-lv-1 dark:bg-lv-19 flex flex-col justify-center text-center text-xl rounded'>NO PICTURE</div>
            }
            <InsertPhotoOutlinedIcon className='!w-10 !h-10 p-1 absolute top-1 right-1 cursor-pointer hover:text-lv-0 hover:bg-lv-11 '
                onClick={() => props.setPictureModal && props.setPictureModal()} />
        </div>
    )
}
export default EditPicture

export const EditAvatar = (props: Props) => {
    return (
        <div className='w-full aspect-square max-w-60 relative rounded-[50%] overflow-hidden border-2'>
            <div className="relative h-full">
                {
                    props.src ?
                        < Image src={props.src} alt='avata' fill className='object-cover bg-lv-1 dark:bg-lv-19' /> :
                        < div className='h-full bg-lv-0 dark:bg-lv-18  flex flex-col justify-center text-center text-xl'></div>
                }
            </div>
            <InsertPhotoOutlinedIcon className='absolute !w-10 !h-10 rounded-[50%] p-2  bottom-[12.5%] right-[12.5%] cursor-pointer hover:text-lv-0 hover:bg-vl-11' onClick={() => props.setPictureModal && props.setPictureModal()} />
        </div>

    )
}
type PropsMany = {
    sx?: string,
    src?: string[],
    setPictureModal?: () => void,
    onRemove?: (index: number) => void
}
export const ImportManyPicture = (props: PropsMany) => {
    return (
        <div className='shadow rounded w-full overflow-auto scroll-hidden'>
            <div className="flex w-max  my-1">
                <div className='relative overflow-hidden rounded h-[100px] aspect-square bg-slate-50 dark:bg-slate-700 flex flex-col justify-center text-center mr-1 cursor-pointer' onClick={() => props.setPictureModal && props.setPictureModal()}>
                    add
                </div>
                {props.src ? props.src.map((s, index) =>
                    <div className='relative overflow-hidden rounded h-[100px] aspect-square mr-1' key={index}>
                        < Image className='object-cover' src={s} alt='avata' fill />
                        <CloseIcon className='absolute top-1 right-1 !w-4 !h-4 opacity-50 hover:opacity-100 hover:text-lv-0 bg-lv-11 cursor-pointer' onClick={() => props.onRemove && props.onRemove(index)} />
                    </div>) :
                    null}
                {/* <InsertPhotoOutlinedIcon className='!w-10 !h-10 p-1 absolute bottom-1 right-1 cursor-pointer hover:text-lv-0 hover:bg-orange-500 ' onClick={() => props.setPictureModal && props.setPictureModal()} /> */}
            </div>
        </div>
    )
}