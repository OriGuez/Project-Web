import videos from '../../data/vidDB.json';
import React, { useState } from 'react';
import VideoPrev from './VideoPrev';

function MapVids({videoList,setVList}) {

    return (
        <div>
            {
                videoList.map((vid) =>
                    <VideoPrev {...vid} />
                )
            }
        </div>
    )
}
export default MapVids;
