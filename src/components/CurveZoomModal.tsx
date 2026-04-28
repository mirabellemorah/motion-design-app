import { Dialog, DialogContent } from "@/components/ui/dialog";
import InteractiveBezierGraph from "@/components/InteractiveBezierGraph";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  bezier: [number, number, number, number];
  onChange?: (b: [number, number, number, number]) => void;
  targetBezier?: [number, number, number, number];
  label?: string;
}

const CurveZoomModal = ({ open, onOpenChange, bezier, onChange, targetBezier, label }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl p-3 bg-background">
        <InteractiveBezierGraph
          bezier={bezier}
          onChange={onChange}
          targetBezier={targetBezier}
          width={520}
          height={420}
          label={label || "Curve — Fullscreen"}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CurveZoomModal;