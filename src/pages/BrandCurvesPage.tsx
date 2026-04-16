import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import BrandCurves from "@/components/BrandCurves";
import BezierTheoryExplainer from "@/components/BezierTheoryExplainer";

const BrandCurvesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background px-4 pb-24 pt-8">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-6 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-base font-semibold text-foreground">Brand Curves & Theory</h1>
          <p className="text-xs text-muted-foreground">How the best teams in the world use bezier curves</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
        <BrandCurves />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <BezierTheoryExplainer />
      </motion.div>
    </div>
  );
};

export default BrandCurvesPage;
