import React, { useEffect } from 'react';
import axios from 'axios';
import './button.css'

export default function Button ({ channel, activeButton, setActiveButton }) {

    const { name, label, id } = channel;
    const active = activeButton == id;

    function addKeyPressListener() {
        function openOnNumberKey(e) {
            //double equals handles type coercision for us
            if (e.key == id ) {
                changeProgramInput();
            }
        }
        document.addEventListener('keyup', openOnNumberKey)
        
        return function removeKeyPressListener() {
            document.removeEventListener('keyup', openOnNumberKey)
        }
    }

    useEffect(addKeyPressListener, []);

    function changeProgramInput() {
        axios.post('/api/changeProgramInput', { id: id })
        .then(response => {
            // console.log(response);
        })
        .catch(error => {
            console.error(error);
        });
    }

    return (
        <button className={active ? "button active" : "button"}
                onClick={changeProgramInput}>
            { name }
        </button>
    );
};