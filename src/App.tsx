import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import NewDecision from './pages/NewDecision';
import Archive from './pages/Archive';
import ReviewQueue from './pages/ReviewQueue';
import Patterns from './pages/Patterns';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<NewDecision />} />
        <Route path="archive"  element={<Archive />} />
        <Route path="review"   element={<ReviewQueue />} />
        <Route path="patterns" element={<Patterns />} />
      </Route>
    </Routes>
  );
}
