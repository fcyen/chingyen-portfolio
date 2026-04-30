import { Route, Routes } from "react-router-dom";
import Home from "@/routes/Home";
import WorkPost from "@/routes/Work/WorkPost";
import NotFound from "@/routes/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/work/:slug" element={<WorkPost />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
