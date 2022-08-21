
import './App.css';
import RoomContainer from './Components/RoomContainer';
import Store from './Store/Store';
import { Provider } from 'react-redux';
import SocketContextWrapper from './Store/Context/SocketContext';



function App() {

    return (
      <SocketContextWrapper>
      <Provider store={Store}>
        <div className="App" style={{minHeight:"100vh"}}>
            <RoomContainer></RoomContainer>
        </div>
        </Provider>
        </SocketContextWrapper>
    );
}

export default App;
