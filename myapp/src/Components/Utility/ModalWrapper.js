import ReactDOM from "react-dom"

const ModalWrapper = (props) => {

    return ReactDOM.createPortal (
        <div className="  absolute w-full h-full top-0 flex justify-center items-center"
            style={
                {backgroundColor: "rgb(0, 0, 0, 0.3)"}
        }>
            {
            props.children
        } </div>,
        document.getElementById("root")
    )

}

export default ModalWrapper
