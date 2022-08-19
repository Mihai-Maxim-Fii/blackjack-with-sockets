
import './App.css';
import RoomContainer from './Components/RoomContainer';
import Store from './Store/Store';
import { Provider } from 'react-redux';
import SocketContextWrapper from './Store/Context/SocketContext';



function App() {

    return (
      <SocketContextWrapper>
      <Provider store={Store}>
        <div className="App h-full">
            <RoomContainer></RoomContainer>
        </div>
        </Provider>
        </SocketContextWrapper>
    );
}

export default App;
