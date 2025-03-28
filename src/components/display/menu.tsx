'use client'
import React, { useState, useEffect } from 'react'
import store from '@/redux/store'
import { useRouter } from 'next/navigation'
import { Divider } from '../tool/divider/divider'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';
import { setMenu } from '@/redux/reducer/MenuReduce'



export const Menu = () => {

    const [currentMenu, setCurrentMenu] = useState<boolean>(store.getState().menu)

    const update = () => {
        store.subscribe(() => setCurrentMenu(store.getState().menu))
    }

    useEffect(() => {
        update()
    })

    const [_id, set_id] = useState<number>(-1)
    const menus = [
        {
            name: "DASHBOARD",
            position: "user",
            link: "/"
        },
        {
            name: "PAGE",
            position: "user",
            children: [
                {
                    name: "VIEW PAGE",
                    link: "/page"
                },
                {
                    name: "ADD NEW PAGE",
                    link: "/page/news"
                },
            ]
        },
        {
            name: "BLOG",
            position: "user",
            children: [
                {
                    name: "VIEW BLOG",
                    link: "/blog"
                },
                {
                    name: "ADD NEW BLOG",
                    link: "/blog/news"
                },
                {
                    name: "Category",
                    link: "/category"
                },
            ]
        },
        {
            name: "IMAGES",
            position: "user",
            link: "/pic"
        },
        {
            name: "AUTHENTICATION",
            position: "user",
            children: [
                {
                    name: "LOGIN",
                    link: "/login"
                },
                {
                    name: "SIGN UP",
                    link: "/signup"
                }
            ]
        },
        {
            name: "USER",
            position: "user",
            children: [
                {
                    name: "VIEW USER",
                    link: "/user"
                },
            ]
        },
    ]
    const toPage = useRouter()
    return (
        <div className={`${currentMenu ? "w-full" : "w-0"} h-full transition-all duration-300 delay-200  xl:w-full xl:max-w-full xl:h-screen-4 xl:sticky xl:top-2 overflow-hidden relative backdrop-brightness-50 xl:backdrop-brightness-100`}>
            <div className="bg-lv-1 dark:bg-lv-18 xl:bg-inherit dark:xl:bg-inherit h-full w-full max-w-[275px]">
                <div className="grid gap-1 relative  xl:w-full xl:max-w-full ">
                    <CloseIcon className='absolute xl:!hidden top-2 right-2 cursor-pointer !w-6 !h-6 ' onClick={() => store.dispatch(setMenu(false))} />
                    {
                        menus.map((item, index) =>
                            < div key={index}>
                                <Divider
                                    name={
                                        <div className='flex justify-between'>
                                            <p>{item.name}</p>
                                            {item.children?.length ? <KeyboardArrowDownIcon className={`transition-all duration-300 ${index === _id ? "-rotate-180" : ""}`} /> : null}
                                        </div>}
                                    onClick={() => {
                                        set_id(currentId => currentId !== index ? index : -1);
                                        if (item.link) (toPage.push(item.link))
                                    }}></Divider>
                                <div className={`grid overflow-hidden transition-all duration-300 `} style={{ height: item.children?.length && index === _id ? item.children?.length * 48 + "px" : "0" }}>
                                    {
                                        item.children ? item.children.map((child, indexchild) =>
                                            <Divider
                                                key={indexchild}
                                                name={child.name}
                                                onClick={() => { if (child.link) { toPage.push(child.link) } }}
                                                sx='opacity-50 text-sm hover:opacity-100'
                                            >
                                            </Divider>)
                                            : null
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>

    )
}
