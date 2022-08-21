import InfoPannel from "./InfoPannel"
import Cards from "../Cards/Cards"
const SecondPlayerContent = (props) =>{
    return (<div className=" w-full h-full relative">
        <InfoPannel {...props.player_content}>

        </InfoPannel>

        <Cards cards={props.player_content.cards}>

        </Cards>
    </div>)
}
export default SecondPlayerContent