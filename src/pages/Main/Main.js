import React from 'react'
import Map from "../../components/Map/Map";
import MarkerListCard from "../../components/MarkerListCard/MarkerListCard"
import Header from '../../components/Header/Header';
import { supabase } from '../../lib/helper/supabaseClient'
import { useEffect, useState } from "react";
import "./Main.css"


export default function Main() {

    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        getMarkers();
    }, [])

    async function getMarkers() {
        try {
            const { data, error } = await supabase
                .from("markers")
                .select("*")
                .limit(10)
            if (error) throw error;
            if (data != null) {
                setMarkers(data);
            }
        } catch (error) {
            alert(error.message);
        }
    }


    return (
        <div className='mainBox'>
            <Header />
            <Map />
        </div>
    )
}
