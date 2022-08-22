import Card from "./Card"

const Cards = (props)=>{

    return (
        <div className=" h-full flex gap-4 justify-center items-center">
        {
            
       
        props.cards.map((card,index)=> {
            return <Card  key={index} {...card}>

            </Card>
        })
        }
        </div>
    )

}

export default Cards