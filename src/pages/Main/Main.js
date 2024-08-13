import React from 'react'
import Map from "../../components/Map/Map";
import MarkerListCard from "../../components/MarkerListCard/MarkerListCard"
import Header from '../../components/Header/Header';
import { supabase } from '../../lib/helper/supabaseClient'
import { useEffect, useState } from "react";


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
                console.log(data) // [product1,product2,product3]
            }
        } catch (error) {
            alert(error.message);
        }
    }


    return (
        <div>
            <Header />
            <Map />
        </div>
    )
}
