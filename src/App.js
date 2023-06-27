import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ChatPage from "./screens/ChatPage";
import { Provider } from "react-redux";
import store from "../src/Redux/Store"
function App() {
  return (
    <div className="App">
      <Provider store={store}>
      <Router>
        <Routes>
          <Route path={"/"} element={<Login />} />
          <Route path={"/signup"} element={<Signup />} />
          <Route path={"/chats"} element={<ChatPage />} />
        </Routes>
      </Router>
      </Provider>
    </div>
  );
}

export default App;
