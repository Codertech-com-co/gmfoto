import React,{useEffect,useRef,useState} from 'react'
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Avatar,
    IconButton,
    Typography,
    Card,
} from "@material-tailwind/react";
import logo from './bestbody.png'

import { Textarea } from "@material-tailwind/react";
import { IoCloseOutline } from "react-icons/io5";

import { LinkIcon } from "@heroicons/react/24/outline";
import { MdVerified } from "react-icons/md";
import { Link } from 'react-router-dom';
import EmojiPicker,{EmojiStyle} from 'emoji-picker-react';
import LazyLoad from 'react-lazyload';

import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
} from "@material-tailwind/react";

const Person = () => {
    return (
        <>
            <Avatar
                variant="circular"
                alt="user 1"
                size="sm"
                className="border-2 border-white hover:z-10 focus:z-10 transition-all duration-500"
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
            />
            <Avatar
                variant="circular"
                alt="user 2"
                size="sm"
                className="border-2 border-white hover:z-10 focus:z-10 transition-all duration-500"
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1061&q=80"
            />
            <Avatar
                variant="circular"
                alt="user 3"
                size="sm"
                className="border-2 border-white hover:z-10 focus:z-10 transition-all duration-500"
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1288&q=80"
            />
            <Avatar
                variant="circular"
                alt="user 4"
                size="sm"
                className="border-2 border-white hover:z-10 focus:z-10 transition-all duration-500"
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80"
            />
            <Avatar
                variant="circular"
                alt="user 5"
                size="sm"
                className="border-2 border-white hover:z-10 focus:z-10 transition-all duration-500"
                src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80"
            />
        </>

    )
}
const Comments = () => {
    const data = [{
        id: 1,
        name: "Duvan Muñoz",
        comment: "Buen contenido"
    }]
    return (
        <>
            {data.map((data) => (
                <div className='grid grid-cols-5 gap-0 mt-2'>
                    <div className='p-0'>
                        <Avatar
                            variant="circular"
                            alt="user 5"
                            className="border-2 border-white hover:z-10 focus:z-10 m-auto"
                            src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80"
                        />
                    </div>
                    <div className='col-span-4'>
                        <div className='bg-gray-50 p-4 rounded-xl dark:bg-gray-900'>
                            <Link className='text-orange-600 hover:text-orange-900' style={{ fontSize: "12px" }}>{data.name}</Link><br />
                            <span style={{ fontSize: "12px" }} className='dark:text-gray-300'>
                                {data.comment}
                            </span>
                            <hr className='dark:invisible'/>
                            <small className='text-gray-500 dark:text-gray-300' style={{ fontSize: "10px" }}>Hace 1 minuto</small>
                            <button className='float-end p-1 border-none hover:text-red-600 flex'><svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-5 w-5"
                            >
                                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                            </svg><small className='ml-2'>10</small> </button>
                        </div>

                    </div>

                </div>
            ))}

        </>
    )
}

