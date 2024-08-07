import React, { useEffect, useState } from 'react';

function PosterImageName(props) {
    const [user, setUser] = useState();

    useEffect(() => {
        const storedId = localStorage.getItem('userId');
    }, []);

    return (
        <>
            <div>
                <img
                    className="rounded-circle"
                    src={props.image ?? "https://th.bing.com/th/id/OIP.0TsJGYhWWOy_hBFOH0hX-gAAAA?rs=1&pid=ImgDetMain"}
                    style={{ width: 40 + "px", height: 40 + "px" }}
                />
                <span className="card-text mx-3 fs-5 align-middle">
                    {props.name} {/* Use optional chaining to access name without errors */}
                </span>
            </div>           
        </>
    );

}

export default PosterImageName;
