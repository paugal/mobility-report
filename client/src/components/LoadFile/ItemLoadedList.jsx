import React, { useState, useEffect } from 'react'
import './LoadFile.css'
import imgIcon from './assets/iconFIleImg.png'
import txtIcon from './assets/iconFIleTxt.png'
import csvIcon from './assets/iconFIleCSV.png'
import xlsIcon from './assets/iconFIleXLS.png'
import pdfIcon from './assets/iconFIlePDF.png'

export default function ItemLoadedList({ file }) {

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simula la carga aumentando el progreso gradualmente
        const speed = 2;
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev < 100) {
                    return Math.min(prev + ((2000000 * 100) / file.size), 100).toFixed(0); // Aumenta el progreso en un 10% cada 500ms
                } else {
                    clearInterval(interval); // Limpia el intervalo cuando el progreso alcanza el 100%
                    return 100;
                }
            });
        }, 500); // Intervalo de 500ms

        return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
    }, []);


    function fileIconSwitch() {

        if (file.type === 'application/pdf') {
            return pdfIcon;
        } else if (file.type.startsWith('image/')) {
            return imgIcon
        } else if (file.type.startsWith('txt/')) {
            return txtIcon
        } else if (file.type === 'application/csv') {
            return csvIcon
        } else if (file.type === 'application/xls') {
            return xlsIcon
        }
    }


    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes'

        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

    return (
        <div class="item-loaded">
            <div class="item-loaded-description">
                <div class="file-image">
                    <img src={fileIconSwitch()} alt="file type" />
                </div>

                <div class="name-size-time">
                    <div class="name-file">
                        {file.name}
                    </div>
                    <div class="size-time-file">
                        <div>{formatBytes(file.size)}</div>
                        {progress !== 100 ?
                            <>
                                <div>|</div>
                                <div>2s left</div>
                            </> : null}


                    </div>
                </div>
                <div class="options">
                    <span className="deleteIcon material-symbols-outlined">
                        close
                    </span>
                    {progress !== 100 ?
                        <div>
                            {progress}%
                        </div> : null}
                </div>
            </div>
            {progress !== 100 ?
                <div class="progres-bar">
                    <div className='empty-bar'></div>
                    <div className='load-bar' style={{ width: `${progress}%` }}></div>

                </div>
                : null}

        </div>
    )
}