export default () => {
    const [open, setOpen] = React.useState(false);
    const [isFavorite, setIsFavorite] = React.useState(false);
    const [comment, setComment] = React.useState('');
    const contentEditableRef = useRef(null); // Ref para acceder al elemento contentEditable

    

    useEffect(() => {
        // Coloca el cursor al final del contenido editable después de cada renderizado
        if (contentEditableRef.current) {
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(contentEditableRef.current);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
            contentEditableRef.current.focus();
        }
    }, [comment]); // Ejecuta el efecto cada vez que cambia el texto

    const [openMenu, setOpenMenu] = React.useState(true);

    const handleOpen = () => setOpen((cur) => !cur);
    const handleIsFavorite = () => setIsFavorite((cur) => !cur);

    const data = [
        {
            imageLink:
                "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        },
        {
            imageLink:
                "https://images.unsplash.com/photo-1432462770865-65b70566d673?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        },
        {
            imageLink:
                "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80",
        }
    ];


  
    const placeholderText = "Escribe un mensaje";

    const handleChange = (e) => {
        const newText = e.target.textContent;
        if (newText !== placeholderText) {
            setComment(newText);
        } else {
            setComment(""); // Si el texto es igual al marcador de posición, establece el texto escrito como vacío
        }
    };
    const generateSpanEmoji=(url)=>{
        return `<span className="w-[25px] h-[25px]" style={{backgroundImage:url('${url}')}}></span>`
            
        
    }
    function PressEmoji(data) {
        
        var emoji = data.emoji
        setComment(comment + " " +emoji)
        


    }



    return (
        <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 p-5">
                {data.map(({ imageLink }, index) => (
                    <div key={index} className='cursor-pointer group relative' onClick={handleOpen}>
                        <img
                            className="h-40 w-full max-w-full rounded-lg object-cover object-center"
                            src={imageLink}
                            alt="gallery-photo"
                        />
                        <div className='invisible group-hover:visible absolute top-0 bg-[rgba(0,0,0,0.5)] text-white w-full h-[100%] grid place-items-center font-bold rounded-lg'>
                            5 Like's
                        </div>
                    </div>
                ))}
            </div>
            <Dialog size="xl" open={open} handler={handleOpen} className='outline-none p-5 dark:bg-gray-900 '>
                <DialogHeader className="justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar
                            size="sm"
                            variant="circular"
                            alt="tania andrew"
                            src={logo}
                        />
                        <div className="-mt-px flex flex-col">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-medium"
                            >
                                <b className='flex dark:text-white'>Gimansio BestBody Facatativa <MdVerified className='text-blue-900  ml-1' style={{ fontSize: "20px" }} /></b>
                            </Typography>
                            <Typography
                                variant="small"
                                color="gray"
                                className="text-xs font-normal dark:text-gray-300"
                            >
                                @gymbestbody
                            </Typography>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 ">
                        <IconButton
                            variant="text"
                            size="sm"
                            onClick={() => setOpen(false)}
                        >
                            <IoCloseOutline className='text-2xl dark:text-gray-300' />
                        </IconButton>

                    </div>
                </DialogHeader>
                <DialogBody>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            {/* <img
                                alt="nature"
                                className="h-[40rem] w-full rounded-lg object-cover object-center"
                                src="https://images.unsplash.com/photo-1485470733090-0aae1788d5af?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2717&q=80"
                            /> */}
                            <video src="https://videos.pexels.com/video-files/6235191/6235191-uhd_2160_3840_25fps.mp4" className='max-h-[500px] w-full rounded-xl m-auto' controls autoPlay></video>
                            <small className='dark:text-gray-400'>01 Febrero de 2024</small>
                        </div>
                        <div>
                            <div className="mt-2 mb-2">
                                <div>

                                    <Typography color="blue-gray" className="font-medium">

                                        <small className='text-gray-500'>44,082,044 Visualizaciones</small>
                                    </Typography>
                                </div>
                                <div className='flex'>
                                    <Typography variant="small" color="gray" className="font-bold text-orange-800">
                                        <IconButton
                                            className='mr-2'
                                            variant="text"
                                            size="sm"
                                            color={isFavorite ? "red" : "blue-gray"}
                                            onClick={handleIsFavorite}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="h-5 w-5"
                                            >
                                                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                            </svg>



                                        </IconButton>
                                    </Typography>
                                    <Typography color="blue-gray" className="font-medium dark:text-gray-300">
                                        553,031 Like's
                                        <div className="flex r -space-x-4">
                                            <Person />
                                        </div>
                                    </Typography>
                                </div>
                            </div>

                            <hr />


                            <div className="p-5 rounded-lg h-[90%] flex flex-col mt-2">
                                <div className="flex-grow">
                                    <Comments />
                                </div>
                                <div className="">
                                    <div className="flex w-full flex-row items-center gap-2 rounded-[99px] border border-none p-2">
                                        <div className="flex">
                                            <IconButton variant="text" className="rounded-full border-none dark:text-gray-300">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={2}
                                                    stroke="currentColor"
                                                    className="h-5 w-5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                                    />
                                                </svg>
                                            </IconButton>


                                            <Menu >
                                                <MenuHandler>
                                                    <IconButton variant="text" className="rounded-full border-none">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                            className="h-5 w-5 dark:text-gray-300"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                                                            />
                                                        </svg>
                                                    </IconButton>
                                                </MenuHandler>
                                                <MenuList className=' z-[1000000000000] bg-transparent border-none'>


                                                    <EmojiPicker onEmojiClick={(data) => PressEmoji(data)} emojiStyle={EmojiStyle.NATIVE} preload  categories={[
  {
    category: 'smileys_people',
    name: 'CARAS Y PERSONAS'
  }]} 
  lazyLoadEmojis={true}
  skinTonesDisabled={true}
  Theme="dark"
                                                    
//                                                     customEmojis={[
//     {
//       names: ['Alice', 'alice in wonderland'],
//       imgUrl:
//         'https://cdn.jsdelivr.net/gh/ealush/emoji-picker-react@custom_emojis_assets/alice.png',
//       id: 'alice'
//     },
//     {
//       names: ['Dog'],
//       imgUrl:
//         'https://cdn.jsdelivr.net/gh/ealush/emoji-picker-react@custom_emojis_assets/dog.png',
//       id: 'dog'
//     },
//     {
//       names: ['Hat'],
//       imgUrl:
//         'https://cdn.jsdelivr.net/gh/ealush/emoji-picker-react@custom_emojis_assets/hat.png',
//       id: 'hat'
//     },
//     {
//       names: ['Vest'],
//       imgUrl:
//         'https://cdn.jsdelivr.net/gh/ealush/emoji-picker-react@custom_emojis_assets/vest.png',
//       id: 'vest'
//     }
//   ]}
  />

                                                </MenuList>
                                            </Menu>

                                        </div>
                                        {/* <Textarea
                                            rows={1}
                                            resize={true}
                                            placeholder="Escribe un comentario"
                                            className="min-h-full !border-0 focus:border-transparent"
                                            containerProps={{
                                                className: "grid h-full",
                                            }}
                                            labelProps={{
                                                className: "before:content-none after:content-none",
                                            }}
                                            value={comment}

                                            onChange={(e) => setComment(e.target.value)}
                                        /> */}

<div
            className="w-full h-[80px] p-5 outline-none max-h-[100px] overflow-auto dark:text-gray-300"
            style={{ fontSize: "12px" }}
            onKeyUp={handleChange}
            contentEditable="true"
            placeholder="Escribe un comentario"
            ref={contentEditableRef} 
            value={comment}
        >
            
        </div>
                                        <div>
                                            <IconButton variant="text" className="rounded-full border-none dark:text-gray-300">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    className="h-5 w-5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                                                    />
                                                </svg>
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>
                            </div>






                        </div>

                    </div>

                </DialogBody>
                <DialogFooter className="justify-between">

                    <Button
                        size="sm"
                        variant="outlined"
                        color="blue-gray"
                        className="mr-5 flex items-center hover:bg-orange-800 hover:text-white hover:border-orange-800 transition-all duration-500 dark:text-gray-300"
                    >
                        Compartir
                    </Button>
                </DialogFooter>
            </Dialog>
        </>

    );
}

