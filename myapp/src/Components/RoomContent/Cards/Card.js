const Card = (props) =>{
    return(
        <div className=" flex flex-col gap-2">
            <p>
                {`${props.name} of ${props.type}`}
            </p>
            <p>
                {
                    props.value_one
                }
            </p>
        </div>
    )
}

export default Card