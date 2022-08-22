import Cards from "../Cards/Cards"
import InfoPannel from "./InfoPannel"
const OurContent = (props) => {
    return <div className=" w-full h-full relative flex justify-center">
        <InfoPannel {...props.player_content}>

        </InfoPannel>

        <Cards cards={props.player_content.cards}>

        </Cards>

         </div>
}

export default OurContent
