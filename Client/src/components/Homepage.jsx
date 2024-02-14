import React from "react"
import { Link } from 'react-router-dom';


const Homepage = () => {

    return <>
        <h1>Cointab SE-ASSIGNMENT</h1>
        <Link to={"/userData"}>
            <button>All users</button>
        </Link>
    </>
}

export default Homepage