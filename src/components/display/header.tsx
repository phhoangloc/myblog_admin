import React, { useState, useEffect } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import store from '@/redux/store';
import { setMenu } from '@/redux/reducer/MenuReduce';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { UserType } from '@/redux/reducer/UserReduce';
import { setRefresh } from '@/redux/reducer/RefreshReduce';
import { useRouter } from 'next/navigation';
import PersonIcon from '@mui/icons-material/Person';
import { IconDivider } from '../tool/icon/icon';
const Header = () => {

    const params = useParams()
    const toPage = useRouter()
    const [currentUser, setCurrentUser] = useState<UserType>(store.getState().user)

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
    }

    useEffect(() => {
        update()
    })
    const dropDataLogin = [
        {
            name: "Profile",
            func: () => toPage.push("/profile")
        },
        {
            name: "Log Out",
            func: () => { localStorage.clear(); store.dispatch(setRefresh()) }
        }]
    const dropDataLogout = [
        {
            name: "Login",
            func: () => toPage.push("/login")
        },
        {
            name: "Sign Up",
            func: () => toPage.push("/signup")
        }
    ]
    return (
        <div className=" rounded h-12 flex text-lv-11 dark:text-lv-0  w-full top-0">
            <MenuIcon className="cursor-pointer !w-12 !h-12 p-2 opacity-75 hover:opacity-100 xl:!hidden" onClick={() => store.dispatch(setMenu(true))} />
            <div className="h-full w-full-12 xl:w-full gap-1 flex font-bold ">
                <Image src={"/logo.png"} width={48} height={48} alt='logo' className=' p-2 hidden xl:block' />
                <div className="h-12 font-bold text-xl flex cursor-pointer">
                    <p className='h-full flex flex-col justify-center'>{params.archive ? params.archive === "pic" ? "IMAGES" : params.archive.toString().toUpperCase() : "ADMIN"}</p>
                </div>
                <IconDivider
                    sx='ml-auto mr-0 cursor-pointer'
                    icon={
                        currentUser && currentUser.avata ?
                            <Image src={process.env.ftp_url + currentUser.avata.name} width={36} height={36} alt='avata' className='rounded-[50%]' /> :
                            <PersonIcon className='!w-12 !h-12 p-2' />
                    } data={currentUser ? dropDataLogin : dropDataLogout} />

            </div>
        </div>
    )
}

export default Header