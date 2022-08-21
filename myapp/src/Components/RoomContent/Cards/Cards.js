import Card from "./Card"

const Cards = (props)=>{

    return (
        <div className=" w-full h-full flex gap-4 justify-center items-center">
            { console.log(props)}
        {
            
       
        props.cards.map(card=> {
            return <Card {...card}>

            </Card>
        })
        }
        </div>
    )

}

export default Cards