import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewConsultation from "./pages/NewConsultation";
import Students from "./pages/consultation";
import Records from "./pages/Records";

function App() {

  return (

    <Router>

      <Routes>

        <Route
          path="/"
          element={<Signup />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/new-consultation"
          element={<NewConsultation />}
        />

         <Route
          path="/students"
          element={<Students />}
        />

        <Route
  path="/records"
  element={<Records />}
/>

      </Routes>

    </Router>

  );

}

export default App;