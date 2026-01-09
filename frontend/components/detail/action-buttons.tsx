"use client";

import { motion } from "framer-motion";
import { Check, X, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

export function ActionButtons() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="flex flex-wrap gap-3"
    >
      <Button variant="success" className="flex-1 sm:flex-none">
        <Check className="h-4 w-4 mr-2" />
        Mark as Legitimate
      </Button>
      <Button variant="danger" className="flex-1 sm:flex-none">
        <X className="h-4 w-4 mr-2" />
        Mark as Fraud
      </Button>
      <Button variant="warning" className="flex-1 sm:flex-none">
        <AlertTriangle className="h-4 w-4 mr-2" />
        Needs Review
      </Button>
    </motion.div>
  );
}
