const LobbyMessages = (props) => {

    return (
        <div className="  w-full break-words    flex flex-col gap-2 w-fit p-4 rounded-sm ">
            {
            props.message_objects.map((room_message, index) => {
                return <div key={index}
                    className="rounded-sm break-words  flex justify-start gap-2 items-center ">
                    <p className="bg-gray-400 text-white rounded-sm text-sm  p-2">
                       {
                        room_message.from
                    }  </p>
                    <p className="bg-gray-400 text-white rounded-sm text-sm  p-2">
                        {
                        room_message.time
                    } </p>
                    <p className=" break-words  bg-white rounded-sm text-black p-2">
                        {
                        room_message.message
                    } </p>

                </div>
        })
        } </div>
    )

}

export default LobbyMessages
