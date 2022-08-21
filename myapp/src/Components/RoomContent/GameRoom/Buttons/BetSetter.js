import ModalWrapper from "../../../Utility/ModalWrapper"
import {useSelector} from "react-redux"
import {useRef} from "react"
import {useContext} from "react"
import {MySocketContext} from "../../../../Store/Context/SocketContext"
const BetSetter = (props) => {

    const user_name = useSelector(state => state.username_reducer.username)

    const user_funds = useSelector(state => state.game_reducer.game[user_name].funds)

    const game_name = useSelector(state => state.game_reducer.game.game_name)

    const number_ref = useRef()

    const socket_context = useContext(MySocketContext)

    const set_bet = () => {

        let bet_value = number_ref.current.value

        if (0 < bet_value && bet_value <= user_funds) { // emit update funds

            socket_context.emit("set-bet", user_name, game_name, bet_value)

            props.close()


        } else {
            alert(`Bet must be between [1, ${user_funds}] `)
        }

    }

    return (
        <ModalWrapper>
            <div className=" w-80 h-40 bg-gray-500 flex flex-col items-center ">
                <div className=" w-full h-8 bg-orange-300 flex justify-end items-center">
                    <button className=" text-white p-4"
                        onClick={
                            () => props.close()
                    }>
                        Close
                    </button>

                </div>
                <div className=" flex h-full w-full flex-col gap-4 justify-between items-center">
                    <div className=" flex flex-col gap-2 w-full items-center">
                        <label className=" text-white">Amount</label>
                        <input type="number"
                            ref={number_ref}
                            defaultValue={100}
                            className=" p-2 h-fit w-1/2 text-black text-center"
                            min={0}></input>
                    </div>
                    <button onClick={set_bet}
                        className=" w-full h-8 bg-gray-300 text-black hover:bg-green-500 hover:text-white">
                        Bet
                    </button>
                </div>
            </div>
        </ModalWrapper>
    )

}


export default BetSetter
