import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "true");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 p-4 shadow-lg backdrop-blur-sm"
        >
          <div className="container mx-auto flex flex-wrap items-center justify-center gap-4 text-center md:justify-between md:text-left">
            <p className="text-sm text-muted-foreground">
              We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.{" "}
              <Link to="/privacy-policy" className="font-semibold text-primary underline">Learn more</Link>.
            </p>
            <Button onClick={handleAccept} size="sm">Accept</Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}