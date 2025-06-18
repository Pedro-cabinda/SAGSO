import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LayoutPadrao from './componentes/LayoutPadrao';
import Home from './paginas/Home';
import Atendimentos from './paginas/Atendimento';
import Estoque from './paginas/Estoque';
import Agendamento from './paginas/Agendamento';
import Relatorios from './paginas/Relatorios';
import Login from './paginas/Login';
import RotaPrivada from './componentes/RotaPrivada'; // importar aqui

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Rota protegida */}
        <Route element={<RotaPrivada />}>
          <Route element={<LayoutPadrao />}>
            <Route path="/home" element={<Home />} />
            <Route path="/atendimentos" element={<Atendimentos />} />
            <Route path="/estoque" element={<Estoque />} />
            <Route path="/agendamento" element={<Agendamento />} />
            <Route path="/relatorios" element={<Relatorios />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
