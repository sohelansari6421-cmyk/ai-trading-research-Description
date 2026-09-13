import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Experiment from "./pages/Experiment/Experiment";
import History from "./pages/History/History";
import Research from "./pages/Research/Reserach";

function App() {
  return (
    <BrowserRouter>
      {/* <Header /> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/experiment" element={<Experiment />} />
        <Route path="/history" element={<History />} />
        <Route path="/research" element={<Research />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;