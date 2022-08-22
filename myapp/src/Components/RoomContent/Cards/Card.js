const Card = (props) =>{
   let image_name= `${props.name}_of_${props.type}.png`


    return(
        <div className=" ">
          
            <img src={`/CardImages/${image_name}`}  className="shadow-black shadow-md" style={{
               height:"16vh"
            }} />
        
        </div>
    )
}

export default Card